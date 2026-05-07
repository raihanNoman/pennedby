import { env } from "$amplify/env/create-gif";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import chromium from "@sparticuz/chromium";
import { execSync } from "child_process";
import fs from "fs";
import puppeteer, { Browser } from "puppeteer-core";
import { PuppeteerScreenRecorder } from "puppeteer-screen-recorder";
import type { Schema } from "../../data/resource";

const s3 = new S3Client({ region: env.AWS_REGION });

export const handler: Schema["createGif"]["functionHandler"] = async (
  event,
) => {
  console.log("🟢 Starting gif generation...");

  const { userID, title, iframeUrl } = event.arguments;
  // Use unique filenames to avoid collision in reused containers
  const timestamp = Date.now();
  const mp4 = `/tmp/${timestamp}.mp4`;
  const gif = `/tmp/${timestamp}.gif`;

  let browser: Browser | null = null;

  try {
    browser = await puppeteer.launch({
      args: puppeteer.defaultArgs({ args: chromium.args, headless: "shell" }),
      executablePath: await chromium.executablePath(),
      headless: "shell",
      defaultViewport: {
        deviceScaleFactor: 1,
        hasTouch: false,
        isLandscape: true,
        isMobile: false,
        height: 1080,
        width: 1920,
      },
    });

    const page = await browser.newPage();
    const recorder = new PuppeteerScreenRecorder(page, {
      followNewTab: true,
      fps: 30,
      videoCrf: 18,
      videoCodec: "libx264",
      videoPreset: "ultrafast",
      videoBitrate: 1000,
      aspectRatio: "4:3",
      videoFrame: { width: 1024, height: 768 },
    });

    await page.setViewport({ width: 600, height: 600 });
    console.log("Navigating to:", iframeUrl);

    await page.goto(iframeUrl, { waitUntil: "networkidle2", timeout: 30000 });
    await recorder.start(mp4); // supports extension - mp4, avi, webm and mov
    console.log("Recording started ...");

    // 4. Wait for the animation to finish
    await new Promise((resolve) => setTimeout(resolve, 6000));

    await recorder.stop();
    console.log("Recording stopped. File saved as simple.mp4");

    await browser.close();
    console.log("closed browser conversion...");

    console.log("Starting conversion...");
    execSync(
      `ffmpeg -i ${mp4} -vf "fps=15,scale=600:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 ${gif} `,
    );
    console.log("✅ Converted to Gif");

    console.log("📤 Uploading to S3...");
    const key = `letter-gifs/${userID}/${title}.gif`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AMPLIFY_STORAGE_BUCKET_NAME,
        Key: key,
        Body: fs.readFileSync(gif),
        ContentType: "image/gif",
      }),
    );

    console.log("✅ uploaded to S3...");

    return key;
  } catch (err) {
    console.error("🚨 Critical failure:", err);
    throw err; // Trigger Lambda retry if necessary
  } finally {
    // CLEANUP: Important for Lambda health
    if (browser) await browser.close();
    [mp4, gif].forEach((path) => {
      if (fs.existsSync(path)) fs.unlinkSync(path);
    });
  }
};
