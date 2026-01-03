"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GlowingCard } from "@/components/ui/glowing-card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import {
  Shield,
  Building,
  Plus,
  Copy,
  CheckCircle,
  Loader2,
  ExternalLink,
  QrCode,
  FileText,
  GraduationCap,
  CreditCard,
  LogIn,
  Building2,
  Vote,
  Landmark,
  BookOpen,
  Briefcase,
} from "lucide-react";

const PROOF_TYPES = [
  {
    id: "age_verification",
    icon: QrCode,
    label: "Age Verification",
    attribute: "Age > 18",
    description: "Verify user is above 18 years",
  },
  {
    id: "income_verification",
    icon: FileText,
    label: "Income Verification",
    attribute: "Income > 50,000/mo",
    description: "Verify monthly income threshold",
  },
  {
    id: "education_verification",
    icon: GraduationCap,
    label: "Education Verification",
    attribute: "Degree Verified",
    description: "Verify degree completion",
  },
  {
    id: "tax_verification",
    icon: CreditCard,
    label: "Tax Compliance",
    attribute: "Tax Compliant",
    description: "Verify tax filing status",
  },
];

const DEMO_VERIFIERS = [
  { id: "eci", name: "Election Commission of India", icon: Vote },
  { id: "sbi", name: "State Bank of India", icon: Landmark },
  { id: "hdfc", name: "HDFC Bank", icon: Building },
  { id: "passport", name: "Passport Seva Kendra", icon: BookOpen },
  { id: "custom", name: "Custom Organization", icon: Briefcase },
];

