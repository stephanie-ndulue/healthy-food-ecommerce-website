import dotenv from "dotenv";
import OpenAI from "openai";
import {response} from "express";
// const configuration = new Configuration({
//     apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(configuration);
// configure env
dotenv.config();
const openai = new OpenAI();

export const chatbotController = async (req, res) => {
    try {
        const { text } = req.body;
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "You are a food nutritionist, start by getting to know the user's objectives" },
                { role: "user", content: `${text}`},
            ],
            model: "gpt-3.5-turbo",
        });
        var msg = '';
        if(completion){}
            msg = completion.choices[0].message.content;
        res.status(200).send({
            success: true,
            message: "Connected Successfully",
            msg,
        });
    } catch (err) {
        console.log(err);
        return res.status(404).json({
            message: err.message,
        });
    }
};
