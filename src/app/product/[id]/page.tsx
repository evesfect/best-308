"use client";
import { useEffect, useState } from 'react';
import ProductItem from './ProductItem';
import { Product } from '@/types/product';
import styles from '../../../styles/ProductItem.module.css';
import StaticTopBar from '@/components/StaticTopBar';

export default function Page({ params }: { params: { id: string } }) {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchProduct() {
            setLoading(true);
            try {
                const res = await fetch(`/api/product?id=${params.id}`);
                if (!res.ok) {
                    throw new Error('Failed to fetch product');
                }
                const data = await res.json();
                if (isMounted) {
                    setProduct(data);
                }
            } catch (error) {
                if (isMounted) {
                    setError((error as Error).message || 'An unknown error occurred');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchProduct();

        return () => {
            isMounted = false;
        };
    }, [params.id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!product) return <div>Product not found</div>;

    return (
        <>
            <StaticTopBar />
            <div style={{ height: '150px' }} />
            <div className={styles.container}>
                <ProductItem product={product} />
            </div>
        </>
    );
}
