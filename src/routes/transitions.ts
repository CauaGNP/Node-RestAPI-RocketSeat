import { FastifyInstance } from "fastify";
import { z } from "zod";
import { randomUUID } from "node:crypto"
import { knexInstance } from "../database"; 
import { checkSessionExist } from "../middleware/check-session-id-exist";

export async function transitionRoutes(app : FastifyInstance) {
    app.get("/",{
        preHandler : [checkSessionExist],
    },async (request) => {
        const sessionId = request.cookies.sessionId;  
        const transactions = await knexInstance("transictions").where("session_id", sessionId).select();
        
        return { transactions };
    });

    app.get("/:id",{
        preHandler : [checkSessionExist],
    },async (request) => {
        const getTransactionsParamsSchema = z.object({
            id : z.string().uuid(),
        })

        const { id } = getTransactionsParamsSchema.parse(request.params);
        const { sessionId } = request.cookies;

        const transaction = await knexInstance("transictions").where({
            session_id : sessionId,
            id,
        }).first();

        return { transaction };
    });

    app.get("/summary",{
        preHandler : [checkSessionExist]
    },async (request)=> {
        const { sessionId } = request.cookies;
        const sumary = await knexInstance("transictions").where("session_id", sessionId).sum("amount", { as : "amount" }).first();

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