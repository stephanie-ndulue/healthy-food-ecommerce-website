import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import cookie from "cookie";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        default: 0
    }    
}, { timestamps: true });

//hashed password
userSchema.pre("save", async function (next) {
    //update
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

//match password
userSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

//SIGN TOKEN
userSchema.methods.getSignedToken = function (res) {
    const acccesToken = JWT.sign(
        { id: this._id },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.JWT_ACCESS_EXPIREIN }
    );
    const refreshToken = JWT.sign(
        { id: this._id },
        process.env.JWT_REFRESH_TOKEN,
        { expiresIn: process.env.JWT_REFRESH_EXIPREIN }
    );
    res.cookie("refreshToken", `${refreshToken}`, {
        maxAge: 86400 * 7000,
        httpOnly: true,
    });
};
export default mongoose.model('users', userSchema);


// 0 - Users
// 1 - Admin