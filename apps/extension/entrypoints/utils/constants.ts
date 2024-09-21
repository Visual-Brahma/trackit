export const API_URL = import.meta.env.DEV
  ? "http://localhost:3000/api"
  : "https://trackit.visualbrahma.tech/api";

export const buildUrl = (path: string) => {
  if (path.startsWith("/")) {
    return `${API_URL}${path}`;
  }
  return `${API_URL}/${path}`;
};
