// lib/validations/user.ts
import { z } from "zod";

// Schema untuk validasi
export const userSchema = z.object({
  id: z.number().optional(),
  email: z.string().email("Email tidak valid").min(1, "Email wajib diisi"),
  name: z.string().min(1, "Nama wajib diisi").max(100, "Nama terlalu panjang"),
  password: z
    .string()
    .min(6, "Password minimal 6 karakter")
    .max(100, "Password terlalu panjang")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password harus mengandung huruf besar, huruf kecil, dan angka"
    )
    .optional()
    .or(z.literal("")),
  role: z.enum(["user", "admin"]).default("user"),
});

export const createUserSchema = userSchema.omit({ id: true }).extend({
  password: z
    .string()
    .min(6, "Password minimal 6 karakter")
    .max(100, "Password terlalu panjang")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password harus mengandung huruf besar, huruf kecil, dan angka"
    ),
});

export const updateUserSchema = userSchema
  .omit({ id: true })
  .partial()
  .extend({
    password: z
      .string()
      .min(6, "Password minimal 6 karakter")
      .max(100, "Password terlalu panjang")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password harus mengandung huruf besar, huruf kecil, dan angka"
      )
      .optional()
      .or(z.literal("")),
  });

export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Password saat ini wajib diisi"),
    newPassword: z
      .string()
      .min(6, "Password baru minimal 6 karakter")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password harus mengandung huruf besar, huruf kecil, dan angka"
      ),
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password baru dan konfirmasi tidak cocok",
    path: ["confirmPassword"],
  });

// Type inference
export type UserInput = z.infer<typeof userSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

// Validation middleware
export const validateUserData = (data: unknown) => {
  return createUserSchema.safeParse(data);
};

export const validateUpdateUserData = (data: unknown) => {
  return updateUserSchema.safeParse(data);
};