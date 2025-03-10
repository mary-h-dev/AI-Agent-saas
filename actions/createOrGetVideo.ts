"use server";
import { Doc } from "@/convex/_generated/dataModel";
import { getConvexClient } from "@/lib/convex";
import { currentUser } from "@clerk/nextjs/server";
import { checkFeatureUsageLimit } from "@/lib/checkFeatureUsageLimit";
import { featureFlagEvents, FeatureFlag } from "@/features/flags";
import { client } from "@/lib/schematic";
import { api } from "@/convex/_generated/api";

export interface VideoResponse {
  success: boolean;
  data?: Doc<"videos"> | null;
  error?: string;
}

export const createOrGetVideo = async (
  videoId: string,
  userId: string
): Promise<VideoResponse> => {
  try {
    const convex = getConvexClient();
    const user = await currentUser();

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    // Check feature usage limit
    const featureCheck = await checkFeatureUsageLimit(
      user.id,
      featureFlagEvents[FeatureFlag.ANALYSE_VIDEO].event
    );

    if (!featureCheck.success) {
      return {
        success: false,
        error: featureCheck.error,
      };
    }

    // Get video if already exists
    const video = await convex.query(api.videos.getVideoById, {
      videoId,
      userId,
    });

    if (!video) {
      console.log(`Analyse event for video ${videoId} — Token will be spent`);
      //  Create new video entry
      const newVideoId = await convex.mutation(api.videos.createVideoEntry, {
        videoId,
        userId,
      });
      // Get new video data
      const newVideo = await convex.query(api.videos.getVideoById, {
        videoId: newVideoId,
        userId,
      });
      // Track usage (spending token / increment usage)
      console.log("Tracking analyse video event...");
      await client.track({
        event: featureFlagEvents[FeatureFlag.ANALYSE_VIDEO].event,
        company: {
          id: userId,
        },
        user: {
          id: userId,
        },
      });
      return {
        success: true,
        data: newVideo,
      };
    } else {
      console.log(`Video exists - no token needs to be spent`);
      return {
        success: true,
        data: video,
      };
    }
  } catch (error) {
    console.error("Error creating or getting video:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
};
