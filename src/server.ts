import fastify from "fastify"; 
// import { knexInstance } from "./database";
import { env } from "./env";
// import crypto from "node:crypto";


const app = fastify();

app.get("/users", async () => {

    // const transactions = await knexInstance("transictions").where("amount" , 1000).select("*");

    // return transactions;

    // const transactions = await knexInstance("transictions").insert({
    //     id : crypto.randomUUID(),
    //     title : "Transação teste",
    //     amount : 1000,
    // }).returning("*");

    // return transactions
});

app.listen({
    port : env.PORT,
}).then(() => {
    console.log("Server Running!!");
});