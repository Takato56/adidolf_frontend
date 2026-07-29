// FILE: takato56-adidolf_frontend/app/admin/orders/[id]/page.tsx

'use client';

import { OrderForm } from '@/components/admin/OrderForm';
import { ShipmentForm } from '@/components/admin/ShipmentForm';
import { PaymentForm } from '@/components/admin/PaymentForm';
import { useOrders } from '@/lib/hooks/useOrders';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FiTrash2, FiArrowLeft, FiLock } from 'react-icons/fi';
import { Order, Shipment, Payment } from '@/types';
import Link from 'next/link';

const TABS = [
  { key: 'details', label: 'Order Details' },
  { key: 'shipment', label: 'Shipment Info' },
  { key: 'payment', label: 'Payment Info' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = parseInt(params.id as string) || 0;
  const { updateOrder, deleteOrder, updateShipment, updatePayment, fetchOrder } =
    useOrders();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('details');

  const [isSubmittingDetails, setIsSubmittingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const [shipmentError, setShipmentError] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [shipmentSaved, setShipmentSaved] = useState(false);
  const [paymentSaved, setPaymentSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchOrder(orderId)
      .then((found) => {
        if (!cancelled) setOrder(found);
      })
      .catch((err) => {
        if (!cancelled) {
          setLoadError(err instanceof Error ? err.message : 'Failed to load order');
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [orderId, fetchOrder]);

  const isCancelled = order?.status === 'cancelled';

  const handleOrderSubmit = async (data: any) => {
    if (isCancelled) return;
    setDetailsError(null);
    setIsSubmittingDetails(true);
    try {
      await updateOrder(orderId, data);
      router.push('/admin/orders');
    } catch (err) {
      setDetailsError(err instanceof Error ? err.message : 'Failed to update order');
    } finally {
      setIsSubmittingDetails(false);
    }
  };

  const handleShipmentSubmit = async (data: Partial<Shipment>) => {
    if (isCancelled) return;
    setShipmentError(null);
    setShipmentSaved(false);
    try {
      const updated = await updateShipment(orderId, data);
      setOrder((prev) => (prev ? { ...prev, shipment: updated } : prev));
      setShipmentSaved(true);
    } catch (err) {
      setShipmentError(err instanceof Error ? err.message : 'Failed to save shipment');
    }
  };

  const handlePaymentSubmit = async (data: Partial<Payment>) => {
    if (isCancelled) return;
    setPaymentError(null);
    setPaymentSaved(false);
    try {
      const updated = await updatePayment(orderId, data);
      setOrder((prev) => (prev ? { ...prev, payment: updated } : prev));
      setPaymentSaved(true);
    } catch (err) {
      setPaymentError(err instanceof Error ? err.message : 'Failed to save payment');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this order record?')) return;

    setDetailsError(null);
    try {
      await deleteOrder(orderId);
      router.push('/admin/orders');
    } catch (err) {
      setDetailsError(err instanceof Error ? err.message : 'Failed to delete order');
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-500">
        Loading order details...
      </div>
    );
  }

  if (loadError || !order) {
    return (
      <div className="space-y-4">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
        >
          <FiArrowLeft size={16} />
          Back to Orders
        </Link>
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {loadError || 'Order not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mb-2"
          >
            <FiArrowLeft size={16} />
            Back to Orders
          </Link>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900">
              Order #{order.id}
            </h2>
            {isCancelled && (
              <span className="flex items-center gap-1 text-xs bg-red-100 text-red-800 font-bold px-3 py-1 rounded-full uppercase">
                <FiLock /> Cancelled
              </span>
            )}
          </div>
          <p className="text-gray-600 text-sm mt-1">
            Created on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        <button
          onClick={handleDelete}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium cursor-pointer"
        >
          <FiTrash2 size={18} />
          Delete Order
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-0 -mb-px">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                activeTab === tab.key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        {activeTab === 'details' && (
          <>
            {detailsError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
                {detailsError}
              </div>
            )}
            <OrderForm
              order={order}
              onSubmit={handleOrderSubmit}
              isLoading={isSubmittingDetails}
            />
          </>
        )}

        {activeTab === 'shipment' && (
          <>
            {shipmentError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
                {shipmentError}
              </div>
            )}
            <ShipmentForm
              shipment={order.shipment}
              orderId={order.id}
              disabled={isCancelled}
              onSubmit={handleShipmentSubmit}
            />
            {shipmentSaved && (
              <p className="text-sm text-green-600 font-medium mt-3">✓ Saved</p>
            )}
          </>
        )}

        {activeTab === 'payment' && (
          <>
            {paymentError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
                {paymentError}
              </div>
            )}
            <PaymentForm
              payment={order.payment}
              orderId={order.id}
              disabled={isCancelled}
              onSubmit={handlePaymentSubmit}
            />
            {paymentSaved && (
              <p className="text-sm text-green-600 font-medium mt-3">✓ Saved</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}