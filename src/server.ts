import fastify from "fastify"; 
import { knexInstance } from "./database";

const app = fastify();

app.get("/users", async () => {
    const tables = await knexInstance("sqlite_schema").select("*");
    return tables;
});

app.listen({
    port : 3333
}).then(() => {
    console.log("Server Running!!");
});