import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all images for a specific user and video
export const getImages = query({
  args: {
    userId: v.string(),
    videoId: v.string(),
  },
  handler: async (ctx, args) => {
    const images = await ctx.db
      .query("images")
      .withIndex("by_user_and_video")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .filter((q) => q.eq(q.field("videoId"), args.videoId))
      .collect();

    const imageUrls = await Promise.all(
      images.map(async (image) => ({
        ...image,
        url: await ctx.storage.getUrl(image.storageId),
      }))
    );

    return imageUrls;
  },
});


// Generate an upload URL (for sending files to Convex storage)
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

// Store the uploaded image metadata in database
export const storeImage = mutation({
  args: {
    storageId: v.id("_storage"),
    videoId: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    // store image metadata in database
    const imageId = await ctx.db.insert("images", {
      storageId: args.storageId,
      videoId: args.videoId,
      userId: args.userId,
    });

    return imageId;
  },
});

// Get the image URL for a specific user and video
export const getImage = query({
  args: {
    userId: v.string(),
    videoId: v.string(),
  },
  handler: async (ctx, args) => {
    const image = await ctx.db
      .query("images")
      .withIndex("by_user_and_video", (q) =>
        q.eq("userId", args.userId).eq("videoId", args.videoId)
      )
      .first();

    if (!image) {
      return null;
    }

    return await ctx.storage.getUrl(image.storageId);
  },
})
