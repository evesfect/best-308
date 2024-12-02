export interface CartItem {
    _id: string;
    name: string;
    salePrice: string;
    quantity: number;
    imageId: string;
    size: string; // Include size in cart item
    color: string; // Include color in cart item
  }