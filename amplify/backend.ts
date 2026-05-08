import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { createGif } from "./functions/create-gif/recource";
import { storage } from "./storage/resource";

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
    auth,
    data,
    createGif,
    storage,
});

backend.createGif.addEnvironment("BUCKET_NAME", backend.storage.resources.bucket.bucketName);

// const postTable = backend.data.resources.tables["Post"];

// backend.createGif.resources.lambda.addEventSource(
//   new DynamoEventSource(postTable, {
//     startingPosition: StartingPosition.LATEST,
//     batchSize: 1,
//     retryAttempts: 2,
//   }),
// );
