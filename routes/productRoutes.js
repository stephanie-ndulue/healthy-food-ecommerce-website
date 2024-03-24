import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
    getProductController,
    createProductController,
    deleteProductController,
    singleProductController,
    updateProductController,
    getProductImageController,
    productFiltersController,
    productCountController,
    productListController,
    searchProductController,
    productCategoryController,
    braintreeTokenController,
    brainTreePaymentController, getLowInventoryProductController
} from "../controllers/productController.js";
import formidable from 'express-formidable';

const router = express.Router();

// routes
// create product
router.post('/create-product', requireSignIn, isAdmin, formidable(), createProductController);

// update product
router.put('/update-product/:pid', requireSignIn, isAdmin, formidable(), updateProductController);

// get all product
router.get('/get-product', getProductController);

// get single product
router.get('/single-product/:slug', singleProductController);

// get product photo
router.get('/product-image/:pid', getProductImageController);

// delete product
router.delete('/delete-product/:pid', deleteProductController);

// filter product
router.post('/product-filters', productFiltersController);

// product count
router.get('/product-count', productCountController);

// product per page
router.get('/product-list/:page', productListController);

// search product
router.get('/search/:keyword', searchProductController);

// category wise product
router.get('/product-category/:slug', productCategoryController);

// get all product
router.get('/lowest-inventory-product', getLowInventoryProductController);

//payments routes
//token
router.get("/braintree/token", braintreeTokenController);

//payments
router.post("/braintree/payment", requireSignIn, brainTreePaymentController);

export default router;