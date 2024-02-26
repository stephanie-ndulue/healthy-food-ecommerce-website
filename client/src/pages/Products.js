import React from 'react';
import Layout from '../components/Layout/Layout';

const Products = () => {
    return (
        <Layout title={"Products - Food App"}>
        <div className='row Products'>
            <div className='col-md-6'>
                <img src="/images/cheesecake.png" alt='products' style={{ width: "100%" }} />
            </div>
            <div className='col-md-4'>
                <h1 className='text-center'>Products</h1>
            </div>
        </div>
        </Layout>
    )
}


export default Products