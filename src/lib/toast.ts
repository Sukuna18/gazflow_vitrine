import type React from "react";

export type ToastType = "success" | "error";
export type ToastPayload = { message: string; type: ToastType; style: React.CSSProperties; duration: number };
export type ToastListener = (payload: ToastPayload) => void;

const listeners = new Set<ToastListener>();

export const errorToastStyle: React.CSSProperties = {
  backgroundColor: "#FF4D4F",
  color: "white",
};

export const successToastStyle: React.CSSProperties = {
  backgroundColor: "#00ac4f",
  color: "white",
};

export const toastMessage = (message: string, type: ToastType) => {
  const payload = {
    message,
    type,
    style: type === "error" ? errorToastStyle : successToastStyle,
    duration: 5000,
  };
  listeners.forEach((listener) => listener(payload));
};

export function subscribeToast(listener: ToastListener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
