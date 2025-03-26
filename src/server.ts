import fastify from "fastify"; 
import { env } from "./env";
import { transitionRoutes } from "./routes/transitions";

const app = fastify();

app.register(transitionRoutes, {
    prefix : "transactions"
})

app.listen({
    port : env.PORT,
}).then(() => {
    console.log("Server Running!!");
});