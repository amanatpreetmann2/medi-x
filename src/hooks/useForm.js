import { useState, useCallback } from 'react';

/**
 * Custom React Hook for Form Handling
 * Provides controlled form state, real-time & on-blur validation,
 * submission handling, touched field tracking, and dirty detection.
 *
 * @param {Object} initialValues - Initial field values
 * @param {Function} validate - Validation function receiving values and returning errors object
 * @param {Function} onSubmit - Callback invoked with validated values upon successful submission
 */
export function useForm(initialValues = {}, validate = null, onSubmit = null) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Run validation and return if form has errors
  const runValidation = useCallback((currentValues) => {
    if (typeof validate === 'function') {
      const validationErrors = validate(currentValues) || {};
      setErrors(validationErrors);
      return validationErrors;
    }
    return {};
  }, [validate]);

  // Handle input changes
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setValues((prev) => {
      const nextValues = { ...prev, [name]: fieldValue };
      if (validate) {
        // Run validation on change for already touched fields
        if (touched[name]) {
          const newErrors = validate(nextValues);
          setErrors(newErrors);
        }
      }
      return nextValues;
    });
  }, [validate, touched]);

  // Handle blur to mark field as touched and validate
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors);
    }
  }, [validate, values]);

  // Set individual field value programmatically
  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Set field error programmatically
  const setFieldError = useCallback((name, errorMsg) => {
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  }, []);

  // Reset form to initial or new values
  const resetForm = useCallback((newValues = initialValues) => {
    setValues(newValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    // Validate all fields
    const validationErrors = runValidation(values);
    const hasErrors = Object.values(validationErrors).some((err) => Boolean(err));

    if (hasErrors) {
      return false;
    }

    if (onSubmit) {
      try {
        setIsSubmitting(true);
        await onSubmit(values, { resetForm, setFieldValue, setFieldError });
      } finally {
        setIsSubmitting(false);
      }
    }
    return true;
  }, [values, runValidation, onSubmit, resetForm, setFieldValue, setFieldError]);

  const isValid = Object.keys(errors).length === 0 || Object.values(errors).every((err) => !err);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
    setValues
  };
}

export default useForm;
