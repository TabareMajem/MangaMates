"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth/context";
import { affiliateService } from "@/lib/services/affiliate";
import { Building, CheckCircle } from "lucide-react";

interface AffiliateApplicationProps {
  onSuccess: () => void;
}

export function AffiliateApplication({ onSuccess }: AffiliateApplicationProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    website: "",
    paymentInfo: {
      type: "bank",
      accountName: "",
      accountNumber: ""
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      await affiliateService.applyForProgram(user.id, formData);
      toast({
        title: "Success",
        description: "Your application has been submitted!"
      });
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit application",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Building className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Affiliate Program Application</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Company Name</label>
            <Input
              value={formData.companyName}
              onChange={(e) => setFormData({
                ...formData,
                companyName: e.target.value
              })}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Website</label>
            <Input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({
                ...formData,
                website: e.target.value
              })}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Bank Account Name</label>
            <Input
              value={formData.paymentInfo.accountName}
              onChange={(e) => setFormData({
                ...formData,
                paymentInfo: {
                  ...formData.paymentInfo,
                  accountName: e.target.value
                }
              })}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Bank Account Number</label>
            <Input
              value={formData.paymentInfo.accountNumber}
              onChange={(e) => setFormData({
                ...formData,
                paymentInfo: {
                  ...formData.paymentInfo,
                  accountNumber: e.target.value
                }
              })}
              required
            />
          </div>
        </div>

        <div className="bg-secondary/10 p-4 rounded-lg space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-primary" />
            <p className="text-sm">10% commission on all referred sales</p>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-primary" />
            <p className="text-sm">Monthly payments</p>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-primary" />
            <p className="text-sm">Real-time tracking dashboard</p>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Submitting..." : "Submit Application"}
        </Button>
      </form>
    </Card>
  );
}
