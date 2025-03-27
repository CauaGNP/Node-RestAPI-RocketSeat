import { FastifyInstance } from "fastify";
import { z } from "zod";
import { randomUUID } from "node:crypto"
import { knexInstance } from "../database"; 
import { checkSessionExist } from "../middleware/check-session-id-exist";
import { request } from "node:http";

export async function transitionRoutes(app : FastifyInstance) {
    app.get("/",{
        preHandler : [checkSessionExist],
    },async (request, reply ) => {
        const { session_id } = request.cookies; 
        const transactions = await knexInstance("transictions").where("session_id", session_id).select();

        return { transactions };
    });

    app.get("/:id",{
        preHandler : [checkSessionExist]
    },async (request) => {
        const getTransactionsParamsSchema = z.object({
            id : z.string().uuid(),
        })

        const { id } = getTransactionsParamsSchema.parse(request.params);
        const { session_id } = request.cookies;

        const transactions = await knexInstance("transictions").where({
            id,
            "session_id" : session_id,
        }).first();
        return { transactions };
    });

    app.get("/summary",{
        preHandler : [checkSessionExist]
    },async (request)=> {
        const { session_id } = request.cookies;
        const sumary = await knexInstance("transictions").where("session_id", session_id).sum("amount", { as : "amount" }).first();

        return { sumary };
    });

    app.post("/", async (request, reply) => {
        const createTransacrionBodySchema = z.object({
            title : z.string(),
            amount : z.number(), 
            type : z.enum(["credit", "debit"]),
        });

        const { title, amount, type } = createTransacrionBodySchema.parse(request.body);

        let sessionId = request.cookies.sessionId;

        if(!sessionId){
            sessionId = randomUUID();
            reply.cookie("sessionId", sessionId, {
                path : "/",
                maxAge : 60 * 60 * 24 * 7, ///7 days
            });
        }

        await knexInstance("transictions").insert({
            id : randomUUID(),
            title,
            amount : type === "credit" ? amount : amount * -1,
            session_id : sessionId,
        });

        return reply.code(201).send();
    });
}