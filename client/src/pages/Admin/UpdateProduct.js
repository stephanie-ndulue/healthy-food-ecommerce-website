import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import { useNavigate, useParams } from "react-router-dom"; 

const {Option} = Select;


const UpdateProduct = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [shipping, setShipping] = useState("");
    const [image, setImage] = useState("");
    const [id, setId] = useState("");


    // get single product
    const getSingleProduct = async () => {
        try{
            const {data} = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/single-product/${params.slug}`);
            setName(data.product.name);
            setId(data.product._id);
            setDescription(data.product.description);
            setPrice(data.product.price);
            setQuantity(data.product.quantity);
            setCategory(data.product.category);
            setShipping(data.product.shipping);
            setCategory(data.product.category._id);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getSingleProduct();
        //eslint-disable-next-line
    }, []);
    
    // get all category
    const getAllCategory  = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/category/get-category`);
            if(data?.success){ 
                setCategories(data?.category);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong in getting category");
        }
    };

    useEffect(() => {
        getAllCategory();
    }, []);

    // update product function
    const handleUpdate = async(e) => {
        e.preventDefault();
        try{
            const productData = new FormData();
            productData.append("name", name);
            productData.append("description", description);
            productData.append("price", price);
            productData.append("quantity", quantity);
            image && productData.append("image", image);
            productData.append("category", category);
            // console.log(productData);
            // const {data} = axios.put(`${process.env.REACT_APP_API}/api/v1/product/update-product/${id}`, productData);
            const { data } = axios.put(
                `${process.env.REACT_APP_API}/api/v1/product/update-product/${id}`,
                productData
              );
            if(data?.success){
                toast.error(data?.message);
            } else {
                toast.success("Product updated successfully");
                navigate("/dashboard/admin/products");
            }
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong');
        }
    };

    //delete a product
    const handleDelete = async () => {
        try {
            let answer = window.prompt("Are You Sure want to delete this product ? ");
            if (!answer) return;
            const { data } = await axios.delete(
                `${process.env.REACT_APP_API}/api/v1/product/delete-product/${id}`
            );
            toast.success("Product Deleted Succfully");
            navigate("/dashboard/admin/products");
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    };


    return (
        <Layout title="Dashboard - Update Product">            
            <div className="container-fluid m-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <h1>Update Product</h1>
                        <div className="m-1 w-75">
                            <label className="form-label">Select a Category</label>
                            <Select variant = {false}
                                placeholder="Select a Category"
                                size="large"
                                showSearch
                                className="form-select mb-3" 
                                onChange={(value) => {setCategory(value)}}
                                value={category}
                            >
                                {categories?.map((c) => (
                                    <Option key={c._id} value={c._id}>
                                        {c.name}
                                    </Option>
                                ))}
                            </Select>
                            <div className="mb-3">
                                <label className="form-label">Upload Image</label>
                                <label className="btn btn-outline-secondary col-md-12">
                                    {image ? image.name : "Upload Image"}
                                    <input type="file"
                                        name="image"
                                        accept="image/*"
                                        onChange={(e) => setImage(e.target.files[0])}
                                        hidden
                                    />
                                </label>
                            </div>
                            <div className="mb-3">
                                { image ? (
                                    <div className="text-center">
                                        <img src={URL.createObjectURL(image)}
                                            alt="product_image"
                                            height={"200px"}
                                            className="img img-responsive"
                                        />
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <img src={`${process.env.REACT_APP_API}/api/v1/product/product-image/${id}`} 
                                            alt="product_image"
                                            height={"200px"}
                                            className="img img-responsive"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Product Name</label>
                                <input type="text"
                                    value={name}
                                    placeholder="Write Product Name"
                                    className="form-control"
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Product Description</label>
                                <textarea type="text"
                                    value={description}
                                    placeholder="Write Product Description"
                                    className="form-control"
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Product Price</label>
                                <input type="number"
                                    value={price}
                                    placeholder="Write Product Price"
                                    className="form-control"
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Product Quantity</label>
                                <input type="number"
                                    value={quantity}
                                    placeholder="Write Product Quantity"
                                    className="form-control"
                                    onChange={(e) => setQuantity(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Select shipping</label>
                                <Select variant = {false}
                                    placeholder="Select shipping"
                                    size="large"
                                    showSearch
                                    className="form-select mb-3" onChange={(value) => {setShipping(value)}}
                                    value = {shipping ? "Yes" : "No"}
                                >
                                    <Option value="0">No</Option>
                                    <Option value="1">Yes</Option>
                                </Select>
                            </div>
                            <div className="mb-3">
                                <button className="btn btn-primary" onClick={handleUpdate}>
                                    Update Product
                                </button>
                            </div>
                            <div className="mb-3">
                                <button className="btn btn-danger" onClick={handleDelete}>
                                DELETE PRODUCT
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default UpdateProduct;