import { Layout, Menu, Button, Modal, message, Spin } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useState } from 'react';
import type { List, CreateListInput, UpdateListInput } from '../../types';
import { useActiveList } from '../../contexts/ActiveListContext';
import { ListManager } from '../ListManager';
import './Sidebar.css';

const { Sider } = Layout;

interface SidebarProps {
  lists: List[];
  loading: boolean;
  fetchLists: () => Promise<void>;
  deleteList: (id: string) => Promise<void>;
  createList: (input: CreateListInput) => Promise<List>;
  updateList: (id: string, input: UpdateListInput) => Promise<void>;
}

export const Sidebar = ({
  lists,
  loading,
  fetchLists,
  deleteList,
  createList,
  updateList,
}: SidebarProps) => {
  const { activeList, setActiveList } = useActiveList();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [listToDelete, setListToDelete] = useState<List | null>(null);

  const handleListClick = (list: List) => {
    setActiveList(list);
  };

  const handleDeleteClick = (e: React.MouseEvent, list: List) => {
    e.stopPropagation();
    setListToDelete(list);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (!listToDelete) return;

    try {
      await deleteList(listToDelete.id);
      message.success('List deleted successfully');
      if (activeList?.id === listToDelete.id) {
        setActiveList(null);
      }
      // Refresh lists to ensure UI is updated
      await fetchLists();
    } catch {
      message.error('Failed to delete list');
    } finally {
      setIsDeleteModalVisible(false);
      setListToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
    setListToDelete(null);
  };

  const menuItems = lists.map((list) => ({
    key: list.id,
    label: (
      <div className="sidebar-list-item">
        <span className="sidebar-list-name">{list.name}</span>
        <Button
          type="text"
          danger
          size="small"
          icon={<DeleteOutlined />}
          onClick={(e) => handleDeleteClick(e, list)}
          className="sidebar-delete-btn"
        />
      </div>
    ),
    onClick: () => handleListClick(list),
  }));

  const selectedKeys = activeList ? [activeList.id] : [];

  return (
    <>
      <Sider width={250} className="sidebar" theme="light">
        <div className="sidebar-header">
          <h2>My Lists</h2>
          <ListManager onListCreated={fetchLists} createList={createList} updateList={updateList} />
        </div>
        {loading ? (
          <div style={{ padding: '16px', textAlign: 'center' }}>
            <Spin tip="Loading lists..." />
          </div>
        ) : (
          <Menu
            mode="inline"
            selectedKeys={selectedKeys}
            items={menuItems}
            className="sidebar-menu"
          />
        )}
      </Sider>

      <Modal
        title="Confirm Deletion"
        open={isDeleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete the list &quot;{listToDelete?.name}&quot;?</p>
        <p style={{ color: 'red', fontSize: '12px' }}>
          All tasks in this list will also be deleted.
        </p>
      </Modal>
    </>
  );
};
