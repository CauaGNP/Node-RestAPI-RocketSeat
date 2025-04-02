import { app } from "../src/app";
import { expect, it, beforeAll, beforeEach,afterAll, describe } from "vitest";
import request from "supertest";
import { execSync } from "child_process";

describe("Transactions Routes",() => {
    beforeAll(async () => {
        await app.ready();
    })

    afterAll(async () =>{
        await app.close();
    })

    beforeEach(async () => {
        execSync("npm run knex migrate:rollback --all");
        execSync("npm run knex migrate:latest");
    })

    it("Shoud be able to create transactions", async () => {
        await request(app.server).post("/transactions").send({
            title : "New transaction",
            amount : 5000,
            type : "credit",
        }).expect(201)
    })

    it("Shoud be able to list transactions", async() => {
        const createTransactionsResponse =  await request(app.server)
            .post("/transactions").send({
                title : "New transaction",
                amount : 5000,
                type : "credit",
            })

        const cookies = createTransactionsResponse.get("Set-Cookie") ?? [];
        console.log(cookies)
        
        const listTransactionsResponse = await request(app.server)
            .get("/transactions")
            .set('Cookie', cookies)
            .expect(200)

            expect(listTransactionsResponse.body.transactions).toEqual([
                expect.objectContaining({
                   title : "New transaction",
                   amount : 5000,
                })
           ])
    })

    it("Shoud be able to get a specifc transaction", async () => {
        const createTransactionsResponse =  await request(app.server)
        .post("/transactions").send({
            title : "New transaction",
            amount : 5000,
            type : "credit",
        })

        const cookies = createTransactionsResponse.get("Set-Cookie") ?? [];
        
        const listTransactionsResponse = await request(app.server)
            .get("/transactions")
            .set('Cookie', cookies)
            .expect(200)

        const transactionId = listTransactionsResponse.body.transactions[0].id;

        const getTransactionResponse = await request(app.server)
            .get(`/transactions/${transactionId}`)
            .set('Cookie', cookies)
            .expect(200)

            expect(getTransactionResponse.body.transaction).toEqual(
                expect.objectContaining({
                    title: "New transaction",
                    amount: 5000,
                })
            )
    })

    it("Should be able to get a summary", async () => {
        const createTransactionsResponse = await request(app.server)
            .post("/transactions")
            .send({
                title: "Credit transaction",
                amount: 5000,
                type: "credit",
            });
    
        const cookies = createTransactionsResponse.get("Set-Cookie") ?? []; 
    
        await request(app.server)
            .post("/transactions")
            .set("Cookie", cookies)
            .send({
                title: "Debit transaction",
                amount: 2000,
                type: "debit",
            });
    
        const listTransactionsResponse = await request(app.server)
            .get("/transactions")
            .set("Cookie", cookies)
            .expect(200);
    
        console.log("Transactions Response:", listTransactionsResponse.body);
    
        const transactionId = listTransactionsResponse.body.transactions[0].id;
    
        if (!transactionId) {
            throw new Error("Transaction ID not found. Check the response structure.");
        }
    
        const getSummaryResponse = await request(app.server)
            .get("/transactions/summary")
            .set("Cookie", cookies)
            .expect(200);
    
        console.log("Summary Response:", getSummaryResponse.body);
    
        expect(getSummaryResponse.body.sumary).toEqual({
            amount: 3000,
        });
    });
})