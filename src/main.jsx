import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter } from "react-router-dom";
import { LazyMotion, domAnimation } from "framer-motion";

import { ApiProvider } from "@reduxjs/toolkit/query/react";
import { tmdbApi } from "./services/TMDB";
import GlobalContextProvider from "./context/globalContext";
import ThemeProvider from "./context/themeContext";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App";
import "./index.css";

const queryClient = new QueryClient();
const PUBLIC_URL = "https://shinyoonha.github.io/moon-cinema/";

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter basename={PUBLIC_URL}>
      <ApiProvider api={tmdbApi}>
        <ThemeProvider>
          <GlobalContextProvider>
            <LazyMotion features={domAnimation}>
              <App />
            </LazyMotion>
          </GlobalContextProvider>
        </ThemeProvider>
      </ApiProvider>
    </BrowserRouter>
  </QueryClientProvider>
);
