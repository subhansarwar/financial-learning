// app/validations/commonValidation.js
import * as yup from "yup";

// ============================================
// COMMON VALIDATION RULES
// ============================================

export const commonRules = {
    // Email validation
    email: yup
        .string()
        .required("Email is required")
        .email("Please enter a valid email address")
        .max(100, "Email must be at most 100 characters")
        .trim()
        .lowercase(),

    // Password validation
    password: yup
        .string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters")
        .max(50, "Password must be at most 50 characters")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            "Password must contain at least one uppercase, one lowercase, and one number"
        ),

    // Confirm password validation
    confirmPassword: yup
        .string()
        .required("Please confirm your password")
        .oneOf([yup.ref("password"), null], "Passwords must match"),

    // Name validation
    name: yup
        .string()
        .required("Name is required")
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must be at most 50 characters")
        .trim()
        .matches(/^[a-zA-Z\s-']+$/, "Name can only contain letters, spaces, hyphens, and apostrophes"),

    // Username validation
    username: yup
        .string()
        .required("Username is required")
        .min(3, "Username must be at least 3 characters")
        .max(30, "Username must be at most 30 characters")
        .matches(
            /^[a-zA-Z0-9_]+$/,
            "Username can only contain letters, numbers, and underscores"
        )
        .trim()
        .lowercase(),

    // Phone validation
    phone: yup
        .string()
        .required("Phone number is required")
        .matches(
            /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
            "Please enter a valid phone number"
        ),

    // URL validation
    url: yup
        .string()
        .url("Please enter a valid URL")
        .nullable()
        .optional(),

    // Number validation
    number: yup
        .number()
        .typeError("Must be a number")
        .positive("Must be a positive number")
        .integer("Must be an integer")
        .nullable()
        .optional(),

    // Percentage validation (0-100)
    percentage: yup
        .number()
        .typeError("Must be a number")
        .min(0, "Must be at least 0")
        .max(100, "Must be at most 100")
        .required("Percentage is required"),

    // Date validation
    date: yup
        .date()
        .typeError("Please enter a valid date")
        .required("Date is required")
        .min(new Date(1900, 0, 1), "Date must be after 1900")
        .max(new Date(), "Date cannot be in the future"),

    // Boolean validation
    boolean: yup
        .boolean()
        .required("Please select an option"),

    // Array validation
    array: yup
        .array()
        .min(1, "Please select at least one option")
        .required("Please select at least one option"),

    // File validation
    file: yup
        .mixed()
        .required("File is required")
        .test("fileSize", "File is too large (max 5MB)", (value) => {
            if (!value) return true;
            return value.size <= 5 * 1024 * 1024;
        })
        .test("fileType", "Unsupported file format", (value) => {
            if (!value) return true;
            const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
            return allowedTypes.includes(value.type);
        }),
};