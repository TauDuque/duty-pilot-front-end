import { Layout, Typography } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { DutyForm } from './components/DutyForm';
import { DutyList } from './components/DutyList';
import { Sidebar } from './components/Sidebar';
import { ListManager } from './components/ListManager';
import { useDuties } from './hooks';
import { useActiveList } from './contexts/ActiveListContext';
import './App.css';

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  const { activeList } = useActiveList();
  const { duties, loading, error, createDuty, updateDuty, deleteDuty } = useDuties(activeList?.id);

  const handleCreate = async (name: string): Promise<void> => {
    await createDuty({ name });
  };

  const handleUpdate = async (id: string, name: string): Promise<void> => {
    await updateDuty(id, { name });
  };

  const handleDelete = async (id: string): Promise<void> => {
    await deleteDuty(id);
  };

  return (
    <Layout className="app-layout">
      <Sidebar />
      <Layout>
        <Header className="app-header">
          <div className="app-header-content">
            <CheckCircleOutlined className="app-icon" />
            <Title level={2} className="app-title">
              Duty Pilot
            </Title>
            {activeList && (
              <Title level={4} className="app-subtitle">
                {activeList.name}
              </Title>
            )}
          </div>
        </Header>
        <Content className="app-content">
          <div className="app-container">
            {activeList ? (
              <>
                <DutyForm onCreate={handleCreate} />
                <DutyList
                  duties={duties}
                  loading={loading}
                  error={error}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              </>
            ) : (
              <div className="app-empty-state">
                <p>Select a list from the sidebar to get started</p>
                <ListManager />
              </div>
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
