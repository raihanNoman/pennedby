import * as SecureStore from "expo-secure-store";

enum Keys {
  email = "email",
  password = "password",
}

async function saveCredentials(email: string, password: string) {
  const isAvailable = await SecureStore.isAvailableAsync();
  if (!isAvailable) throw "Secure store is unavailable";

  await SecureStore.setItemAsync(Keys.email, email);
  await SecureStore.setItemAsync(Keys.password, password);
  console.log("secure store: Login credentials saved");
}

async function deleteCredentials() {
  try {
    await SecureStore.deleteItemAsync(Keys.email);
    await SecureStore.deleteItemAsync(Keys.password);
    console.log("secure store: deleted login credentials ");
  } catch (e) {
    console.error(deleteCredentials.name, e);
  }
}

async function getCredentials() {
  const email = await SecureStore.getItemAsync(Keys.email);
  const password = await SecureStore.getItemAsync(Keys.password);
  if (typeof email === "string" && typeof password === "string") {
    return { email, password };
  } else throw "no previously saved user";
}

const secureStore = { saveCredentials, deleteCredentials, getCredentials };
export default secureStore;
export { Keys as SecureStoreKeys };
