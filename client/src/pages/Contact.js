import React from 'react';
import Layout from '../components/Layout/Layout';

const Contact = () => {
    return (
        <Layout title={"Contact - Food App"}>
        <div className='row contact'>
            <div className='col-md-6'>
                <img src="/images/cheesecake.png" alt='contact' style={{ width: "100%" }} />
            </div>
            <div className='col-md-4'>
                <h1 className='text-center'>Contact</h1>
            </div>
        </div>
        </Layout>
    )
}


export default Contact