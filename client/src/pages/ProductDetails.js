import React, {useState, useEffect} from 'react';
import Layout from '../components/Layout/Layout';
import axios from 'axios';
import {useNavigate, useParams} from "react-router-dom";
import { useCart } from "../context/cart";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductDetails = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState({});
    const [cart, setCart] = useCart();

    // initial details
    useEffect(() => {
        if(params?.slug) getProduct();
    }, [params?.slug]);

    // get product
    const getProduct = async () => {
        try {
            const {data} = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/single-product/${params.slug}`);
            setProduct(data?.product);
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <Layout title={"Products - Food App"}>
            <div className="row container product-details">
            <h1 className="text-center">Product Details</h1>
            
                <div className="col-md-6" >
                <img
                        src={`${process.env.REACT_APP_API}/api/v1/product/product-image/${product._id}`}
                        alt={product.name}
                        style={{ width: "75%"}}
                    />
                </div>
                <div className="col-md-6 product-details-info">
                    
                    <h6>Name : {product.name}</h6>
                    
                    <h6>Description : {product.description}</h6>
                    <h6>
                        Price :
                        {product?.price?.toLocaleString("en-US", {
                            style: "currency",
                            currency: "CAD",
                        })}
                    </h6>
                    <h6>Category : {product?.category?.name}</h6>
                    <button
                        className="btn btn-success"
                        onClick={() => {
                            setCart([...cart, product]);
                            toast.success("Item added to cart");
                        }}
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </Layout>
    )
}


export default ProductDetails