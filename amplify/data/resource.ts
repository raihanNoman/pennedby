import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { postConfirmation } from "../auth/post-confirmation/resource";
import { createGif } from "../functions/create-gif/recource";

const schema = a
    .schema({
        createGif: a
            .mutation()
            .arguments({
                postID: a.string().required(),
                iframeUrl: a.string().required(),
                userID: a.string().required(),
                title: a.string().required(),
            })
            .returns(a.string()) // returns the s3 key
            .authorization((allow) => allow.authenticated())
            .handler(a.handler.function(createGif)),

        Post: a
            .model({
                title: a.string(),
                isPublic: a.boolean().default(true),
                points: a.json().required(), // svg points used to do the animation

                color: a.string(),
                size: a.integer(),
                viewBox: a.string().required(),

                audioKey: a.string(), // adding voice
                audioDuration: a.float(), // Vital for the iframe to know the "scroll/play" length
                audioTranscript: a.string(),
                audioStamps: a.string(), // transcript word stamps from deepgram or whisper.

                gifKey: a.string(),

                userID: a.id().required(),
                user: a.belongsTo("User", "userID"),
            })
            .authorization((allow) => [allow.guest(), allow.authenticated(), allow.ownerDefinedIn("userID")]),

        User: a
            .model({
                name: a.string(),
                picture: a.string(), // Show the founder's face in the letter corner
                posts: a.hasMany("Post", "userID"),
            })
            .authorization((allow) => [allow.guest().to(["read"]), allow.authenticated(), allow.owner()]),
    })
    .authorization((allow) => [
        allow.resource(postConfirmation).to(["mutate"]),
        allow.resource(createGif).to(["mutate", "query"]),
    ]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
    schema,
    authorizationModes: {
        defaultAuthorizationMode: "userPool",
    },
});
