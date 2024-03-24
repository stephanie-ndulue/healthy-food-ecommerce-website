import React, { useState } from "react";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import Layout from "../components/Layout/Layout";
import {UserOutlined} from "@ant-design/icons";
import "../styles/ChatBotStyles.css";


const ChatBot = () => {
    const [text, setText] = useState("");
    // const [response, setResponse] = useState("");
    const [error, setError] = useState("");
    const [chat, setChat] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(text);
            setChat(chat => [text,...chat] )
            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/openai/chatbot`, { text });
            console.log(data.msg);
            setChat(chat => [data.msg,...chat] )
            // setResponse(data.msg);
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
                <div className="row justify-content-center align-items-center">
                    <h1 className="text-center">Food Nutritionist Bot</h1>
                    <div className="m-1 w-50">
                        <div className="mb-3 text-center">
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
                        <div className="mb-3 text-center">
                            <button className="btn btn-primary" onClick={handleSubmit}>
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center align-items-center">
                    {chat?.map((c, i) => {
                        return (
                            <div className="row justify-content-center align-items-center m-2">

                                <div className="card w-50 chat-text">
                                    <div className="d-fex"><UserOutlined />&nbsp;&nbsp;{(i % 2 === 0) ? "Bot" : "You"}</div>
                                    <p>{c}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Layout>
);
};

export default ChatBot;