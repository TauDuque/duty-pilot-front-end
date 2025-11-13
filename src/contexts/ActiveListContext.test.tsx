import { renderHook, act } from '@testing-library/react';
import { ActiveListProvider, useActiveList } from './ActiveListContext';
import type { List } from '../types';

describe('ActiveListContext', () => {
  const mockList: List = {
    id: '1',
    name: 'Test List',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  };

  it('should provide activeList and setActiveList', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ActiveListProvider>{children}</ActiveListProvider>
    );

    const { result } = renderHook(() => useActiveList(), { wrapper });

    expect(result.current.activeList).toBeNull();
    expect(typeof result.current.setActiveList).toBe('function');
    expect(typeof result.current.clearActiveList).toBe('function');
  });

  it('should set active list', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ActiveListProvider>{children}</ActiveListProvider>
    );

    const { result } = renderHook(() => useActiveList(), { wrapper });

    act(() => {
      result.current.setActiveList(mockList);
    });

    expect(result.current.activeList).toEqual(mockList);
  });

  it('should clear active list', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ActiveListProvider>{children}</ActiveListProvider>
    );

    const { result } = renderHook(() => useActiveList(), { wrapper });

    act(() => {
      result.current.setActiveList(mockList);
    });

    expect(result.current.activeList).toEqual(mockList);

    act(() => {
      result.current.clearActiveList();
    });

    expect(result.current.activeList).toBeNull();
  });

  it('should throw error when used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useActiveList());
    }).toThrow('useActiveList must be used within an ActiveListProvider');

    consoleSpy.mockRestore();
  });
});
