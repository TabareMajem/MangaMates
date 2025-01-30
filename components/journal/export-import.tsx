"use client";

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/lib/auth/context';
import { exportUserData, importUserData } from '@/lib/services/data-export';
import { Download, Upload } from 'lucide-react';
import { useState } from 'react';

export function ExportImportData() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [importing, setImporting] = useState(false);

  const handleExport = async () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to export data",
        variant: "destructive"
      });
      return;
    }

    try {
      const data = await exportUserData(user.id);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `journal-export-${new Date().toISOString()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Successful",
        description: "Your journal data has been exported"
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Could not export your data",
        variant: "destructive"
      });
    }
  };

  const handleImport = async () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to import data",
        variant: "destructive"
      });
      return;
    }

    const input = document.getElementById('import-file') as HTMLInputElement;
    if (!input?.files?.[0]) {
      toast({
        title: "Error",
        description: "Please select a file to import",
        variant: "destructive"
      });
      return;
    }

    try {
      setImporting(true);
      const file = input.files[0];
      const text = await file.text();
      await importUserData(user.id, text);
      
      toast({
        title: "Import Successful",
        description: "Your journal data has been imported"
      });
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Could not import your data",
        variant: "destructive"
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="flex gap-4">
      <Button
        variant="outline"
        onClick={handleExport}
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        Export Data
      </Button>
      
      <Button
        variant="outline"
        onClick={() => {
          const input = document.getElementById('import-file') as HTMLInputElement;
          input?.click();
        }}
        disabled={importing}
        className="flex items-center gap-2"
      >
        <Upload className="h-4 w-4" />
        Import Data
      </Button>
      
      <input
        type="file"
        id="import-file"
        accept=".json"
        onChange={handleImport}
        className="hidden"
      />
    </div>
  );
}
