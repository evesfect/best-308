"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react'; // Import next-auth

interface TopBarProps {
  scrollPosition: number;
}

const TopBar: React.FC<TopBarProps> = ({ scrollPosition }) => {
  const { data: session } = useSession(); // Get session data
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const iconColor = scrollPosition > 0 ? 'black' : 'white';
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

  const goToShoppingCart = () => {
    router.push('/shop/cart');
  };

  const bgColorClass = scrollPosition > 0 ? 'bg-semi-transparent' : 'bg-transparent';

  const backgroundColor = `rgba(255, 255, 255, ${Math.min(scrollPosition / 100, 1)})`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-transparent pointer-events-none" />
      
      {/* Main background that changes with scroll */}
      <div 
        className="relative z-10"
        style={{ 
          backgroundColor,
          transition: 'background-color 0.3s ease-in-out',
        }}
      >
        {/* Content container */}
        <div className="container mx-auto px-6 py-2 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" onClick={handleLogoClick}>
            <Image src="/images/logo_transparent.png" alt="Shop Logo" width={150} height={60} />
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-6 flex-grow justify-center">
            <Link href="/shop/browse/new-arrivals" className={`font-bold hover:text-gray-900 ${scrollPosition > 0 ? 'text-gray-600' : 'text-white'}`}>New Arrivals</Link>
            <Link href="/shop/browse/men" className={`font-bold hover:text-gray-900 ${scrollPosition > 0 ? 'text-gray-600' : 'text-white'}`}>Men</Link>
            <Link href="/shop/browse/women" className={`font-bold hover:text-gray-900 ${scrollPosition > 0 ? 'text-gray-600' : 'text-white'}`}>Women</Link>
            <Link href="/shop/browse/best-sellers" className={`font-bold hover:text-gray-900 ${scrollPosition > 0 ? 'text-gray-600' : 'text-white'}`}>Best Sellers</Link>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-6">
            <button aria-label="Search" className="flex items-center">
              <Image src="/icons/search.svg" alt="Search" width={20} height={20} className={`transition-colors duration-300`} style={{ filter: `invert(${iconColor === 'white' ? 1 : 0})` }} />
            </button>
            <div className="relative flex items-center" ref={dropdownRef}>
              <button 
                aria-label="User Account" 
                className="flex items-center"
                onMouseEnter={() => setShowLoginDropdown(true)}
              >
                <Image src="/icons/user.svg" alt="User Account" width={20} height={20} className={`transition-colors duration-300`} style={{ filter: `invert(${iconColor === 'white' ? 1 : 0})` }} />
              </button>
              {showLoginDropdown && (
                <div 
                  className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
                  style={{ minWidth: '200px' }}
                  onMouseLeave={() => setShowLoginDropdown(false)}
                >
                  {session ? (
                    <div className="p-2">
                      <Link href="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">My Account</Link>
                      <button 
                        onClick={() => signOut()} 
                        className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 rounded"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="p-2">
                      <Link href="/auth/signin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Sign in</Link>
                      <div className="px-4 py-2 text-sm text-gray-500">Don't have an account?</div>
                      <Link href="/auth/signup" className="block px-4 py-2 text-sm text-blue-500 hover:bg-gray-100 rounded">Sign up</Link>
                    </div>
                  )}
                </div>
              )}
            </div>
            <button aria-label="Favorites" className="flex items-center">
              <Image src="/icons/heart.svg" alt="Favorites" width={20} height={20} className={`transition-colors duration-300`} style={{ filter: `invert(${iconColor === 'white' ? 1 : 0})` }} />
            </button>
            <button aria-label="Shopping Cart" className="flex items-center" onClick={goToShoppingCart}>
              <Image src="/icons/cart.svg" alt="Shopping Cart" width={20} height={20} className={`transition-colors duration-300`} style={{ filter: `invert(${iconColor === 'white' ? 1 : 0})` }} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopBar;
