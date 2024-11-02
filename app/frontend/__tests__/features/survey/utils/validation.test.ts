import { validateSurveyResponse } from '../../../../features/survey/utils/validation';

describe('validateSurveyResponse', () => {
  describe('general validation', () => {
    it('returns error for undefined value', () => {
      expect(validateSurveyResponse(undefined, 'text')).toBe('This field is required');
    });

    it('returns error for null value', () => {
      expect(validateSurveyResponse(null, 'text')).toBe('This field is required');
    });

    it('returns error for empty string', () => {
      expect(validateSurveyResponse('', 'text')).toBe('This field is required');
    });
  });

  describe('scale question validation', () => {
    const constraints = { min: 1, max: 10 };

    it('validates number within range', () => {
      expect(validateSurveyResponse(5, 'scale', constraints)).toBeNull();
    });

    it('returns error for number below minimum', () => {
      expect(validateSurveyResponse(0, 'scale', constraints))
        .toBe('Please enter a number between 1 and 10');
    });

    it('returns error for number above maximum', () => {
      expect(validateSurveyResponse(11, 'scale', constraints))
        .toBe('Please enter a number between 1 and 10');
    });

    it('returns error for non-numeric value', () => {
      expect(validateSurveyResponse('not a number', 'scale', constraints))
        .toBe('Please enter a valid number');
    });

    it('uses default constraints when none provided', () => {
      expect(validateSurveyResponse(5, 'scale')).toBeNull();
    });
  });

  describe('text question validation', () => {
    const constraints = { limit: 10 };

    it('validates text within character limit', () => {
      expect(validateSurveyResponse('Hello', 'text', constraints)).toBeNull();
    });

    it('returns error for text exceeding limit', () => {
      expect(validateSurveyResponse('This is too long', 'text', constraints))
        .toBe('Response must be 10 characters or less');
    });

    it('accepts any text when no limit specified', () => {
      expect(validateSurveyResponse('Any length is fine', 'text')).toBeNull();
    });
  });
});
