import { Modal, Form, Input, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import type { List, CreateListInput, UpdateListInput } from '../../types';
import { useLists } from '../../hooks';
import { useActiveList } from '../../contexts/ActiveListContext';
import { validateDutyName } from '../../utils/validation';
import './ListManager.css';

interface ListManagerProps {
  listToEdit?: List | null;
  onClose?: () => void;
  onListCreated?: () => void;
}

export const ListManager = ({ listToEdit, onClose, onListCreated }: ListManagerProps) => {
  const { createList, updateList } = useLists();
  const { setActiveList } = useActiveList();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const isEditMode = !!listToEdit;

  const showModal = () => {
    if (listToEdit) {
      form.setFieldsValue({ name: listToEdit.name });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    onClose?.();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (isEditMode && listToEdit) {
        const input: UpdateListInput = { name: values.name };
        await updateList(listToEdit.id, input);
        message.success('List updated successfully');
      } else {
        const input: CreateListInput = { name: values.name };
        const newList = await createList(input);
        message.success('List created successfully');
        // Select the newly created list
        setActiveList(newList);
      }

      // Refresh lists in sidebar
      onListCreated?.();
      handleCancel();
    } catch (error) {
      if (error && typeof error === 'object' && 'errorFields' in error) {
        // Validation errors are handled by Form
        return;
      }
      message.error(isEditMode ? 'Failed to update list' : 'Failed to create list');
    } finally {
      setLoading(false);
    }
  };

  // Auto-open modal if listToEdit is provided
  if (listToEdit && !isModalVisible) {
    showModal();
  }

  return (
    <>
      {!listToEdit && (
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showModal}
          className="list-manager-button"
        >
          New List
        </Button>
      )}

      <Modal
        title={isEditMode ? 'Edit List' : 'New List'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        confirmLoading={loading}
        okText={isEditMode ? 'Save' : 'Create'}
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical" name="listForm">
          <Form.Item
            name="name"
            label="List Name"
            rules={[
              { required: true, message: 'Name is required' },
              {
                validator: (_, value) => {
                  const error = validateDutyName(value);
                  if (error) {
                    return Promise.reject(new Error(error));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input placeholder="e.g., Travel bag" maxLength={255} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
