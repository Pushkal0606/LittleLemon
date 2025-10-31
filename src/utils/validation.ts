export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[0-9\-\+\s\(\)]{7,}$/;
  return phoneRegex.test(phone);
};

export const validateDate = (date: string): boolean => {
  if (!date) return false;

  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) return false;

  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  if (selectedDate > maxDate) return false;

  const dayOfWeek = selectedDate.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) return false;

  return true;
};

export const validateTime = (time: string): boolean => {
  if (!time) return false;

  const [hours, minutes] = time.split(':').map(Number);
  if (hours < 11 || hours >= 22 || (hours === 21 && minutes > 0)) return false;

  return true;
};

export const validateGuestCount = (count: number): boolean => {
  return count >= 1 && count <= 6;
};

export const validateBookingForm = (
  date: string,
  time: string,
  guests: number
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!date || !time) {
    errors.push('Please select a date and time');
  } else {
    if (!validateDate(date)) {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        errors.push('Cannot book in the past');
      } else {
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 30);
        if (selectedDate > maxDate) {
          errors.push('Can only book up to 30 days in advance');
        } else {
          const dayName = selectedDate.getDay() === 0 ? 'Sunday' : 'Saturday';
          errors.push(`Bookings currently closed on ${dayName}s`);
        }
      }
    }

    if (!validateTime(time)) {
      errors.push('Bookings available between 11:00 AM and 9:00 PM');
    }
  }

  if (!validateGuestCount(guests)) {
    errors.push('Number of guests must be between 1 and 6');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
