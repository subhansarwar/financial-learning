// app/validations/authValidation.js
import * as yup from "yup";
import { commonRules } from "./commonValidation";

// ============================================
// LOGIN VALIDATION SCHEMA
// ============================================

export const loginSchema = yup.object({
    email: commonRules.email,
    password: commonRules.password,
});

// ============================================
// REGISTER VALIDATION SCHEMA
// ============================================

export const signupSchema = yup.object().shape({
    full_name: yup
        .string()
        .min(2, "Full name must be at least 2 characters")
        .max(50, "Full name cannot exceed 50 characters")
        .required("Full name is required")
        .matches(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),
    email: yup
        .string()
        .email("Please enter a valid email address")
        .required("Email is required"),
    password: yup
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(32, "Password cannot exceed 32 characters")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        )
        .required("Password is required"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password"), null], "Passwords must match")
        .required("Please confirm your password"),
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
    email: yup
        .string()
        .trim()
        .email("Please enter a valid email address")
        .required("Email is required"),
    code: yup
        .string()
        .trim()
        .required("Verification code is required")
        .min(4, "Code must be at least 4 characters")
        .max(8, "Code cannot exceed 8 characters")
        .matches(/^\d+$/, "Code must contain only numbers"),
    new_password: yup
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(32, "Password cannot exceed 32 characters")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        )
        .required("New password is required"),
    confirm_password: yup
        .string()
        .required("Please confirm your new password")
        .oneOf([yup.ref("new_password"), null], "Passwords must match"),
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