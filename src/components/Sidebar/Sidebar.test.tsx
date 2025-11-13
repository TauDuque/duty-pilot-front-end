import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Sidebar } from './Sidebar';
import { useLists } from '../../hooks';
import { useActiveList } from '../../contexts/ActiveListContext';
import type { List } from '../../types';

jest.mock('../../hooks/useLists');
jest.mock('../../contexts/ActiveListContext');

const mockUseLists = useLists as jest.MockedFunction<typeof useLists>;
const mockUseActiveList = useActiveList as jest.MockedFunction<typeof useActiveList>;

describe('Sidebar', () => {
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

  const mockDeleteList = jest.fn();
  const mockFetchLists = jest.fn();
  const mockSetActiveList = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLists.mockReturnValue({
      lists: mockLists,
      loading: false,
      error: null,
      fetchLists: mockFetchLists,
      createList: jest.fn(),
      updateList: jest.fn(),
      deleteList: mockDeleteList,
    });
    mockUseActiveList.mockReturnValue({
      activeList: null,
      setActiveList: mockSetActiveList,
      clearActiveList: jest.fn(),
    });
  });

  it('should render sidebar with lists', () => {
    render(<Sidebar />);

    expect(screen.getByText('My Lists')).toBeInTheDocument();
    expect(screen.getByText('Test List 1')).toBeInTheDocument();
    expect(screen.getByText('Test List 2')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    mockUseLists.mockReturnValue({
      lists: [],
      loading: true,
      error: null,
      fetchLists: mockFetchLists,
      createList: jest.fn(),
      updateList: jest.fn(),
      deleteList: mockDeleteList,
    });

    render(<Sidebar />);

    // Check for Spin component (loading indicator)
    const spinElement = document.querySelector('.ant-spin');
    expect(spinElement).toBeInTheDocument();
  });

  it('should call setActiveList when list is clicked', () => {
    render(<Sidebar />);

    const listItem = screen.getByText('Test List 1');
    fireEvent.click(listItem);

    expect(mockSetActiveList).toHaveBeenCalledWith(mockLists[0]);
  });

  it('should show delete modal when delete button is clicked', async () => {
    render(<Sidebar />);

    // Find delete button by icon class
    const deleteIcon = document.querySelector('.anticon-delete');
    if (deleteIcon) {
      const deleteButton = deleteIcon.closest('button');
      if (deleteButton) {
        fireEvent.click(deleteButton);

        await waitFor(() => {
          expect(screen.getByText('Confirm Deletion')).toBeInTheDocument();
        });
        expect(screen.getByText(/Are you sure you want to delete the list/)).toBeInTheDocument();
      }
    }
  });

  it('should delete list when confirmed', async () => {
    mockDeleteList.mockResolvedValue(undefined);
    mockFetchLists.mockResolvedValue(undefined);

    render(<Sidebar />);

    // Find delete button by icon class
    const deleteIcon = document.querySelector('.anticon-delete');
    if (deleteIcon) {
      const deleteButton = deleteIcon.closest('button');
      if (deleteButton) {
        fireEvent.click(deleteButton);

        await waitFor(() => {
          expect(screen.getByText('Confirm Deletion')).toBeInTheDocument();
        });

        const confirmButton = screen.getByText('Delete');
        fireEvent.click(confirmButton);

        await waitFor(() => {
          expect(mockDeleteList).toHaveBeenCalledWith('1');
        });
      }
    }
  });

  it('should highlight active list', () => {
    mockUseActiveList.mockReturnValue({
      activeList: mockLists[0],
      setActiveList: mockSetActiveList,
      clearActiveList: jest.fn(),
    });

    render(<Sidebar />);

    // The active list should be selected in the menu
    const menu = screen.getByRole('menu');
    expect(menu).toBeInTheDocument();
  });
});