export default function VerifierPortal() {
  const [step, setStep] = useState<"login" | "form" | "success">("login");
  const [selectedVerifier, setSelectedVerifier] = useState<string | null>(null);
  const [customName, setCustomName] = useState("");
  const [verifierName, setVerifierName] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [purpose, setPurpose] = useState("");
  const [loading, setLoading] = useState(false);
  const [requestId, setRequestId] = useState("");
  const [requestLink, setRequestLink] = useState("");
  const [copied, setCopied] = useState(false);

  const handleVerifierLogin = () => {
    if (!selectedVerifier) return;
    
    if (selectedVerifier === "custom") {
      if (!customName.trim()) return;
      setVerifierName(customName);
    } else {
      const verifier = DEMO_VERIFIERS.find(v => v.id === selectedVerifier);
      setVerifierName(verifier?.name || "");
    }
    setStep("form");
  };

  const handleCreateRequest = async () => {
    if (!verifierName || !selectedType || !purpose) return;

    setLoading(true);

    const selectedProofType = PROOF_TYPES.find((t) => t.id === selectedType);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour expiry

    const { data, error } = await supabase
      .from("verification_requests")
      .insert([
        {
          verifier_name: verifierName,
          verifier_id: `verifier_${selectedVerifier}_${Date.now()}`,
          required_proof_type: selectedType,
          required_attribute: selectedProofType?.attribute,
          purpose: purpose,
          status: "pending",
          expires_at: expiresAt.toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating request:", error);
      setLoading(false);
      return;
    }

    const link = `${window.location.origin}/request/${data.id}`;
    setRequestId(data.id);
    setRequestLink(link);
    setStep("success");
    setLoading(false);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(requestLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyId = () => {
    navigator.clipboard.writeText(requestId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
              <span className="font-bold text-xl text-white">Verifier Portal</span>
            </Link>
            <Badge variant="primary">
              <Building className="w-3 h-3 mr-1" />
              For Organizations
            </Badge>
          </div>
        </div>
      </header>

      <main className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Login Step */}
        {step === "login" && (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-blue-400" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Verifier Portal
              </h1>
              <p className="text-gray-400">
                Select your organization to create verification requests
              </p>
            </div>

            <GlowingCard>
              <div className="space-y-4">
                <p className="text-sm text-gray-400 mb-4">Select Organization (Demo)</p>
                
                {DEMO_VERIFIERS.map((verifier) => (
                  <div
                    key={verifier.id}
                    onClick={() => setSelectedVerifier(verifier.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-4 ${
                      selectedVerifier === verifier.id
                        ? "border-green-500 bg-green-500/10"
                        : "border-green-500/20 hover:border-green-500/40"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      selectedVerifier === verifier.id ? "bg-green-500/20" : "bg-dark-800"
                    }`}>
                      <verifier.icon className={`w-5 h-5 ${selectedVerifier === verifier.id ? "text-green-400" : "text-gray-400"}`} />
                    </div>
                    <span className="text-white font-medium">{verifier.name}</span>
                    {selectedVerifier === verifier.id && (
                      <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />
                    )}
                  </div>
                ))}

                {selectedVerifier === "custom" && (
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Enter organization name"
                    className="w-full px-4 py-3 bg-dark-900/80 border border-green-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 mt-2"
                  />
                )}

                <div className="pt-4">
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleVerifierLogin}
                    disabled={!selectedVerifier || (selectedVerifier === "custom" && !customName.trim())}
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Continue as Verifier
                  </Button>
                </div>

                <p className="text-xs text-gray-500 text-center pt-2">
                  This is a demo portal. In production, verifiers would have authenticated accounts.
                </p>
              </div>
            </GlowingCard>
          </>
        )}

        {/* Form Step */}
        {step === "form" && (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Create Verification Request
              </h1>
              <p className="text-gray-400">
                Logged in as: <span className="text-green-400">{verifierName}</span>
              </p>
            </div>

            <GlowingCard>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    What do you need to verify?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {PROOF_TYPES.map((type) => (
                      <div
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          selectedType === type.id
                            ? "border-green-500 bg-green-500/10"
                            : "border-green-500/20 hover:border-green-500/40"
                        }`}
                      >
                        <type.icon className={`w-6 h-6 mb-2 ${selectedType === type.id ? "text-green-400" : "text-gray-500"}`} />
                        <p className="text-white font-medium text-sm">{type.label}</p>
                        <p className="text-xs text-gray-500 mt-1">{type.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Purpose of Verification
                  </label>
                  <textarea
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="e.g., Voter ID card application - Age verification required"
                    rows={3}
                    className="w-full px-4 py-3 bg-dark-900/80 border border-green-500/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 resize-none"
                  />
                </div>

                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                  <p className="text-sm text-blue-400">
                    <strong>How it works:</strong> You'll get a unique link to share with the user. 
                    They'll log in, approve the request, and you'll be able to verify their proof - 
                    all without seeing their personal data.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep("login")}
                  >
                    Back
                  </Button>
                  <Button
                    className="flex-1"
                    size="lg"
                    onClick={handleCreateRequest}
                    disabled={!selectedType || !purpose || loading}
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4 mr-2" />
                    )}
                    Create Request
                  </Button>
                </div>
              </div>
            </GlowingCard>
          </>
        )}

        {/* Success Step */}
        {step === "success" && (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Request Created</h1>
              <p className="text-gray-400">Share this link with the user to request verification</p>
            </div>

            <GlowingCard className="mb-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Request Link (share with user)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={requestLink}
                      readOnly
                      className="flex-1 px-4 py-3 bg-dark-900 border border-green-500/20 rounded-xl text-white font-mono text-sm"
                    />
                    <Button onClick={copyLink}>
                      {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Request ID</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={requestId}
                      readOnly
                      className="flex-1 px-4 py-3 bg-dark-900 border border-green-500/20 rounded-xl text-white font-mono text-sm"
                    />
                    <Button variant="outline" onClick={copyId}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </GlowingCard>

            <GlowingCard>
              <h3 className="text-lg font-semibold text-white mb-4">Next Steps</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 text-green-400 text-sm font-bold">
                    1
                  </div>
                  <p className="text-gray-300">Share the request link with the user</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 text-green-400 text-sm font-bold">
                    2
                  </div>
                  <p className="text-gray-300">User logs in and approves the request</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 text-green-400 text-sm font-bold">
                    3
                  </div>
                  <p className="text-gray-300">Check the request status to verify the proof</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-green-500/10">
                <Link href={`/verifier/status/${requestId}`}>
                  <Button className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Check Request Status
                  </Button>
                </Link>
              </div>
            </GlowingCard>

            <div className="mt-6 text-center">
              <Button variant="ghost" onClick={() => { setStep("form"); setSelectedType(""); setPurpose(""); }}>
                Create Another Request
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
