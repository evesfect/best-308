"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TopBar from '../components/TopBar';
import StaticTopBar from '@/components/StaticTopBar';

const Home = () => {
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
    }, 8000); // Change image every 8 seconds

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
      <TopBar scrollPosition={scrollPosition} />

      {/* Image Carousel */}
      <div className="relative h-screen overflow-hidden">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image 
              src={image} 
              alt={`Carousel Image ${index + 1}`} 
              layout="fill"
              objectFit="cover"
              objectPosition="top"
              priority={index === 0}
            />
          </div>
        ))}
        <div className="absolute bottom-4 left-4 right-4 flex space-x-4">
          {images.map((_, index) => (
            <div key={index} className="flex-1 progress-container opacity-85">
              <div 
                className={`progress-line ${index === currentImageIndex ? 'animate-progress' : index < currentImageIndex ? 'w-full' : 'w-0'}`}
              ></div>
            </div>
          ))}
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
