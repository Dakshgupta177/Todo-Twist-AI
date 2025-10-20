import z from "zod";

export const signupSchemaValidation = z.object({
    username: z.string().min(4,{message:"Min Length for user name is 4"}),
    email: z.string().email({message:"Email is invalid"}),
    password: z.string().min(6,{message:"Password should be greater than 6 letters"})
})