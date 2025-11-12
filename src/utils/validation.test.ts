import { validateDutyName } from './validation';

describe('validateDutyName', () => {
  it('should return null for valid name', () => {
    expect(validateDutyName('Valid Duty')).toBeNull();
  });

  it('should return error for empty name', () => {
    expect(validateDutyName('')).toBe('Name is required');
  });

  it('should return error for whitespace-only name', () => {
    expect(validateDutyName('   ')).toBe('Name is required');
  });

  it('should return error for name longer than 255 characters', () => {
    const longName = 'a'.repeat(256);
    expect(validateDutyName(longName)).toBe('Name must be less than 255 characters');
  });

  it('should return null for name with exactly 255 characters', () => {
    const exactName = 'a'.repeat(255);
    expect(validateDutyName(exactName)).toBeNull();
  });
});
