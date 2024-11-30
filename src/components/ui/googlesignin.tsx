"use client";
import { useChatStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const GoogleSignIn: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const { setUserToken, setUserData, setIsLoggedIn } = useChatStore();
  const router = useRouter();
  const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;

  useEffect(() => {
    // Load the Google script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id:
            "508045256314-mos8at9ampfv6ude20iv0udapi0j3efv.apps.googleusercontent.com",
          callback: handleCredentialResponse,
        });

        window.google.accounts.id.renderButton(
          document.getElementById("google-signin-button") as HTMLElement,
          {
            theme: "outline",
            size: "large",
          }
        );
      }
    };

    return () => {
      // Remove the script when the component unmounts
      document.body.removeChild(script);
    };
  }, []);

  const handleCredentialResponse = (
    response: google.accounts.id.CredentialResponse
  ) => {
    // console.log("Encoded JWT ID token: ", response.credential);
    
    // Send the token to the backend
    fetch(`${apiEndpoint}/auth/google/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ access_token: response.credential }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("", data);
        //storing it in the Zustand store
        setUserToken({
          key: data.key,
          google_token: response.credential, 
        });
        setIsLoggedIn(true);
        
        
        // page refresh
        router.refresh();
      })
      .catch((error) => {
        console.error("Error during authentication:", error);
      });


      fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${response.credential}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          // console.log("User Data acquired:", data);
          //storing it in the Zustand store
          setUserData({
            userId: data.sub, // Assuming `sub` is the unique user ID provided by Google
            firstname: data.given_name,
            lastname: data.family_name,
            email: data.email,
            profilePicture: data.picture, 
          });
          
          // page refresh
          router.refresh();
        })
        .catch((error) => {
          console.error("Error during authentication:", error);
        });

  };

  const handleAcceptAndContinue = () => {
    if (isTermsChecked) {
      setShowModal(false);

      // Programmatically click the Google Sign-In button
      const googleButton = document.getElementById("google-signin-button");
     
      if (googleButton) {
        console.log("Button clicked");
        googleButton.click();
        setShowModal(false);
      }
    }
  };

  return (
    <>
      {/* Invisible layer to trigger modal 
      onClick={() => setShowModal(true)}
      */}

      <div >
        <div id="google-signin-button" style={{ display: "block" }}></div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md mx-4 rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h2 className="text-xl font-bold text-gray-800">
                Terms & Privacy
              </h2>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <p className="text-gray-600 text-sm leading-relaxed">
                Before you continue, please review and accept our{" "}
                <a
                  href="/conditions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Terms of Use
                </a>{" "}
                and{" "}
                <a
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Privacy Policy
                </a>
                .
              </p>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="terms-checkbox"
                  checked={isTermsChecked}
                  onChange={() => setIsTermsChecked(!isTermsChecked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="terms-checkbox"
                  className="ml-2 block text-sm text-gray-900"
                >
                  I have read and agree to the Terms and Privacy Policy
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAcceptAndContinue}
                disabled={!isTermsChecked}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Accept and Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GoogleSignIn;
