import express from 'express';
import dotenv from 'dotenv';
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from './lib/db.js';
import dns from "node:dns/promises";
import cookieParser from 'cookie-parser';
import cors from 'cors'; //to enable Cross-Origin Resource Sharing (CORS) in the application, allowing it to handle requests from different origins (domains) and enabling communication between the frontend and backend when they are hosted on different domains or ports.


dns.setServers(["8.8.8.8", "1.1.1.1"]); //to set the DNS servers for the application to use when resolving domain names. By specifying Google's public DNS server (8.8.8.8) and Cloudflare's public DNS server (1.1.1.1), the application can resolve domain names more reliably.

dotenv.config(); //to load environment variables from a .env file into process.env, allowing the application to access configuration settings such as database connection strings, API keys, and other sensitive information securely without hardcoding them in the source code. This is a common practice to manage configuration in Node.js applications and keep sensitive data out of the codebase.
const app = express(); //to create an instance of the Express application, which will be used to define routes, middleware, and start the server. The app variable represents the main application object that will handle incoming HTTP requests and send responses back to clients.


const PORT = process.env.PORT //to define a constant named PORT that retrieves the value of the PORT environment variable. This allows the application to listen on a specific port defined in the environment configuration, making it flexible and adaptable to different deployment environments where the port number may vary. If the PORT environment variable is not set, it will be undefined, and the application may need to handle this case by providing a default port or throwing an error.
app.use(express.json()) // Middleware to parse JSON request bodies, to extract the json data from the body 
app.use(cookieParser()); // Middleware to parse cookies from incoming requests, to extract the cookies from the request headers and make them available in the req.cookies object for further processing in the application.
app.use(cors({ //to configure CORS settings for the application, allowing it to handle cross-origin requests from the specified origin and enabling credentials to be included in those requests.
  origin: "http://localhost:5173", //to specify the allowed origin for cross-origin requests, allowing only requests from http://localhost:5173 to access the resources of the backend server. This is important for security reasons to prevent unauthorized access from other origins.
  credentials: true, //to allow cookies and other credentials to be included in cross-origin requests, enabling the frontend application to send authentication tokens or session cookies along with requests to the backend server, which is necessary for maintaining user sessions and authentication state across different origins.
}))

app.use("/api/auth", authRoutes) //to mount the authRoutes router on the /api/auth path, meaning that any requests to endpoints starting with /api/auth will be handled by the routes defined in the authRoutes module. This allows for better organization of routes related to authentication and keeps the main application file cleaner by delegating route handling to separate modules.
app.use("/api/messages", messageRoutes) //to mount the messageRoutes router on the /api/messages path, meaning that any requests to endpoints starting with /api/messages will be handled by the routes defined in the messageRoutes module. This allows for better organization of routes related to messaging functionality and keeps the main application file cleaner by delegating route handling to separate modules.


app.listen(PORT, () => {
  console.log('Server is running on PORT:', PORT);
  connectDB();
});