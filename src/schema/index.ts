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

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const ProductSchema = z.object({
    title: z.string({message: "Enter valid title"}).min(1, "Title is required"),

    product_tag: z.string({
        message: "Enter valid product_tag"
}).min(1, "Product tag is required"),

    dealer: z.string({
        message: "Enter valid dealer"
}).optional(),

    description: z.string({
        message: "Enter valid description"
}).optional(),

    company: z.string({
        message: "Enter valid company"
}).optional(),
images: z
.array(z.instanceof(File))
.max(10, "You can upload up to 10 images only")
.refine(
  (files) => files.every(file => file.size <= MAX_FILE_SIZE),
  "Each image must be less than 5MB."
)
.refine(
  (files) => files.every(file => ACCEPTED_IMAGE_MIME_TYPES.includes(file.type)),
  "Only .jpg, .jpeg, .png, and .webp formats are supported."
),
  });