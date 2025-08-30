const getErrorMessage = (error: any) => {
  // Check if error has a data property with a revert reason.
  if (error?.data?.message) return error.data.message;
  if (error?.reason) return error.reason;
  if (typeof error === "string") return error;
  return "An unexpected error occurred . Please try again later.";
};

export default getErrorMessage;