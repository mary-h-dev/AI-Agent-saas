import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { currentUser } from "@clerk/nextjs/server";
import { getVideoDetails } from "@/actions/getVideoDetails";
import fetchTranscript from "@/tools/fetchTranscript";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
  compatibility: "strict",
});

export const runtime = "nodejs";

const model = openai("gpt-4o-mini");

export async function POST(req: Request) {
  try {
    const { messages, videoId } = await req.json();
    const user = await currentUser();

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    console.log("Fetching video details for:", videoId);
    const videoDetails = await getVideoDetails(videoId);
    console.log("Video details:", videoDetails ? "Found" : "Not found");

    const systemMessage = `You are an AI agent ready to accept questions from the user about ONE specific video.
        The video ID in question is ${videoId} but you'll refer to this as ${
      videoDetails?.title || "Selected Video"
    }.
        Use emojis to make the conversation more engaging.
        If an error occurs, explain it to the user and ask them to try again later.
        If the error suggests the user upgrade, explain that they must upgrade to use the feature, then tell them to go to 'Manage Plan' in the header and upgrade.
        If any tool is used, analyse the response and if it contains a cache, explain that the transcript is cached because they previously transcribed the video saving the user a token.
        Use words like database instead of cache to make it more easy to understand.
        Format for notion.
        `;

    const result = streamText({
      model,
      messages: [
        {
          role: "system",
          content: systemMessage,
        },
        ...messages,
      ],
      tools: {
        fetchTranscript: fetchTranscript,
      },
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error in OpenAI chat API:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process chat request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
