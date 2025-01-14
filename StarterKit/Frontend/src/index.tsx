import * as React from "react";
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import ShowDetailsPage from "./pages/Details";  // Import the ShowDetailsPage component
import ReservationForm from "./Components/ReservationForm";
import CartPage from './pages/CartPage';  // Import the new CartPage component

createRoot(document.getElementById('root')!)
    .render(
        <React.StrictMode>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="shows/:id" element={<ShowDetailsPage />} />
                    <Route path="/reservation-form" element={<ReservationForm />} />
                    <Route path="/cart" element={<CartPage />} />
                </Routes>
            </Router>
        </React.StrictMode>
    );
