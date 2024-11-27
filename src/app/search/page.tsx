"use client";

import React from "react";
import { useChatStore } from "@/lib/store";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeftIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

const SearchResults = () => {
  const { searchResults } = useChatStore();
  const router = useRouter();

  const handleNavigation = (view: "chat" | "search") => {
    if (view === "chat") {
      router.push("/chat");
    }
  };

  if (!searchResults) return null;

  if (searchResults.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <SparklesIcon className="h-8 w-8 text-blue-500" />
              <h2 className="text-2xl font-bold text-gray-800">
                Searching for &quot;{searchResults.query}&quot;...
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gray-100 border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg animate-pulse"
                >
                  <div className="h-56 bg-gray-300 mb-4"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="container mx-auto mt-10">
        {/* Navigation Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-6 left-6 z-50"
        >
          <button
            onClick={() => handleNavigation("chat")}
            className="p-3 bg-white/80 backdrop-blur-lg rounded-full shadow-xl hover:bg-blue-100 transition-all group"
          >
            <ArrowLeftIcon className="h-6 w-6 text-blue-600 group-hover:text-blue-800 transition-colors" />
          </button>
        </motion.div>

        {/* Page Heading */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
            Product Search Results
          </h1>
          <p className="text-gray-600 text-lg">
            Search results for <span className="text-blue-500">&quot;{searchResults.query}&quot;</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6"
        >
          {searchResults.results.length === 0 ? (
            <div className="text-center py-12 bg-gray-100 rounded-xl">
              <p className="text-gray-600 text-xl">No results found.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.results.map((product, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white border-2 border-gray-100 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-blue-100 transition-all group"
                >
                  <div className="relative overflow-hidden">
                    <Image
                      src={product.image_url || "/api/placeholder/200/200"}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300"
                      unoptimized
                    />
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="font-bold text-lg text-gray-800 truncate">
                      {product.name}
                    </h3>
                    <div className="flex justify-between items-center">
                      <p className="text-blue-600 font-semibold text-lg">
                        {product.price.toLocaleString()} FCFA
                      </p>
                      <p
                        className={`text-sm font-medium ${
                          product.disponibilite === "Out of Stock !"
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      >
                        {product.disponibilite}
                      </p>
                    </div>
                    <Link
                      href={product.url}
                      passHref
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 w-full bg-blue-500 text-white py-2.5 rounded-lg hover:bg-blue-600 transition inline-block text-center font-semibold tracking-wider"
                    >
                      View Details
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SearchResults;
