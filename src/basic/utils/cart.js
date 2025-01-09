export const canUpdateQuantity = (productModel, cartItem) => productModel.quantity > (cartItem?.getQuantity() || 0);

export const getTotalQuantity = (cartItems) => cartItems.reduce((sum, item) => sum + item.quantity, 0);

export const calculatePoint = (amount) => Math.floor(amount / 1000);
