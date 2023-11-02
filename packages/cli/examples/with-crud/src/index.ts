import { App } from "@flare-city/core";
import { RoutePost } from "./features";

// Declare a new application
export const API = new App("with-crud");

// Add routes
API.addRoute(RoutePost);

// Start the API
export default API.start();
