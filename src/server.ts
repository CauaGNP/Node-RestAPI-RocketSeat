import fastify from "fastify";
import cookie from "@fastify/cookie"; 
import { env } from "./env";
import { transitionRoutes } from "./routes/transitions";

const app = fastify();

app.register(cookie);
app.register(transitionRoutes, {
    prefix : "transactions"
})

app.listen({
    port : env.PORT,
}).then(() => {
    console.log("Server Running!!");
});