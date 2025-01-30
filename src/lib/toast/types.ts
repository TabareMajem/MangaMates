export type ToastVariant = 'default' | 'destructive';

export interface Toast {
  id: string;
  title?: string;
  description: string;
  variant?: ToastVariant;
}
