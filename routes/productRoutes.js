import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { productController, createProductController, deleteProductController, singleProductController, updateProductController } from "../controllers/productController.js";
import formidable from 'express-formidable';

const router = express.Router();

// routes
// create product
router.post('/create-product', requireSignIn, isAdmin, formidable(), createProductController);

// update product
router.put('/update-product/:id', requireSignIn, isAdmin, updateProductController);

// get all product
router.get('/get-product', productController);

// get single product
router.get('/single-product/:slug', singleProductController);

// delete product
router.get('/delete-product/:id', requireSignIn, isAdmin, deleteProductController);

export default router;