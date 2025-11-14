import { renderHook, act, waitFor } from '@testing-library/react';
import { useDuties } from './useDuties';
import { dutyService } from '../services';
import type { Duty } from '../types';

jest.mock('../services/dutyService');

describe('useDuties', () => {
  const mockDuties: Duty[] = [
    {
      id: '1',
      name: 'Test Duty 1',
      status: 'pending',
      list_id: 'list-1',
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    },
    {
      id: '2',
      name: 'Test Duty 2',
      status: 'in_progress',
      list_id: 'list-1',
      created_at: '2024-01-02',
      updated_at: '2024-01-02',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch duties on mount without listId', async () => {
    jest.spyOn(dutyService, 'getAll').mockResolvedValue(mockDuties);

    const { result } = renderHook(() => useDuties());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.duties).toEqual(mockDuties);
    expect(dutyService.getAll).toHaveBeenCalledWith(undefined);
  });

  it('should fetch duties filtered by listId', async () => {
    const listId = 'list-1';
    jest.spyOn(dutyService, 'getAll').mockResolvedValue(mockDuties);

    const { result } = renderHook(() => useDuties(listId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.duties).toEqual(mockDuties);
    expect(dutyService.getAll).toHaveBeenCalledWith(listId);
  });

  it('should create a new duty', async () => {
    jest.spyOn(dutyService, 'getAll').mockResolvedValue([]);
    const newDuty: Duty = {
      id: '3',
      name: 'New Duty',
      status: 'pending',
      list_id: 'list-1',
      created_at: '2024-01-03',
      updated_at: '2024-01-03',
    };
    jest.spyOn(dutyService, 'create').mockResolvedValue(newDuty);

    const { result } = renderHook(() => useDuties('list-1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.createDuty({ name: 'New Duty' });
    });

    expect(result.current.duties).toContainEqual(newDuty);
    expect(dutyService.create).toHaveBeenCalledWith({ name: 'New Duty', list_id: 'list-1' });
  });

  it('should create duty without list_id when listId is not provided', async () => {
    jest.spyOn(dutyService, 'getAll').mockResolvedValue([]);
    const newDuty: Duty = {
      id: '3',
      name: 'New Duty',
      status: 'pending',
      list_id: null,
      created_at: '2024-01-03',
      updated_at: '2024-01-03',
    };
    jest.spyOn(dutyService, 'create').mockResolvedValue(newDuty);

    const { result } = renderHook(() => useDuties());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.createDuty({ name: 'New Duty' });
    });

    expect(result.current.duties).toContainEqual(newDuty);
    expect(dutyService.create).toHaveBeenCalledWith({ name: 'New Duty' });
  });

  it('should update a duty', async () => {
    jest.spyOn(dutyService, 'getAll').mockResolvedValue(mockDuties);
    const updatedDuty: Duty = {
      ...mockDuties[0],
      name: 'Updated Duty',
    };
    jest.spyOn(dutyService, 'update').mockResolvedValue(updatedDuty);

    const { result } = renderHook(() => useDuties());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.updateDuty('1', { name: 'Updated Duty' });
    });

    expect(result.current.duties.find((d) => d.id === '1')?.name).toBe('Updated Duty');
    expect(dutyService.update).toHaveBeenCalledWith('1', { name: 'Updated Duty' });
  });

  it('should delete a duty', async () => {
    jest.spyOn(dutyService, 'getAll').mockResolvedValue(mockDuties);
    jest.spyOn(dutyService, 'delete').mockResolvedValue();

    const { result } = renderHook(() => useDuties());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.deleteDuty('1');
    });

    expect(result.current.duties.find((d) => d.id === '1')).toBeUndefined();
    expect(dutyService.delete).toHaveBeenCalledWith('1');
  });

  it('should update duty status optimistically', async () => {
    jest.spyOn(dutyService, 'getAll').mockResolvedValue(mockDuties);
    jest
      .spyOn(dutyService, 'update')
      .mockResolvedValue({ ...mockDuties[0], status: 'done' as const });

    const { result } = renderHook(() => useDuties());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.updateDutyStatus('1', 'done');
    });

    expect(result.current.duties.find((d) => d.id === '1')?.status).toBe('done');
    expect(dutyService.update).toHaveBeenCalledWith('1', { status: 'done' });
  });

  it('should revert status on update failure', async () => {
    jest.spyOn(dutyService, 'getAll').mockResolvedValue(mockDuties);
    jest.spyOn(dutyService, 'update').mockRejectedValue(new Error('Failed'));

    const { result } = renderHook(() => useDuties());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await expect(
      act(async () => {
        await result.current.updateDutyStatus('1', 'done');
      })
    ).rejects.toThrow('Failed');

    expect(result.current.duties.find((d) => d.id === '1')?.status).toBe('pending');
  });

  it('should handle errors when fetching duties', async () => {
    jest.spyOn(dutyService, 'getAll').mockRejectedValue(new Error('Failed to fetch'));

    const { result } = renderHook(() => useDuties());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Failed to fetch');
    expect(result.current.duties).toEqual([]);
  });

  it('should refetch duties when listId changes', async () => {
    jest.spyOn(dutyService, 'getAll').mockResolvedValue(mockDuties);

    type Props = { listId?: string };
    const { result, rerender } = renderHook<ReturnType<typeof useDuties>, Props>(
      ({ listId }) => useDuties(listId),
      {
        initialProps: { listId: undefined },
      }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(dutyService.getAll).toHaveBeenCalledWith(undefined);

    rerender({ listId: 'list-1' });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(dutyService.getAll).toHaveBeenCalledWith('list-1');
  });
});
