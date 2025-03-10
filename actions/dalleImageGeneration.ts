"use server";
import { getConvexClient } from "@/lib/convex";
import { currentUser } from "@clerk/nextjs/server";
import OpenAI from "openai";
import { api } from "@/convex/_generated/api";

const IMAGE_SIZE = "1792x1024" as const;
const convexClient = getConvexClient();

export const dalleImageGeneration = async (
  prompt: string,
  videoId: string
) => {
  const user = await currentUser();

  if (!user?.id) {
    throw new Error("User not found");
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
  });

  if (!prompt) {
    throw new Error("Failed to generate image prompt");
  }

  console.log("🚀 Generating image with prompt:", prompt);

  // Generate the image using DALL-E
  const imageResponse = await openai.images.generate({
    model: "dall-e-3",
    prompt: prompt,
    n: 1,
    size: IMAGE_SIZE,
    quality: "standard",
    style: "vivid",
  });

  const imageUrl = imageResponse.data[0]?.url;

  if (!imageUrl) {
    throw new Error("Failed to generate image");
  }

  // Step 1: Get a short-lived upload URL for Convex
  console.log("📤 Getting upload URL...");
  const postUrl = await convexClient.mutation(
    api.images.generateUploadUrl
  );
  console.log("✅ Got upload URL");

  // (ادامه کد آپلود فایل به URL و ذخیره لینک در دیتابیس، که در اسکرین‌شات دیده نمیشه)
};




