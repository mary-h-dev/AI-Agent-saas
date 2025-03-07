export function getVideoIdFromUrl(url: string): string | null {
  let videoId: string | null = null;

  if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1]?.split(/[?#]/)[0] || null;
  } else if (url.includes("youtube.com/shorts/")) {
    videoId = url.split("shorts/")[1]?.split(/[?#]/)[0] || null;
  } else if (url.includes("v=")) {
    videoId = url.split("v=")[1]?.split("&")[0] || null;
  }

  return videoId;
}


const url1 = "https://youtu.be/qoL-qrygV8";
const url2 = "https://www.youtube.com/watch?v=qoL-qrygV8";
const url3 = "https://www.youtube.com/shorts/qoL-qrygV8";

console.log(getVideoIdFromUrl(url1)); // خروجی: qoL-qrygV8
console.log(getVideoIdFromUrl(url2)); // خروجی: qoL-qrygV8
console.log(getVideoIdFromUrl(url3)); // خروجی: qoL-qrygV8

