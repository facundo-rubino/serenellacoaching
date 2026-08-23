"use client";

import { Toaster } from "sonner";
import styles from "./admin.module.scss";

export function AdminToaster() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      visibleToasts={4}
      mobileOffset={16}
      toastOptions={{
        duration: 4500,
        classNames: {
          toast: styles.adminToast,
          title: styles.adminToastTitle,
          description: styles.adminToastDescription,
          actionButton: styles.adminToastAction,
          cancelButton: styles.adminToastCancel,
        },
      }}
    />
  );
}
