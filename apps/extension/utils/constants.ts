export const BASE_URL = import.meta.env.DEV
  ? "http://localhost:3000"
  : "https://trackit.visualbrahma.tech";

export const buildApiUrl = (path: string) => {
  if (path.startsWith("/")) {
    return `${BASE_URL}/api${path}`;
  }
  return `${BASE_URL}/api/${path}`;
};
