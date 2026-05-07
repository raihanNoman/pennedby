import { defineFunction } from "@aws-amplify/backend";

/**
 * following
 *  @ref https://docs.amplify.aws/react-native/build-a-backend/functions/examples/create-user-profile-record/
 */

export const postConfirmation = defineFunction({
  name: "post-confirmation",
  resourceGroupName: "auth",
  // environment: {
  //   ADMIN_EMAIL: "support@quran600.com",
  // },
});
