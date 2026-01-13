"use client";

import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";
import useFetch from "@/hooks/use-fetch";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import Link from "next/link";
import { updateDefaultAccount } from "@/actions/account";
import { toast } from "sonner";

export function AccountCard({ account }) {
  const { name, type, balance, id, isDefault } = account;

  const {
    loading: updateDefaultLoading,
    fn: updateDefaultFn,
    data: updatedAccount,
    error,
  } = useFetch(updateDefaultAccount);

  const handleDefaultChange = async (event) => {
    event.preventDefault(); // Prevent navigation
    if (isDefault) {
      toast.warning("You need at least 1 default account");
      return;
    }
    await updateDefaultFn(id);
  };

  useEffect(() => {
    if (updatedAccount?.success) {
      toast.success("Default account updated successfully");
    }
  }, [updatedAccount]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update default account");
    }
  }, [error]);

  return (
    <Link href={`/account/${id}`} className="block h-full group">
      <div
        className={`
          relative h-full rounded-xl p-6 overflow-hidden shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl
          ${
            isDefault
              ? "bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 text-white"
              : "bg-gradient-to-br from-slate-800 via-slate-900 to-black text-white border border-white/10"
          }
        `}
      >
        {/* Background Decorative Circles */}
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-black/10 rounded-full blur-xl" />

        {/* Card Header: Chip & Logo */}
        <div className="relative z-10 flex justify-between items-start mb-8">
            {/* EMV Chip */}
            <div className="w-12 h-9 rounded-md bg-gradient-to-tr from-yellow-300 to-yellow-500 border border-yellow-200/50 relative overflow-hidden shadow-sm">
                <div className="absolute inset-0 border border-black/10 opacity-50 rounded-md" />
                {/* Chip Lines */}
                <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-black/20" />
                <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-black/20" />
                <div className="absolute top-1/2 left-1/2 w-4 h-4 border border-black/20 rounded-full -translate-x-1/2 -translate-y-1/2" />
            </div>

            {/* Finora Logo on Card */}
            <div className="text-right">
                <div className="text-lg font-bold tracking-tight opacity-90 font-mono">Finora.</div>
                <div className="text-[10px] uppercase tracking-widest opacity-70">Platinum</div>
            </div>
        </div>

        {/* Card Number (Fake/Masked) */}
        <div className="relative z-10 mb-6">
            <div className="font-mono text-xl tracking-[0.2em] opacity-90 shadow-black drop-shadow-md">
                **** **** **** {id.slice(-4)}
            </div>
        </div>

        {/* Card Footer: Details */}
        <div className="relative z-10 flex justify-between items-end">
            <div>
                <p className="text-[10px] uppercase tracking-wider opacity-70 mb-1">Card Holder</p>
                <p className="font-semibold text-sm tracking-wide capitalize truncate max-w-[150px]">
                    {name}
                </p>
                <p className="text-[10px] opacity-70 mt-0.5 capitalize">{type} Account</p>
            </div>

            <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider opacity-70 mb-1">Balance</p>
                <p className="text-2xl font-bold tracking-tight">
                    ${parseFloat(balance).toFixed(2)}
                </p>
            </div>
        </div>

        {/* Default Switch (Absolute Top Right) */}
        <div className="absolute bottom-4 right-1/2 translate-x-1/2 z-20 group-hover:opacity-100 opacity-0 transition-opacity" onClick={(e) => e.preventDefault()}>
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                <span className="text-[10px] font-medium">Default</span>
                <Switch
                    checked={isDefault}
                    onCheckedChange={() => handleDefaultChange({ preventDefault: () => {} })}
                    disabled={updateDefaultLoading}
                    className="scale-75 data-[state=checked]:bg-green-500"
                />
            </div>
        </div>
      </div>
    </Link>
  );
}