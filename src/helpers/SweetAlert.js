import Swal from "sweetalert2";
export const ConfirmBox = async obj => {
  if (!obj) {
    obj = {};
  }
  let {
    title,
    text,
    type,
    showCancelButton,
    showConfirmButton,
    confirmButtonColor,
    cancelButtonColor,
    confirmButtonText,
    html,
    customClass
  } = obj;
  return await Swal.fire({
    title: title || "Are you sure?",
    text: text !== null ? text : "You want to be able to revert this!",
    type: type || "warning",
    showCancelButton:
      typeof showCancelButton == "undefined" ? true : showCancelButton,
    showConfirmButton:
      typeof showConfirmButton == "undefined" ? true : showConfirmButton,
    confirmButtonColor: confirmButtonColor || "#3085d6",
    cancelButtonColor: cancelButtonColor || "#d33",
    confirmButtonText: confirmButtonText || "Yes!",
    html: html || null,
    customClass: customClass || null
  });
};
