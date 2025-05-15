import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import Image from 'next/image';
import NextLink from 'next/link';
import { Link as MuiLink } from '@mui/material';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const ResponsiveCarousel = ({ featuredProducts }) => {
  return (
    <Carousel showThumbs={false} autoPlay infiniteLoop>
      {featuredProducts.map((product) => (
        <div key={product._id}>
          <NextLink href={`/product/${product.slug}`} passHref>
            <MuiLink>
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
            </MuiLink>
          </NextLink>
        </div>
      ))}
    </Carousel>
  );
};

export default ResponsiveCarousel;
