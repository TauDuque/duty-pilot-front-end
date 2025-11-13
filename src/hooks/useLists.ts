import { useState, useEffect, useCallback } from 'react';
import type { List, CreateListInput, UpdateListInput } from '../types';
import { listService } from '../services';

export const useLists = () => {
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLists = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listService.getAll();
      setLists(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch lists';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  const createList = async (input: CreateListInput): Promise<List> => {
    setLoading(true);
    setError(null);
    try {
      const newList = await listService.create(input);
      setLists((prev) => [newList, ...prev]);
      return newList;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create list';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateList = async (id: string, input: UpdateListInput): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const updatedList = await listService.update(id, input);
      setLists((prev) => prev.map((list) => (list.id === id ? updatedList : list)));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update list';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteList = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await listService.delete(id);
      setLists((prev) => prev.filter((list) => list.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete list';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    lists,
    loading,
    error,
    fetchLists,
    createList,
    updateList,
    deleteList,
  };
};
