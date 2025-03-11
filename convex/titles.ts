
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";


// for getting the list of titles
export const list = query({
  args: {
    videoId: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("titles")
      .withIndex("by_user_and_video", (q) =>
        q.eq("userId", args.userId).eq("videoId", args.videoId)
      )
      .collect();
  },
});

// for generating a new title
export const generate = mutation({
  args: {
    videoId: v.string(),
    userId: v.string(),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    // insert the title into the database
    const titleId = await ctx.db.insert("titles", {
      videoId: args.videoId,
      userId: args.userId,
      title: args.title,
    });

    return titleId;
  },
});
