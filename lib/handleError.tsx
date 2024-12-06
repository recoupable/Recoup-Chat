import { toast } from "react-toastify";

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const handleError = (error: any) => {
  const primaryError = error?.reason || error?.data?.message;
  const nestedError = error?.error?.message;
  const fallbackError = error.message;

  const toastMessage = primaryError || nestedError || fallbackError;
  toast.error(toastMessage);
  return toastMessage;
};

export default handleError;
