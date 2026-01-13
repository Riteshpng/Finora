"use client";

import { useRef, useEffect, useState } from "react";
import { Loader2, Camera, Sparkles, CheckCircle2 } from "lucide-react";
import { scanReceipt } from "@/actions/transaction";
import { toast } from "sonner";

export function ReceiptScanner({ onScanComplete }) {
  const fileInputRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState("idle");

  const handleReceiptScan = async (file) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    setIsScanning(true);
    setScanStatus("scanning");

    try {
      const result = await scanReceipt(file);
      setScanStatus("success");
      onScanComplete(result);
      toast.success("Receipt scanned successfully");
      setTimeout(() => setScanStatus("idle"), 3000);
    } catch (error) {
      console.error("Receipt scan failed:", error);
      setScanStatus("error");
      toast.error("Failed to scan receipt");
      setTimeout(() => setScanStatus("idle"), 2000);
    } finally {
      setIsScanning(false);
    }
  };

  const getBackgroundClass = () => {
    switch (scanStatus) {
      case "scanning": return "from-yellow-500/20 via-orange-500/20 to-red-500/20 border-yellow-500/50";
      case "success": return "from-green-500/20 via-emerald-500/20 to-teal-500/20 border-green-500/50";
      case "error": return "from-red-500/20 via-red-500/20 to-red-500/20 border-red-500/50";
      default: return "from-blue-600/20 via-purple-500/20 to-pink-500/20 border-purple-500/50 hover:border-purple-400";
    }
  };

  const getIconColor = () => {
    switch (scanStatus) {
      case "scanning": return "text-yellow-400";
      case "success": return "text-green-400";
      case "error": return "text-red-400";
      default: return "text-white";
    }
  };

  return (
    <div className="w-full relative group">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        capture="environment"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleReceiptScan(file);
            e.target.value = "";
          }
        }}
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isScanning}
        className={`w-full h-24 rounded-xl border-2 border-dashed bg-gradient-to-br ${getBackgroundClass()} transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-purple-500/20 hover:scale-[1.01] flex items-center justify-center gap-4 overflow-hidden relative ${isScanning ? "cursor-wait" : "cursor-pointer"}`}
      >
        <div className="z-10 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full bg-slate-900/50 flex items-center justify-center backdrop-blur-md border border-white/10 shadow-inner transition-transform duration-300 group-hover:rotate-12`}>
                {scanStatus === "scanning" ? (
                    <Loader2 className={`w-5 h-5 animate-spin ${getIconColor()}`} />
                ) : scanStatus === "success" ? (
                    <CheckCircle2 className={`w-5 h-5 ${getIconColor()}`} />
                ) : (
                    <Camera className={`w-5 h-5 ${getIconColor()}`} />
                )}
            </div>
            <div className="text-left">
                <div className={`text-sm font-semibold transition-colors duration-300 ${getIconColor()}`}>
                    {scanStatus === "scanning" ? "Analyzing Receipt..." : scanStatus === "success" ? "Scan Complete!" : scanStatus === "error" ? "Scan Failed" : "Scan Receipt with AI"}
                </div>
                <div className="text-xs text-slate-400">
                    {scanStatus === "scanning" ? "Extracting data..." : scanStatus === "success" ? "Data filled automatically" : "Upload or take a photo"}
                </div>
            </div>
            {scanStatus === "idle" && (
                <Sparkles className="w-4 h-4 text-purple-400 animate-pulse absolute top-3 right-3 opacity-50" />
            )}
        </div>
      </button>
    </div>
  );
}