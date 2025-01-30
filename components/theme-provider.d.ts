declare module 'next-themes' {
  export interface ThemeProviderProps {
    attribute?: string;
    defaultTheme?: string;
    children: React.ReactNode;
  }
  export function ThemeProvider(props: ThemeProviderProps): JSX.Element;
}
