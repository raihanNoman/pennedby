import { defineStorage } from "@aws-amplify/backend";
import { createGif } from "../functions/create-gif/recource";

export const storage = defineStorage({
  name: "quranPlay",
  isDefault: true,
  access: (allow) => ({
    "letter-gifs/{entity_id}/*": [
      allow.guest.to(["read"]),
      allow.authenticated.to(["read", "write"]),
      allow.resource(createGif).to(["write"]),
    ],
  }),
});
