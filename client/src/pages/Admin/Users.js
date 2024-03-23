import React, {useEffect, useState} from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import axios from "axios";
import {useAuth} from "../../context/auth";
import moment from "moment";


const Users = () => {
    const [auth] = useAuth();
    const [users, setUsers] = useState([]);
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
        <Layout title="Dashboard - All Users">            
            <div className="container-fluid m-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">

                        <h1 className="text-center">All Users</h1>

                        <table className="table">
                            <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">Email</th>
                                <th scope="col">Phone</th>
                                <th scope="col">Address</th>
                                <th scope="col">Created At</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users?.map((u, i) => {
                                return (
                                    <tr>
                                        <td>{i + 1}</td>
                                        <td>{u?.name}</td>
                                        <td>{u?.email}</td>
                                        <td>{u?.phone}</td>
                                        <td>{u?.address}</td>
                                        <td>{moment(u?.createdAt).fromNow()}</td>
                                    </tr>
                                );
                            })}

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Users;