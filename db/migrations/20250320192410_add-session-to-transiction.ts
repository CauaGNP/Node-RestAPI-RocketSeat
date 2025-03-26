import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable("transictions", (table) => {
        table.decimal("amount", 10,2).notNullable();
        table.timestamp("create-at").defaultTo(knex.fn.now()).notNullable();
        table.uuid("session_id").after("id").index();
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable( "transictions", (table) => {
        table.dropColumn("session_id");
        table.dropColumn("amount");
        table.dropColumn("create-at");
    });
}

