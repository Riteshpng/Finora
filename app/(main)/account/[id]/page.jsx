import { Suspense } from "react";
import { getAccountWithTransactions } from "@/actions/account";
import { BarLoader } from "react-spinners";
import { TransactionTable } from "../_components/transaction-table";
import { notFound } from "next/navigation";
import { AccountChart } from "../_components/account-chart";

export default async function AccountPage({ params }) {
  const accountData = await getAccountWithTransactions(params.id);

  if (!accountData) {
    notFound();
  }

  const { transactions, ...account } = accountData;

  return (
    <div className="space-y-8 px-5 py-8 relative">
      
      {/* Ambient Background Glow (Subtle) */}
      <div className="absolute top-20 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute top-20 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

      {/* 1. Glass Header Card */}
      <div className="flex flex-col sm:flex-row items-end justify-between gap-4 p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl">
        
        {/* Account Info */}
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent capitalize">
            {account.name}
          </h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
            {account.type.charAt(0) + account.type.slice(1).toLowerCase()} Account
          </p>
        </div>

        {/* Balance Block */}
        <div className="text-right pb-2">
          <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            ${parseFloat(account.balance).toFixed(2)}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {account._count.transactions} Transactions
          </p>
        </div>
      </div>

      {/* 2. Chart Section (Wrapped in Card) */}
      <div className="rounded-2xl border border-white/5 bg-black/20 backdrop-blur-sm overflow-hidden">
        <Suspense
            fallback={<div className="h-[400px] flex items-center justify-center"><BarLoader color="#9333ea" /></div>}
        >
            <AccountChart transactions={transactions} />
        </Suspense>
      </div>

      {/* 3. Transactions Table (Clean Layout) */}
      <div className="pt-4">
        <h2 className="text-2xl font-semibold mb-6 tracking-tight">Transaction History</h2>
        <Suspense
            fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}
        >
            <TransactionTable transactions={transactions} />
        </Suspense>
      </div>
    </div>
  );
}