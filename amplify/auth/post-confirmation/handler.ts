import { env } from "$amplify/env/post-confirmation";
import { getAmplifyDataClientConfig } from "@aws-amplify/backend/function/runtime";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import type { PostConfirmationTriggerHandler } from "aws-lambda";
import { type Schema } from "../../data/resource";

const { resourceConfig, libraryOptions } =
  await getAmplifyDataClientConfig(env);
Amplify.configure(resourceConfig, libraryOptions);
const client = generateClient<Schema>();

/**
 * following
 *  @ref https://docs.amplify.aws/react-native/build-a-backend/functions/examples/create-user-profile-record/
 */

export const handler: PostConfirmationTriggerHandler = async (event) => {
  try {
    const { userAttributes } = event.request;
    console.log("🟢 cognito sub", userAttributes.sub);

    const name =
      userAttributes.preferred_username ||
      userAttributes.name ||
      userAttributes.email?.split("@")[0] ||
      "New User";

    const { data, errors } = await client.models.User.create({
      id: userAttributes.sub,
      name,
    });

    if (errors) {
      console.log("graphql err", data);
      throw "could not create user on post confirmation";
    }
    console.log("✅✅ post-confirmation", data?.id);
  } catch (e) {
    console.log("❌ post-confirmation function", e);
  }

  return event;
};
