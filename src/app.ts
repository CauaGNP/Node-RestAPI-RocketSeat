import fastify from "fastify";
import cookie from "@fastify/cookie"; 
import { transitionRoutes } from "./routes/transitions";

export const app = fastify();

app.register(cookie);
app.register(transitionRoutes, {
    prefix : "transactions"
})
