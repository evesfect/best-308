// File: ProductItem.tsx
import React, { useState } from 'react';
import { Product } from '@/types/product';
import Image from 'next/image';
import { Button } from 'primereact/button';
import styles from '../../../styles/ProductItem.module.css';

interface ProductItemProps {
    product: Product;
}

const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [showSizeDropdown, setShowSizeDropdown] = useState(false);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [hoveredColor, setHoveredColor] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);

    const formattedProductName = product.name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    return (
        <div className={styles.productContainer}>
            <div className={styles.imageSection}>
                <Image
                    src={`/api/images/${product.imageId}`} // Use the image API route
                    alt={product.name}
                    width={300}
                    height={300}
                    className={styles.productImage}
                />
            </div>

            <div className={styles.detailsSection}>
                <div className={styles.namePriceSection}>
                    <h1 className={styles.productName}>{formattedProductName}</h1>
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
                                        style={{backgroundColor: color.toLowerCase()}}
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
                                {product.sizes && product.sizes.length > 0 ? (
                                    product.sizes.map(size => (
                                        <div
                                            key={size}
                                            className={styles.sizeOption}
                                            onClick={() => {
                                                setSelectedSize(size);
                                                setShowSizeDropdown(false);
                                            }}
                                        >
                                            {size}
                                        </div>
                                    ))
                                ) : (
                                    <div>No sizes available</div> // Fallback if no sizes are defined
                                )}
                            </div>
                        )}
                    </div>
                    <hr className={styles.horizontalLine}/>

                    <Button
                        label="ADD TO CART"
                        className={styles.addToCartButton}
                        onClick={() => { /* Handle add to cart logic */
                        }}
                    />
                </div>
            </div>

            <div className={styles.verticalLine}></div>

            <div className={styles.descriptionSection}>
                <h2 className={styles.descriptionHeading}>Description</h2>
                <p className={styles.productDescription}>{product.description}</p>

                <hr className={styles.horizontalLine}/>

                <div className={styles.additionalInfo}>
                    <h3>Fabric & Care</h3>
                    <p>This section provides details on the materials used and how to properly care for the garment.</p>

                    <h3>Size & Fit</h3>
                    <p>Here you will find guidance on sizing and the fit of the product to ensure the best choice for
                        your needs.</p>

                    <h3>Delivery & Returns</h3>
                    <p>This outlines the delivery options available and the process for returning the product if
                        necessary.</p>

                    <h3>Payment</h3>
                    <p>This section covers the accepted payment methods and any additional payment-related
                        information.</p>
                </div>
            </div>
        </div>
    );
};

export default ProductItem;
