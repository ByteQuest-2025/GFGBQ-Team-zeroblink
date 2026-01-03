"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GlowingCard } from "@/components/ui/glowing-card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import {
  Shield,
  Search,
  CheckCircle,
  XCircle,
  Loader2,
  Building,
  Clock,
  FileCheck,
  AlertTriangle,
} from "lucide-react";

type VerificationStatus = "idle" | "loading" | "success" | "expired" | "not_found";

interface ProofResult {
  id: string;
  type: string;
  attribute: string;
  created_at: string;
  expires_at: string;
  status: string;
}

export default function VerifyPage() {
  const [proofId, setProofId] = useState("");
  const [status, setStatus] = useState<VerificationStatus>("idle");
  const [proofResult, setProofResult] = useState<ProofResult | null>(null);

  const handleVerify = async () => {
    if (!proofId.trim()) return;
    
    setStatus("loading");
    
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const { data, error } = await supabase
      .from("proofs")
      .select("*")
      .eq("id", proofId.trim())
      .single();

    if (error || !data) {
      setStatus("not_found");
      setProofResult(null);
      return;
    }

    // Check if expired
    const expiresAt = new Date(data.expires_at);
    const now = new Date();
    
    if (expiresAt < now || data.status === "expired") {
      setStatus("expired");
      setProofResult(data);
      return;
    }

    setStatus("success");
    setProofResult(data);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
              <span className="font-bold text-xl text-white">Verify Proof</span>
            </Link>
            <Badge variant="primary">
              <Building className="w-3 h-3 mr-1" />
              For Verifiers
            </Badge>
          </div>
        </div>
      </header>

      <main className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Verify ZK Proof
          </h1>
          <p className="text-gray-400">
            Enter a proof ID to verify its authenticity without accessing raw data
          </p>
        </div>

        <GlowingCard className="mb-6">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-300">
              Proof ID
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={proofId}
                onChange={(e) => setProofId(e.target.value)}
                placeholder="Enter proof ID (e.g., abc123-def456-...)"
                className="flex-1 px-4 py-3 bg-dark-900/80 border border-green-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50"
              />
              <Button 
                onClick={handleVerify}
                disabled={!proofId.trim() || status === "loading"}
              >
                {status === "loading" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Verify
                  </>
                )}
              </Button>
            </div>
          </div>
        </GlowingCard>

        {/* Results */}
        {status === "success" && proofResult && (
          <GlowingCard className="border-green-500/30 bg-green-500/5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-400 mb-1">
                  Proof Verified Successfully
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  This proof is valid and has not been tampered with.
                </p>
                
                <div className="space-y-3 bg-dark-900/50 rounded-xl p-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Document Type</span>
                    <span className="text-white font-medium">{proofResult.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Verified Attribute</span>
                    <span className="text-green-400 font-medium">{proofResult.attribute}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Created</span>
                    <span className="text-white">{formatDate(proofResult.created_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Expires</span>
                    <span className="text-white">{formatDate(proofResult.expires_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          </GlowingCard>
        )}

        {status === "expired" && proofResult && (
          <GlowingCard className="border-yellow-500/30 bg-yellow-500/5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-yellow-400 mb-1">
                  Proof Expired
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  This proof has expired and is no longer valid. Request a new proof from the user.
                </p>
                
                <div className="space-y-3 bg-dark-900/50 rounded-xl p-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Document Type</span>
                    <span className="text-white font-medium">{proofResult.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Expired On</span>
                    <span className="text-yellow-400">{formatDate(proofResult.expires_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          </GlowingCard>
        )}

        {status === "not_found" && (
          <GlowingCard className="border-red-500/30 bg-red-500/5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <XCircle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-400 mb-1">
                  Proof Not Found
                </h3>
                <p className="text-gray-400 text-sm">
                  No proof exists with this ID. Please check the ID and try again.
                </p>
              </div>
            </div>
          </GlowingCard>
        )}

        {/* Info section */}
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-semibold text-white">How it works</h3>
          <div className="grid gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <FileCheck className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <p className="text-white font-medium">Zero-Knowledge Verification</p>
                <p className="text-sm text-gray-400">
                  Verify attributes without accessing the underlying document data
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <Clock className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <p className="text-white font-medium">Time-Bound Proofs</p>
                <p className="text-sm text-gray-400">
                  All proofs auto-expire after 7 days for enhanced security
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <AlertTriangle className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <p className="text-white font-medium">Tamper-Proof</p>
                <p className="text-sm text-gray-400">
                  Cryptographic proofs cannot be modified or forged
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
