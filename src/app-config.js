let backendHost;

const hostname = window && window.location && window.location.hostname;

if (hostname === "localhost") {
  backendHost = "http://172.30.74.17:8080";
}

export const API_BASE_URL = "http://172.30.74.17:8080";
