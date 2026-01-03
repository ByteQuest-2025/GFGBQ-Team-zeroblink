"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GlowingCard } from "@/components/ui/glowing-card";
import { ZKAnimation } from "@/components/ui/zk-animation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { performOCR } from "@/lib/ocr";
import { generateZKProof } from "@/lib/zk-proof";
import {
  Shield,
  QrCode,
  FileText,
  Upload,
  CheckCircle,
  Loader2,
  Sparkles,
  GraduationCap,
  CreditCard,
  X,
  AlertTriangle,
  FileCheck,
} from "lucide-react";

type ProofType = "aadhaar" | "salary" | "marksheet" | "pan" | null;
type Step = "select" | "upload" | "ocr" | "zkproof" | "complete" | "error";

const proofTypes = [
  {
    id: "aadhaar",
    icon: QrCode,
    title: "Aadhaar QR Code",
    description: "Prove age, address, or identity",
    acceptedFormats: ".png,.jpg,.jpeg",
    attribute: "Age > 18",
  },
  {
    id: "salary",
    icon: FileText,
    title: "Salary Slip",
    description: "Prove income range",
    acceptedFormats: ".pdf,.png,.jpg,.jpeg",
    attribute: "Income > 50,000/mo",
  },
  {
    id: "marksheet",
    icon: GraduationCap,
    title: "Marksheet",
    description: "Prove education credentials",
    acceptedFormats: ".pdf,.png,.jpg,.jpeg",
    attribute: "Degree Verified",
  },
  {
    id: "pan",
    icon: CreditCard,
    title: "PAN Card",
    description: "Prove tax compliance",
    acceptedFormats: ".png,.jpg,.jpeg,.pdf",
    attribute: "Tax Compliant",
  },
];

