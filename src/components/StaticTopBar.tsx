"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const StaticTopBar: React.FC = () => {
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowLoginDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.push('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div 
        className="relative z-10 bg-white"
      >
        <div className="container mx-auto px-6 py-2 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" onClick={handleLogoClick}>
            <Image src="/images/logo.png" alt="Shop Logo" width={80} height={32} />
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-6 flex-grow justify-center">
            <Link href="/new-arrivals" className="font-bold text-gray-600 hover:text-gray-900">New Arrivals</Link>
            <Link href="/men" className="font-bold text-gray-600 hover:text-gray-900">Men</Link>
            <Link href="/women" className="font-bold text-gray-600 hover:text-gray-900">Women</Link>
            <Link href="/best-sellers" className="font-bold text-gray-600 hover:text-gray-900">Best Sellers</Link>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-6">
            <button aria-label="Search" className="flex items-center">
              <Image src="/icons/search.svg" alt="Search" width={20} height={20} />
            </button>
            <div className="relative flex items-center" ref={dropdownRef}>
              <button 
                aria-label="Login" 
                className="flex items-center"
                onMouseEnter={() => setShowLoginDropdown(true)}
              >
                <Image src="/icons/user.svg" alt="Login" width={20} height={20} />
              </button>
              {showLoginDropdown && (
                <div 
                className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
                style={{ minWidth: '200px' }}
                onMouseLeave={() => setShowLoginDropdown(false)}
              >
                <div className="p-2">
                  <Link href="/auth/signin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Sign in</Link>
                  <div className="px-4 py-2 text-sm text-gray-500">Don't have an account?</div>
                  <Link href="/auth/signup" className="block px-4 py-2 text-sm text-blue-500 hover:bg-gray-100 rounded">Sign up</Link>
                </div>
              </div>
              )}
            </div>
            <button aria-label="Favorites" className="flex items-center">
              <Image src="/icons/heart.svg" alt="Favorites" width={20} height={20} />
            </button>
            <button aria-label="Shopping Cart" className="flex items-center">
              <Image src="/icons/cart.svg" alt="Shopping Cart" width={20} height={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default StaticTopBar;
