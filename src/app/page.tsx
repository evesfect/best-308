"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Home = () => {
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const router = useRouter();

  const images = [
    '/images/carousel/image1.jpg',
    '/images/carousel/image2.jpg',
    '/images/carousel/image3.jpg',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.pageYOffset;
      setScrollPosition(position);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrollPosition > 0 ? 'bg-white shadow-md' : 'bg-transparent'
      }`} style={{ backgroundColor: `rgba(255, 255, 255, ${Math.min(scrollPosition / 300, 1)})` }}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <Image src="/images/logo.png" alt="Shop Logo" width={100} height={40} />
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-6">
            <Link href="/new-arrivals" className={`hover:text-gray-900 ${scrollPosition > 0 ? 'text-gray-600' : 'text-white'}`}>New Arrivals</Link>
            <Link href="/men" className={`hover:text-gray-900 ${scrollPosition > 0 ? 'text-gray-600' : 'text-white'}`}>Men</Link>
            <Link href="/women" className={`hover:text-gray-900 ${scrollPosition > 0 ? 'text-gray-600' : 'text-white'}`}>Women</Link>
            <Link href="/best-sellers" className={`hover:text-gray-900 ${scrollPosition > 0 ? 'text-gray-600' : 'text-white'}`}>Best Sellers</Link>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <button aria-label="Search">
              <Image src="/icons/search.svg" alt="Search" width={24} height={24} />
            </button>
            <div className="relative">
              <button 
                aria-label="Login" 
                onMouseEnter={() => setShowLoginDropdown(true)}
                onMouseLeave={() => setShowLoginDropdown(false)}
              >
                <Image src="/icons/user.svg" alt="Login" width={24} height={24} />
              </button>
              {showLoginDropdown && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
                  onMouseEnter={() => setShowLoginDropdown(true)}
                  onMouseLeave={() => setShowLoginDropdown(false)}
                >
                  <Link href="/auth/signin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Login</Link>
                  <div className="px-4 py-2 text-sm text-gray-500">Don't have an account?</div>
                  <Link href="/auth/signup" className="block px-4 py-2 text-sm text-blue-500 hover:bg-gray-100">Sign up</Link>
                </div>
              )}
            </div>
            <button aria-label="Favorites">
              <Image src="/icons/heart.svg" alt="Favorites" width={24} height={24} />
            </button>
            <button aria-label="Shopping Cart">
              <Image src="/icons/cart.svg" alt="Shopping Cart" width={24} height={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Image Carousel */}
      <div className="relative h-screen">
        <Image 
          src={images[currentImageIndex]} 
          alt={`Carousel Image ${currentImageIndex + 1}`} 
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-200">
          <div 
            className="h-full bg-black transition-all duration-5000 ease-linear"
            style={{ width: `${((currentImageIndex + 1) / images.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Category Links */}
      <div className="container mx-auto px-4 py-12 pt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link href="/men" className="relative h-64 rounded-lg overflow-hidden">
            <Image src="/images/mens-category.jpg" alt="Men's Selection" layout="fill" objectFit="cover" />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">Men's Selection</span>
            </div>
          </Link>
          <Link href="/women" className="relative h-64 rounded-lg overflow-hidden">
            <Image src="/images/womens-category.jpg" alt="Women's Selection" layout="fill" objectFit="cover" />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">Women's Selection</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
