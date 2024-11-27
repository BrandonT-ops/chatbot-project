"use client";

import React, { useState, useEffect } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  HeartIcon,
  ShoppingBagIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { useChatStore } from "@/lib/store";
import Script from "next/script";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (element: HTMLElement, options: object) => void;
          prompt: () => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

const navigation = [
  { name: "Dashboard", href: "#", current: true },
  { name: "Products", href: "#", current: false },
  { name: "Recommendations", href: "#", current: false },
  { name: "Cart", href: "#", current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { setSearchResults } = useChatStore();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<{
    name?: string;
    email?: string;
    picture?: string;
  }>({});

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTerm = searchTerm.trim();

    if (!trimmedTerm) {
      setSearchResults(null);
      return;
    }

    // Set loading state before fetching
    setSearchResults({
      query: trimmedTerm,
      results: [],
      isLoading: true, // Add loading state
    });

    try {
      const response = await fetch(
        `https://maguida.raia.cm/shop/search/?query=${encodeURIComponent(
          trimmedTerm
        )}`
      );

      if (!response.ok) {
        throw new Error(
          `Search request failed with status: ${response.status}`
        );
      }

      const data = await response.json();
      console.log(data);

      // Check if the response is an array
      if (Array.isArray(data) && data.length > 0) {
        setSearchResults({
          query: trimmedTerm,
          results: data,
          isLoading: false, // Remove loading state
        });
      } else {
        setSearchResults({
          query: trimmedTerm,
          results: [],
          isLoading: false, // Remove loading state
        });
      }
    } catch (error) {
      console.error("Search error:", error);

      // Handle error state
      setSearchResults({
        query: trimmedTerm,
        results: [],
        isLoading: false, // Remove loading state
      });
    }
  };

  const handleCredentialResponse = async (response: { credential: string }) => {
    try {
      const res = await fetch("https://maguida.raia.cm/auth/google/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: response.credential, // Google ID token
        }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log("User authenticated successfully:", data);

        // Decode the JWT to get user information
        const decodedToken = JSON.parse(
          atob(response.credential.split(".")[1])
        );

        setUserProfile({
          name: decodedToken.name,
          email: decodedToken.email,
          picture: decodedToken.picture,
        });
        setIsLoggedIn(true);
      } else {
        throw new Error("Failed to log in");
      }
    } catch (err) {
      console.error("Error logging in:", err);
      alert("Login failed!");
    }
  };

  // Initialize Google Login
  useEffect(() => {
    // Add a type check to handle potential undefined state
    if (typeof window !== "undefined" && window.google?.accounts) {
      window.google.accounts.id.initialize({
        client_id:
          "508045256314-mos8at9ampfv6ude20iv0udapi0j3efv.apps.googleusercontent.com",
        callback: handleCredentialResponse,
      });
    }
  }, []);

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setUserProfile({});
    // Safely call disableAutoSelect if google is available
    if (typeof window !== "undefined" && window.google?.accounts) {
      window.google.accounts.id.disableAutoSelect();
    }
  };

  return (
    <>
      {/* Google Sign-In Script */}
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
      />

      <Disclosure
        as="nav"
        className="bg-white border-b-2 border-gray-200 fixed top-0 w-full z-50"
      >
        <div className="mx-auto max-w-full px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              {/* Mobile menu button*/}
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <Bars3Icon
                  aria-hidden="true"
                  className="block size-6 group-data-[open]:hidden"
                />
                <XMarkIcon
                  aria-hidden="true"
                  className="hidden size-6 group-data-[open]:block"
                />
              </DisclosureButton>
            </div>

            {/* Logo and text section */}
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex shrink-0 items-center">
                <Image
                  width={100}
                  height={100}
                  alt="Maguida logo"
                  src="assets/app_logo.svg"
                  className="h-8 w-auto"
                />
                <span className="ml-2 text-gray-900 font-semibold">
                  Maguida
                </span>
              </div>
            </div>

            {/* Search Bar */}
            <div className=" items-center mr-4 md:block hidden max-w-3xl">
              <form onSubmit={handleSearch} className="relative ">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="size-5 text-gray-900" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    // If input is emptied, reset search results
                    if (!e.target.value.trim()) {
                      setSearchResults(null);
                    }
                  }}
                  className=" placeholder:text-sm bg-[#F0F2F5] text-gray-900 pl-10 pr-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 w-64 lg:w-96"
                />
              </form>
            </div>

            {/* Buttons and profile by the right */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              {isLoggedIn ? (
                <>
                  <button
                    type="button"
                    className="lg:block hidden relative rounded-md bg-[#F0F2F5] mr-3 p-2 text-gray-900 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors duration-150"
                  >
                    <HeartIcon aria-hidden="true" className="size-5" />
                  </button>

                  <button
                    type="button"
                    className="lg:block hidden relative rounded-md bg-[#F0F2F5] p-2 text-gray-900 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors duration-150"
                  >
                    <ShoppingBagIcon aria-hidden="true" className="size-5" />
                  </button>

                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        <Image
                          width={100}
                          height={100}
                          alt="Profile Picture"
                          src={
                            userProfile.picture || "assets/profile_picture.svg"
                          }
                          className="size-8 rounded-full"
                        />
                      </MenuButton>
                    </div>
                    <MenuItems
                      transition
                      className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                    >
                      {/* <MenuItem>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                        >
                          Your Profile
                        </a>
                      </MenuItem>
                      <MenuItem>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                        >
                          Settings
                        </a>
                      </MenuItem> */}
                      <MenuItem>
                        <button
                          onClick={handleSignOut}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                        >
                          Sign out
                        </button>
                      </MenuItem>
                    </MenuItems>
                  </Menu>
                </>
              ) : (
                <div
                  id="g_id_onload"
                  data-client_id="508045256314-mos8at9ampfv6ude20iv0udapi0j3efv.apps.googleusercontent.com"
                  data-login_uri="https://maguida.raia.cm/auth/login/"
                  data-auto_prompt="false"
                >
                  <div
                    className="g_id_signin block w-full sm:w-auto sm:h-auto sm:overflow-visible sm:text-base w-12 h-12 overflow-hidden text-transparent"
                    data-type="standard"
                    data-size="large"
                    data-theme="outline"
                    data-text="sign_in_with"
                    data-shape="rectangular"
                    data-logo_alignment="left"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <DisclosurePanel className="sm:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {navigation.map((item) => (
              <DisclosureButton
                key={item.name}
                as="a"
                href={item.href}
                aria-current={item.current ? "page" : undefined}
                className={classNames(
                  item.current
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white",
                  "block rounded-md px-3 py-2 text-base font-medium"
                )}
              >
                {item.name}
              </DisclosureButton>
            ))}
          </div>
        </DisclosurePanel>
      </Disclosure>
    </>
  );
};

export default Header;
