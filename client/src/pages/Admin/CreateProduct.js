import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
// import toast from "react-hot-toast";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { Select } from "antd";
import { useNavigate } from "react-router-dom"; 

const {Option} = Select;


const CreateProduct = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [shipping, setShipping] = useState("");
    const [image, setImage] = useState("");

    
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

    // create product function
    const handleCreate = async(e) => {
        e.preventDefault();
        try{
            const productData = new FormData();
            productData.append("name", name);
            productData.append("description", description);
            productData.append("price", price);
            productData.append("quantity", quantity);
            productData.append("image", image);
            productData.append("category", category);
            productData.append("shipping", shipping);

            const {data} = axios.post(`${process.env.REACT_APP_API}/api/v1/product/create-product`, productData);
            if(data?.success){
                toast.error(data?.message);
            } else {
                toast.success("Product created successfully");
                navigate("/dashboard/admin/products");
            }
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong');
        }
    }


    return (
        <Layout title="Dashboard - Create Product">            
            <div className="container-fluid m-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <h1>Create Product</h1>
                        <div className="m-1 w-75">
                            <label className="form-label">Select a Category</label>
                            <Select variant = {false}
                                placeholder="Select a Category"
                                size="large"
                                showSearch
                                className="form-select mb-3" onChange={(value) => {setCategory(value)}}
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
                                { image && (
                                    <div className="text-center">
                                        <img src={URL.createObjectURL(image)}
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
                                >
                                    <Option value="0">No</Option>
                                    <Option value="1">Yes</Option>
                                </Select>
                            </div>
                            <div className="mb-3">
                                <button className="btn btn-primary" onClick={handleCreate}>
                                    Create Product
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CreateProduct;