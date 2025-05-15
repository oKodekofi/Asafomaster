//import NextLink from 'next/link';
import React from 'react';
import Image from 'next/image';
import { Grid, Link, Typography } from '@mui/material';
import Layout from '../components/Layout';
import db from '../utils/db';
import Product from '../models/Product';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { Store } from '../utils/Store';
import ProductItem from '../components/ProductItem';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
//import classes from '../utils/classes';

export default function Home(props) {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { topRatedProducts, featuredProducts } = props;
  const addToCartHandler = async (product) => {
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    router.push('/cart');
  };
  return (
    <Layout>
      <Carousel showThumbs={false} autoPlay>
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
                  sizes="(max-width: 768px) 100vw, 500px"
                  onError={(e) =>
                    console.error(`Image failed to load: ${product.image}`, e)
                  }
                />
              ) : (
                <p className="text-red-500">Image not available</p>
              )}
            </Link>
          </div>
        ))}
      </Carousel>

      <Typography variant="h2">Popular Products 1</Typography>
      <Grid container spacing={3}>
        {topRatedProducts.map((product) => (
          <Grid item md={4} key={product.name}>
            <ProductItem
              product={product}
              addToCartHandler={addToCartHandler}
            />
          </Grid>
        ))}
      </Grid>
    </Layout>
  );
}

export async function getServerSideProps() {
  try {
    await db.connect();

    const featuredProductsDocs = await Product.find(
      { isFeatured: true },
      '-reviews'
    )
      .lean()
      .limit(3);

    const topRatedProductsDocs = await Product.find({}, '-reviews')
      .lean()
      .sort({ rating: -1 })
      .limit(6);

    return {
      props: {
        featuredProducts: featuredProductsDocs.map(db.convertDocToObj),
        topRatedProducts: topRatedProductsDocs.map(db.convertDocToObj),
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      props: {
        featuredProducts: [],
        topRatedProducts: [],
        error: 'Failed to load products',
      },
    };
  } finally {
    await db.disconnect(); // Always disconnect regardless of error
  }
}
