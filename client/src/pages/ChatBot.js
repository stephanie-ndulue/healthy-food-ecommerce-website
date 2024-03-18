import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import Layout from "../components/Layout/Layout";
import {
    Typography,
    Card,
} from "@mui/material";


const ChatBot = () => {
    // const navigate = useNavigate();
    const [text, setText] = useState("");
    const [response, setResponse] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(text);
            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/openai/chatbot`, { text });
            console.log(data.msg);
            setResponse(data.msg);
        } catch (err) {
            console.log(error);
            if (err.response.data.error) {
                setError(err.response.data.error);
            } else if (err.message) {
                setError(err.message);
            }
            setTimeout(() => {
                setError("");
            }, 5000);
        }
    };
    return (
        <Layout title="Dashboard - Create Product">
            <div className="container-fluid m-3 p-3">
                <div className="row">
                    <div className="col-md-12">
                        <h1>ChatBot</h1>
                        <div className="m-1 w-75">
                            <div className="mb-3">
                                <label className="form-label">Write what you want to ask</label>
                                <textarea type="text"
                                          placeholder="Write what you want to ask"
                                          className="form-control"
                                          value={text}
                                          onChange={(e) => {
                                              setText(e.target.value);
                                          }}
                                />
                            </div>
                            <div className="mb-3">
                                <button className="btn btn-primary" onClick={handleSubmit}>
                                    Submit
                                </button>
                            </div>
                        </div>
                        {response ? (
                            <div>{response}</div>
                        ) : (
                            <div>Bot Response</div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ChatBot;