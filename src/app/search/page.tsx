"use client";

import React, { useState } from "react";
import { useChatStore } from "@/lib/store";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import Header from "@/components/ui/header";

const SearchResults = () => {
  const { searchResults } = useChatStore();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => setIsExpanded((prev) => !prev);

  const handleNavigation = (view: "chat") => {
    if (view === "chat") {
      router.push("/chat");
    }
  };

  if (!searchResults) return null;

  if (searchResults.isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen p-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-sm text-gray-600 mb-4">
            Searching for &quot;{searchResults.query}&quot;...
          </div>
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="border-b border-gray-200 py-4 animate-pulse"
            >
              <div className="h-4 bg-gray-300 mb-2 w-3/4"></div>
              <div className="h-3 bg-gray-200 mb-2 w-1/2"></div>
              <div className="h-3 bg-gray-200 w-2/3"></div>
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
        {/* Header */}

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center justify-between mb-6">
            {/* Back to Chat Button */}
            <button
              onClick={() => handleNavigation("chat")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Back to Chat
            </button>

            {/* Search Results Label */}
            <div className="text-lg font-semibold text-gray-700 bg-gray-100 px-4 py-2 rounded-full shadow-sm">
              Search Results
            </div>
          </div>
        </div>

        {/* Search Info */}
        <div className="text-sm text-gray-600 mb-6">
          About {searchResults.results.length} results
        </div>

        {/* Search Results */}
        <div>
          {searchResults.results.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              No results found.
            </div>
          ) : (
            searchResults.results.map((product, index) => (
              <div
                key={index}
                className="border-b border-gray-200 py-4 hover:bg-gray-100 transition"
              >
                <div className="flex space-x-4">
                  <div className="flex-shrink-0 w-36 h-36">
                    <Image
                      src={product.image_url || "/api/placeholder/200/200"}
                      alt={product.name}
                      width={144}
                      height={144}
                      className="object-cover w-full h-full rounded"
                      unoptimized
                    />
                  </div>
                  <div className="flex-grow">
                    <Link
                      href={product.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-lg font-medium"
                    >
                      {product.name}
                    </Link>
                    <div className="text-sm text-gray-700 my-2">
                      <p
                        className={`${
                          isExpanded ? "" : "line-clamp-2"
                        } leading-relaxed`}
                      >
                        {product.description ||
                          "Short description about the product goes here."}
                      </p>
                      {product.description?.length > 100 && ( // Show "Read More" only if the description is long enough
                        <button
                          onClick={toggleExpand}
                          className="text-blue-600 hover:underline mt-2 inline-block"
                        >
                          {isExpanded ? "Read Less" : "Read More"}
                        </button>
                      )}
                    </div>
                    <div className="text-sm text-green-700 mb-1">
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
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
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
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
