import {
  validateEmail,
  validatePassword,
  validatePhoneNumber,
  validateDate,
  validateTime,
  validateGuestCount,
  validateBookingForm,
} from './validation';

describe('Email Validation', () => {
  test('should validate correct email', () => {
    expect(validateEmail('user@example.com')).toBe(true);
  });

  test('should reject email without @', () => {
    expect(validateEmail('userexample.com')).toBe(false);
  });

  test('should reject email without domain', () => {
    expect(validateEmail('user@')).toBe(false);
  });
});

describe('Password Validation', () => {
  test('should validate password with 6 or more characters', () => {
    expect(validatePassword('password123')).toBe(true);
  });

  test('should reject password with less than 6 characters', () => {
    expect(validatePassword('pass')).toBe(false);
  });

  test('should accept exactly 6 character password', () => {
    expect(validatePassword('123456')).toBe(true);
  });
});

describe('Phone Number Validation', () => {
  test('should validate phone number with digits', () => {
    expect(validatePhoneNumber('5551234567')).toBe(true);
  });

  test('should validate phone number with formatting', () => {
    expect(validatePhoneNumber('+1 (555) 123-4567')).toBe(true);
  });

  test('should reject short phone number', () => {
    expect(validatePhoneNumber('555')).toBe(false);
  });
});

describe('Guest Count Validation', () => {
  test('should validate guest count of 1', () => {
    expect(validateGuestCount(1)).toBe(true);
  });

  test('should validate guest count of 6', () => {
    expect(validateGuestCount(6)).toBe(true);
  });

  test('should validate guest count of 3', () => {
    expect(validateGuestCount(3)).toBe(true);
  });

  test('should reject 0 guests', () => {
    expect(validateGuestCount(0)).toBe(false);
  });

  test('should reject more than 6 guests', () => {
    expect(validateGuestCount(7)).toBe(false);
  });
});

describe('Time Validation', () => {
  test('should validate opening hour 11:00', () => {
    expect(validateTime('11:00')).toBe(true);
  });

  test('should validate time during business hours', () => {
    expect(validateTime('15:30')).toBe(true);
  });

  test('should validate time before 9:00 PM', () => {
    expect(validateTime('20:30')).toBe(true);
  });

  test('should reject time before opening', () => {
    expect(validateTime('10:00')).toBe(false);
  });

  test('should reject time after hours', () => {
    expect(validateTime('22:00')).toBe(false);
  });
});

describe('Booking Form Validation', () => {
  test('should identify missing date and time', () => {
    const result = validateBookingForm('', '', 2);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  test('should reject booking with 0 guests', () => {
    const today = new Date().toISOString().split('T')[0];
    const result = validateBookingForm(today, '12:00', 0);
    expect(result.valid).toBe(false);
  });

  test('should reject booking with more than 6 guests', () => {
    const today = new Date().toISOString().split('T')[0];
    const result = validateBookingForm(today, '12:00', 7);
    expect(result.valid).toBe(false);
  });
});
