import Swal from "sweetalert2";

interface ConfirmAlertParams {
  title: string;
  text: string;
  icon: "warning" | "error" | "success" | "info" | "question";
  confirmText: string;
  cancelText: string;
}

export const confirmAlert = async ({
  title,
  text,
  icon,
  confirmText,
  cancelText,
}: ConfirmAlertParams) => {
  const result = await Swal.fire({
    title,
    text,
    icon,

    width: "420px",
    padding: "1.5rem",
    backdrop: `rgba(0,0,0,0.4)`,

    // 👉 conditionally add props
    ...(icon === "warning" && {
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
    }),

    customClass: {
      popup: "rounded-3",
      confirmButton: "btn btn-danger px-4",
      cancelButton: "btn btn-secondary px-4 ms-2",
      title: "fw-semibold",
    },
    buttonsStyling: false,
  });

  return result.isConfirmed;
};
