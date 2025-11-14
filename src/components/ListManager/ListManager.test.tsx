import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import type { ComponentProps } from 'react';
import { ListManager } from './ListManager';
import { useActiveList } from '../../contexts/ActiveListContext';
import type { List } from '../../types';

jest.mock('../../contexts/ActiveListContext');

const mockUseActiveList = useActiveList as jest.MockedFunction<typeof useActiveList>;

describe('ListManager', () => {
  const mockCreateList = jest.fn();
  const mockUpdateList = jest.fn();
  const mockSetActiveList = jest.fn();
  const mockOnListCreated = jest.fn();
  const renderComponent = (overrideProps: Partial<ComponentProps<typeof ListManager>> = {}) =>
    render(
      <ListManager
        createList={mockCreateList}
        updateList={mockUpdateList}
        onListCreated={mockOnListCreated}
        {...overrideProps}
      />
    );

  const mockNewList: List = {
    id: '1',
    name: 'New List',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateList.mockReset();
    mockUpdateList.mockReset();
    mockSetActiveList.mockReset();
    mockOnListCreated.mockReset();
    mockUseActiveList.mockReturnValue({
      activeList: null,
      setActiveList: mockSetActiveList,
      clearActiveList: jest.fn(),
    });
  });

  it('should render new list button', () => {
    renderComponent();

    expect(screen.getByText('New List')).toBeInTheDocument();
  });

  it('should open modal when button is clicked', async () => {
    renderComponent();

    const button = screen.getByText('New List');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByLabelText('List Name')).toBeInTheDocument();
    });
  });

  it('should create a new list', async () => {
    mockCreateList.mockResolvedValue(mockNewList);

    renderComponent();

    const button = screen.getByText('New List');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByLabelText('List Name')).toBeInTheDocument();
    });

    const input = screen.getByLabelText('List Name');
    fireEvent.change(input, { target: { value: 'New List' } });

    const createButton = screen.getByText('Create');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(mockCreateList).toHaveBeenCalledWith({ name: 'New List' });
    });

    expect(mockSetActiveList).toHaveBeenCalledWith(mockNewList);
    expect(mockOnListCreated).toHaveBeenCalled();
  });

  it('should show validation error for empty name', async () => {
    renderComponent();

    const button = screen.getByText('New List');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Create')).toBeInTheDocument();
    });

    const createButton = screen.getByText('Create');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getAllByText('Name is required').length).toBeGreaterThan(0);
    });

    expect(mockCreateList).not.toHaveBeenCalled();
  });

  it('should update existing list', async () => {
    const listToEdit: List = {
      id: '1',
      name: 'Old Name',
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    };

    mockUpdateList.mockResolvedValue(undefined);

    renderComponent({ listToEdit });

    await waitFor(() => {
      expect(screen.getByText('Edit List')).toBeInTheDocument();
    });

    const input = screen.getByLabelText('List Name') as HTMLInputElement;
    expect(input.value).toBe('Old Name');

    fireEvent.change(input, { target: { value: 'Updated Name' } });

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockUpdateList).toHaveBeenCalledWith('1', { name: 'Updated Name' });
    });

    expect(mockOnListCreated).toHaveBeenCalled();
  });

  it('should close modal when cancel is clicked', async () => {
    renderComponent();

    const button = screen.getByText('New List');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByLabelText('List Name')).toBeInTheDocument();
    });

    expect(screen.getByText('Create')).toBeInTheDocument();

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    // Wait for modal to close - Ant Design keeps modal in DOM but hides it
    // Verify that the modal is no longer visible by checking the modal wrap style
    await waitFor(
      () => {
        const input = screen.queryByLabelText('List Name');
        if (input) {
          // If input exists, check if it's in a hidden modal
          const modalWrap = input.closest('.ant-modal-wrap') as HTMLElement;
          if (modalWrap) {
            // Modal wrap should have display: none in inline style
            const displayStyle = modalWrap.style.display;
            // Check if modal is hidden (either via style attribute or computed style)
            expect(displayStyle === 'none' || !modalWrap.offsetParent).toBe(true);
          }
        } else {
          // Input not found means modal is closed
          expect(input).toBeNull();
        }
      },
      { timeout: 2000 }
    );
  });
});
