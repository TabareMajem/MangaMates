"use client";

import { AffiliateDashboard } from "@/components/affiliate/affiliate-dashboard";
import { AffiliateApplication } from "@/components/affiliate/affiliate-application";
import { useAuth } from "@/lib/auth/context";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { affiliateService } from "@/lib/services/affiliate";

export default function AffiliatePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isPartner, setIsPartner] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth/signin?redirect=/affiliate');
      return;
    }

    checkPartnerStatus();
  }, [user, navigate]);

  const checkPartnerStatus = async () => {
    try {
      const stats = await affiliateService.getPartnerStats(user!.id);
      setIsPartner(!!stats);
    } catch (error) {
      setIsPartner(false);
    } finally {
      setLoading(false);
    }
  };

  if (!user || loading) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1a0f1f] to-[#150c2e] py-16">
      <div className="container mx-auto px-4">
        {isPartner ? (
          <AffiliateDashboard />
        ) : (
          <AffiliateApplication onSuccess={() => setIsPartner(true)} />
        )}
      </div>
    </main>
  );
}
