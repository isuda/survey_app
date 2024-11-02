export const validateSurveyResponse = (
  value: any, 
  questionType: string,
  constraints?: { min?: number; max?: number; limit?: number }
): string | null => {
  if (value === undefined || value === null || value === '') {
    return 'This field is required';
  }

  if (questionType === 'scale') {
    const numValue = Number(value);
    const { min = 1, max = 10 } = constraints || {};
    
    if (isNaN(numValue)) {
      return 'Please enter a valid number';
    }
    if (numValue < min || numValue > max) {
      return `Please enter a number between ${min} and ${max}`;
    }
  }

  if (questionType === 'text') {
    const { limit } = constraints || {};
    if (limit && value.length > limit) {
      return `Response must be ${limit} characters or less`;
    }
  }

  return null;
};
