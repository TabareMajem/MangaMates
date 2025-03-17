"use client";

import { BrowserRouter } from 'react-router-dom';
import App from '@/src/App';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
} 