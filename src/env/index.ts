import { z } from "zod";
import {config} from "dotenv";

if(process.env.NODE_ENV === "test"){
    config({ path : ".env.test" })
}else{
    config()
}

const envSchema = z.object({
    NODE_ENV : z.enum(["development", "test", "production"]).default("production"),
    DATABASE_URL : z.string(),
    PORT : z.number().default(3333),
})

const _env = envSchema.safeParse(process.env);
if(_env.success === false){
    console.error("Invalid enviroment variables", _env.error.format());
    throw new Error("Invalid enviroment variables");
}

export const env = _env.data;