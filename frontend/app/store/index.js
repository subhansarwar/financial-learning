// app/store/index.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

import userReducer from "./slices/user/userSlice";
import commonReducer from "./slices/common/commonSlice";
import courseReducer from "./slices/courses/courseSlice";
import adminCoursesReducer from "./admin/adminCourses/adminCoursesSlice";
import websiteCourseReducer from "./website/websiteCourseSlice";
import caseStudiesReducer from "./admin/caseStudy/caseStudiesSlice";


// ============================================
// SSR-SAFE STORAGE
// ============================================

const createNoopStorage = () => {
    return {
        getItem() {
            return Promise.resolve(null);
        },

        setItem(_key, value) {
            return Promise.resolve(value);
        },

        removeItem() {
            return Promise.resolve();
        },
    };
};

const storage =
    typeof window !== "undefined"
        ? createWebStorage("local")
        : createNoopStorage();

// ============================================
// PERSIST CONFIGURATIONS
// ============================================

const userPersistConfig = {
    key: "user",
    storage,
    whitelist: ["user", "isAuthenticated", "preferences", "stats"],
};

const commonPersistConfig = {
    key: "common",
    storage,
    whitelist: [],
};

const coursePersistConfig = {
    key: "courses",
    storage,
    whitelist: ["courses", "initialized"],
};

const adminCoursesPersistConfig = {
    key: "adminCourses",
    storage,
    whitelist: ["courses", "pagination"],
};

const websiteCoursePersistConfig = {
    key: "websiteCourse",
    storage,
    whitelist: ["courses", "currentCourse", "topics", "pagination", "filters", "certificate"],
};

const caseStudiesPersistConfig = {
    key: "caseStudies",
    storage,
    whitelist: ["caseStudies", "pagination"],
};

// ============================================
// PERSISTED REDUCERS
// ============================================

const persistedUserReducer = persistReducer(userPersistConfig, userReducer);
const persistedCommonReducer = persistReducer(commonPersistConfig, commonReducer);
const persistedCourseReducer = persistReducer(coursePersistConfig, courseReducer);
const persistedAdminCoursesReducer = persistReducer(adminCoursesPersistConfig, adminCoursesReducer);
const persistedWebsiteCourseReducer = persistReducer(websiteCoursePersistConfig, websiteCourseReducer);
const persistedCaseStudiesReducer = persistReducer(caseStudiesPersistConfig, caseStudiesReducer);



// ============================================
// ROOT REDUCER
// ============================================

const rootReducer = combineReducers({
    user: persistedUserReducer,
    common: persistedCommonReducer,
    courses: persistedCourseReducer,
    adminCourses: persistedAdminCoursesReducer,
    websiteCourse: persistedWebsiteCourseReducer,
    caseStudies: persistedCaseStudiesReducer,
});

// ============================================
// STORE CONFIGURATION
// ============================================

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
    devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);