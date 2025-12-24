const BASE_URL = "https://assessment.ksensetech.com/api";

const MAX_RETRIES = 3;
const BASE_BACKOFF_MS = 300;

const RETRY_STATUS_CODES = new Set([429, 500, 503]);

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getApiKey(): string {
  const apiKey = process.env.KSENSE_API_KEY;
  if (!apiKey) {
    throw new Error("Missing KSENSE_API_KEY environment variable.");
  }
  return apiKey;
}

async function fetchWithRetry(
  input: RequestInfo,
  init?: RequestInit,
  retries = MAX_RETRIES,
): Promise<Response> {
  let attempt = 0;
  let lastError: unknown;

  while (attempt <= retries) {
    try {
      const response = await fetch(input, init);
      if (!response.ok && RETRY_STATUS_CODES.has(response.status)) {
        throw new Error(`Retryable status: ${response.status}`);
      }

      return response;
    } catch (error) {
      lastError = error;

      if (attempt === retries) {
        break;
      }

      const backoff = BASE_BACKOFF_MS * Math.pow(2, attempt);
      await sleep(backoff);

      attempt += 1;
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Request failed.");
}

export async function fetchUsers(): Promise<unknown> {
  const apiKey = getApiKey();
  const response = await fetchWithRetry(`${BASE_URL}/patients`, {
    headers: {
      "x-api-key": apiKey,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch users (status ${response.status}).`);
  }

  return response.json();
}
