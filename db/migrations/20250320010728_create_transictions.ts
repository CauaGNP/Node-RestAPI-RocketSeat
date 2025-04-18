import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("transictions", (table) => {
        table.uuid("id").primary();
        table.text("title").notNullable();
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("transictions")
}

