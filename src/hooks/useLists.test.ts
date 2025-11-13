import { renderHook, act, waitFor } from '@testing-library/react';
import { useLists } from './useLists';
import { listService } from '../services';
import type { List } from '../types';

jest.mock('../services/listService');

describe('useLists', () => {
  const mockLists: List[] = [
    {
      id: '1',
      name: 'Test List 1',
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    },
    {
      id: '2',
      name: 'Test List 2',
      created_at: '2024-01-02',
      updated_at: '2024-01-02',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch lists on mount', async () => {
    jest.spyOn(listService, 'getAll').mockResolvedValue(mockLists);

    const { result } = renderHook(() => useLists());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.lists).toEqual(mockLists);
    expect(listService.getAll).toHaveBeenCalledTimes(1);
  });

  it('should create a new list', async () => {
    jest.spyOn(listService, 'getAll').mockResolvedValue([]);
    const newList: List = {
      id: '3',
      name: 'New List',
      created_at: '2024-01-03',
      updated_at: '2024-01-03',
    };
    jest.spyOn(listService, 'create').mockResolvedValue(newList);

    const { result } = renderHook(() => useLists());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.createList({ name: 'New List' });
    });

    expect(result.current.lists).toContainEqual(newList);
    expect(listService.create).toHaveBeenCalledWith({ name: 'New List' });
  });

  it('should update a list', async () => {
    jest.spyOn(listService, 'getAll').mockResolvedValue(mockLists);
    const updatedList: List = {
      ...mockLists[0],
      name: 'Updated List',
    };
    jest.spyOn(listService, 'update').mockResolvedValue(updatedList);

    const { result } = renderHook(() => useLists());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.updateList('1', { name: 'Updated List' });
    });

    expect(result.current.lists.find((l) => l.id === '1')?.name).toBe('Updated List');
    expect(listService.update).toHaveBeenCalledWith('1', { name: 'Updated List' });
  });

  it('should delete a list', async () => {
    jest.spyOn(listService, 'getAll').mockResolvedValue(mockLists);
    jest.spyOn(listService, 'delete').mockResolvedValue();

    const { result } = renderHook(() => useLists());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.deleteList('1');
    });

    expect(result.current.lists.find((l) => l.id === '1')).toBeUndefined();
    expect(listService.delete).toHaveBeenCalledWith('1');
  });

  it('should handle errors when fetching lists', async () => {
    jest.spyOn(listService, 'getAll').mockRejectedValue(new Error('Failed to fetch'));

    const { result } = renderHook(() => useLists());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Failed to fetch');
    expect(result.current.lists).toEqual([]);
  });
});
