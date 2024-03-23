import React, {useEffect, useState} from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import { useAuth } from "../../context/auth";
import "../../styles/AdminDashboardStyles.css";
import axios from "axios";
import moment from "moment/moment";
import {Link} from "react-router-dom";
import {
    DollarCircleOutlined,
    ShoppingCartOutlined,
    UserOutlined,
} from "@ant-design/icons";
import {toast} from "react-toastify";
const AdminDashboard = () => {
    const [auth] = useAuth();
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [sales, setSales] = useState();
    const [products, setProducts] = useState([]);
    var sale = 0;

    // get all products
    const getLowInventoryProducts  = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/lowest-inventory-product`);
            if(data?.success){
                setProducts(data?.products);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong in getting category");
        }
    };

    useEffect(() => {
        getLowInventoryProducts();
    }, []);
    const getOrders = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/latest-orders`);
            setOrders(data);
            data.forEach((o) => sale = sale + parseFloat(o?.payment.transaction.amount));
            setSales(sale);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (auth?.token) getOrders();
    }, [auth?.token]);
    const getUsers = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/all-users`);
            setUsers(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (auth?.token) getUsers();
    }, [auth?.token]);
    return (
        <Layout>
            <div className="container-fluid m-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        {/*<div className="card w-50 p-3">*/}
                        {/*    <h3>Admin Name: {auth?.user?.name}</h3>*/}
                        {/*    <h3>Admin Email: {auth?.user?.email}</h3>*/}
                        {/*    <h3>Admin Phone: {auth?.user?.phone}</h3>*/}
                        {/*</div>*/}
                        <div className="d-flex row">
                            <div className="card w-25 p-3 m-2">
                                <div className="row g-0">
                                    <div className="col-md-4">
                                        <ShoppingCartOutlined
                                            style={{
                                                color: "green",
                                                backgroundColor: "rgba(0,255,0,0.25)",
                                                borderRadius: 20,
                                                fontSize: 24,
                                                padding: 8,
                                            }}
                                        />
                                    </div>
                                    <div className="col-md-8">
                                        <div className="card-body">
                                            <h5 className="card-title">Orders</h5>
                                            <p className="card-subtitle">{orders.length}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card w-25 p-3 m-2">
                                <div className="row g-0">
                                    <div className="col-md-4">
                                        <UserOutlined
                                            style={{
                                                color: "purple",
                                                backgroundColor: "rgba(0,255,255,0.25)",
                                                borderRadius: 20,
                                                fontSize: 24,
                                                padding: 8,
                                            }}
                                        />
                                    </div>
                                    <div className="col-md-8">
                                        <div className="card-body">
                                            <h5 className="card-title">Customer</h5>
                                            <p className="card-subtitle">{users.length}</p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="card w-25 p-3 m-2">
                                <div className="row g-0">
                                    <div className="col-md-4">
                                        <DollarCircleOutlined
                                            style={{
                                                color: "red",
                                                backgroundColor: "rgba(255,0,0,0.25)",
                                                borderRadius: 20,
                                                fontSize: 24,
                                                padding: 8,
                                            }}
                                        />
                                    </div>
                                    <div className="col-md-8">
                                        <div className="card-body">
                                            <h5 className="card-title">Sales</h5>
                                            <p className="card-subtitle">CAD ${parseFloat(sales)}</p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="p-3">
                            <h1 className="text-center">All Orders</h1>

                            <table className="table">
                                <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Buyer</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Payment</th>
                                    <th scope="col">Quantity</th>
                                    <th scope="col">Details</th>
                                </tr>
                                </thead>
                                <tbody>
                                {orders?.map((o, i) => {
                                    return (
                                        <tr>
                                            <td>{i + 1}</td>
                                            <td>{o?.status}</td>
                                            <td>{o?.buyer?.name}</td>
                                            <td>{moment(o?.createdAt).fromNow()}</td>
                                            <td>${o?.payment.transaction.amount}</td>
                                            <td>{o?.products?.length}</td>
                                            <td><Link to="/dashboard/admin/orders">Details</Link></td>
                                        </tr>
                                    );
                                })}

                                </tbody>
                            </table>
                        </div>
                        <div className="p-3">
                            <h1 className="text-center">Latest Inventory</h1>

                            <table className="table">
                                <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Quantity</th>
                                    <th scope="col">Category</th>
                                    <th scope="col">Details</th>
                                </tr>
                                </thead>
                                <tbody>
                                {products?.map((p, i) => {
                                    return (
                                        <tr>
                                            <td>{i + 1}</td>
                                            <td>{p?.name}</td>
                                            <td>{p?.quantity}</td>
                                            <td>{p?.category.name}</td>
                                            <td><Link to={`/dashboard/admin/product/${p.slug}`}>Details</Link></td>
                                        </tr>
                                    );
                                })}

                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>

        </Layout>
    );
}


export default AdminDashboard;