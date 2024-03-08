import slugify from "slugify";
import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import fs from "fs";

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

