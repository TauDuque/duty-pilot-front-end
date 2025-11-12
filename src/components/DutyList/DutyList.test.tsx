import { render, screen } from '@testing-library/react';
import { DutyList } from './DutyList';
import type { Duty } from '../../types';

describe('DutyList', () => {
  const mockDuties: Duty[] = [
    { id: '1', name: 'Test Duty 1', created_at: '2024-01-01', updated_at: '2024-01-01' },
    { id: '2', name: 'Test Duty 2', created_at: '2024-01-02', updated_at: '2024-01-02' },
  ];

  const mockOnUpdate = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show loading spinner when loading', () => {
    render(
      <DutyList
        duties={[]}
        loading={true}
        error={null}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Loading duties...')).toBeInTheDocument();
  });

  it('should show error message when there is an error', () => {
    render(
      <DutyList
        duties={[]}
        loading={false}
        error="Failed to load duties"
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Failed to load duties')).toBeInTheDocument();
  });

  it('should show empty state when there are no duties', () => {
    render(
      <DutyList
        duties={[]}
        loading={false}
        error={null}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('No duties yet. Create your first duty above!')).toBeInTheDocument();
  });

  it('should render list of duties', () => {
    render(
      <DutyList
        duties={mockDuties}
        loading={false}
        error={null}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Your Duties (2)')).toBeInTheDocument();
    expect(screen.getByText('Test Duty 1')).toBeInTheDocument();
    expect(screen.getByText('Test Duty 2')).toBeInTheDocument();
  });
});
