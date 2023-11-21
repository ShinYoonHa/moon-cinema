let backendHost;

const hostname = window && window.location && window.location.hostname;

if (hostname === "localhost") {
  backendHost = "https://172.30.74.17:8080";
}

export const API_BASE_URL = "https://172.30.74.17:8080";
