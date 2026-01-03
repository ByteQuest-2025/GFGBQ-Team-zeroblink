"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlowingCard } from "@/components/ui/glowing-card";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import {
  Shield,
  QrCode,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Loader2,
  Share2,
  Copy,
} from "lucide-react";

interface Proof {
  id: string;
  type: string;
  attribute: string;
  created_at: string;
  expires_at: string;
  status: "active" | "expired" | "pending";
}

export default function VaultPage() {
  const [proofs, setProofs] = useState<Proof[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchProofs();
    }
  }, [user]);

  const fetchProofs = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from("proofs")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching proofs:", error);
    } else {
      setProofs(data || []);
    }
    setLoading(false);
  };

  const getStatusIcon = (status: Proof["status"]) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "expired":
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getStatusBadge = (status: Proof["status"]) => {
    switch (status) {
      case "active":
        return <Badge variant="success">Active</Badge>;
      case "expired":
        return <Badge variant="warning">Expired</Badge>;
      case "pending":
        return <Badge>Pending</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const copyProofId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-green-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      
      <header className="relative bg-dark-900/80 backdrop-blur-xl border-b border-green-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white">My Vault</span>
            </Link>
            <Link href="/generate">
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Proof
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          <GlowingCard className="bg-gradient-to-br from-green-500/20 to-green-600/5">
            <div className="flex items-center justify-between mb-4">
              <Shield className="w-8 h-8 text-green-400" />
              <span className="text-3xl font-bold text-white">
                {proofs.filter((p) => p.status === "active").length}
              </span>
            </div>
            <p className="text-gray-400">Active Proofs</p>
          </GlowingCard>

          <GlowingCard>
            <div className="flex items-center justify-between mb-4">
              <QrCode className="w-8 h-8 text-gray-500" />
              <span className="text-3xl font-bold text-white">
                {proofs.filter((p) => p.type === "Aadhaar").length}
              </span>
            </div>
            <p className="text-gray-400">Aadhaar Proofs</p>
          </GlowingCard>

          <GlowingCard className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <FileText className="w-8 h-8 text-gray-500" />
              <span className="text-3xl font-bold text-white">
                {proofs.filter((p) => p.type === "Salary Slip").length}
              </span>
            </div>
            <p className="text-gray-400">Income Proofs</p>
          </GlowingCard>
        </div>

        <GlowingCard>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Your Proofs</h2>
            <p className="text-sm text-gray-500">
              Auto-expire in 7 days
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-green-400 animate-spin" />
            </div>
          ) : proofs.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No proofs yet</p>
              <Link href="/generate">
                <Button>Generate Your First Proof</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {proofs.map((proof) => (
                <div
                  key={proof.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-dark-900/50 rounded-xl border border-green-500/10 hover:border-green-500/20 transition-colors gap-3"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(proof.status)}
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-white">{proof.attribute}</span>
                        {getStatusBadge(proof.status)}
                      </div>
                      <p className="text-sm text-gray-500">
                        {proof.type} - Expires {formatDate(proof.expires_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-7 sm:ml-0">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => copyProofId(proof.id)}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      {copied === proof.id ? "Copied" : "Copy ID"}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlowingCard>
      </main>
    </div>
  );
}
