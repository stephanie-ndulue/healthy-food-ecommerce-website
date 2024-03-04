import React from "react";
import Layout from "../components/Layout/Layout";
import { useAuth } from "../context/auth"; 

const HomePage = () => {
  const [auth, setAuth] = useAuth();
  return (
    <Layout title={"Home - Food App"}>
      <pre>{JSON.stringify(auth, null, 4)}</pre>
      <div>
        {/* hero section */}
        <div class="main">
          <div class="main__container">
            <div class="main__content">
            <div class="main__img--container">
                <img id="main__img" src="images/pic1.svg" alt="hero" />
            </div>
              <h1>HEALTHY FOOD</h1>
              <h2>Discover new healthy dishes</h2>
              <button class="main__btn">
                <a href="#gettingStarted">Get Started</a>
              </button>
            </div>
            
          </div>
        </div>

        {/* Services Section */}
        <div class="services" id="gettingStarted">
          <h1>What do we offer?</h1>
          <div class="services__container">
            <div class="services__card">
              <h2>Browse through Multicultural dishes</h2>
              <a href="/products"><button className="services-button">Browse</button></a>
            </div>
            <div class="services__card">
              <h2>AI Personalized Recommendations Chat</h2>
              
                <a href="/register"><button className="services-button">Chat</button></a>
              
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
