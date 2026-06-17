'use client';

import { OrderForm } from '@/components/admin/OrderForm';
import { ShipmentForm } from '@/components/admin/ShipmentForm';
import { PaymentForm } from '@/components/admin/PaymentForm';
import { useOrders } from '@/lib/hooks/useOrders';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { Order, Shipment, Payment } from '@/types';

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
  const { getOrder, updateOrder, deleteOrder, updateShipment, updatePayment, isLoaded } = useOrders();
  const [order, setOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('details');

  useEffect(() => {
    if (isLoaded) {
      const found = getOrder(orderId);
      if (found) {
        setOrder(found);
      } else {
        router.push('/admin/orders');
      }
    }
  }, [isLoaded, orderId, getOrder, router]);

  const handleOrderSubmit = (data: any) => {
    updateOrder(orderId, data);
    router.push('/admin/orders');
  };

  const handleShipmentSubmit = (data: Partial<Shipment>) => {
    updateShipment(orderId, data);
    // Refresh order state after update
    setOrder((prev) =>
      prev
        ? {
            ...prev,
            shipment: {
              ...(prev.shipment || {
                shipmentId: 0,
                carrier: '',
                trackingNumber: null,
                status: 'preparing' as const,
                shippedAt: null,
                estimatedDelivery: null,
                deliveredAt: null,
              }),
              ...data,
            },
          }
        : null
    );
  };

  const handlePaymentSubmit = (data: Partial<Payment>) => {
    updatePayment(orderId, data);
    setOrder((prev) =>
      prev
        ? {
            ...prev,
            payment: {
              ...(prev.payment || {
                paymentId: 0,
                method: 'COD' as const,
                status: 'pending' as const,
                amount: 0,
                transactionId: null,
                gatewayResponse: null,
                paidAt: null,
              }),
              ...data,
            },
          }
        : null
    );
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      deleteOrder(orderId);
      router.push('/admin/orders');
    }
  };

  if (!isLoaded || !order) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Edit Order #{order.id}
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Update order information
          </p>
        </div>
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
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
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
          <OrderForm order={order} onSubmit={handleOrderSubmit} />
        )}
        {activeTab === 'shipment' && (
          <ShipmentForm
            shipment={order.shipment}
            orderId={order.id}
            onSubmit={handleShipmentSubmit}
            onSuccess={() => {
              const updated = getOrder(orderId);
              if (updated) setOrder(updated);
            }}
          />
        )}
        {activeTab === 'payment' && (
          <PaymentForm
            payment={order.payment}
            orderId={order.id}
            onSubmit={handlePaymentSubmit}
            onSuccess={() => {
              const updated = getOrder(orderId);
              if (updated) setOrder(updated);
            }}
          />
        )}
      </div>
    </div>
  );
}