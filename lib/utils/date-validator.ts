/**
 * Date Validation Utilities
 *
 * Provides validation functions for date parameters in YYYY-MM-DD format.
 * Used by tools that accept date range parameters.
 */

export interface DateValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates date range parameters for tools
 * @param startDate - Start date in YYYY-MM-DD format
 * @param endDate - End date in YYYY-MM-DD format
 * @returns Validation result with success status and error message if invalid
 */
export function validateDateRange(
  startDate: string,
  endDate: string
): DateValidationResult {
  // Validate date formats
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
    return {
      isValid: false,
      error:
        "Invalid date format. Both startDate and endDate must be in YYYY-MM-DD format.",
    };
  }

  // Validate date values
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);

  if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
    return {
      isValid: false,
      error:
        "Invalid date values. Please provide valid dates in YYYY-MM-DD format.",
    };
  }

  // Validate logical order
  if (startDateObj > endDateObj) {
    return {
      isValid: false,
      error: "Start date must be before or equal to end date.",
    };
  }

  return { isValid: true };
}
