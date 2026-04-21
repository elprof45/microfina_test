"use client";

import React, { ReactNode } from "react";
import { Button } from "./Common";

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "primary" | "danger" | "success";
  isLoading?: boolean;
  children: ReactNode;
}

export function Modal({
  isOpen,
  title,
  onClose,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "primary",
  isLoading = false,
  children,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>

        <div className="px-6 py-4">{children}</div>

        <div className="px-6 py-4 bg-gray-50 border-t flex gap-3 justify-end">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          {onConfirm && (
            <Button
              variant={confirmVariant}
              onClick={onConfirm}
              isLoading={isLoading}
            >
              {confirmText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
