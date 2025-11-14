import { useState } from 'react';
import { Card, Button, Space, Input, Modal, message, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import type { Duty, DutyStatus } from '../../types';
import { validateDutyName } from '../../utils';
import './DutyItem.css';

interface DutyItemProps {
  duty: Duty;
  onUpdate: (id: string, name: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onUpdateStatus: (id: string, status: DutyStatus) => Promise<void>;
}

const statusConfig: Record<DutyStatus, { color: string; label: string; next: DutyStatus }> = {
  pending: { color: 'orange', label: 'Pending', next: 'in_progress' },
  in_progress: { color: 'blue', label: 'In Progress', next: 'done' },
  done: { color: 'green', label: 'Done', next: 'pending' },
};

export const DutyItem: React.FC<DutyItemProps> = ({ duty, onUpdate, onDelete, onUpdateStatus }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(duty.name);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);

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

  const handleDeleteClick = (): void => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    try {
      await onDelete(duty.id);
      setIsDeleteModalOpen(false);
      message.success('Duty deleted successfully');
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Failed to delete duty');
    }
  };

  const handleDeleteCancel = (): void => {
    setIsDeleteModalOpen(false);
  };

  const handleToggleStatus = async (): Promise<void> => {
    if (isStatusUpdating) {
      return;
    }

    setIsStatusUpdating(true);
    const nextStatus = statusConfig[duty.status].next;

    try {
      await onUpdateStatus(duty.id, nextStatus);
    } finally {
      setIsStatusUpdating(false);
    }
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
          <Space size="middle" className="duty-item-status-wrapper">
            <Tag
              color={statusConfig[duty.status].color}
              onClick={handleToggleStatus}
              className="duty-item-status-tag"
              style={{
                opacity: isStatusUpdating ? 0.6 : 1,
                pointerEvents: isStatusUpdating ? 'none' : 'auto',
              }}
            >
              {statusConfig[duty.status].label}
            </Tag>
            <span
              className="duty-item-name"
              style={{
                textDecoration: duty.status === 'done' ? 'line-through' : 'none',
                opacity: duty.status === 'done' ? 0.6 : 1,
              }}
            >
              {duty.name}
            </span>
          </Space>
          <Space className="duty-item-actions">
            <Button type="text" icon={<EditOutlined />} onClick={handleEdit} size="small">
              Edit
            </Button>
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={handleDeleteClick}
              size="small"
            >
              Delete
            </Button>
          </Space>
        </div>
      )}
      <Modal
        title="Delete Duty"
        open={isDeleteModalOpen}
        onOk={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete this duty?</p>
        <p>
          <strong>{duty.name}</strong>
        </p>
      </Modal>
    </Card>
  );
};
