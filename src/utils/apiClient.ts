/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import axios from "axios";

// Centralized Axios instance targeting the express server endpoints
export const apiClient = axios.create({
  baseURL: "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for standard error unwrapping
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || "An unexpected network error occurred.";
    console.error("[apiClient Error]:", message);
    return Promise.reject(new Error(message));
  }
);
