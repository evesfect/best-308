"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TopBar from '../components/TopBar';
import StaticTopBar from '@/components/StaticTopBar';
import { Libre_Baskerville } from 'next/font/google'; // Import Libre Baskerville

const libreBaskerville = Libre_Baskerville({ 
  weight: ['400', '700'],  // Add this line
  subsets: ['latin'] 
}); // Initialize the font

const Home = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const router = useRouter();

  const carouselContent = [
    {
      name: "The Timeless Collection",
      description: "Elegance redefined for the modern gentleman"
    },
    {
      name: "Executive Essentials",
      description: "Commanding presence in every boardroom"
    },
    {
      name: "Luxe Comfort",
      description: "Where opulence meets unparalleled ease"
    }
  ];

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
              alt={`${carouselContent[index].name}`} 
              layout="fill"
              objectFit="cover"
              objectPosition="top"
              priority={index === 0}
            />
          </div>
        ))}
        <div className="absolute bottom-4 left-4 right-4 flex space-x-4">
          {carouselContent.map((content, index) => (
            <div key={index} className="flex-1 relative">
              <div className="absolute bottom-1 left-0 right-0 text-left">
                <p className={`text-white text-xl font-bold mb-1 transition-all duration-500 ease-in-out ${libreBaskerville.className}`}
                   style={{ transform: index === currentImageIndex ? 'translateY(-48px)' : 'translateY(0)' }}>
                  {content.name}
                </p>
                <p className={`text-white text-sm transition-opacity duration-500 absolute bottom-2 left-0 right-0 ${libreBaskerville.className} ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}>
                  {content.description}
                </p>
              </div>
              <div className="progress-container opacity-85">
                <div 
                  className={`progress-line ${index === currentImageIndex ? 'animate-progress' : index < currentImageIndex ? 'w-full' : 'w-0'}`}
                ></div>
                <div className="absolute inset-0 bg-white opacity-40"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Links */}
      <div className="w-full pt-24 pb-12">
        <div className="flex flex-col space-y-24">
          <div className="flex flex-col space-y-4">
            <span className={`text-[#003153] text-4xl font-bold text-center ${libreBaskerville.className}`}>
              Men's Selection
            </span>
            <div className="flex w-full h-[600px]">
              <Link href="/men" className="relative w-1/2 overflow-hidden">
                <Image 
                  src="/images/mens-category-1.jpg" 
                  alt="Men's Selection 1" 
                  layout="fill" 
                  objectFit="cover"
                  objectPosition="center"
                />
              </Link>
              <Link href="/men" className="relative w-1/2 overflow-hidden">
                <Image 
                  src="/images/mens-category-2.jpg" 
                  alt="Men's Selection 2" 
                  layout="fill" 
                  objectFit="cover"
                  objectPosition="center"
                />
              </Link>
            </div>
          </div>
          <div className="flex flex-col space-y-4">
            <span className={`text-[#8B4513] text-4xl font-bold text-center ${libreBaskerville.className}`}>
              Women's Selection
            </span>
            <div className="flex w-full h-[600px]">
              <Link href="/women" className="relative w-1/2 overflow-hidden">
                <Image 
                  src="/images/womens-category-1.jpg" 
                  alt="Women's Selection 1" 
                  layout="fill" 
                  objectFit="cover"
                  objectPosition="center"
                />
              </Link>
              <Link href="/women" className="relative w-1/2 overflow-hidden">
                <Image 
                  src="/images/womens-category-2.jpg" 
                  alt="Women's Selection 2" 
                  layout="fill" 
                  objectFit="cover"
                  objectPosition="center"
                />
              </Link>
            </div>
          </div>
          <div className="flex flex-col space-y-4">
            <span className={`text-[#003153] text-4xl font-bold text-center ${libreBaskerville.className}`}>
              About Us
            </span>
            <div className="w-full h-[700px]">
              <Link href="/about" className="relative w-full h-full overflow-hidden">
                <Image 
                  src="/images/about-us.jpg" 
                  alt="About Us" 
                  layout="fill" 
                  objectFit="cover"
                  objectPosition="center"
                />
                <img 
  src="/images/about-us.jpg" 
  alt="About Us" 
  className="w-full h-full object-cover"
/>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
