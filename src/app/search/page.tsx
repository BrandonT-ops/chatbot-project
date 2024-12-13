"use client";

import React, { useState } from "react";
import { useChatStore } from "@/lib/store";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/ui/header";

const SearchResults = () => {
  const { searchResults } = useChatStore();
  const router = useRouter();

  // Change to an object to track expanded state for each product
  const [expandedItems, setExpandedItems] = useState<{
    [key: number]: boolean;
  }>({});

  const toggleExpand = (index: number) => {
    setExpandedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleNavigation = () => {
    router.push("/");
  };

  if (!searchResults) return null;

  if (searchResults.isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen p-4">
        <Header />
        <div className="max-w-3xl mx-auto mt-20">
          <div className="text-xl font-bold text-gray-600 mb-4">
            Searching for &quot;{searchResults.query}&quot;...
          </div>
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="border-b border-gray-200 py-4 animate-pulse flex"
            >
              {/* Store Information Loading */}
              <div className="flex-grow pr-4">
                <div className="flex items-center mb-2">
                  <div className="h-8 w-8 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <div className="h-4 bg-gray-300 w-32 mb-1"></div>
                    <div className="h-3 bg-gray-200 w-48"></div>
                  </div>
                </div>

                {/* Product Name Loading */}
                <div className="h-5 bg-gray-300 w-40 mb-3"></div>

                {/* Product Description Loading */}
                <div className="h-3 bg-gray-200 mb-2 w-3/4"></div>
                <div className="h-3 bg-gray-200 mb-2 w-2/3"></div>

                {/* Price and Availability Loading */}
                <div className="flex items-center space-x-2">
                  <div className="h-4 bg-gray-300 w-24"></div>
                  <div className="h-4 bg-gray-300 w-24"></div>
                </div>
              </div>

              {/* Product Image Loading */}
              <div className="flex-shrink-0 w-36 h-36">
                <div className="bg-gray-300 w-full h-full rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <div className="max-w-4xl mx-auto p-4 mt-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleNavigation}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Back to Chat
            </button>
          </div>
        </div>

        <div className="text-4xl font-semibold text-gray-700 py-2">
          Search Results for &quot;{searchResults.query}&quot;
        </div>
        <div className="text-sm text-gray-600 mb-6">
          About {searchResults.results.length} results
        </div>

        <div>
          {searchResults.results.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              No results found.
            </div>
          ) : (
            searchResults.results.map((product, index) => (
              <div
                key={index}
                className="border-b border-gray-200 py-4 hover:bg-gray-100 transition flex flex-row sm:flex-row"
              >
                <div className="flex-grow pr-4">
                  {/* Store Information */}
                  <div className="flex items-center mb-2">
                    {product.boutique_image && (
                      <Image
                        src={`/api/proxy/image-proxy?url=${encodeURIComponent(
                          product.boutique_image
                        )}`}
                        alt={product.boutique_name || "Store Logo"}
                        width={32}
                        height={32}
                        className="mr-3 rounded-full"
                        unoptimized
                      />
                    )}
                    <div>
                      <span className="text-sm font-bold capitalize text-gray-600">
                        {product.boutique_name}
                      </span>
                      {product.url && (
                        <a
                          href={product.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-xs text-gray-500 mt-1 truncate w-48" // Adjust the `w-48` class for your desired truncation width
                        >
                          {product.url}
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Product Name */}
                  <Link
                    href={`/product?url=${encodeURIComponent(product.url)}`}
                    className="text-blue-600 hover:underline text-xl font-medium block"
                  >
                    {product.name}
                  </Link>

                  {/* Product Description */}
                  <div className="text-sm text-gray-700 my-2">
                    <p
                      className={`${
                        expandedItems[index] ? "" : "line-clamp-2"
                      } leading-relaxed`}
                    >
                      {product.description ||
                        "Short description about the product goes here."}
                    </p>
                    {product.description?.length > 100 && (
                      <button
                        onClick={() => toggleExpand(index)}
                        className="text-blue-600 hover:underline mt-2 text-sm inline-block"
                      >
                        {expandedItems[index] ? "Read Less" : "Read More"}
                      </button>
                    )}
                  </div>

                  {/* Price and Availability */}
                  <div className="flex items-center space-x-2">
                    <div className="text-sm font-bold text-green-700">
                      {product.price.toLocaleString()} FCFA
                    </div>
                    <div
                      className={`text-sm ${
                        product.disponibilite === "Out of Stock !"
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      {product.disponibilite}
                    </div>
                  </div>
                </div>

                {/* Product Image (on the right) */}
                <div className="flex-shrink-0 w-32 sm:w-36 h-24 sm:h-36 px-4 sm:px-0">
                  <Image
                    src={`/api/proxy/image-proxy?url=${encodeURIComponent(
                      product.image_url
                    )}`}
                    alt={product.name}
                    width={96} // Smaller width for mobile
                    height={96} // Smaller height for mobile
                    className="object-contain w-full h-full rounded"
                    unoptimized
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;

{
  /* Pagination
        <div className="flex justify-center items-center mt-8 space-x-4 text-blue-600">
          <button
            className="flex items-center hover:underline disabled:opacity-50"
            disabled
          >
            <ChevronLeftIcon className="h-5 w-5 mr-1" />
            Previous
          </button>
          <div className="space-x-2">
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                className={`px-3 py-1 rounded ${
                  page === 1 ? "bg-blue-600 text-white" : "hover:bg-gray-200"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          <button className="flex items-center hover:underline">
            Next
            <ChevronRightIcon className="h-5 w-5 ml-1" />
          </button>
        </div> */
}
