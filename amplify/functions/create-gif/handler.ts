import { env } from "$amplify/env/create-gif";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import chromium from "@sparticuz/chromium";
import { execSync } from "child_process";
import fs from "fs";
import puppeteer, { Browser } from "puppeteer-core";
import type { Schema } from "../../data/resource";
import { client } from "./aws";

const s3 = new S3Client({ region: env.AWS_REGION });

export const handler: Schema["createGif"]["functionHandler"] = async (event) => {
    console.log("🟢 Starting gif generation...");

    const { userID, title, iframeUrl, postID } = event.arguments;
    // Use unique filenames to avoid collision in reused containers
    const timestamp = Date.now();
    const mp4 = `/tmp/${timestamp}.mp4` as const;
    const gif = `/tmp/${timestamp}.gif` as const;

    const framesDir = `/tmp/frames_${timestamp}` as const;
    fs.mkdirSync(framesDir);

    let browser: Browser | null = null;

    try {
        const post = await client.models.Post.update({ id: postID });
        if (!post.data || post.errors) {
            console.log("graph ql err");
            console.log(post.errors);
            throw "no such post " + postID;
        }

        const executablePath = await chromium.executablePath();

        if (!fs.existsSync(executablePath)) {
            console.log("Chromium binary not found at path, extracting...");
        } else {
            console.log("🟢 got chromumm binary");
        }

        console.log({ iframeUrl });

        browser = await puppeteer.launch({
            args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
            executablePath: executablePath,
            headless: "shell",
            defaultViewport: {
                deviceScaleFactor: 1,
                hasTouch: false,
                isLandscape: true,
                isMobile: false,
                height: 1080,
                width: 1920,
            },
            issuesEnabled: false,
        });

        const page = await browser.newPage();
        await page.goto(iframeUrl, { waitUntil: "networkidle0", timeout: 30000 });

        await page.waitForSelector("path", { timeout: 15000 });

        // Optional: Give it an extra 500ms for the animation to actually kick in
        await new Promise((r) => setTimeout(r, 500));

        await page.setViewport({ width: 600, height: 600 });
        // Capture 10 frames per second for 6 seconds
        const fps = 10;
        const duration = 6;
        const totalFrames = fps * duration;

        for (let i = 0; i < totalFrames; i++) {
            // Pad numbers for FFmpeg: 001.jpg, 002.jpg...
            const frameName = String(i).padStart(3, "0");
            await page.screenshot({
                path: `${framesDir}/${frameName}.jpg`,
                type: "jpeg",
                quality: 80,
            });

            // Manual delay to keep roughly 10fps
            await new Promise((r) => setTimeout(r, 1000 / fps));
        }

        await browser.close();
        console.log("✅ Frames captured. Stitching with FFmpeg...");

        const ffmpegCmd = `ffmpeg -framerate ${fps} -i ${framesDir}/%03d.jpg -vf "scale=600:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 ${gif}`;

        execSync(ffmpegCmd);
        console.log("✅🎉 GIF Created!");

        const key = `gif/${userID}/${title}.gif`;

        console.log("About to upload to s3", env.PENNED_BY_ME_BUCKET_NAME, key, process.env); //

        await s3.send(
            new PutObjectCommand({
                Bucket: env.PENNED_BY_ME_BUCKET_NAME,
                Key: key,
                Body: fs.readFileSync(gif),
                ContentType: "image/gif",
            }),
        );

        console.log("✅ uploaded to S3...");

        const updatedPost = await client.models.Post.update({
            id: postID,
            gifKey: key,
        });

        if (!updatedPost.data || updatedPost.errors) {
            console.log("graph ql err");
            console.log(updatedPost.errors);
            throw "failed to update post object with gif s3key ";
        }

        return updatedPost.data.gifKey;
    } catch (err) {
        console.error("🚨 Critical failure:", err);
        throw err; // Trigger Lambda retry if necessary
    } finally {
        fs.rmSync(framesDir, { recursive: true, force: true });

        // CLEANUP: Important for Lambda health
        if (browser) await browser.close();
        [mp4, gif].forEach((path) => {
            if (fs.existsSync(path)) fs.unlinkSync(path);
        });
    }
};

/**
 // Add this at the VERY top before other imports
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// If standard import fails, try requiring from the absolute layer path
const chromium = require('/opt/nodejs/node_modules/@sparticuz/chromium-min');
 */
