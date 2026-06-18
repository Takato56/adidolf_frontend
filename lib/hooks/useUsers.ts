import { User, Address } from '@/types';
import { useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'admin_users';

function migrateAddress(raw: any): Address {
  return {
    id: typeof raw.id === 'number' ? raw.id : 0,
    recipient_name: raw.recipient_name || '',
    phone: raw.phone || '',
    province: raw.province || '',
    district: raw.district || '',
    ward: raw.ward || '',
    street_detail: raw.street_detail || '',
    is_default: raw.is_default === 1 ? 1 : 0,
  };
}

function migrateUser(raw: any): User {
  return {
    id: typeof raw.id === 'number' ? raw.id : 0,
    email: raw.email || '',
    full_name: raw.full_name || '',
    phone: raw.phone || '',
    avatar_url: raw.avatar_url || '',
    password_hash: raw.password_hash || '',
    role: raw.role === 'admin' ? 'admin' : 'customer',
    is_active: raw.is_active === 1 || raw.is_active === true ? 1 : 0,
    created_at: raw.created_at || new Date().toISOString(),
    addresses: Array.isArray(raw.addresses) ? raw.addresses.map(migrateAddress) : [],
  };
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Persistent ID counters seeded from existing data
  const nextUserId = useRef(100);
  const nextAddressId = useRef(200);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      let parsedUsers: User[];
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          parsedUsers = Array.isArray(parsed) ? parsed.map(migrateUser) : [];
        } catch {
          parsedUsers = [];
        }
      } else {
        parsedUsers = [];
      }
      // Seed counters from existing data to avoid key collisions
      nextUserId.current =
        Math.max(...parsedUsers.map((u) => u.id), 0) + 1;
      const maxAddrId = Math.max(
        ...parsedUsers.flatMap((u) => u.addresses.map((a) => a.id)),
        0
      );
      nextAddressId.current = maxAddrId + 1;
      setUsers(parsedUsers);
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    }
  }, [users, isLoaded]);

  const addUser = (user: Omit<User, 'id' | 'addresses'> & { addresses?: Omit<Address, 'id'>[] }) => {
    const newUser: User = {
      ...user,
      id: nextUserId.current++,
      addresses: (user.addresses || []).map((a) => ({
        ...a,
        id: nextAddressId.current++,
      })),
    };
    setUsers((prev) => [...prev, newUser]);
    return newUser;
  };

  const updateUser = (id: number, updates: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== id) return u;
        // If addresses are provided, assign new IDs to new addresses
        let updatedAddresses = u.addresses;
        if (updates.addresses) {
          updatedAddresses = updates.addresses.map((a) => ({
            ...a,
            id: a.id || nextAddressId.current++,
          }));
        }
        return { ...u, ...updates, addresses: updatedAddresses };
      })
    );
  };

  const deleteUser = (id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const getUser = (id: number) => {
    return users.find((u) => u.id === id);
  };

  return {
    users,
    isLoaded,
    addUser,
    updateUser,
    deleteUser,
    getUser,
  };
}
