export const validateDutyName = (name: string): string | null => {
  if (!name || name.trim().length === 0) {
    return 'Name is required';
  }

  if (name.length > 255) {
    return 'Name must be less than 255 characters';
  }

  return null;
};
