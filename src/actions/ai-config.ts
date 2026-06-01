"use server";

import { db } from "../lib/db";

export async function saveAIConfig(
  userId: string,
  provider: string,
  model: string,
  apiKey: string
) {
  try {
    const config = await db.userAIConfig.upsert({
      where: { userId },
      update: {
        provider,
        model,
        apiKey,
      },
      create: {
        userId,
        provider,
        model,
        apiKey,
      },
    });
    return { success: true, data: config };
  } catch (error: any) {
    console.error("Error saving AI config:", error);
    return { success: false, error: error?.message || "Failed to save AI config" };
  }
}

export async function getAIConfig(userId: string) {
  try {
    const config = await db.userAIConfig.findUnique({
      where: { userId },
    });
    return { success: true, data: config };
  } catch (error: any) {
    console.error("Error getting AI config:", error);
    return { success: false, error: error?.message || "Failed to fetch AI config" };
  }
}
