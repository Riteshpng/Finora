"use server";


import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { GoogleGenerativeAI } from "@google/generative-ai";
import aj from "@/lib/arcjet";
import { request } from "@arcjet/next";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const serializeAmount = (obj) => ({
  ...obj,
  amount: obj.amount.toNumber(),
});

// Create Transaction
export async function createTransaction(data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Get request data for ArcJet
    const req = await request();

    // Check rate limit
    const decision = await aj.protect(req, {
      userId,
      requested: 1, // Specify how many tokens to consume
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        const { remaining, reset } = decision.reason;
        console.error({
          code: "RATE_LIMIT_EXCEEDED",
          details: {
            remaining,
            resetInSeconds: reset,
          },
        });

        throw new Error("Too many requests. Please try again later.");
      }

      throw new Error("Request blocked");
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const account = await db.account.findUnique({
      where: {
        id: data.accountId,
        userId: user.id,
      },
    });

    if (!account) {
      throw new Error("Account not found");
    }

    // Calculate new balance
    const balanceChange = data.type === "EXPENSE" ? -data.amount : data.amount;
    const newBalance = account.balance.toNumber() + balanceChange;

    // Create transaction and update account balance
    const transaction = await db.$transaction(async (tx) => {
      const newTransaction = await tx.transaction.create({
        data: {
          ...data,
          userId: user.id,
          nextRecurringDate:
            data.isRecurring && data.recurringInterval
              ? calculateNextRecurringDate(data.date, data.recurringInterval)
              : null,
        },
      });

      await tx.account.update({
        where: { id: data.accountId },
        data: { balance: newBalance },
      });

      return newTransaction;
    });

    revalidatePath("/dashboard");
    revalidatePath(`/account/${transaction.accountId}`);

    return { success: true, data: serializeAmount(transaction) };
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getTransaction(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const transaction = await db.transaction.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!transaction) throw new Error("Transaction not found");

  return serializeAmount(transaction);
}

export async function updateTransaction(id, data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // Get original transaction to calculate balance change
    const originalTransaction = await db.transaction.findUnique({
      where: {
        id,
        userId: user.id,
      },
      include: {
        account: true,
      },
    });

    if (!originalTransaction) throw new Error("Transaction not found");

    // OLD AMOUNT LOGIC (What we need to "undo")
    const oldBalanceChange =
      originalTransaction.type === "EXPENSE"
        ? -originalTransaction.amount.toNumber()
        : originalTransaction.amount.toNumber();

    // NEW AMOUNT LOGIC (What we need to "apply")
    const newBalanceChange =
      data.type === "EXPENSE" ? -data.amount : data.amount;

    // RUN THE UPDATE INSIDE A TRANSACTION (ACID Compliance)
    const transaction = await db.$transaction(async (tx) => {
      // 1. Update the Transaction Record itself
      const updated = await tx.transaction.update({
        where: {
          id,
          userId: user.id,
        },
        data: {
          ...data,
          nextRecurringDate:
            data.isRecurring && data.recurringInterval
              ? calculateNextRecurringDate(data.date, data.recurringInterval)
              : null,
        },
      });

      // 2. Handle Account Balances
      // CASE A: User switched accounts (e.g., Bank -> Cash)
      if (data.accountId !== originalTransaction.accountId) {
        // Refund the OLD account
        await tx.account.update({
          where: { id: originalTransaction.accountId },
          data: {
            balance: {
              increment: -oldBalanceChange, // Reverse the old action
            },
          },
        });

        // Charge the NEW account
        await tx.account.update({
          where: { id: data.accountId },
          data: {
            balance: {
              increment: newBalanceChange, // Apply the new action
            },
          },
        });
      } 
      // CASE B: Same account, just different amount/type
      else {
        const netChange = newBalanceChange - oldBalanceChange;
        await tx.account.update({
          where: { id: data.accountId },
          data: {
            balance: {
              increment: netChange,
            },
          },
        });
      }

      return updated;
    });

    revalidatePath("/dashboard");
    revalidatePath(`/account/${data.accountId}`);

    return { success: true, data: serializeAmount(transaction) };
  } catch (error) {
    throw new Error(error.message);
  }
}

// Get User Transactions
export async function getUserTransactions(query = {}) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const transactions = await db.transaction.findMany({
      where: {
        userId: user.id,
        ...query,
      },
      include: {
        account: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    return { success: true, data: transactions };
  } catch (error) {
    throw new Error(error.message);
  }
}

// Scan Receipt
// REPLACE your old scanReceipt function with this:

export async function scanReceipt(file) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const req = await request();
    const decision = await aj.protect(req, {
      userId,
      requested: 1,
    });

    if (decision.isDenied()) {
      throw new Error("Rate limit exceeded");
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const mimeType = allowedTypes.includes(file.type)
      ? file.type
      : "image/jpeg";

    const bytes = await file.arrayBuffer();
    if (!bytes || bytes.byteLength === 0) {
      throw new Error("Empty image buffer");
    }

    const base64 = Buffer.from(bytes).toString("base64");

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are a receipt extraction system.

Return ONLY valid JSON. No markdown. No explanations.
If a field is unclear, use null. DO NOT GUESS.

Schema:
{
  "amount": number | null,
  "date": string | null,
  "description": string | null,
  "merchantName": string | null,
  "category": string | null
}
`;

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64,
          mimeType,
        },
      },
      prompt,
    ]);

    const rawText = result.response.text();

    const start = rawText.indexOf("{");
    const end = rawText.lastIndexOf("}");

    if (start === -1 || end === -1) {
      throw new Error("Gemini returned no JSON");
    }

    const json = JSON.parse(rawText.slice(start, end + 1));

    return {
      amount: typeof json.amount === "number" ? json.amount : null,
      date: json.date ? new Date(json.date) : null,
      description: json.description ?? null,
      merchantName: json.merchantName ?? null,
      category: json.category ?? "other-expense",
    };
  } catch (error) {
    console.error("Receipt scan failed:", error);
    throw new Error("Failed to scan receipt");
  }
}


// Helper function to calculate next recurring date
function calculateNextRecurringDate(startDate, interval) {
  const date = new Date(startDate);

  switch (interval) {
    case "DAILY":
      date.setDate(date.getDate() + 1);
      break;
    case "WEEKLY":
      date.setDate(date.getDate() + 7);
      break;
    case "MONTHLY":
      date.setMonth(date.getMonth() + 1);
      break;
    case "YEARLY":
      date.setFullYear(date.getFullYear() + 1);
      break;
  }

  return date;
}
