import slugify from "slugify";
import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import orderModel from "../models/orderModel.js";

import fs from "fs";
import braintree from "braintree";
import dotenv from "dotenv";

dotenv.config();

//payment gateway
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

export const createProductController = async(req, res) => {
    try {
        const {name, description, price, category, quantity, shipping} = req.fields;
        const {image} = req.files;

        // validation
        switch(true){
            case !name:
                return res.status(500).send({message: 'Name is required'})
            case !description:
                return res.status(500).send({message: 'Description is required'})
            case !price:
                return res.status(500).send({message: 'Price is required'})
            case !category:
                return res.status(500).send({message: 'Category is required'})
            case !quantity:
                return res.status(500).send({message: 'Quantity is required'})
            case image && image.size > 1000000:
                return res.status(500).send({message: 'Image is required and should be less than 1mb'})
        }
        
        const products = new productModel({...req.fields, slug:slugify(name)});
        if(image){
            products.image.data = fs.readFileSync(image.path);
            products.image.contentType = image.type;
        }

        await products.save();
        res.status(201).send({
            success: true,
            message: "Product Created Successfully",
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error in creating Product'
        })
    }
};

// update product

export const updateProductController = async (req, res) => {
    try {
        const {name, description, price, category, quantity, shipping} = req.fields;
        const {image} = req.files;

        // validation
        switch(true){
            case !name:
                return res.status(500).send({message: 'Name is required'})
            case !description:
                return res.status(500).send({message: 'Description is required'})
            case !price:
                return res.status(500).send({message: 'Price is required'})
            case !category:
                return res.status(500).send({message: 'Category is required'})
            case !quantity:
                return res.status(500).send({message: 'Quantity is required'})
            case image && image.size > 1000000:
                return res.status(500).send({message: 'Image is required and should be less than 1mb'})
        }
        
        const products = await productModel.findByIdAndUpdate(req.params.pid, 
            {...req.fields, slug:slugify(name)}, {new: true}
            );
        if(image){
            products.image.data = fs.readFileSync(image.path);
            products.image.contentType = image.type;
        }

        await products.save();
        res.status(201).send({
            success: true,
            message: "Product Updated Successfully",
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error in Product Update'
        })
    }
}


// get all product
export const getProductController = async (req, res) => {
    try {
        const products = await productModel
            .find({})
            .populate('category')
            .select("-image")
            .limit(15)
            .sort({createdAt: -1});
        res.status(200).send({
            success: true,
            totalCount: products.length,
            message: "All Products",
            products
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error getting all Products"
        })
    }
}


// get single product
export const singleProductController = async (req, res) => {
    try {
        const product = await productModel
            .findOne({ slug: req.params.slug })
            .select('-image')
            .populate('category');
        res.status(200).send({
            success: true,
            message: "Get Single Product Successfully",
            product
        })

    } catch (error) {
        console.log (error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while getting single product"
        })
    }
}

// get product image
export const getProductImageController = async(req, res) => {
    try{
        const product = await productModel.findById(req.params.pid).select("image");
        if(product.image.data) {
            res.set("Content-type", product.image.contentType);
            return res.status(200).send(product.image.data);
        }
    } catch (error){
        console.log (error);
        res.status(500).send({
            success: false,
            message: "Error while getting product image",
            error
        });
    }
}


// delete product
export const deleteProductController = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.pid).select("-image");
        res.status(200).send({
            success: true,
            message: "Product deleted successfully"
        });
    } catch (error) {
        console.log (error);
        res.status(500).send({
            success: false,
            message: "Error while deleting product",
            error
        });
    }
}

// get all product
export const productFiltersController = async (req, res) => {
    try {
        const {checked, radio} = req.body;
        let args = {};
        if(checked.length > 0) 
            args.category = checked;
        if(radio.length) 
            args.prices = { $gte: radio[0], $lte: radio[1] }
        const products = await productModel.find(args);
        res.status(200).send({
            success: true,
            products,
        });

    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            error,
            message: "Error while filtering Products"
        })
    }

}

// product count
export const productCountController = async(req, res) => {
    try {
        const total = await productModel.find({}).estimatedDocumentCount();
        res.status(200).send({
            success: true,
            total,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: "Error in Product Count",
            error,
            success: false
        })
    }
}

// product list per page
export const productListController = async(req, res) => {
    try {
        const perPage = 2;
        const page = req.params.page ? req.params.page : 1;
        const products = await productModel
            .find({})
            .select("-image")
            .skip((page - 1) * perPage)
            .limit(perPage)
            .sort({ createdAt: -1 })

        res.status(200).send({
            success: true,
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: "Error in Product Page Controller",
            error,
            success: false
        })
    }
}


// search product
export const searchProductController = async(req, res) => {
    try {
        const {keyword} = req.params;
        const results = await productModel.find({
            $or: [
                { name: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        }).select("-image");
        res.json(results);
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: "Error in Search Product API",
            error,
            success: false
        })
    }
}


// get products by category
export const productCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.findOne({ slug: req.params.slug });
        const products = await productModel.find({ category }).populate("category");
        res.status(200).send({
            success: true,
            category,
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            error,
            message: "Error While Getting products",
        });
    }
};


//payment gateway api
//token
export const braintreeTokenController = async (req, res) => {
    try {
        gateway.clientToken.generate({}, function (err, response) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(response);
            }
        });
    } catch (error) {
        console.log(error);
    }
};

//payment
export const brainTreePaymentController = async (req, res) => {
    try {
        const { nonce, cart } = req.body;
        let total = 0;
        cart.map((i) => {
            total += i.price;
        });
        let newTransaction = gateway.transaction.sale(
            {
                amount: total,
                paymentMethodNonce: nonce,
                options: {
                    submitForSettlement: true,
                },
            },
            function (error, result) {
                if (result) {
                    const order = new orderModel({
                        products: cart,
                        payment: result,
                        buyer: req.user._id,
                    }).save();
                    res.json({ ok: true });
                } else {
                    res.status(500).send(error);
                }
            }
        );
    } catch (error) {
        console.log(error);
    }
};

// get lowest inventory product
export const getLowInventoryProductController = async (req, res) => {
    try {
        const products = await productModel
            .find({})
            .populate('category')
            .select("-image")
            .limit(15)
            .sort({quantity: 1})
            .limit(10);
        res.status(200).send({
            success: true,
            totalCount: products.length,
            message: "All Products",
            products
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error getting all Products"
        })
    }
}