import React from 'react';
import Layout from '../components/Layout/Layout';

const About = () => {
    return (
        <Layout title={"About US - Food App"}>
            <div className='row about'>
                <div className='col-md-6'>
                    <img src="/images/burger.png" alt='about' style={{ width: "100%" }} />
                </div>
                <div className='col-md-4'>
                    <h1 className='text-center'>About</h1>
                </div>
            </div>
            
        </Layout>
    )
}


export default About