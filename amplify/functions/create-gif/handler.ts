import { env } from "$amplify/env/create-gif";
import { S3Client } from "@aws-sdk/client-s3";
// @ts-ignore
import chromium from "@sparticuz/chromium";
import { execSync } from "child_process";
import fs from "fs";
import puppeteer, { Browser } from "puppeteer-core";
import type { Schema } from "../../data/resource";

const s3 = new S3Client({ region: env.AWS_REGION });

export const handler: Schema["createGif"]["functionHandler"] = async (event) => {
    console.log("🟢 Starting gif generation...");

    const { userID, title, iframeUrl, postID } = event.arguments;
    // Use unique filenames to avoid collision in reused containers
    const timestamp = Date.now();
    const mp4 = `/tmp/${timestamp}.mp4`;
    const gif = `/tmp/${timestamp}.gif`;

    let browser: Browser | null = null;

    try {
        const executablePath = await chromium
            .executablePath
            //  process.env.AWS_EXECUTION_ENV ? "/var/task/node_modules/@sparticuz/chromium/bin" : undefined,
            // "/opt/chromium",
            //    "https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar",
            ();

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

        await page.setViewport({ width: 600, height: 600 });
        const recorder = await page.screencast({ path: `/tmp/${timestamp}.gif` });

        console.log("Navigating to:", iframeUrl);

        //    await recorder.start(mp4); // supports extension - mp4, avi, webm and mov
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
        const key = `gif/${userID}/${title}.gif`;

        return "all done for now";

        // const post = await client.models.Post.update({ id: postID });
        // if (!post.data || post.errors) {
        //     console.log("graph ql err");
        //     console.log(post.errors);
        //     throw "no such post " + postID;
        // }

        // await s3.send(
        //     new PutObjectCommand({
        //         Bucket: process.env.AMPLIFY_STORAGE_BUCKET_NAME,
        //         Key: key,
        //         Body: fs.readFileSync(gif),
        //         ContentType: "image/gif",
        //     }),
        // );

        // console.log("✅ uploaded to S3...");

        // const updatedPost = await client.models.Post.update({
        //     id: postID,
        //     gifKey: key,
        // });

        // if (!updatedPost.data || updatedPost.errors) {
        //     console.log("graph ql err");
        //     console.log(updatedPost.errors);
        //     throw "failed to update post object with gif s3key ";
        // }

        // return updatedPost.data.gifKey;
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

/**
 // Add this at the VERY top before other imports
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// If standard import fails, try requiring from the absolute layer path
const chromium = require('/opt/nodejs/node_modules/@sparticuz/chromium-min');
 */
