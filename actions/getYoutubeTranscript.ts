"use server";

import { currentUser } from "@clerk/nextjs/server";
import { Innertube } from "youtubei.js";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

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
  console.log("Fetching current user...");
  const user = await currentUser();
  console.log("Current user:", user);

  if (!user?.id) {
    console.error("User not found");
    throw new Error("User not found");
  }

  //for savinfg in data base or retriving from data base
  const existingTranscript = await convex.query(
    api.transcript.getTranscriptByVideoId,
    {
      videoId,
      userId: user.id,
    }
  );
  if (existingTranscript) {
    console.log("Transcript already exists in the database");
    return {
      transcript: existingTranscript.transcript,
      cache:
        "This video already exists in the database, use the cache instead of fetching again",
    };
  }

  try {
    //fetching transcript
    const transcript = await fetchTranscript(videoId);
    //saving transcript in the database
    await convex.mutation(api.transcript.storeTranscript, {
      videoId,
      userId: user.id,
      transcript,
    });

    return {
      transcript,
      cache:
        "This video was transcribed using a token, the transcript is now saved in the database",
    };
  } catch (error) {
    console.error("❌ Error fetching transcript:", error);

    return {
      transcript: [],
      cache: "Error fetching transcript, please try again later",
    };
  }
}
