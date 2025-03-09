import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// retriving transcript for a video
export const getTranscriptByVideoId = query({
  args: {
    videoId: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("transcript")
      .withIndex("by_user_and_video", (q) =>
        q.eq("userId", args.userId).eq("videoId", args.videoId)
      )
      .unique();
  },
});

// saving transcript for a video
export const storeTranscript = mutation({
  args: {
    videoId: v.string(),
    userId: v.string(),
    transcript: v.array(
      v.object({
        text: v.string(),
        timestamp: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    // checking if the transcript already exists for the user and video
    const existingTranscript = await ctx.db
      .query("transcript")
      .withIndex("by_user_and_video", (q) =>
        q.eq("userId", args.userId).eq("videoId", args.videoId)
      )
      .unique();

    if (existingTranscript) {
      return existingTranscript;
    }

    // saving the transcript
    return await ctx.db.insert("transcript", {
      videoId: args.videoId,
      userId: args.userId,
      transcript: args.transcript,
    });
  },
});


// retriving all transcripts for a user
export const getTranscriptsByUserId = query({
    args: {
      userId: v.string(),
    },
    handler: async (ctx, args) => {
      return await ctx.db
        .query("transcript")
        .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
        .collect();
    },
  });




  //deleting transcript
export const deleteTranscript = mutation({
    args: { id: v.id("transcript"), userId: v.string() },
    handler: async (ctx, args) => {
      const transcript = await ctx.db.get(args.id);
  
      if (!transcript) {
        throw new Error("Transcript not found");
      }
  
      if (transcript.userId !== args.userId) {
        throw new Error("Not authorized");
      }
  
      await ctx.db.delete(args.id);
      return true;
    },
  });
  