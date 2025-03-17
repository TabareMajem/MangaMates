import type { ReactNode } from 'react';

export interface BaseProps {
  className?: string;
  children?: ReactNode;
}

export interface LoadingProps extends BaseProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export interface ErrorProps extends BaseProps {
  error: Error | string;
  retry?: () => void;
}

export interface CardProps extends BaseProps {
  title?: string;
  description?: string;
  footer?: ReactNode;
  onClick?: () => void;
}

export interface ButtonProps extends BaseProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}
