"use client";

import { useEffect, useRef } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="bg-surface border border-border rounded-lg p-0 w-full max-w-lg backdrop:bg-black/60 text-text-primary"
    >
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <h2 className="text-sm font-semibold font-mono">{title}</h2>
        <button
          onClick={onClose}
          className="text-text-secondary hover:text-text-primary text-lg cursor-pointer"
        >
          &times;
        </button>
      </div>
      <div className="p-5">{children}</div>
    </dialog>
  );
}
