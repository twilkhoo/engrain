import React from "react";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";

const Header = () => {
  const { user } = useUser();
  return (
    <header className="text-gray-600 body-font">
      <div
        className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center"
        style={{ height: "100px" }}
      >
        <Link
          href="/"
          className="flex items-center mb-4 md:mb-0 font-kalam font-semibold text-xl text-amber-950"
        >
          Engrain.
        </Link>
        <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
          {user && (
            <>
              <div className="mx-4 inline-flex font-comfortaa text-amber-950 items-center bg-orange-500 border-0 py-1 px-3 focus:outline-none hover:bg-orange-600 rounded text-base mt-4 md:mt-0">
                <Link href="/admin">Add</Link>
              </div>
              <div className="mx-4 inline-flex font-comfortaa text-amber-950 items-center bg-orange-500 border-0 py-1 px-3 focus:outline-none hover:bg-orange-600 rounded text-base mt-4 md:mt-0">
                <Link href="/favorites">Favorites</Link>
              </div>
            </>
          )}

          {user ? (
            <div className="flex items-center space-x-5">
              <Link
                href="/api/auth/logout"
                className="mx-4 inline-flex font-comfortaa text-amber-950 items-center bg-orange-500 border-0 py-1 px-3 focus:outline-none hover:bg-orange-600 rounded text-base mt-4 md:mt-0"
              >
                Logout
              </Link>
              <img
                alt="profile"
                className="rounded-full w-12 h-12"
                src={user.picture ? user.picture : ""}
              />
            </div>
          ) : (
            <Link
              href="/api/auth/login"
              className="inline-flex font-comfortaa text-amber-950 items-center bg-orange-500 border-0 py-1 px-3 focus:outline-none hover:bg-orange-600 rounded text-base mt-4 md:mt-0"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
