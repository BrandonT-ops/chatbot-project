"use client";

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowPathIcon, LinkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { useChatStore } from '@/lib/store';

const ProductRedirectContent: React.FC = () => {
  const searchParams = useSearchParams();
  const url = searchParams.get('url');
  
  const [status, setStatus] = useState<'loading' | 'error' | 'redirecting'>('loading');
  const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
  const { userToken } = useChatStore();

  useEffect(() => {
    // Ensure this code runs only on the client
    if (typeof window === 'undefined' || !url) {
      setStatus('error');
      return;
    }

    // Assuming userToken is an object with a 'key' property
    const token = userToken && 'key' in userToken ? userToken.key : null;

    const redirectToProduct = async () => {
      try {
        // Validate URL before redirecting
        if (!isValidUrl(url)) {
          setStatus('error');
          return;
        }

        // Prepare headers
        const headers: Record<string, string> = { 
          'Content-Type': 'application/json',
        };

        // Add Authorization header only if token exists
        if (token) {
          headers['Authorization'] = `Token ${token}`;
        }

        // Attempt to register click via backend API
        const response = await fetch(`${apiEndpoint}/shop/register-click/`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ 
            "product_url": url,
          }),
        //   credentials: 'include',
        });

        // Log the entire response
        console.log('Response status:', response.status);
        try {
          const responseBody = await response.json();
          console.log('Response body:', responseBody);
        } catch (parseError) {
          console.log('Could not parse response body');
          console.log(parseError);
        }

        if (response.ok) {
          setStatus('redirecting');
          // Redirect after successful click registration
          window.location.href = decodeURIComponent(url);
        } else {
          // Handle non-200 responses
          console.error('Redirect registration failed', response.status);
          setStatus('error');
        }
      } catch (error) {
        console.error('Redirect error:', error);
        setStatus('error');
      }
    };

    // Call redirect function if URL is present
    if (url) {
      redirectToProduct();
    }
  }, [url, apiEndpoint, userToken]);

  // URL validation function
  const isValidUrl = (urlString: string): boolean => {
    try {
      const url = new URL(urlString);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  };

  // Render different UI based on redirect status
  const renderContent = () => {
    switch (status) {
      case 'loading':
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
      case 'redirecting':
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
      case 'error':
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
              Nous n&apos;avons pas pu vous rediriger. 
              Veuillez réessayer ou contacter le support.
            </p>
            <button
              onClick={() => window.location.href = '/'}
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