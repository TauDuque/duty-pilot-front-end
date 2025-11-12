import { useState } from 'react';
import { Card, Input, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { validateDutyName } from '../../utils';
import './DutyForm.css';

interface DutyFormProps {
  onCreate: (name: string) => Promise<void>;
}

export const DutyForm: React.FC<DutyFormProps> = ({ onCreate }) => {
  const [name, setName] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (): Promise<void> => {
    const error = validateDutyName(name);
    if (error) {
      setValidationError(error);
      return;
    }

    setIsSubmitting(true);
    try {
      await onCreate(name);
      setName('');
      setValidationError(null);
      message.success('Duty created successfully');
    } catch (err) {
      message.error(err instanceof Error ? err.message : 'Failed to create duty');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setName(e.target.value);
    setValidationError(null);
  };

  return (
    <Card title="Create New Duty" className="duty-form">
      <div className="duty-form-content">
        <Input
          placeholder="Enter duty name"
          value={name}
          onChange={handleInputChange}
          onPressEnter={handleSubmit}
          status={validationError ? 'error' : ''}
          size="large"
          maxLength={255}
          showCount
        />
        {validationError && <div className="duty-form-error">{validationError}</div>}
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleSubmit}
          loading={isSubmitting}
          size="large"
          block
        >
          Add Duty
        </Button>
      </div>
    </Card>
  );
};
