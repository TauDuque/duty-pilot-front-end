import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DutyForm } from './DutyForm';

// Mock antd message
jest.mock('antd', () => {
  const actual = jest.requireActual('antd');
  return {
    ...actual,
    message: {
      success: jest.fn(),
      error: jest.fn(),
    },
  };
});

describe('DutyForm', () => {
  const mockOnCreate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render form with input and button', () => {
    render(<DutyForm onCreate={mockOnCreate} />);

    expect(screen.getByPlaceholderText('Enter duty name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add duty/i })).toBeInTheDocument();
  });

  it('should show validation error for empty input', async () => {
    render(<DutyForm onCreate={mockOnCreate} />);

    const button = screen.getByRole('button', { name: /add duty/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
    });

    expect(mockOnCreate).not.toHaveBeenCalled();
  });

  it('should call onCreate with valid input', async () => {
    mockOnCreate.mockResolvedValueOnce(undefined);
    render(<DutyForm onCreate={mockOnCreate} />);

    const input = screen.getByPlaceholderText('Enter duty name');
    const button = screen.getByRole('button', { name: /add duty/i });

    fireEvent.change(input, { target: { value: 'Test Duty' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockOnCreate).toHaveBeenCalledWith('Test Duty');
    });
  });

  it('should clear input after successful submission', async () => {
    mockOnCreate.mockResolvedValueOnce(undefined);
    render(<DutyForm onCreate={mockOnCreate} />);

    const input = screen.getByPlaceholderText('Enter duty name') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Test Duty' } });
    fireEvent.click(screen.getByRole('button', { name: /add duty/i }));

    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });
});
