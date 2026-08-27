// app/components/googleLogin/GoogleLogin.jsx
"use client";

import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useAppDispatch } from "../../store/hooks";
import { googleLogin } from "../../store/slices/user/userThunks";
import toast from "react-hot-toast";

const CLIENT_ID = "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";

export default function GoogleLoginButton({ isLoading, setIsLoading }) {
    const dispatch = useAppDispatch();

    const handleSuccess = async (credentialResponse) => {
        setIsLoading(true);
        try {
            const idToken = credentialResponse.credential;
            await dispatch(googleLogin(idToken)).unwrap();
            // Success handled in useEffect of LoginComp
        } catch (error) {
            // Error handled in thunk
        } finally {
            setIsLoading(false);
        }
    };

    const handleError = () => {
        toast.error("Google login failed. Please try again.");
        setIsLoading(false);
    };

    return (
        <GoogleOAuthProvider clientId={CLIENT_ID}>
            <div className="flex w-full justify-center">
                <GoogleLogin
                    onSuccess={handleSuccess}
                    onError={handleError}
                    theme="none"
                    size="large"
                    width="100%"
                    text="signin_with"
                    shape="square"
                    logo_alignment="center"
                    containerProps={{
                        style: {
                            borderRadius: '10px',  // Reduced radius
                            border: 'none',       // Removed outline/border
                        }
                    }}
                />
            </div>
        </GoogleOAuthProvider>
    );
}