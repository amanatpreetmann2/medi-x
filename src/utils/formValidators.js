/**
 * Form Validation Utilities for React Form Handling
 * Supports common validation rules and custom constraint checkers
 */

export const validateEmail = (email) => {
  if (!email || !email.trim()) return "Email address is required";
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email.trim())) return "Please enter a valid email address (e.g. name@domain.com)";
  return "";
};

export const validateRequired = (val, fieldName = "This field") => {
  if (val === null || val === undefined || (typeof val === 'string' && !val.trim())) {
    return `${fieldName} is required`;
  }
  return "";
};

export const validateMinLength = (val, min, fieldName = "This field") => {
  if (!val || val.trim().length < min) {
    return `${fieldName} must be at least ${min} characters`;
  }
  return "";
};

export const validatePhone = (phone) => {
  if (!phone || !phone.trim()) return "Phone number is required";
  // Allows international or US format
  const regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  if (!regex.test(phone.trim().replace(/\s+/g, ' '))) {
    return "Please enter a valid phone number (e.g. +1 (555) 012-3456)";
  }
  return "";
};

export const validateFutureDate = (dateStr) => {
  if (!dateStr) return "Appointment date is required";
  const selected = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isNaN(selected.getTime())) {
    return "Invalid date format";
  }

  if (selected < today) {
    return "Appointment date cannot be in the past";
  }

  // Check not on weekend (Sunday=0, Saturday=6)
  const day = selected.getDay();
  if (day === 0) {
    return "Clinics are closed on Sundays. Please choose Monday - Saturday";
  }

  return "";
};
