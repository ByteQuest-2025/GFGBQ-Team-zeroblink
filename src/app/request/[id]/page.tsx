"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GlowingCard } from "@/components/ui/glowing-card";
import { Badge } from "@/components/ui/badge";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import {
  Shield,
  Building,
  CheckCircle,
  XCircle,
  Loader2,
  AlertTriangle,
  Clock,
  FileCheck,
  Lock,
} from "lucide-react";

interface VerificationRequest {
  id: string;
  verifier_name: string;
  verifier_id: string;
  required_proof_type: string;
  required_attribute: string;
  purpose: string;
  status: "pending" | "approved" | "rejected" | "expired";
  created_at: string;
  expires_at: string;
  user_id?: string;
  proof_id?: string;
}

interface Proof {
  id: string;
  type: string;
  attribute: string;
  status: string;
  expires_at: string;
}

function RequestContent() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [request, setRequest] = useState<VerificationRequest | null>(null);
  const [matchingProofs, setMatchingProofs] = useState<Proof[]>([]);
  const [selectedProof, setSelectedProof] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchRequest();
  }, [params.id]);

  useEffect(() => {
    if (request && user) {
      fetchMatchingProofs();
    }
  }, [request, user]);

  const fetchRequest = async () => {
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from("verification_requests")
        .select("*")
        .eq("id", params.id)
        .single();

      if (fetchError) {
        console.error("Fetch error:", fetchError);
        setError("Verification request not found. Please check the link.");
        setLoading(false);
        return;
      }

      if (!data) {
        setError("Verification request not found or has expired.");
        setLoading(false);
        return;
      }

      // Check if expired
      if (new Date(data.expires_at) < new Date()) {
        setError("This verification request has expired.");
        setLoading(false);
        return;
      }

      // Check if already processed
      if (data.status !== "pending") {
        setError(`This request has already been ${data.status}.`);
        setLoading(false);
        return;
      }

      setRequest(data);
      setLoading(false);
    } catch (err) {
      console.error("Request fetch error:", err);
      setError("Failed to load request. Please try again.");
      setLoading(false);
    }
  };

  const fetchMatchingProofs = async () => {
    if (!user || !request) return;

    const docTypeMap: Record<string, string> = {
      "age_verification": "Aadhaar",
      "income_verification": "Salary Slip",
      "education_verification": "Marksheet",
      "tax_verification": "PAN Card",
    };

    const requiredType = docTypeMap[request.required_proof_type] || request.required_proof_type;

    const { data } = await supabase
      .from("proofs")
      .select("*")
      .eq("user_id", user.id)
      .eq("type", requiredType)
      .eq("status", "active")
      .gt("expires_at", new Date().toISOString());

    setMatchingProofs(data || []);
  };

  const handleApprove = async () => {
    if (!selectedProof || !request || !user) return;

    setSubmitting(true);

    // Update the request with approval
    const { error } = await supabase
      .from("verification_requests")
      .update({
        status: "approved",
        user_id: user.id,
        proof_id: selectedProof,
        approved_at: new Date().toISOString(),
      })
      .eq("id", request.id);

    if (error) {
      setError("Failed to approve request. Please try again.");
      setSubmitting(false);
      return;
    }

    setSuccess(true);
    setSubmitting(false);
  };

  const handleReject = async () => {
    if (!request) return;

    setSubmitting(true);

    const { error } = await supabase
      .from("verification_requests")
      .update({
        status: "rejected",
        rejected_at: new Date().toISOString(),
      })
      .eq("id", request.id);

    if (error) {
      setError("Failed to reject request.");
      setSubmitting(false);
      return;
    }

    router.push("/vault");
  };

  const getProofTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      "age_verification": "Age Verification (Aadhaar)",
      "income_verification": "Income Verification (Salary Slip)",
      "education_verification": "Education Verification (Marksheet)",
      "tax_verification": "Tax Compliance (PAN Card)",
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-green-400 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4">
        <GlowingCard className="max-w-md w-full text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Request Error</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link href="/vault">
            <Button>Go to Vault</Button>
          </Link>
        </GlowingCard>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4">
        <GlowingCard className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Proof Shared Successfully</h2>
          <p className="text-gray-400 mb-2">
            Your proof has been securely shared with <span className="text-white">{request?.verifier_name}</span>.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            They can now verify your {request?.required_attribute} without seeing your personal data.
          </p>
          <Link href="/vault">
            <Button>Back to Vault</Button>
          </Link>
        </GlowingCard>
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
              <span className="font-bold text-xl text-white">Verification Request</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <GlowingCard className="mb-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Building className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">{request?.verifier_name}</h2>
              <p className="text-gray-400 text-sm">is requesting verification</p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="p-4 bg-dark-900/50 rounded-xl">
              <p className="text-sm text-gray-400 mb-1">Requesting</p>
              <p className="text-white font-medium">{getProofTypeLabel(request?.required_proof_type || "")}</p>
            </div>
            <div className="p-4 bg-dark-900/50 rounded-xl">
              <p className="text-sm text-gray-400 mb-1">To Verify</p>
              <p className="text-green-400 font-medium">{request?.required_attribute}</p>
            </div>
            <div className="p-4 bg-dark-900/50 rounded-xl">
              <p className="text-sm text-gray-400 mb-1">Purpose</p>
              <p className="text-white">{request?.purpose}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>Expires: {new Date(request?.expires_at || "").toLocaleString()}</span>
            </div>
          </div>

          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl mb-6">
            <div className="flex items-start gap-2">
              <Lock className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-green-400">
                <strong>Privacy Protected:</strong> Only the verification result will be shared. 
                {request?.verifier_name} will NOT see your actual document or personal details.
              </p>
            </div>
          </div>

          {matchingProofs.length > 0 ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-400">Select a proof to share:</p>
              {matchingProofs.map((proof) => (
                <div
                  key={proof.id}
                  onClick={() => setSelectedProof(proof.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedProof === proof.id
                      ? "border-green-500 bg-green-500/10"
                      : "border-green-500/20 hover:border-green-500/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileCheck className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="text-white font-medium">{proof.attribute}</p>
                        <p className="text-sm text-gray-500">{proof.type}</p>
                      </div>
                    </div>
                    {selectedProof === proof.id && (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    )}
                  </div>
                </div>
              ))}

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleReject}
                  disabled={submitting}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleApprove}
                  disabled={!selectedProof || submitting}
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  )}
                  Approve & Share
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <AlertTriangle className="w-10 h-10 text-yellow-400 mx-auto mb-3" />
              <p className="text-white font-medium mb-2">No matching proof found</p>
              <p className="text-sm text-gray-400 mb-4">
                You need to generate a {getProofTypeLabel(request?.required_proof_type || "")} proof first.
              </p>
              <Link href="/generate">
                <Button>Generate Proof</Button>
              </Link>
            </div>
          )}
        </GlowingCard>
      </main>
    </div>
  );
}

export default function RequestPage() {
  return (
    <AuthGuard>
      <RequestContent />
    </AuthGuard>
  );
}
