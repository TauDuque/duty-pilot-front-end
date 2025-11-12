import { Alert, Spin, Empty } from 'antd';
import type { Duty } from '../../types';
import { DutyItem } from '../DutyItem';
import './DutyList.css';

interface DutyListProps {
  duties: Duty[];
  loading: boolean;
  error: string | null;
  onUpdate: (id: string, name: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const DutyList: React.FC<DutyListProps> = ({
  duties,
  loading,
  error,
  onUpdate,
  onDelete,
}) => {
  if (loading && duties.length === 0) {
    return (
      <div className="duty-list-loading">
        <Spin size="large" tip="Loading duties..." />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        className="duty-list-error"
      />
    );
  }

  if (duties.length === 0) {
    return (
      <Empty
        description="No duties yet. Create your first duty above!"
        className="duty-list-empty"
      />
    );
  }

  return (
    <div className="duty-list">
      <div className="duty-list-header">
        <h3>Your Duties ({duties.length})</h3>
      </div>
      <div className="duty-list-items">
        {duties.map((duty) => (
          <DutyItem key={duty.id} duty={duty} onUpdate={onUpdate} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
};
