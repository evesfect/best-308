// File: ProductItem.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Product } from '@/types/product';
import Image from 'next/image';
import { Button } from 'primereact/button';
import styles from '../../../styles/ProductItem.module.css';
import CommentSection from './CommentSection';
import { Toast } from 'primereact/toast';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import colorMap from "@/types/ColorMap";
import { Heart, HeartFill } from 'react-bootstrap-icons';
import { WishlistItem } from "@/types/wishlist";
import { productCategoryInfo, sizeAndFit, deliveryAndReturns, payment } from '../../../types/description.ts'

interface ProductItemProps {
    product: Product;
}

const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [showSizeDropdown, setShowSizeDropdown] = useState(false);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [hoveredColor, setHoveredColor] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const toast = useRef<Toast>(null);
    const { data: session } = useSession();
    const [wishlistItems, setWishlistItems] = useState<Set<string>>(new Set());

    const formattedProductName = product.name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    const totalStock = product.available_stock
        ? Object.values(product.available_stock).reduce((acc, stock) => acc + stock, 0)
        : 0;

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const response = await axios.get('/api/wishlist/view-wishlist');
                const items: WishlistItem[] = response.data.items;
                const itemIds = new Set(items.map(item => item.productId.toString()));
                setWishlistItems(itemIds);
            } catch (error) {
                console.error('Error fetching wishlist:', error);
            }
        };

        fetchWishlist();
    }, []);

    const toggleWishlistItem = async () => {
        try {
            if (!session?.user?.id) {
                toast.current?.show({ 
                    severity: 'error', 
                    summary: 'Error', 
                    detail: 'Please login to manage your wishlist' 
                });
                return;
            }

            if (wishlistItems.has(product._id)) {
                // Remove from wishlist
                const response = await axios.delete('/api/wishlist/remove-from-wishlist', {
                    data: { productId: product._id },
                });

                if (response.status === 200 || response.status === 204) {
                    toast.current?.show({ 
                        severity: 'success', 
                        summary: 'Success', 
                        detail: 'Removed from wishlist successfully!' 
                    });
                    setWishlistItems(prev => {
                        const updatedSet = new Set(prev);
                        updatedSet.delete(product._id);
                        return updatedSet;
                    });
                }
            } else {
                // Add to wishlist
                const response = await axios.post('/api/wishlist/add-to-wishlist', {
                    productId: product._id,
                    size: selectedSize,
                    color: selectedColor,
                });

                if (response.status === 200 || response.status === 201) {
                    toast.current?.show({ 
                        severity: 'success', 
                        summary: 'Success', 
                        detail: 'Added to wishlist successfully!' 
                    });
                    setWishlistItems(prev => new Set(prev).add(product._id));
                }
            }
        } catch (error: any) {
            console.error('Error managing wishlist:', error);
            toast.current?.show({ 
                severity: 'error', 
                summary: 'Error', 
                detail: error.response?.data?.error || "Failed to manage wishlist"
            });
        }
    };

    const addToCart = async () => {
        if (!selectedSize || !selectedColor) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Please select a size and color before adding to cart.' });
            return;
        }

        if (!session || !session.user) {
            // Handle non-logged-in user cart
            const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
            console.log(localCart);

            const existingItemIndex = localCart.findIndex(
                (item: any) => item.productId === product._id && item.size === selectedSize && item.color === selectedColor
            );

            if (existingItemIndex > -1) {
                localCart[existingItemIndex].quantity += quantity;
            } else {
                localCart.push({ productId: product._id, size: selectedSize, color: selectedColor, quantity, salePrice: product.salePrice, name: product.name, imageId: product.imageId });
            }

            localStorage.setItem('cart', JSON.stringify(localCart));
            toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Item added to cart.' });
            return;
        }

        // Handle logged-in user cart
        try {
            const userId = session.user.id;
            const response = await axios.post('/api/cart/add-to-cart', {
                userId,
                productId: product._id,
                size: selectedSize,
                color: selectedColor,
            });

            if (response.status === 200) {
                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Product added to cart successfully!' });
            } else {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: `Failed to add to cart: ${response.data.error}` });
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'An error occurred while adding the product to the cart. Please try again.' });
        }
    };

    return (
        <>
            <div className={styles.productContainer}>
                <div className={styles.imageSection}>
                    <Image
                        src={`/api/images/${product.imageId}`}
                        alt={product.name}
                        width={300}
                        height={300}
                        className={styles.productImage}
                    />
                </div>

                <div className={styles.detailsSection}>
                    <div className={styles.namePriceSection}>
                        <div className={`${styles.nameWishlistContainer} flex items-center justify-between`}>
                            <h1 className={styles.productName}>{formattedProductName}</h1>
                            <button
                                onClick={toggleWishlistItem}
                                className={`${styles.wishlistButton} ${wishlistItems.has(product._id) ? styles.active : ''}`}
                                title={wishlistItems.has(product._id) ? "Remove from Wishlist" : "Add to Wishlist"}
                            >
                                {wishlistItems.has(product._id) ? (
                                    <HeartFill className="text-red-500 w-7 h-7"/>
                                ) : (
                                    <Heart className="text-gray-500 w-7 h-7"/>
                                )}
                            </button>
                        </div>
                        <p className={styles.productPrice}>${product.salePrice}</p>
                        <hr className={styles.horizontalLine}/>

                        <div className={styles.colorSection}>
                            <div className={styles.colorHeaderSection}>
                                <h3>Select color: {hoveredColor &&
                                    <span className={styles.hoveredColorName}>{` ${hoveredColor}`}</span>}</h3>
                            </div>
                            <div className={styles.colorOptions}>
                                {product.colors && product.colors.length > 0 ? (
                                    product.colors.map(color => (
                                        <div
                                            key={color}
                                            className={`${styles.colorOption} ${selectedColor === color ? styles.selectedColor : ''}`}
                                            style={{backgroundColor: (color && colorMap[color.toLowerCase()] || 'white'),}}
                                            onClick={() => setSelectedColor(color)}
                                            onMouseEnter={() => setHoveredColor(color)}
                                            onMouseLeave={() => setHoveredColor(null)}
                                        />
                                    ))
                                ) : (
                                    <div>No colors available</div> // Fallback if no colors are defined
                                )}
                            </div>
                        </div>

                        <hr className={styles.horizontalLine}/>

                        <div className={styles.quantitySection}>
                            <h3>Quantity</h3>
                            <div className={styles.quantityControls}>
                                <Button
                                    label="-"
                                    onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                                    className={styles.quantityButton}
                                />
                                <span className={styles.quantityDisplay}>{quantity}</span>
                                <Button
                                    label="+"
                                    onClick={() => setQuantity(quantity + 1)}
                                    className={styles.quantityButton}
                                />
                            </div>
                        </div>

                        <hr className={styles.horizontalLine}/>

                        <div className={styles.sizeDropdownSection}>
                            <h3>Size</h3>
                            <button className={styles.sizeButton} onClick={() => setShowSizeDropdown(!showSizeDropdown)}>
                                <span className={styles.sizeButtonText}>
                                    {selectedSize ? `Size: ${selectedSize}` : "Please select size"}
                                </span>
                                <svg
                                    className={`${styles.caretIcon} ${showSizeDropdown ? styles.caretIconUp : ''}`}
                                    width="12"
                                    height="8"
                                    viewBox="0 0 12 8"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M1 1.5L6 6.5L11 1.5"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                            {showSizeDropdown && (
                                <div className={styles.sizeDropdown}>
                                    <div
                                        className={styles.sizeOption}
                                        onClick={() => {
                                            setSelectedSize(null);
                                            setShowSizeDropdown(false);
                                        }}
                                    >
                                        Please select size
                                    </div>
                                    {product.available_stock ? (
                                        Object.entries(product.available_stock).map(([size, quantity]) => (
                                            <div
                                                key={size}
                                                className={`${styles.sizeOption} ${quantity === 0 ? styles.disabled : ''}`}
                                                onClick={() => {
                                                    if (quantity > 0) { // Allow selection only if quantity is greater than 0
                                                        setSelectedSize(size);
                                                        setShowSizeDropdown(false);
                                                    }
                                                }}
                                            >
                                                <span>{size}</span>
                                                <span
                                                    className={`${styles.sizeQuantity} ${quantity > 0 && quantity < 5 ? styles.lowStock : ''}`}
                                                >
                                                    {quantity >= 5
                                                        ? `In Stock: ${quantity}`
                                                        : quantity > 0
                                                        ? `Low Stock: ${quantity}`
                                                        : 'Out of Stock'}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <div>No sizes available</div>
                                    )}
                                </div>
                            )}
                            {product.available_stock && (
                                <p
                                    className={`${styles.stockMessage} ${
                                    totalStock === 0
                                        ? styles.outOfStock
                                        : totalStock < 10
                                        ? styles.lowStock
                                        : ''
                                    }`}
                                >
                                {totalStock === 0
                                    ? 'Sorry, this product is currently out of stock!'
                                    : totalStock < 10
                                    ? `Hurry! Only ${totalStock} items left in stock!`
                                    : `${totalStock} items currently available in stock.`}
                                </p>
                            )}

                            <div className={styles.productDetails}>
                                <p>Product ID: <span>{product._id.toString()}</span></p>
                                {product.model && product.model.length > 0 && (
                                    <p>Model: <span>{product.model}</span></p>
                                )}
                                {product.serialNum && product.serialNum.length > 0 && (
                                    <p>Serial Number: <span>{product.serialNum}</span></p>
                                )}
                                {product.warranty && product.warranty.length > 0 && (
                                    <p>Warranty: <span>{product.warranty}</span></p>
                                )}
                                {product.distributor && product.distributor.length > 0 && (
                                    <p>Distributor: <span>{product.distributor}</span></p>
                                )}
                            </div>
                        </div>
                        <hr className={styles.horizontalLine}/>

                        <div className={styles.actionButtons}>
                            <Button
                                label="ADD TO CART"
                                className={styles.addToCartButton}
                                onClick={addToCart}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.verticalLine}></div>

            <div className={styles.descriptionSection}>
                <h2 className={styles.descriptionHeading}>Description</h2>
                <p className={styles.productDescription}>{product.description}</p>

                <hr className={styles.horizontalLine}/>

                <div className={styles.additionalInfo}>
                    <h3>Fabric & Care</h3>
                    <p>{productCategoryInfo[product.category.toLowerCase()] || "Fabric & Care details not available for this category."}</p>

                    <h3>Size & Fit</h3>
                    <p>{sizeAndFit}</p>

                    <h3>Delivery & Returns</h3>
                    <p>{deliveryAndReturns}</p>

                    <h3>Payment</h3>
                    <p>{payment}</p>
                </div>
            </div>

            <CommentSection productId={product._id.toString()}/>
            <Toast ref={toast}/>
        </>
    );
};

export default ProductItem;
