import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  try {
    const loggedInUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    if (loggedInUser) {
      return loggedInUser;
    }

    // FIX 1: Handle missing last name gracefully
    // If lastName is null, it becomes empty string. .trim() removes trailing spaces.
    const name = `${user.firstName} ${user.lastName || ""}`.trim();

    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      },
    });

    return newUser;
  } catch (error) {
    // FIX 2: The "Race Condition" Handler
    // If creating the user failed (likely because they were created 1ms ago by another request),
    // we simply fetch and return that existing user.
    console.log("User sync error (likely race condition), fetching existing user:", error.message);
    
    const existingUser = await db.user.findUnique({
        where: { clerkUserId: user.id }
    });
    
    return existingUser;
  }
};