export interface CartItem {
    theatreShowId: number;
    showName: string;
    quantity: number;
    price: number;
}

export interface ShoppingCart {
    items: CartItem[];
    totalQuantity: number;
    totalPrice: number;
}

export function initializeCart(): ShoppingCart {
    return {
        items: [],
        totalQuantity: 0,
        totalPrice: 0,
    };
}

export function getCartFromLocalStorage(): ShoppingCart | null {
    const cart = localStorage.getItem('shoppingCart');
    return cart ? JSON.parse(cart) : null;
}

export function saveCartToLocalStorage(cart: ShoppingCart) {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
}

export function addToCart(productId: number, productName: string, price: number, quantity: number) {
    let cart = getCartFromLocalStorage();

    if (cart === null) {
        cart = initializeCart();
    }

    const existingItemIndex = cart.items.findIndex(item => item.theatreShowId === productId);

    if (existingItemIndex !== -1) {
        cart.items[existingItemIndex].quantity += quantity;
    } else {
        cart.items.push({ theatreShowId: productId, showName: productName, price: price, quantity: quantity });
    }

    cart.totalQuantity += quantity;
    cart.totalPrice += price * quantity;

    saveCartToLocalStorage(cart);
}

export function removeFromCart(productId: number) {
    let cart = getCartFromLocalStorage();

    if (cart !== null) {
        const existingItemIndex = cart.items.findIndex(item => item.theatreShowId === productId);
        if (existingItemIndex !== -1) {
            cart.totalQuantity -= cart.items[existingItemIndex].quantity;
            cart.totalPrice -= cart.items[existingItemIndex].price * cart.items[existingItemIndex].quantity;

            cart.items.splice(existingItemIndex, 1);

            saveCartToLocalStorage(cart);
        }
    }
}

export function getCart() {
    return getCartFromLocalStorage();
}
