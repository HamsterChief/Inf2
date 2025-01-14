import React, { useState, useEffect } from 'react';
import { getCart, saveCartToLocalStorage } from '../Components/Cart';  // Import the cart utility functions

interface CartItemProps {
    theatreShowId: number;
    showName: string;
    price: number;
    quantity: number;
}

const CartPage: React.FC = () => {
    const [cart, setCart] = useState<CartItemProps[]>([]);
    const [totalQuantity, setTotalQuantity] = useState<number>(0);
    const [totalPrice, setTotalPrice] = useState<number>(0);

    useEffect(() => {
        const fetchedCart = getCart();
        if (fetchedCart) {
            setCart(fetchedCart.items);
            setTotalQuantity(fetchedCart.totalQuantity);
            setTotalPrice(fetchedCart.totalPrice);
        }
    }, []);

    const handleQuantityChange = (showName: string, newQuantity: number) => {
        let updatedCart = [...cart];
        const itemIndex = updatedCart.findIndex(item => item.showName === showName);

        if (itemIndex !== -1) {
            updatedCart[itemIndex].quantity = newQuantity;
            const item = updatedCart[itemIndex];
            const newTotalQuantity = updatedCart.reduce((acc, item) => acc + item.quantity, 0);
            const newTotalPrice = updatedCart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

            setCart(updatedCart);
            setTotalQuantity(newTotalQuantity);
            setTotalPrice(newTotalPrice);

            // Save to localStorage
            saveCartToLocalStorage({
                items: updatedCart,
                totalQuantity: newTotalQuantity,
                totalPrice: newTotalPrice
            });
        }
    };

    const handleRemoveItem = (showName: string) => {
        let updatedCart = [...cart];
        updatedCart = updatedCart.filter(item => item.showName !== showName);

        const newTotalQuantity = updatedCart.reduce((acc, item) => acc + item.quantity, 0);
        const newTotalPrice = updatedCart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

        setCart(updatedCart);
        setTotalQuantity(newTotalQuantity);
        setTotalPrice(newTotalPrice);

        // Save to localStorage
        saveCartToLocalStorage({
            items: updatedCart,
            totalQuantity: newTotalQuantity,
            totalPrice: newTotalPrice
        });
    };

    return (
        <div>
            <h2>Shopping Cart</h2>
            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    <ul>
                        {cart.map(item => (
                            <li key={item.theatreShowId}>
                                <p>{item.showName}</p>
                                <p>Price: ${item.price}</p>
                                <p>
                                    Quantity:
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        min="1"
                                        onChange={(e) => handleQuantityChange(item.showName, parseInt(e.target.value))}
                                    />
                                </p>
                                <button onClick={() => handleRemoveItem(item.showName)}>Remove</button>
                            </li>
                        ))}
                    </ul>
                    <div>
                        <h3>Total</h3>
                        <p>Quantity: {totalQuantity}</p>
                        <p>Total Price: ${totalPrice}</p>
                    </div>
                </>
            )}
        </div>
    );
};

export default CartPage;
