import React from 'react'
import { useChatStore } from "@/lib/store";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

const SearchResults = () => {
  const { searchResults } = useChatStore();

  if (!searchResults) return null;

  if (searchResults.isLoading) {
    return (
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Searching for {searchResults.query}...
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white border rounded-lg p-4 shadow-sm animate-pulse"
              >
                <div className="h-48 bg-gray-300 rounded-t-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Search Results for {searchResults.query}
        </h2>
        {searchResults.results.length === 0 ? (
          <p className="text-gray-600">No results found.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.results.map((product, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition"
              >
                <Image
                  src={product.image_url || "/api/placeholder/200/200"}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="w-full h-48 object-cover rounded-t-lg"
                  unoptimized
                />
                <div className="mt-2">
                  <h3 className="font-semibold text-gray-800">
                    {product.name}
                  </h3>
                  <p className="text-gray-600">{product.price} FCFA</p>
                  <p
                    className={`text-sm ${
                      product.disponibilite === "Out of Stock !"
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {product.disponibilite}
                  </p>
                  <Link href={product.url} passHref   
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition inline-block text-center"
                    >
                      View Details
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchResults;