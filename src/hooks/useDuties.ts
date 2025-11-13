import { useState, useEffect, useCallback } from 'react';
import type { Duty, CreateDutyInput, UpdateDutyInput } from '../types';
import { dutyService } from '../services';

export const useDuties = (listId?: string) => {
  const [duties, setDuties] = useState<Duty[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDuties = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dutyService.getAll(listId);
      setDuties(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch duties';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [listId]);

  useEffect(() => {
    fetchDuties();
  }, [fetchDuties]);

  const createDuty = async (input: CreateDutyInput): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const inputWithListId = listId ? { ...input, list_id: listId } : input;
      const newDuty = await dutyService.create(inputWithListId);
      setDuties((prev) => [newDuty, ...prev]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create duty';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateDuty = async (id: string, input: UpdateDutyInput): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const updatedDuty = await dutyService.update(id, input);
      setDuties((prev) => prev.map((duty) => (duty.id === id ? updatedDuty : duty)));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update duty';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteDuty = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await dutyService.delete(id);
      setDuties((prev) => prev.filter((duty) => duty.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete duty';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    duties,
    loading,
    error,
    fetchDuties,
    createDuty,
    updateDuty,
    deleteDuty,
  };
};
