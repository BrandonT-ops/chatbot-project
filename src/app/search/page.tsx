"use client";

import React, { useState } from "react";
import { useChatStore } from "@/lib/store";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/ui/header";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const SearchResults = () => {
  const { searchResults, setSearchResults } = useChatStore();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  // const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;

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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTerm = searchTerm.trim();

    // If search term is empty, explicitly clear results and reset
    if (!trimmedTerm) {
      setSearchResults(null);
      router.push("/search");
      return;
    }

    try {
      // Set loading state
      setSearchResults({
        query: trimmedTerm,
        results: [],
        isLoading: true,
      });

      // Update URL
      router.push(`/search?term=${encodeURIComponent(trimmedTerm)}`);

      // Fetch search results
      // const response = await fetch(
      //   `${apiEndpoint}/shop/search/?query=${encodeURIComponent(trimmedTerm)}`
      // );

      // Handle non-OK responses
      // if (!response.ok) {
      //   throw new Error(
      //     `Search request failed with status: ${response.status}`
      //   );
      // }

      // const data = await response.json();

      // // Update results
      // setSearchResults({
      //   query: trimmedTerm,
      //   results: Array.isArray(data) ? data : [],
      //   isLoading: false,
      // });
    } catch (error) {
      console.error("Search error:", error);

      setSearchResults({
        query: trimmedTerm,
        results: [],
        isLoading: false,
        // error: error instanceof Error ? error.message : 'An unexpected error occurred',
      });

      router.push("/search");
    }
  };

  // In your input component
  <input
    type="text"
    placeholder="Search for products..."
    value={searchTerm}
    onChange={(e) => {
      const value = e.target.value;
      setSearchTerm(value);

      // If input is completely empty, clear results immediately
      if (value.trim() === "") {
        setSearchResults(null);
        router.push("/search");
      }
    }}
    onKeyDown={(e) => {
      if (e.key === "Enter" && searchTerm.trim()) {
        handleSearch(e);
      }
    }}
  />;
  // if (!searchResults) {
  //   return (
  //     <div className="text-center py-12 text-gray-600">
  //       Type something in the search bar to begin.
  //     </div>
  //   );
  // }
  if (searchResults?.isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen p-4">
        <Header />
        <div className="max-w-3xl mx-auto mt-20">
          <div className="text-xl font-bold text-gray-600 mb-4">
            Searching for &quot;{searchResults!.query}&quot;...
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

  if (!searchResults || searchResults.isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen p-4">
        <Header />
        <div className="max-w-3xl mx-auto mt-20">
          <div className="text-xl font-bold text-gray-600 mb-4">
            Searching for &quot;{searchResults?.query || ""}&quot;...
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
        <div className="flex items-center justify-between">
          <div className="flex justify-between mb-6 items-start flex-col w-full">
            <div className="px-2 pb-3 w-full ">
              <button
                onClick={handleNavigation}
                className="bg-[#652574] text-white px-4 py-2 mb-4 rounded-lg shadow-md hover:opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center space-x-2"
              >
                {/* Logo */}
                <Image
                  src="/assets/white_app_logo.svg" // Replace with your logo's path
                  alt="Maguida logo"
                  width={100}
                  height={100}
                  className="w-5 h-5" // Adjust size of the logo
                />
                {/* Button text */}
                <span>Back to Chat</span>
              </button>
              <h1 className="text-gray-900 font-semibold text-3xl mb-4">
                Maguida Search
              </h1>
              <form onSubmit={handleSearch} className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="size-5 text-gray-900" />
                </div>
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchTerm}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.trim() || value === "") {
                      // Update the search term only if there's meaningful input or it's explicitly cleared
                      setSearchTerm(value);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const trimmedTerm = searchTerm.trim();

                      if (trimmedTerm) {
                        // Perform search
                        handleSearch(e);
                      } else {
                        // Do nothing if the field is empty
                        setSearchResults(null);
                      }
                    }
                  }}
                  className="w-full placeholder:text-sm bg-[#F0F2F5] text-gray-900 pl-10 pr-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                />
              </form>
            </div>
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
