"use server";

// import { getVideoIdFromUrl } from "@/lib/youtube/getVideoIdFromUrl";
import { redirect } from "next/navigation";

export async function analyseYoutubeVideo(formData: FormData) {
  const url = formData.get("url")?.toString();
  if (!url) return;

  const videoId = "abc"; // TODO: اینجا باید ویدیو ID واقعی از لینک استخراج شود
  if (!videoId) return;

  // تغییر مسیر به صفحه آنالیز ویدیو
  redirect(`/video/${videoId}/analysis`);
}
