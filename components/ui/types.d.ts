declare module '@radix-ui/react-label' {
  export interface LabelProps {
    htmlFor?: string;
    children: React.ReactNode;
  }
  export function Label(props: LabelProps): JSX.Element;
}

declare module '@radix-ui/react-slot' {
  export interface SlotProps {
    children?: React.ReactNode;
  }
  export function Slot(props: SlotProps): JSX.Element;
}

declare module 'react-day-picker' {
  export interface DayPickerProps {
    mode?: 'single' | 'multiple' | 'range';
    selected?: Date | Date[] | { from: Date; to: Date };
    onSelect?: (date: Date) => void;
    disabled?: Date[];
    modifiers?: Record<string, Date[]>;
  }
  export function DayPicker(props: DayPickerProps): JSX.Element;
}

declare module '@radix-ui/react-progress' {
  export interface ProgressProps {
    value?: number;
    max?: number;
  }
  export const Progress: React.FC<ProgressProps>;
}

declare module '@radix-ui/react-select' {
  export interface SelectProps {
    value?: string;
    onValueChange?: (value: string) => void;
  }
  export const Select: React.FC<SelectProps>;
  export const SelectTrigger: React.FC;
  export const SelectValue: React.FC;
  export const SelectContent: React.FC;
  export const SelectItem: React.FC<{value: string}>;
}

declare module '@radix-ui/react-switch' {
  export interface SwitchProps {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
  }
  export const Switch: React.FC<SwitchProps>;
}

declare module '@radix-ui/react-toast' {
  export interface ToastProps {
    title?: string;
    description?: string;
  }
  export const Toast: React.FC<ToastProps>;
  export const ToastProvider: React.FC;
  export const ToastViewport: React.FC;
}

declare module 'tailwind-merge' {
  export function twMerge(...classLists: string[]): string;
}

declare module 'sonner' {
  export function toast(message: string, options?: any): void;
  export const Toaster: React.FC;
}

declare module 'zustand' {
  export function create<T>(config: (set: any) => T): () => T;
}
