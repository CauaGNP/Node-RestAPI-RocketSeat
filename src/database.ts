import knex from "knex"; 

export const knexInstance = knex({
    client : "sqlite",
    connection : {
        filename : "./tmp/app.db",
    }
})