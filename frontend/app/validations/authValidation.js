// app/validations/authValidation.js
import * as yup from "yup";
import { commonRules } from "./commonValidation";

// ============================================
// LOGIN VALIDATION SCHEMA
// ============================================

export const loginSchema = yup.object({
    name: yup
        .string()
        .required("Name is required")
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must be at most 50 characters")
        .trim()
        .matches(/^[a-zA-Z\s-']+$/, "Name can only contain letters, spaces, hyphens, and apostrophes"),
    email: commonRules.email,
    password: commonRules.password,
});

// ============================================
// REGISTER VALIDATION SCHEMA
// ============================================

export const registerSchema = yup.object({
    name: commonRules.name,
    email: commonRules.email,
    password: commonRules.password,
    confirmPassword: commonRules.confirmPassword,
    terms: yup
        .boolean()
        .required("You must accept the terms and conditions")
        .oneOf([true], "You must accept the terms and conditions"),
});

// ============================================
// FORGOT PASSWORD VALIDATION SCHEMA
// ============================================

export const forgotPasswordSchema = yup.object({
    email: commonRules.email,
});

// ============================================
// RESET PASSWORD VALIDATION SCHEMA
// ============================================

export const resetPasswordSchema = yup.object({
    password: commonRules.password,
    confirmPassword: commonRules.confirmPassword,
});

// ============================================
// CHANGE PASSWORD VALIDATION SCHEMA
// ============================================

export const changePasswordSchema = yup.object({
    currentPassword: yup
        .string()
        .required("Current password is required"),
    newPassword: commonRules.password,
    confirmNewPassword: yup
        .string()
        .required("Please confirm your new password")
        .oneOf([yup.ref("newPassword"), null], "Passwords must match"),
});