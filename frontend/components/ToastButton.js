"use client";

import toast from "react-hot-toast";

export default function ToastButton({ children, message, className, type = "success", title }) {
  const handleClick = () => {
    if (type === "success") toast.success(message);
    else if (type === "error") toast.error(message);
    else toast(message);
  };

  return (
    <button onClick={handleClick} className={className} title={title}>
      {children}
    </button>
  );
}
