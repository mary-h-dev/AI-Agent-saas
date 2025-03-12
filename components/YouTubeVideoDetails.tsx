"use client";

import { getVideoDetails } from "@/actions/getVideoDetails";
import { VideoDetails } from "@/types/types";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Calendar, Eye, MessageCircle, ThumbsUp } from "lucide-react";

function YoutubeVideoDetails({ videoId }: { videoId: string }) {
  const [video, setVideo] = useState<VideoDetails | null>(null);
  console.log("video", video);

  useEffect(() => {
    const fetchVideoDetails = async () => {
      const video = await getVideoDetails(videoId);
      setVideo(video);
    };

    fetchVideoDetails();
  }, [videoId]);

  if (!video) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
    </div>
  );

  return (
    <div className="@container bg-black rounded-xl">
      <div className="flex flex-col gap-8">
        {/* Video Thumbnail */}
        <div className="flex-shrink-0">
          <Image
            src={video.thumbnail}
            alt={video.title}
            width={500}
            height={500}
            className="w-full rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
          />
        </div>

        {/* Video Details */}
        <div className="flex-grow space-y-4">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-200 leading-tight line-clamp-2">
            {video.title}
          </h1>

          {/* Channel Info */}
          <div className="flex items-center gap-4">
            <Image
              src={video.channel.thumbnail}
              alt={video.channel.title}
              width={48}
              height={48}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-gray-100"
            />
            <p className="text-base md:text-lg font-semibold text-gray-200">
              {video.channel.title}
            </p>
            <p className="text-sm md:text-base text-gray-200">
              {video.channel.subscribers} subscribers
            </p>
          </div>
        </div>

        {/* Video Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          <div className="bg-gray-900 rounded-lg p-3 transition-all duration-300 hover:bg-gray-700">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-gray-200" />
              <p className="text-sm text-gray-200">Published</p>
            </div>
            <p className="font-medium text-gray-200">
              {new Date(video.publishedAt).toLocaleDateString()}
            </p>
          </div>
          <div className="bg-gray-900 rounded-lg p-3 transition-all duration-300 hover:bg-gray-700">
            <div className="flex items-center gap-2 mb-1">
              <Eye className="w-4 h-4 text-gray-200" />
              <p className="text-sm text-gray-200">Views</p>
            </div>
            <p className="font-medium text-gray-200">{video.views}</p>
          </div>
          <div className="bg-gray-900 rounded-lg p-3 transition-all duration-300 hover:bg-gray-700">
            <div className="flex items-center gap-2 mb-1">
              <ThumbsUp className="w-4 h-4 text-gray-200" />
              <p className="text-sm text-gray-200">Likes</p>
            </div>
            <p className="font-medium text-gray-200">{video.likes}</p>
          </div>

          <div className="bg-gray-900 rounded-lg p-3 transition-all duration-300 hover:bg-gray-700">
            <div className="flex items-center gap-2 mb-1">
              <MessageCircle className="w-4 h-4 text-gray-200" />
              <p className="text-sm text-gray-200">Comments</p>
            </div>
            <p className="font-medium text-gray-200">{video.comments}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default YoutubeVideoDetails;
