import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TableOfContents } from './TableOfContents';

interface DocsLayoutProps {
  children: React.ReactNode;
  toc: Array<{
    title: string;
    id: string;
    level: number;
  }>;
}

export function DocsLayout({ children, toc }: DocsLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 px-4 py-8 md:px-8 lg:px-12">
        <button
          className="md:hidden mb-4"
          onClick={() => setSidebarOpen(true)}
        >
          Menu
        </button>
        
        <div className="flex gap-12">
          <div className="flex-1 max-w-3xl mx-auto">
            <main>{children}</main>
          </div>
          
          <div className="hidden xl:block w-64 flex-shrink-0">
            <TableOfContents items={toc} />
          </div>
        </div>
      </div>
    </div>
  );
}
