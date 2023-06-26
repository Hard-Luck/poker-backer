import { useState } from "react";
import Link from "next/link";
import { SignedIn } from "@clerk/nextjs/dist/client-boundary/controlComponents";

const BurgerMenu = ({
  pages,
  currentPage,
}: {
  pages: string[];
  currentPage: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <SignedIn>
      <div className="p-4">
        <button onClick={toggleMenu}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <div
          className={`absolute left-0 right-0 bg-black py-4 transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <div className="flex flex-col items-center space-y-2">
            {pages.map((page) => {
              if (page === currentPage) {
                return (
                  <p key={page} className="border-b-2">
                    {page}
                  </p>
                );
              }
              return (
                <Link key={page} className="border-b-2" href={`/${page}`}>
                  {page}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </SignedIn>
  );
};

export default BurgerMenu;