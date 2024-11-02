import { isValidEmail } from '../../../../features/email/utils/validation';

describe('isValidEmail', () => {
  it('validates correct email addresses', () => {
    const validEmails = [
      'test@example.com',
      'user.name@domain.com',
      'user+label@domain.co.uk',
      'first.last@subdomain.domain.org',
      '123@domain.com'
    ];

    validEmails.forEach(email => {
      expect(isValidEmail(email)).toBe(true);
    });
  });

  it('rejects invalid email addresses', () => {
    const invalidEmails = [
      '',                     // empty string
      'notanemail',           // no @ symbol
      '@nodomain.com',        // no local part
      'no.domain@',           // no domain part
      'spaces in@email.com',  // contains spaces
      'double@@domain.com',   // double @
      'missing.domain@.com',  // missing domain part
      'multiple@at@signs.com' // multiple @ signs
    ];

    invalidEmails.forEach(email => {
      expect(isValidEmail(email)).toBe(false);
    });
  });

  it('handles edge cases', () => {
    expect(isValidEmail(undefined as any)).toBe(false);
    expect(isValidEmail(null as any)).toBe(false);
    expect(isValidEmail(NaN as any)).toBe(false);
  });
});
