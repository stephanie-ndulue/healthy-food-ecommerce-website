import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import { useCart } from "../context/cart";

const HomePage = () => {
  const  navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  //get total count
  const getTotal = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-count`);
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };


  //load more
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);

  //get all category
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/category/get-category`);
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);

  //get products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/get-product`);
      setLoading(false);
      setProducts(data.products);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    if(!checked.length || !radio.length) getAllProducts();
  }, [checked.length, radio.length]);

  // filter by category
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  }

  // get filtered products
  const filterProduct = async () => {
    try {
      const {data} = await axios.post(`${process.env.REACT_APP_API}/api/v1/product/product-filters`, {checked, radio});
      setProducts(data?.products);
    } catch(error){
      console.log(error);
    }
  }

  useEffect(() => {
    if(checked.length || radio.length) filterProduct();
  }, [checked, radio]);


  return (
    <Layout title={"Home - Food App"}>
      <div>
        {/* hero section */}
        <div className="main">
          <div className="main__container">
            <div className="main__content">
              <div className="main__img--container">
                  <img id="main__img" src="images/pic1.svg" alt="hero" />
              </div>
              <h1>HEALTHY FOOD</h1>
              <h2>Discover new healthy dishes</h2>
              <button className="main__btn">
                <a href="#gettingStarted">Get Started</a>
              </button>
            </div>
            
          </div>
        </div>

        {/* Services Section */}
        <div className="services" id="gettingStarted">
          <h1>What do we offer?</h1>
          <div className="services__container">
            <div className="services__card">
              <h2>Browse through Multicultural dishes</h2>
              <a href="/products"><button className="services-button">Browse</button></a>
            </div>
            <div className="services__card">
              <h2>AI Personalized Recommendations Chat</h2>
              
                <a href="/register"><button className="services-button">Chat</button></a>
              
            </div>
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-md-2">
            <h4 className="text-center">Filter by Category</h4>
            <div className="d-flex flex-column">
              {categories?.map((c) => (
                  <Checkbox key={c._id} onChange={(e) => handleFilter(e.target.checked, c._id)}>
                    {c.name}
                  </Checkbox>
              ))}
            </div>
            <h4 className="text-center mt-4">Filter by Prices</h4>
            <div className="d-flex flex-column">
              <Radio.Group onChange={(e) => setRadio(e.target.value)}>
                {Prices?.map((p) => (
                    <div key={p._id}>
                      <Radio value={p.array}>{p.name}</Radio>
                    </div>
                ))}
              </Radio.Group>
            </div>
            <div className="d-flex flex-column mt-4">
              <button className="btn btn-danger" onClick={() => window.location.reload()}>
                RESET FILTERS
              </button>
            </div>
          </div>
          <div className="col-md-10">
            <h2 className="text-center">All Products</h2>
            <div className="d-flex flex-wrap">
              {products?.map(p => (
                  <div className="card m-2" style={{width: '18rem'}} key={p._id}>
                    <img src={`${process.env.REACT_APP_API}/api/v1/product/product-image/${p._id}`}
                         className="card-img-top" alt={p.name}/>
                    <div className="card-body">
                      <h5 className="card-title">{p.name}</h5>
                      <p className="card-text">{p.description.substring(0, 30)}</p>
                      <p className="card-text">$ {p.price}</p>
                      <button
                          className="btn btn-primary"
                          onClick={() => navigate(`/product/${p.slug}`)}>More Details</button>
                      <button
                          className="btn btn-secondary"
                          onClick={() => {
                            setCart([...cart, p]);
                            toast.success("Item added to cart");
                          }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
              ))}
            </div>
          </div>
          <div className="m-2 p-3">
            {products && products.length < total && (
                <button
                    className="btn loadmore"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(page + 1);
                    }}
                >
                  {loading ? (
                      "Loading ..."
                  ) : ( "Loadmore"
                  )}
                </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
