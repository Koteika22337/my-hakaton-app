import { mockBack } from "./mockBack";

export async function getServerByName(name) {
  const found = mockBack.find((server) => server.name === name);
  return found || null;
}
