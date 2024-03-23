import express from "express";
import {
    registerController,
    loginController,
    testController,
    updateProfileController,
    getOrdersController,
    getAllOrdersController,
    orderStatusController, getAllUsersController, getLatestOrdersController,
} from "../controllers/authController.js";
import { 
    isAdmin, 
    requireSignIn 
} from "../middlewares/authMiddleware.js";


// router object 
const router = express.Router();
4
// routing
// Register || METHOD POST
router.post('/register', registerController);

//LOGIN || METHOD POST
router.post('/login', loginController);

//test routes
router.get('/test', requireSignIn, isAdmin, testController);

//protected user route auth
router.get('/user-auth', requireSignIn, (req, res) => {
    res.status(200).send({ok: true});
});

//protected admin route auth
router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ok: true});
});

//update profile
router.put("/profile", requireSignIn, updateProfileController);

//orders
router.get("/orders", requireSignIn, getOrdersController);

//all orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

//latest orders
router.get("/latest-orders", requireSignIn, isAdmin, getLatestOrdersController);

// order status update
router.put("/order-status/:orderId", requireSignIn, isAdmin, orderStatusController);

//all orders
router.get("/all-users", requireSignIn, isAdmin, getAllUsersController);

export default router;