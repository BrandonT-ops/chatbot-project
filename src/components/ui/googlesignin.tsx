"use client"
import { useEffect } from "react";

const GoogleSignIn: React.FC = () => {
  useEffect(() => {
    // Charger le script Google
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      // Initialiser Google Sign-In si disponible
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

        // Optionnel : afficher automatiquement un prompt
        window.google.accounts.id.prompt();
      }
    };

    return () => {
      // Supprimer le script au démontage du composant
      document.body.removeChild(script);
    };
  }, []);

  // Fonction pour gérer la réponse de Google
  const handleCredentialResponse = (response: google.accounts.id.CredentialResponse) => {
    console.log("Encoded JWT ID token: ", response.credential);

    // Envoyer le token au backend
    fetch("https://maguida.raia.cm/auth/google/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ "access_token" : response.credential }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("User authenticated:", data);
        // Ajouter la logique pour rediriger ou enregistrer l'utilisateur
      })
      .catch((error) => {
        console.error("Error during authentication:", error);
      });
  };

  return <div id="google-signin-button"></div>;
};

export default GoogleSignIn;