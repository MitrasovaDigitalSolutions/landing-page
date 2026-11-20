import { create } from "zustand";

export interface ConfirmDialogParams {
  title: string;
  description: string;
  onConfirm: () => void | Promise<void>;
  variant?: "default" | "destructive";
}

export interface UIState {
  confirmDialog: {
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: (() => void | Promise<void>) | null;
    variant: "default" | "destructive";
  };
  openConfirmDialog: (params: ConfirmDialogParams) => void;
  closeConfirmDialog: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  confirmDialog: {
    isOpen: false,
    title: "",
    description: "",
    onConfirm: null,
    variant: "destructive",
  },
  openConfirmDialog: ({
    title,
    description,
    onConfirm,
    variant = "destructive",
  }: ConfirmDialogParams): void => {
    set({
      confirmDialog: {
        isOpen: true,
        title: "",
        description,
        onConfirm,
        variant,
      },
    });
    set((state) => ({
      confirmDialog: { ...state.confirmDialog, title },
    }));
  },
  closeConfirmDialog: (): void => {
    set((state) => ({
      confirmDialog: {
        ...state.confirmDialog,
        isOpen: false,
        onConfirm: null,
      },
    }));
  },
}));
