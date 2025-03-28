import { toast } from 'sonner';

type ToastProps = {
  title?: string;
  description: string;
  variant?: 'default' | 'destructive';
};

export function useToast() {
  return {
    toast: ({ title, description, variant = 'default' }: ToastProps) => {
      if (variant === 'destructive') {
        toast.error(description, { title });
      } else {
        toast(description, { title });
      }
    }
  };
}
