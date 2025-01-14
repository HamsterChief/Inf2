import * as React from "react";
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import EditShow from "./components/EditShow";
import ReservationForm from "./components/ReservationForm";
import PrivateRoute from './components/PrivateRoute';
import ErrorPage from "./shared/ErrorPage";
import ShowDetailsPage from "./pages/Details";  
import CartPage from "./components/Cart";

createRoot(document.getElementById('root')!)
    .render(
        <React.StrictMode>
            <BrowserRouter>
                <Routes>
                    {/* Route naar de Home pagina */}
                    <Route path="/" element={<Home />} />

                    <Route path="shows/:id" element={<ShowDetailsPage />} />
                    
                    {/* Route naar de Login pagina */}
                    <Route path="/login" element={<Login />} />

                    <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />

                    {/* Route naar de Edit Show pagina */}
                    <Route path="/show/edit/:id" element={<EditShow />} />

                    <Route path="/reservation-form" element={<ReservationForm />} />

                    {/* Route naar de Cart */}
                    <Route path="/cart" element={<CartPage />} />

                    {/* Foutpagina voor niet-bestaande routes */}
                    <Route path="*" element={<ErrorPage />} />


                </Routes>
            </BrowserRouter>
        </React.StrictMode>
    );
