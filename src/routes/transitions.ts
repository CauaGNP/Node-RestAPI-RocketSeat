import { FastifyInstance } from "fastify";
import { z } from "zod";
import { randomUUID } from "node:crypto"
import { knexInstance } from "../database"; 

export async function transitionRoutes(app : FastifyInstance) {
    app.get("/", async () => {
        const transactions = await knexInstance("transictions").select();

        return { transactions };
    });

    app.get("/:id", async (request) => {
        const getTransactionsParamsSchema = z.object({
            id : z.string().uuid(),
        })

        const { id } = getTransactionsParamsSchema.parse(request.params);

        const transactions = await knexInstance("transictions").where("id", id).first();
        return { transactions };
    });

    app.get("/summary", async ()=> {
        const sumary = await knexInstance("transictions").sum("amount", { as : "amount" }).first();

        return { sumary };
    });

    app.post("/", async (request, reply) => {
        const createTransacrionBodySchema = z.object({
            title : z.string(),
            amount : z.number(), 
            type : z.enum(["credit", "debit"]),
        });

        const { title, amount, type } = createTransacrionBodySchema.parse(request.body);

        await knexInstance("transictions").insert({
            id : randomUUID(),
            title,
            amount : type === "credit" ? amount : amount * -1,
        });

        return reply.code(201).send();
    });
}