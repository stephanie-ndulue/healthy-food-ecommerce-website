import React, {useState} from 'react';
import Layout from '../../components/Layout/Layout.js';
import axios from 'axios';
import { toast } from 'react-toastify';


const Register = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPAssword] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")

    // register form function
    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/register`, {name, email, password, phone, address});
        } catch (error) {
            console.log(error);
            toast.error("Something wen wrong")
        }
    }


    return (
        <Layout title={"Register - Food App"}>
            <div className='register'>
                <h1>Register Page</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)}
                            className="form-control" 
                            id="name" 
                            placeholder='Enter Your Name' 
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email address</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-control" 
                            id="email" 
                            placeholder='Enter Your Email Address'
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPAssword(e.target.value)}
                            className="form-control" 
                            id="password" 
                            placeholder='Enter Your Password'
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Phone</label>
                        <input 
                            type="text" 
                            value={phone} 
                            onChange={(e) => setPhone(e.target.value)}
                            className="form-control" 
                            id="phone" 
                            placeholder='Enter Your Phone Number'
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="address">Address</label>
                        <input 
                            type="text" 
                            value={address} 
                            onChange={(e) => setAddress(e.target.value)}
                            className="form-control" 
                            id="address" 
                            placeholder='Enter Your Address'
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>

            </div>
        </Layout>
    )
};


export default Register;
