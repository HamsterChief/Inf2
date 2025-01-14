import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

export interface reservationPayload {
    AmountOfTickets: number,
    Customer: {
        FirstName: string,
        LastName: string,
        Email: string
    },
    TheatreShowDate: {
        TheatreShowDateId: number
    }
}

export interface CartItem {
    title: string,
    price: number,
    payload: reservationPayload
}

export interface Cart {
    Storage: CartItem[]
    Total: number
}

async function SendToDB(payload: reservationPayload): Promise<void> {
    console.log("Reservation Payload:", JSON.stringify(payload));

    try {
        const response = await axios.post(
            "http://localhost:5097/api/v1/reservation/create",
            payload
        );
        console.log("Response:", response.data);
    } catch (error) {
        console.error("Error sending reservation to DB:", error);
    }
}

export function initializeCart(): Cart {
    return {
        Storage: [],
        Total: 0
    };
}

export function getCartFromLocalStorage(): Cart | null {
    const cart = localStorage.getItem('shoppingCart');
    return cart ? JSON.parse(cart) : null;
}

export function saveCartToLocalStorage(cart: Cart) {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
}

export function AddToCart(item: CartItem): void {
    let cart = getCartFromLocalStorage();

    if (cart === null) {
        cart = initializeCart();
    }

    const existingItemIndex = cart.Storage.findIndex(x => x.payload.TheatreShowDate.TheatreShowDateId === item.payload.TheatreShowDate.TheatreShowDateId);

    if (existingItemIndex !== -1) {
        cart.Storage[existingItemIndex].payload.AmountOfTickets += item.payload.AmountOfTickets;
    } else {
        cart.Storage.push(item);
    }

    cart.Total += item.price * item.payload.AmountOfTickets;

    saveCartToLocalStorage(cart);
}

export function RemoveFromCart(item: CartItem): void {
    let cart = getCartFromLocalStorage();

    if (cart === null) {
        cart = initializeCart();
    }

    const existingItemIndex = cart.Storage.findIndex(
        x => x.payload.TheatreShowDate.TheatreShowDateId === item.payload.TheatreShowDate.TheatreShowDateId
    );

    if (existingItemIndex !== -1) {
        cart.Total -= item.price * item.payload.AmountOfTickets;
        cart.Storage.splice(existingItemIndex, 1); // Remove the item at the found index
        console.log(`Item with ID ${item.payload.TheatreShowDate.TheatreShowDateId} removed from cart.`);
    } else {
        console.log(`Item with ID ${item.payload.TheatreShowDate.TheatreShowDateId} not found`);
    }

    // Reset total to 0 if the cart is empty
    if (cart.Storage.length === 0) {
        cart.Total = 0;
    }

    saveCartToLocalStorage(cart);
}



const CartPage: React.FC = () => {
    const [cart, setCart] = useState<Cart>(initializeCart());

    useEffect(() => {
        const savedCart = getCartFromLocalStorage();
        if (savedCart) {
            setCart(savedCart);
        }
    }, []);

    const handleAddToCart = (item: CartItem) => {
        AddToCart(item);
        const updatedCart = getCartFromLocalStorage();
        if (updatedCart) {
            setCart(updatedCart);
        }
    };

    const handleRemoveFromCart = (item: CartItem) => {
        RemoveFromCart(item);
        const updatedCart = getCartFromLocalStorage();
        if (updatedCart) {
            setCart(updatedCart);
        }
    };

    const handleCheckout = async () => {
        for (const item of cart.Storage) {
            await SendToDB(item.payload);
        }
        localStorage.removeItem("shoppingCart");
        setCart(initializeCart());
        alert("Checkout complete!");
    };

    return (
        <div>
            <h1>Shopping Cart</h1>
            <div>
                {cart.Storage.length > 0 ? (
                    cart.Storage.map((item, index) => (
                        <div key={index} style={{ marginBottom: "10px" }}>
                            <h3>{item.title}</h3>
                            <p>Price: ${item.price.toFixed(2)}</p>
                            <p>Tickets: {item.payload.AmountOfTickets}</p>
                            <button onClick={() => handleRemoveFromCart(item)}>Remove</button>
                        </div>
                    ))
                ) : (
                    <p>Your cart is empty.</p>
                )}
            </div>
            <h2>Total: ${cart.Total.toFixed(2)}</h2>
            {cart.Storage.length > 0 && (
                <button onClick={handleCheckout}>Checkout</button>
            )}
        </div>
    );
};

export default CartPage;
