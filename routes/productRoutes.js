import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { getProductController, createProductController, deleteProductController, singleProductController, updateProductController, getProductImageController } from "../controllers/productController.js";
import formidable from 'express-formidable';

const router = express.Router();

// routes
// create product
router.post('/create-product', requireSignIn, isAdmin, formidable(), createProductController);

// update product
router.put('/update-product/:pid', requireSignIn, isAdmin, updateProductController);

// get all product
router.get('/get-product', getProductController);

// get single product
router.get('/single-product/:slug', singleProductController);

// get product photo
router.get('/product-image/:pid', getProductImageController);

// delete product
router.get('/delete-product/:pid', requireSignIn, isAdmin, deleteProductController);

export default router;