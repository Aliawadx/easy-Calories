import { email, z} from "zod"

export const registerSchema  = z.object({
    userName: z.string()
    .min(3,"Username must be at least 3 characters").max(30,).trim(),

    email: z.string().email("email must be valid").trim().toLowerCase(),
    
    password:z.string().min(6,"Password must be at least 6 characters").trim()
})





export const loginSchema = z.object({
    email: z.string().email("email must be valid").toLowerCase().trim(),


    password:z.string().min(6,"Password must be at least 6 characters").trim()
    
})