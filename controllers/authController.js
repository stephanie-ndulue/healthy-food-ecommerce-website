import { hashPassword, comparePassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";
import orderModel from "../models/orderModel.js";
import errorResponse from "../utils/errroResponse.js";

// JWT TOKEN
export const sendToken = (user, statusCode, res) => {
    const token = user.getSignedToken(res);
    res.status(statusCode).json({
        success: true,
        token,
    });
};

export const registerController = async(req, res) => {
    try {
        const {name, email, password, phone, address} = req.body;
        // validation
        if(!name){
            return res.send({error: 'Name is required'});
        }
        if(!email){
            return res.send({error: 'Email is required'});
        }
        if(!password){
            return res.send({error: 'Password is required'});
        }
        if(!phone){
            return res.send({error: 'Phone is required'});
        }
        if(!address){
            return res.send({error: 'Address is required'});
        }

        // check user
        const  existingUser = await userModel.findOne({"email": email});
         // existing user
         if(existingUser){
            return res.status(200).send({
                success: false,
                message: 'Already Registered, please login'
            })
         }

         //register user
         const hashedPassword = await hashPassword(password);
         //save
         const user = await new userModel({name, email, phone, address, password:hashedPassword}).save();

         res.status(201).send({
            success: true,
            message: 'User Registered Successfully',
            user
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Registration',
            error
        })
    }
};

// POST LOGIN
export const loginController  = async(req, res) => {
    console.log("login controller");
    try {
        const  {email, password} = req.body;
        // validation
        if(!email || !password){
            return res.status(404).send({
                success: false,
                message: "Invalid email or password"
            });
        }

        // check user
        const user = await userModel.findOne({"email": email});
        if(!user){
            return res.status(200).send({
                success:false,
                message: "Email is not registered"
            });
        }
        const match = await comparePassword(password, user.password);
        if(!match){
            return res.status(200).send({
                success: false,
                message: "Invalid Password",
            });
        }

        //token
        const token = await JWT.sign({ _id: user._id}, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        res.status(200).send({
            success: true,
            message: "Login Successfully",
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role
            },
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in login",
            error
        });
    }

};
// test Controller

export const testController = (req, res) => {
    res.send("protected route");
}


//update profile
export const updateProfileController = async (req, res) => {
    try {
        const { name, email, password, address, phone } = req.body;
        const user = await userModel.findById(req.user._id);
        //password
        if (password && password.length < 6) {
            return res.json({ error: "Password is required and 6 character long" });
        }
        const hashedPassword = password ? await hashPassword(password) : undefined;
        const updatedUser = await userModel.findByIdAndUpdate(
            req.user._id,
            {
                name: name || user.name,
                password: hashedPassword || user.password,
                phone: phone || user.phone,
                address: address || user.address,
            },
            { new: true }
        );
        res.status(200).send({
            success: true,
            message: "Profile Updated Successfully",
            updatedUser,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error While Update profile",
            error,
        });
    }
};

//orders
export const getOrdersController = async (req, res) => {
    try {
        const orders = await orderModel
            .find({ buyer: req.user._id })
            .populate("products", "-image")
            .populate("buyer", "name");
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error While Getting Orders",
            error,
        });
    }
};
//orders
export const getAllOrdersController = async (req, res) => {
    try {
        const orders = await orderModel
            .find({})
            .populate("products", "-image")
            .populate("buyer", "name")
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error While Getting Orders",
            error,
        });
    }
};
//latest orders
export const getLatestOrdersController = async (req, res) => {
    try {
        const orders = await orderModel
            .find({})
            .populate("products", "-image")
            .populate("buyer", "name")
            .sort({ createdAt: -1 })
            .limit(10);
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error While Getting Orders",
            error,
        });
    }
};

//order status
export const orderStatusController = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const orders = await orderModel.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error While Updating Order",
            error,
        });
    }
};

export const getAllUsersController = async (req, res) => {
    try {
        const users = await userModel
            .find({})
            .sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error While Getting Users",
            error,
        });
    }
};
