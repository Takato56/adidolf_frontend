import { User } from '@/types';
import { useCallback, useEffect, useState } from 'react';
import { getUsersApi, getUserByIdApi, updateUserApi, deleteUserApi } from '@/lib/users';
import { getAddressesByUserId, syncUserAddresses } from '@/lib/addresses';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const data = await getUsersApi();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // User creation is intentionally unsupported here. The backend's generic
  // /admin/users endpoint writes whatever "password_hash" it's given
  // straight into the database with no hashing — sending a plaintext
  // password through it would either permanently break that user's login
  // or store their real password unencrypted. Real accounts should go
  // through /auth/register (which does hash properly via argon2); this
  // panel is for managing (editing role/status/details, or deleting)
  // users after that.
  const addUser = async (): Promise<never> => {
    throw new Error(
      "Creating users isn't supported from this panel — have them sign up normally, then manage their account here."
    );
  };

  const updateUser = async (id: number, updates: Partial<User>) => {
    const { addresses, password_hash, created_at, id: _id, ...rest } = updates;
    const updated = await updateUserApi(id, rest);

    updated.addresses = addresses
      ? await syncUserAddresses(id, addresses)
      : await getAddressesByUserId(id);

    setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
    return updated;
  };

  const deleteUser = async (id: number) => {
    await deleteUserApi(id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const getUser = (id: number) => users.find((u) => u.id === id);

  // Fetches a user with their real, current addresses directly from the
  // API — use this for the detail/edit page rather than getUser(), since
  // the in-memory list from load() doesn't carry addresses (avoids an N+1
  // fetch just to render the list).
  const fetchUser = async (id: number): Promise<User> => {
    const [user, addresses] = await Promise.all([
      getUserByIdApi(id),
      getAddressesByUserId(id),
    ]);
    return { ...user, addresses };
  };

  return {
    users,
    isLoaded,
    error,
    refetch: load,
    addUser,
    updateUser,
    deleteUser,
    getUser,
    fetchUser,
  };
}