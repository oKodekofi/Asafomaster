//import NextLink from 'next/link';
//import Image from 'next/image';
import { Grid, Typography } from '@mui/material';
import Layout from '../components/Layout';
import db from '../utils/db';
import Product from '../models/Product';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { Store } from '../utils/Store';
import ProductItem from '../components/ProductItem';
import DynamicCarousel from '../components/ClientOnlyCarousel';

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
      {/* ✅ Carousel (client-only) */}
      <DynamicCarousel featuredProducts={featuredProducts} />

      {/* Popular products section */}
      <Typography variant="h2" component="h2" className="my-4">
        Popular Products
      </Typography>
      <Grid container spacing={3}>
        {topRatedProducts.map((product) => (
          <Grid item md={4} key={product._id}>
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
