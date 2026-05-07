import { defineFunction } from "@aws-amplify/backend";

//https://serverlessrepo.aws.amazon.com/applications/us-east-1/145266761615/ffmpeg-lambda-layer
export const createGif = defineFunction({
    name: "create-gif",
    entry: "./handler.ts",
    memoryMB: 2048,
    timeoutSeconds: 120,
    runtime: 20,
    ephemeralStorageSizeMB: 512,
    layers: {
        "@aws-lambda-ffmpeg-lambda-layer": "arn:aws:lambda:us-east-1:599797655192:layer:ffmpeg:1",
        "@sparticuz/chromium": "arn:aws:lambda:us-east-1:599797655192:layer:chromium:1",
    },
    architecture: "arm64",
});
