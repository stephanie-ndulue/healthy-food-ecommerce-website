import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import { AiFillWarning } from "react-icons/ai";
import axios from "axios";
// import toast from "react-hot-toast";
import DropIn from "braintree-web-drop-in-react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CartPage = () => {
    const [auth, setAuth] = useAuth();
    const [cart, setCart] = useCart();
    const [clientToken, setClientToken] = useState("");
    const [instance, setInstance] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    //total price
    const totalPrice = () => {
        try {
            let total = 0;
            cart?.map((item) => {
                total = total + item.price;
            });
            return total.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
            });
        } catch (error) {
            console.log(error);
        }
    };
    //detele item
    const removeCartItem = (pid) => {
        try {
            let myCart = [...cart];
            let index = myCart.findIndex((item) => item._id === pid);
            myCart.splice(index, 1);
            setCart(myCart);
            localStorage.setItem("cart", JSON.stringify(myCart));
        } catch (error) {
            console.log(error);
        }
    };


    //get payment gateway token
    const getToken = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/braintree/token`);
            setClientToken(data?.clientToken);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getToken();
    }, [auth?.token]);

    //handle payments
    const handlePayment = async () => {
        try {
            setLoading(true);
            const { nonce } = await instance.requestPaymentMethod();
            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/product/braintree/payment`, {
                nonce,
                cart,
            });
            setLoading(false);
            localStorage.removeItem("cart");
            setCart([]);
            navigate("/dashboard/user/orders");
            toast.success("Payment Completed Successfully ");
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };


    return (
        <Layout>
            <div className=" cart-page">
                <div className="row">
                    <div className="col-md-12">
                        <h1 className="text-center bg-light p-2 mb-1">
                            {!auth?.user
                                ? "Hello Guest"
                                : `Hello  ${auth?.token && auth?.user?.name}`}
                            <p className="text-center">
                                {cart?.length
                                    ? `You Have ${cart.length} items in your cart ${
                                        auth?.token ? "" : "please login to checkout !"
                                    }`
                                    : " Your Cart Is Empty"}
                            </p>
                        </h1>
                    </div>
                </div>
                <div className="container ">
                    <div className="row ">
                        <div className="col-md-6  p-0 m-0">
                            {cart?.map((p) => (
                                <div className="row card flex-row m-2" key={p._id}>
                                    <div className="col-md-4 p-2">
                                        <img
                                            src={`${process.env.REACT_APP_API}/api/v1/product/product-image/${p._id}`}
                                            className="card-img-top"
                                            alt={p.name}
                                            width="100%"
                                            height={"130px"}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <p>{p.name}</p>
                                        <p>{p.description.substring(0, 30)}</p>
                                        <p>Price : ${p.price}</p>
                                    </div>
                                    <div className="col-md-4 cart-remove-btn">
                                        <button
                                            className="btn btn-danger m-3"
                                            onClick={() => {
                                                removeCartItem(p._id);
                                                toast.success("Item removed from cart");
                                            }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="col-md-5 cart-summary m-4">
                            <h2>Cart Summary</h2>
                            <p>Total | Checkout | Payment</p>
                            <hr/>
                            <h4>Total : {totalPrice()} </h4>
                            {auth?.user?.address ? (
                                <>
                                    <div className="mb-3">
                                        <h4>Your current Information:</h4>
                                        <h5>Name: {auth?.user?.name}</h5>
                                        <h5>Email: {auth?.user?.email}</h5>
                                        <h5>Phone Number: {auth?.user?.phone}</h5>
                                        <h5>Current Address: {auth?.user?.address}</h5>
                                        <button
                                            className="btn btn-outline-success"
                                            onClick={() => navigate("/dashboard/user/profile")}
                                        >
                                            Update Your Information
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="mb-3">
                                    {auth?.token ? (
                                        <button
                                            className="btn btn-outline-warning"
                                            onClick={() => navigate("/dashboard/user/profile")}
                                        >
                                            Update Address
                                        </button>
                                    ) : (
                                        <button
                                            className="btn btn-outline-warning"
                                            onClick={() =>
                                                navigate("/login", {
                                                    state: "/cart",
                                                })
                                            }
                                        >
                                            Please Login to checkout
                                        </button>
                                    )}
                                </div>
                            )}
                            <div className="mt-2">
                                {!clientToken || !auth?.token || !cart?.length ? (
                                    ""
                                ) : (
                                    <>
                                        <DropIn
                                            options={{
                                                authorization: clientToken,
                                                paypal: {
                                                    flow: "vault",
                                                },
                                            }}
                                            onInstance={(instance) => setInstance(instance)}
                                        />

                                        <button
                                            className="btn btn-primary"
                                            onClick={handlePayment}
                                            disabled={loading || !instance || !auth?.user?.address}
                                        >
                                            {loading ? "Processing ...." : "Make Payment"}
                                        </button>
                                    </>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};
export default CartPage;