export default function GeneratePage() {
  const [proofType, setProofType] = useState<ProofType>(null);
  const [step, setStep] = useState<Step>("select");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [extractedData, setExtractedData] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const selectedProofType = proofTypes.find((t) => t.id === proofType);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("File size must be less than 10MB");
      return;
    }

    const allowedTypes = selectedProofType?.acceptedFormats.split(",") || [];
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
    
    if (!allowedTypes.some((type) => type.includes(fileExtension))) {
      setErrorMessage(`Invalid file type. Accepted: ${selectedProofType?.acceptedFormats}`);
      return;
    }

    setUploadedFile(file);
    setErrorMessage("");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInputRef.current.files = dataTransfer.files;
      handleFileSelect({ target: { files: dataTransfer.files } } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const processDocument = async () => {
    if (!uploadedFile || !proofType) return;
    
    setStep("ocr");
    setProgress(0);
    setStatusText("Initializing document processing...");

    try {
      // Step 1: OCR Processing
      const ocrResult = await performOCR(
        uploadedFile,
        proofType,
        (prog, status) => {
          setProgress(prog * 0.5); // OCR is 50% of total
          setStatusText(status);
        }
      );

      if (!ocrResult.isValid) {
        setErrorMessage(ocrResult.error || "Document validation failed");
        setStep("error");
        return;
      }

      setExtractedData(ocrResult.extractedData);
      
      // Step 2: ZK Proof Generation
      setStep("zkproof");
      setProgress(50);
      setStatusText("Preparing ZK circuit...");

      const zkProof = await generateZKProof(
        {
          documentType: proofType,
          extractedData: ocrResult.extractedData,
          attribute: selectedProofType?.attribute || "",
        },
        (status, prog) => {
          setProgress(50 + prog * 0.5);
          setStatusText(status);
        }
      );

      // Step 3: Save to database
      setStatusText("Storing proof in vault...");
      
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const typeMap: Record<string, string> = {
        aadhaar: "Aadhaar",
        salary: "Salary Slip",
        marksheet: "Marksheet",
        pan: "PAN Card",
      };
      
      const proofData = {
        user_id: user?.id,
        type: typeMap[proofType],
        attribute: selectedProofType?.attribute,
        proof_data: {
          proofHash: zkProof.proofHash,
          publicSignals: zkProof.publicSignals,
          protocol: zkProof.proof.protocol,
          curve: zkProof.proof.curve,
          timestamp: zkProof.timestamp,
        },
        expires_at: expiresAt.toISOString(),
        status: "active",
      };

      const { error } = await supabase.from("proofs").insert([proofData]);
      
      if (error) {
        console.error("Error saving proof:", error);
        setErrorMessage("Failed to save proof. Please try again.");
        setStep("error");
        return;
      }
      
      setProgress(100);
      setStep("complete");
    } catch (err) {
      console.error("Processing error:", err);
      setErrorMessage("An error occurred during processing. Please try again.");
      setStep("error");
    }
  };

  const resetFlow = () => {
    setStep("select");
    setProofType(null);
    setUploadedFile(null);
    setErrorMessage("");
    setProgress(0);
    setStatusText("");
    setExtractedData({});
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
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white">Generate Proof</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {step === "select" && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">Select Document Type</h1>
              <p className="text-gray-400">Choose the document you want to generate a proof from</p>
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {proofTypes.map((type) => (
                <GlowingCard
                  key={type.id}
                  className={`cursor-pointer transition-all ${
                    proofType === type.id ? "ring-2 ring-green-500 border-green-500" : ""
                  }`}
                  onClick={() => setProofType(type.id as ProofType)}
                >
                  <div className="flex flex-col items-center text-center p-2 md:p-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-green-500/20 rounded-xl flex items-center justify-center mb-3">
                      <type.icon className="w-6 h-6 md:w-7 md:h-7 text-green-400" />
                    </div>
                    <h3 className="font-semibold text-white text-sm md:text-base mb-1">{type.title}</h3>
                    <p className="text-xs text-gray-400 hidden sm:block">{type.description}</p>
                  </div>
                </GlowingCard>
              ))}
            </div>

            <Button className="w-full" size="lg" disabled={!proofType} onClick={() => setStep("upload")}>
              Continue
            </Button>
          </div>
        )}

        {step === "upload" && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">Upload {selectedProofType?.title}</h1>
              <p className="text-gray-400">Your document is processed locally. No data leaves your device.</p>
            </div>

            <GlowingCard 
              className={`border-2 border-dashed transition-colors ${
                uploadedFile ? "border-green-500/50 bg-green-500/5" : "border-green-500/30 hover:border-green-500/50"
              }`}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={selectedProofType?.acceptedFormats}
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              
              {uploadedFile ? (
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <FileCheck className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{uploadedFile.name}</p>
                      <p className="text-xs text-gray-500">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <button onClick={removeFile} className="p-2 hover:bg-red-500/20 rounded-lg transition-colors">
                    <X className="w-5 h-5 text-red-400" />
                  </button>
                </div>
              ) : (
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center text-center p-6 md:p-8">
                    <div className="w-16 h-16 bg-dark-800 rounded-2xl flex items-center justify-center mb-4">
                      <Upload className="w-8 h-8 text-gray-500" />
                    </div>
                    <h3 className="font-semibold text-white mb-1">Upload {selectedProofType?.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">Drag and drop or click to browse</p>
                    <p className="text-xs text-gray-600">Accepted: {selectedProofType?.acceptedFormats}</p>
                  </div>
                </label>
              )}
            </GlowingCard>

            {errorMessage && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-400">{errorMessage}</p>
              </div>
            )}

            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
              <p className="text-sm text-green-400">
                <strong>Privacy Notice:</strong> All processing happens locally in your browser. 
                The document is validated using OCR to ensure it matches the selected type before generating the ZK proof.
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => { setStep("select"); setUploadedFile(null); setErrorMessage(""); }}>
                Back
              </Button>
              <Button className="flex-1" onClick={processDocument} disabled={!uploadedFile}>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Proof
              </Button>
            </div>
          </div>
        )}

        {(step === "ocr" || step === "zkproof") && (
          <div className="text-center py-8">
            <ZKAnimation progress={progress} status={statusText} />
            
            <h1 className="text-2xl font-bold text-white mb-2 mt-8">
              {step === "ocr" ? "Processing Document" : "Generating ZK Proof"}
            </h1>
            <p className="text-gray-400 mb-6">{statusText}</p>
            
            <div className="max-w-xs mx-auto mb-4">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {step === "zkproof" && (
              <div className="mt-6 p-4 bg-dark-900/50 rounded-xl border border-green-500/10 max-w-sm mx-auto">
                <p className="text-xs text-gray-500 font-mono">
                  Circuit: Groth16 on BN128
                </p>
                <p className="text-xs text-gray-500 font-mono mt-1">
                  Protocol: snarkjs v0.7.5
                </p>
              </div>
            )}
          </div>
        )}

        {step === "error" && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-12 h-12 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Validation Failed</h1>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">{errorMessage}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" size="lg" onClick={() => { setStep("upload"); setUploadedFile(null); setErrorMessage(""); }}>
                Try Again
              </Button>
              <Button size="lg" onClick={resetFlow}>Start Over</Button>
            </div>
          </div>
        )}

        {step === "complete" && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 glow-green">
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Proof Generated Successfully</h1>
            <p className="text-gray-400 mb-8">
              Your {selectedProofType?.title} proof has been stored in your vault and will expire in 7 days.
            </p>
            
            {Object.keys(extractedData).length > 0 && (
              <div className="mb-8 p-4 bg-dark-900/50 rounded-xl border border-green-500/10 max-w-sm mx-auto text-left">
                <p className="text-sm text-gray-400 mb-2">Verified Attribute:</p>
                <p className="text-green-400 font-medium">{selectedProofType?.attribute}</p>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/vault">
                <Button size="lg" className="w-full sm:w-auto">View in Vault</Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto" onClick={resetFlow}>
                Generate Another
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
