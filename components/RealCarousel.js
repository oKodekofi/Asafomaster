import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Image from 'next/image';
import Link from 'next/link';

export default function ResponsiveCarousel({ featuredProducts }) {
  return (
    <Carousel showThumbs={false} autoPlay infiniteLoop>
      {featuredProducts.map((product) => (
        <div key={product._id}>
          <Link href={`/product/${product.slug}`} passHref className="flex">
            {product.image ? (
              <Image
                src={
                  product.image.includes('res.cloudinary.com')
                    ? product.image
                    : `https://res.cloudinary.com/diqaci6rs/image/upload/${product.image}`
                }
                alt={product.name}
                width={500}
                height={500}
              />
            ) : (
              <p className="text-red-500">Image not available</p>
            )}
          </Link>
        </div>
      ))}
    </Carousel>
  );
}
