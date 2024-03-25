import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/CategoryProductStyles.css";
import axios from "axios";
import {toast} from "react-toastify";
import { useCart } from "../context/cart";

const CategoryProduct = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState([]);
    const [cart, setCart] = useCart();

    useEffect(() => {
        if (params?.slug) getPrductsByCat();
    }, [params?.slug]);
    const getPrductsByCat = async () => {
        try {
            const { data } = await axios.get(
                `${process.env.REACT_APP_API}/api/v1/product/product-category/${params.slug}`
            );
            setProducts(data?.products);
            setCategory(data?.category);
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <Layout>
            <div className="container mt-3 category">
                <h4 className="text-center">Category - {category?.name}</h4>
                <h6 className="text-center">{products?.length} result found </h6>
                <div className="row">
                    <div className="col-md-12 offset-1">
                        <div className="row d-flex flex-wrap">
                            {products?.map((p) => (
                                <div className="card m-2" key={p._id}>
                                    <img
                                        src={`${process.env.REACT_APP_API}/api/v1/product/product-image/${p._id}`}
                                        className="card-img-top"
                                        alt={p.name}
                                    />
                                    <div className="card-body">
                                        <div className="card-name-price">
                                            <h5 className="card-title">{p.name}</h5>
                                            
                                            <h5 className="card-title card-price">
                                                {p.price.toLocaleString("en-US", {
                                                    style: "currency",
                                                    currency: "CAD",
                                                })}
                                            </h5>
                                        </div>
                                        <p className="card-text ">
                                            {p.description.substring(0, 60)}...
                                        </p>
                                        <div className="card-name-price">
                                            <button
                                                className="btn btn-danger ms-1"
                                                onClick={() => navigate(`/product/${p.slug}`)}
                                            >
                                                More Details
                                            </button>
                                            <button
                                                className="btn btn-success"
                                                onClick={() => {
                                                    setCart([...cart, p]);
                                                    toast.success("Item added to cart");
                                                }}
                                            >
                                                Add to Cart
                                            </button>

                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CategoryProduct;