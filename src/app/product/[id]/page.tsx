"use client";
import { useEffect, useState } from 'react';
import { Product } from '@/types/product'

export default function ProductPage({ params }: { params: { id: string } }) {
    const [product, setProduct] = useState<Product | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Fetch product details from the API
        async function fetchProduct() {
            try {
                const res = await fetch(`/api/products/${params.id}`);  // Call the API route
                if (!res.ok) {
                    throw new Error('Failed to fetch product');
                }
                const data = await res.json();
                setProduct(data);
            } catch (error) {
                setError(error.message);
            }
        }

        fetchProduct();
    }, [params.id]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <p>Price: {product.price}</p>
        </div>
    );
}
