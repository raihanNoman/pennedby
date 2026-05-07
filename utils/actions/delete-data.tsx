import { client } from "../aws";

export async function deleteProfile(userID: string) {
  try {
    await client.models.User.update({
      id: userID,
      name: "Deleted User",
      picture: "",
    });
  } catch (e) {
    console.warn("User profile already deleted or missing", e);
  }
}

/**
 * sheikh can only be deleted by admins and team
 * create admin tasks for this
 */
export async function deletePersonalState(userID: string) {
  const results = await Promise.allSettled([
    client.models.User.delete({ id: userID }),
  ]);

  // optional: log failures for debugging
  results.forEach((r, i) => {
    if (r.status === "rejected") {
      console.warn("Delete failed:", i, r.reason);
    }
  });
}
