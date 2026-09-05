const BASE_URL =
  "https://raw.githubusercontent.com/dinu006/disxcity-data/main";

const cache = new Map();

async function fetchJson(path) {
  const url = path.startsWith("http")
    ? path
    : `${BASE_URL}/${path}`;

  if (cache.has(url)) {
    return cache.get(url);
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Unable to load data (${response.status})`);
  }

  const data = await response.json();

  cache.set(url, data);

  return data;
}

export async function getNcertIndex() {
  return fetchJson("ncert.json");
}

export async function getPyqIndex() {
  return fetchJson("pyq.json");
}

export async function getNcertChapter(filePath) {
  return fetchJson(filePath);
}

export async function getPyqPaper(filePath) {
  return fetchJson(filePath);
}