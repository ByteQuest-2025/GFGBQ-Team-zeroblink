"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlowingCard } from "@/components/ui/glowing-card";
import { AuthGuard } from "@/components/auth/AuthGuard";
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
  LogOut,
  Mail,
  Calendar,
  X,
  ExternalLink,
} from "lucide-react";

interface Proof {
  id: string;
  type: string;
  attribute: string;
  created_at: string;
  expires_at: string;
  status: "active" | "expired" | "pending";
}

function VaultContent() {
  const [proofs, setProofs] = useState<Proof[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const [shareModal, setShareModal] = useState<Proof | null>(null);
  const router = useRouter();
  const { user, signOut } = useAuth();

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

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
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

  const formatJoinDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const copyProofId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const copyVerifyLink = (id: string) => {
    const link = `${window.location.origin}/verify?id=${id}`;
    navigator.clipboard.writeText(link);
    setCopied(`link-${id}`);
    setTimeout(() => setCopied(null), 2000);
  };

  const getInitials = (name: string, email: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return email[0].toUpperCase();
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
        {/* User Profile Card */}
        {user && (
          <GlowingCard className="mb-8 bg-gradient-to-r from-green-500/10 to-transparent">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-green-500/20">
                  {getInitials(user.name, user.email)}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">{user.name || 'User'}</h2>
                  <div className="flex items-center gap-4 mt-1 flex-wrap">
                    <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                      <Mail className="w-3.5 h-3.5" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Joined {formatJoinDate(user.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSignOut}
                className="text-red-400 border-red-500/20 hover:bg-red-500/10 hover:text-red-300"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </GlowingCard>
        )}

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
                      {copied === proof.id ? "Copied!" : "Copy ID"}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShareModal(proof)}
                    >
                      <Share2 className="w-4 h-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlowingCard>

        {/* Share Modal */}
        {shareModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <GlowingCard className="w-full max-w-md relative">
              <button 
                onClick={() => setShareModal(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Share2 className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Share Your Proof</h3>
                <p className="text-sm text-gray-400 mt-1">
                  Share this with verifiers to prove: <span className="text-green-400">{shareModal.attribute}</span>
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Proof ID</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={shareModal.id} 
                      readOnly 
                      className="flex-1 px-3 py-2 bg-dark-900 border border-green-500/20 rounded-lg text-white font-mono text-sm"
                    />
                    <Button 
                      size="sm" 
                      onClick={() => copyProofId(shareModal.id)}
                    >
                      {copied === shareModal.id ? "Copied!" : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Verification Link</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={`${typeof window !== 'undefined' ? window.location.origin : ''}/verify?id=${shareModal.id}`}
                      readOnly 
                      className="flex-1 px-3 py-2 bg-dark-900 border border-green-500/20 rounded-lg text-white font-mono text-xs truncate"
                    />
                    <Button 
                      size="sm" 
                      onClick={() => copyVerifyLink(shareModal.id)}
                    >
                      {copied === `link-${shareModal.id}` ? "Copied!" : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="text-xs text-green-400">
                    <strong>Privacy Protected:</strong> The verifier will only see that "{shareModal.attribute}" is true. 
                    They will NOT see your actual document or personal data.
                  </p>
                </div>

                <div className="pt-2">
                  <Link href={`/verify?id=${shareModal.id}`} target="_blank">
                    <Button variant="outline" className="w-full">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Preview Verification Page
                    </Button>
                  </Link>
                </div>
              </div>
            </GlowingCard>
          </div>
        )}
      </main>
    </div>
  );
}

export default function VaultPage() {
  return (
    <AuthGuard>
      <VaultContent />
    </AuthGuard>
  );
}
