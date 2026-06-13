"use client";

import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";
import { subscribeToast, type ToastPayload } from "@/lib/toast";

type ToastItem = ToastPayload & { id: string };

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  useEffect(() => {
    return subscribeToast((payload) => {
      const id = crypto.randomUUID();
      setToasts((current) => [{ ...payload, id }, ...current].slice(0, 4));
      window.setTimeout(() => dismiss(id), payload.duration);
    });
  }, [dismiss]);

  return (
    <>
      {children}
      <div style={viewportStyle} aria-live="polite" aria-relevant="additions">
        {toasts.map((toast) => (
          <div key={toast.id} style={{ ...toastCardStyle, ...toast.style }}>
            <span style={toastIconStyle}>{toast.type === "error" ? "!" : "✓"}</span>
            <p style={toastTextStyle}>{toast.message}</p>
            <button type="button" onClick={() => dismiss(toast.id)} aria-label="Fermer la notification" style={toastCloseStyle}>
              <X size={15} />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

const viewportStyle: React.CSSProperties = {
  position: "fixed",
  top: 18,
  right: 18,
  zIndex: 9999,
  display: "grid",
  gap: 10,
  width: "min(360px, calc(100vw - 28px))",
  pointerEvents: "none",
};

const toastCardStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "28px 1fr 24px",
  alignItems: "center",
  gap: 10,
  minHeight: 54,
  borderRadius: 14,
  padding: "12px 12px",
  boxShadow: "0 18px 42px rgba(6, 61, 106, .22)",
  pointerEvents: "auto",
  fontSize: 13,
  fontWeight: 900,
};

const toastIconStyle: React.CSSProperties = {
  display: "grid",
  placeItems: "center",
  width: 24,
  height: 24,
  borderRadius: 999,
  background: "rgba(255, 255, 255, .2)",
};

const toastTextStyle: React.CSSProperties = {
  margin: 0,
  lineHeight: 1.35,
};

const toastCloseStyle: React.CSSProperties = {
  display: "grid",
  placeItems: "center",
  width: 24,
  height: 24,
  border: 0,
  borderRadius: 999,
  color: "inherit",
  background: "rgba(255, 255, 255, .16)",
  cursor: "pointer",
};
