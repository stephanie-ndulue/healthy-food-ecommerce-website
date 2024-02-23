import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Helmet } from "react-helmet";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Layout = ({ children, title }) => {
    return (
        <div>
            <Helmet>
                <title>{title}</title>
            </Helmet>
            <Header />
            <main>
                <ToastContainer/>
                {children}
            </main>
            <Footer />
        </div>
    )
}


export default Layout