import { useState } from 'react';
import { Card, Button, Space, Input, Modal, message } from 'antd';
import { EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import type { Duty } from '../../types';
import { validateDutyName } from '../../utils';
import './DutyItem.css';

interface DutyItemProps {
  duty: Duty;
  onUpdate: (id: string, name: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const DutyItem: React.FC<DutyItemProps> = ({ duty, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(duty.name);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleEdit = (): void => {
    setIsEditing(true);
    setEditValue(duty.name);
    setValidationError(null);
  };

  const handleCancel = (): void => {
    setIsEditing(false);
    setEditValue(duty.name);
    setValidationError(null);
  };

  const handleSave = async (): Promise<void> => {
    const error = validateDutyName(editValue);
    if (error) {
      setValidationError(error);
      return;
    }

    try {
      await onUpdate(duty.id, editValue);
      setIsEditing(false);
      setValidationError(null);
      message.success('Duty updated successfully');
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Failed to update duty');
    }
  };

  const handleDelete = (): void => {
    Modal.confirm({
      title: 'Delete Duty',
      content: 'Are you sure you want to delete this duty?',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await onDelete(duty.id);
          message.success('Duty deleted successfully');
        } catch (err) {
          message.error(err instanceof Error ? err.message : 'Failed to delete duty');
        }
      },
    });
  };

  return (
    <Card className="duty-item" size="small">
      {isEditing ? (
        <div className="duty-item-edit">
          <Input
            value={editValue}
            onChange={(e) => {
              setEditValue(e.target.value);
              setValidationError(null);
            }}
            onPressEnter={handleSave}
            status={validationError ? 'error' : ''}
            placeholder="Enter duty name"
            autoFocus
          />
          {validationError && <div className="duty-item-error">{validationError}</div>}
          <Space className="duty-item-actions">
            <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} size="small">
              Save
            </Button>
            <Button icon={<CloseOutlined />} onClick={handleCancel} size="small">
              Cancel
            </Button>
          </Space>
        </div>
      ) : (
        <div className="duty-item-view">
          <span className="duty-item-name">{duty.name}</span>
          <Space className="duty-item-actions">
            <Button type="text" icon={<EditOutlined />} onClick={handleEdit} size="small">
              Edit
            </Button>
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={handleDelete}
              size="small"
            >
              Delete
            </Button>
          </Space>
        </div>
      )}
    </Card>
  );
};
