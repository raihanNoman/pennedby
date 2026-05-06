import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Post: a
    .model({
      isPublic: a.boolean().default(true),
      points: a.json(), // svg points used to do the animation

      color: a.string(),
      size: a.integer(),
      viewBox: a.string(),

      audioKey: a.string(), // adding voice
      audioDuration: a.float(), // Vital for the iframe to know the "scroll/play" length
      audioTranscript: a.string(),
      audioStamps: a.string(), // transcript word stamps from deepgram or whisper.

      userID: a.id().required(),
      user: a.belongsTo("User", "userID"),
    })
    .authorization((allow) => [allow.guest(), allow.ownerDefinedIn("userID")]),

  User: a
    .model({
      name: a.string(),
      picture: a.string(), // Show the founder's face in the letter corner
      posts: a.hasMany("Post", "userID"),
    })
    .authorization((allow) => [allow.guest().to(["read"]), allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "identityPool",
  },
});
