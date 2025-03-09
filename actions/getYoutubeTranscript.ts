"use server";

import { currentUser } from "@clerk/nextjs/server";
import { Innertube } from "youtubei.js";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { client } from "@/lib/schematic";
import { featureFlagEvents, FeatureFlag } from "@/features/flags";



const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export interface TranscriptEntry {
  text: string;
  timestamp: string;
}


const youtube = await Innertube.create({
  lang: "en",
  location: "US",
  retrieve_player: false,
});

function formatTimestamp(start_ms: number): string {
  const minutes = Math.floor(start_ms / 60000);
  const seconds = Math.floor((start_ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

async function fetchTranscript(videoId: string): Promise<TranscriptEntry[]> {
  try {
    const info = await youtube.getInfo(videoId);
    const transcriptData = await info.getTranscript();

    const transcript: TranscriptEntry[] =
      transcriptData.transcript.content?.body?.initial_segments.map(
        (segment) => ({
          text: segment.snippet.text ?? "N/A",
          timestamp: formatTimestamp(Number(segment.start_ms)),
        })
      ) ?? [];

    return transcript;
  } catch (error) {
    console.error("Error fetching transcript:", error);
    throw error;
  }
}

export async function getYoutubeTranscript(videoId: string) {
  console.log("🔍 Starting YouTube transcript fetch process...");
  console.log("📹 Video ID:", videoId);
  
  console.log("👤 Fetching current user...");
  const user = await currentUser();
  console.log("👤 Current user:", user);

  if (!user?.id) {
    console.error("❌ User not found - Authentication required");
    throw new Error("User not found");
  }

  console.log("🔍 Checking database for existing transcript...");
  const existingTranscript = await convex.query(
    api.transcript.getTranscriptByVideoId,
    {
      videoId,
      userId: user.id,
    }
  );
  if (existingTranscript) {
    console.log("✅ Found existing transcript in database");
    return {
      transcript: existingTranscript.transcript,
      cache:
        "This video already exists in the database, use the cache instead of fetching again",
    };
  }

  try {
    console.log("🎯 No existing transcript found, fetching from YouTube...");
    const transcript = await fetchTranscript(videoId);
    
    console.log("💾 Saving transcript to database...");
    await convex.mutation(api.transcript.storeTranscript, {
      videoId,
      userId: user.id,
      transcript,
    });
    
    console.log("📊 Tracking transcription event...");
    await client.track({
        event: featureFlagEvents[FeatureFlag.TRANSCRIPTION].event,
        company: {
            id: user.id,
        },
        user: {
            id: user.id,
        },
    });
    
    console.log("✅ Transcript process completed successfully");
    return {
      transcript,
      cache:
        "This video was transcribed using a token, the transcript is now saved in the database",
    };
  } catch (error) {
    console.error("❌ Error fetching transcript:", error);
    console.log("⚠️ Returning empty transcript due to error");

    return {
      transcript: [],
      cache: "Error fetching transcript, please try again later",
    };
  }
}
