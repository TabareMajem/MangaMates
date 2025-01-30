import 'react-day-picker';

declare module 'react-day-picker' {
  interface DayPickerDefaultProps {
    mode?: 'single' | 'multiple' | 'range';
    selected?: Date | Date[] | { from: Date; to: Date };
    onSelect?: (date: Date | undefined) => void;
    disabled?: (date: Date) => boolean;
    className?: string;
    classNames?: Record<string, string>;
    showOutsideDays?: boolean;
  }
}
