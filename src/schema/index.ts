import * as z from 'zod';

export const SignUpSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address"
    }),
    username: z.string().min(1, {
        message: "Please enter your name"
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters long"
    })
})

export const LoginSchema = z.object({
    username: z.string({
        message: "Enter valid username"
}),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters long"
})
})