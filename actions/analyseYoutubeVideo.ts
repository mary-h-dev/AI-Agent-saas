"use server";

import { getVideoIdFromUrl } from "@/lib/getVideoIdFromUrl";
import { redirect } from "next/navigation";


export async function analyseYoutubeVideo(formData: FormData) {
  const url = formData.get("url")?.toString();
  if (!url) return;

  const videoId = getVideoIdFromUrl(url); // TODO: اینجا باید ویدیو ID واقعی از لینک استخراج شود
  if (!videoId) return;

  console.log("videoId>>>>>>", videoId);

  redirect(`/video/${videoId}/analysis`);
}
