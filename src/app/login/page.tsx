"use client";
import GoogleSignIn from "@/components/ui/googlesignin";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useChatStore } from "@/lib/store";

const LoginPage = () => {
  const router = useRouter();
  const { isLoggedIn } = useChatStore();

  useEffect(() => {
    // Redirect to home if the user is already logged in
    if (isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="absolute top-6 left-6">
        <button
          onClick={() => router.push("/")}
          className="
      flex items-center 
      text-gray-600 
      hover:text-gray-900 
      transition-colors 
      group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2 group-hover:-translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span className="font-medium">Back</span>
        </button>
      </div>
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02]">
        <div className="p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
              Sign up
            </h2>
            <p className="text-gray-500 text-sm">Se connecter avec google</p>
          </div>

          <div className="space-y-4">
            {/* Google Sign-In Button */}
            <div className="w-full justify-center flex items-center">
              <GoogleSignIn />
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500 mt-4">
                By continuing, you agree to our{" "}
                <a
                  href="/terms"
                  className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="/conditions"
                  className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
                >
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
