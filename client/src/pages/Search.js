import React from "react";
import Layout from "../components/Layout/Layout";
import { useSearch } from "../context/search";
import { useCart } from "../context/cart";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../styles/Search.css";

const Search = () => {
    const [values, setValues] = useSearch();
    const [cart, setCart] = useCart();
    const navigate = useNavigate();
    return (
        <Layout title={'Search results'}>
            <div className="container" style={{ minHeight: "85vh"}}>
                <div className="text-center">

                    <h1>Search Results</h1>
                    <h4>{values?.results.length < 1 ? 'Sorry! The product you are looking for is currently unavailable. Please try another product search.' : `Found ${values?.results.length} Products`}</h4>
                    <div className="d-flex flex-wrap mt-4 search-products">

                        {values?.results.map((p) => (
                            <div className="card m-2" style={{width: "18rem"}}>
                                <img
                                    src={`${process.env.REACT_APP_API}/api/v1/product/product-image/${p._id}`}
                                    className="card-img-top m-3"
                                    alt={p.name}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{p.name}</h5>
                                    <p className="card-text card-price" style={{color: '#f77062'}}> CA${p.price}</p>
                                    <p className="card-text">
                                        {p.description.substring(0, 30)}...
                                    </p>
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
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Search;