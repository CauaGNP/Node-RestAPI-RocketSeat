import knex from "knex";
import { string } from "zod";

declare module "knex/types/tables"{
    export interface Tables{
        transictions : {
            id : string
            title : string
            amount : number
            'create-at' : string
            session_id ?: string 
        }
    }
}