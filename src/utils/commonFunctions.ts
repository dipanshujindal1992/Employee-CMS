export const formatDateGB = (date?: string | Date | null) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
export const getInitials = (firstName?: string) => {
  if (!firstName) return "EM";

  return firstName
    .split(" ")
    .map((n: string) => n[0])
    .join("");
};
 export const formatJoiningDate = (date?: string) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
};
export const formatDateToInput = (date?: string | Date): string => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};
export const formatDateIN = (date?: string | Date | null) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};