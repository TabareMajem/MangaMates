declare module '@testing-library/jest-dom' {
  export interface CustomMatchers<R = unknown> {
    toBeInTheDocument(): R;
    toHaveClass(className: string): R;
    toHaveAttribute(attr: string, value?: string): R;
  }
}

declare module 'k6' {
  export function sleep(seconds: number): void;
  export function check(val: any, sets: object): boolean;
  export const http: {
    get(url: string, params?: object): any;
    post(url: string, body?: any, params?: object): any;
  };
}
