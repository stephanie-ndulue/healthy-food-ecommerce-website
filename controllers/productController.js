import productModel from "../models/productModel.js";
import slugify from "slugify";

export const createProductController = async(req, res) => {
    try {
        const {name} = req.body;
        if(!name) {
            return res.status(401).send({message: 'Name is required'})
        }
        const existingProduct = await productModel.findOne({name});
        if(existingProduct){
            return res.status(200).send({
                success: true,
                message: 'Product Already Exists'
            });
        }

        const product = await new productModel({name, slug:slugify(name)}.save());
        res.status(201).send({
            success: true,
            message: 'New Product created',
            product
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
        const { name } = req.body;
        const { id } = req.params;
        const product = await productModel.findByIdAndUpdate(
            id,
            { name, slug: slugify(name)},
            { new: true }
        );
        res.status(200).send({
            success: true,
            message: "Product Updated Successfully",
            product,
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
export const productController = async (req, res) => {
    try {
        const product = await productModel.find({});
        res.status(200).send({
            success: true,
            message: "All Products",
            product
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
        const product = await productModel.findOne({ slug: req.params.slug });
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


// delete product
export const deleteProductController = async (req, res) => {
    try {
        const { id } = req.params;
        await productModel.findByIdAndDelete(id);
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

