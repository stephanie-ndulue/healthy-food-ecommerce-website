import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
// import toast from "react-hot-toast";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { Link } from "react-router-dom";
import "../../styles/AdminProducts.css";

const Products = () => {
    const [products, setProducts] = useState([]);

    

    // get all products
    const getAllProducts  = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/get-product`);
            if(data?.success){ 
                setProducts(data?.products);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong in getting category");
        }
    };

    useEffect(() => {
        getAllProducts();
    }, []);


    return (
        <Layout title="Dashboard - Product List">         
            <div className="container-fluid m-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu/>
                    </div>
                    <div className="col-md-9">
                        <h1 className="text-center"> All Products List </h1>
                        <div className="d-flex row admin-products">
                        {products?.map(p => (
                            <Link key={p._id} to={`/dashboard/admin/product/${p.slug}`}>
                                <div className="card m-2 col-md-3" style={{width: '18rem'}} key={p._id}>
                                    <img src={`${process.env.REACT_APP_API}/api/v1/product/product-image/${p._id}`} className="card-img-top m-3" alt={p.name} />
                                    <div className="card-body">
                                        <h5 className="card-title">{p.name}</h5>
                                        <p className="card-text">{p.description}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}


export default Products;