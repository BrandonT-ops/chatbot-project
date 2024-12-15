"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowPathIcon,
  LinkIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";
import { useChatStore } from "@/lib/store";

const ProductRedirectContent: React.FC = () => {
  const searchParams = useSearchParams();
  const url = searchParams.get("url");

  const [status, setStatus] = useState<"loading" | "error" | "redirecting">(
    "loading"
  );
  const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
  const { userToken } = useChatStore();

  useEffect(() => {
    if (typeof window === "undefined" || !url) {
      setStatus("error");
      return;
    }

    const token = userToken && "key" in userToken ? userToken.key : null;

    const redirectToProduct = async () => {
      try {
        // Check if the URL was already redirected
        const redirectedUrls = JSON.parse(
          localStorage.getItem("redirectedUrls") || "[]"
        ) as string[];

        const referrer = document.referrer; // Get the referring page
        const isFromExternalSite =
          referrer && !referrer.startsWith(window.location.origin);

        if (redirectedUrls.includes(url) && isFromExternalSite) {
          // Redirect to home if coming from an external site and the URL was already redirected
          window.location.href = "/";
          return;
        }

        // Validate URL before proceeding
        if (!isValidUrl(url)) {
          setStatus("error");
          return;
        }

        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };

        if (token) {
          headers["Authorization"] = `Token ${token}`;
        }

        const response = await fetch(`${apiEndpoint}/shop/register-click/`, {
          method: "POST",
          headers,
          body: JSON.stringify({ product_url: url }),
        });

        if (response.ok) {
          setStatus("redirecting");

          // Add URL to redirected list
          const updatedRedirectedUrls = [...redirectedUrls, url];
          localStorage.setItem(
            "redirectedUrls",
            JSON.stringify(updatedRedirectedUrls)
          );

          // Redirect to the product URL
          window.location.href = decodeURIComponent(url);
        } else {
          console.error("Redirect registration failed", response.status);
          setStatus("error");
        }
      } catch (error) {
        console.error("Redirect error:", error);
        setStatus("error");
      }
    };

    redirectToProduct();
  }, [url, apiEndpoint, userToken]);

  const isValidUrl = (urlString: string): boolean => {
    try {
      const parsedUrl = new URL(urlString);
      return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
    } catch {
      return false;
    }
  };

  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <ArrowPathIcon
              className="w-16 h-16 text-blue-500 animate-spin mb-4"
              aria-hidden="true"
            />
            <h1 className="text-xl font-semibold text-gray-700">
              Redirection en cours...
            </h1>
            <p className="text-gray-500 mt-2">
              Veuillez patienter pendant que nous vous redirigeons
            </p>
          </div>
        );
      case "redirecting":
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 p-4">
            <LinkIcon
              className="w-16 h-16 text-green-500 mb-4"
              aria-hidden="true"
            />
            <h1 className="text-xl font-semibold text-green-700">
              Redirection en cours
            </h1>
            <p className="text-green-600 mt-2">
              Vous serez redirigé dans un instant
            </p>
          </div>
        );
      case "error":
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-4">
            <ExclamationTriangleIcon
              className="w-16 h-16 text-red-500 mb-4"
              aria-hidden="true"
            />
            <h1 className="text-xl font-semibold text-red-700">
              Erreur de redirection
            </h1>
            <p className="text-red-600 mt-2 text-center">
              Nous n&apos;avons pas pu vous rediriger. Veuillez réessayer ou
              contacter le support.
            </p>
            <button
              onClick={() => (window.location.href = "/")}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Retour à l&apos;accueil
            </button>
          </div>
        );
    }
  };

  return renderContent();
};

const ProductRedirect = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductRedirectContent />
    </Suspense>
  );
};

export default ProductRedirect;
