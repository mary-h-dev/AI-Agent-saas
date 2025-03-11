"use server";

import { api } from "@/convex/_generated/api";
import { FeatureFlag, featureFlagEvents } from "@/features/flags";
import { getConvexClient } from "@/lib/convex";
import { client } from "@/lib/schematic";
import { currentUser } from "@clerk/nextjs/server";
import OpenAI from "openai";

const convexClient = getConvexClient();

export async function titleGeneration(
  videoId: string,
  videoSummary: string,
  considerations: string
) {
  const user = await currentUser();

  if (!user?.id) {
    throw new Error("User not found");
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
  });

  try {
    console.log("📝 Video summaryyyyyyyyyyyyyyyyyyyyyyyyyyyyy:", videoSummary);
    console.log("🎥 Generating title for videoId:", videoId);
    console.log("💡 Considerations:", considerations);

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful YouTube video creator assistant that creates high quality SEO friendly concise video titles.",
        },
        {
          role: "user",
          content: `Please provide ONE concise YouTube title (and nothing else) for this video. Focus on the main points and key takeaways, it should be SEO friendly and 100 characters or less:\n\n${videoSummary}\n\n${considerations}`,
        },
      ],

      temperature: 0.7,
      max_tokens: 500,
    });

    const title =
      response.choices[0]?.message?.content || "unable to generate title";

    if (!title) {
      throw new Error("No title returned from OpenAI (system error)");
    }

    console.log("✅ Generated Title:", title);

    // Optional: Store the title in Convex
    await convexClient.mutation(api.titles.generate, {
      videoId,
      userId: user.id,
      title: title,
    });

    console.log("💾 Title saved to Convex DB");

    // Optional: Track the event
    await client.track({
      event: featureFlagEvents[FeatureFlag.TITLE_GENERATIONS].event,
      company: {
        id: user.id,
      },
      user: {
        id: user.id,
      },
    });
    return title;
  } catch (error) {
    console.error("❌ Error generating title:", error);
    throw new Error("Failed to generate title");
  }
}







// messages: [
//     {
//       role: "system",
//       content: `
//         You are an expert YouTube video content assistant.
//         You help users generate SEO-friendly YouTube titles by first analyzing the key facts from the provided input, and then writing a title *grounded* in these facts.

//         You must follow this strict format:
//         1. Highlight the important facts by wrapping them with <fact> ... </fact> XML tags.
//         2. Generate one YouTube title that is concise (under 100 characters), SEO-friendly, and based ONLY on the highlighted facts.
//         `,
//     },
//     {
//       role: "user",
//       content: `
// ## Video Summary:
// ${videoSummary}

// ## Considerations:
// ${considerations}

// Follow the instructions. Provide the facts and then the title in the format below.

// HIGHLIGHTED FACTS:
// <fact>...</fact>
// <fact>...</fact>

// TITLE:
// ...Your generated title...
// `,
//     },
//   ],