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
                { role: "system", content: "Welcome to our food nutritionist service! How can I assist you today?" },
                { role: "user", content: `${text}`},
                { role: "system", content: "Sure! Can you tell me about your dietary preferences? Are you looking for anything specific such as vegan, gluten-free, or low-carb options?" },
                { role: "user", content: "I prefer vegetarian options."},
                { role: "system", content: "Great! Do you have any dietary restrictions or allergies I should be aware of?"},
                { role: "user", content: "No, I don't have any allergies."},
                { role: "system", content: "Excellent! How about your taste preferences? Do you prefer sweet, savory, or spicy foods?" },
                { role: "user", content: "I like savory foods."},
                { role: "system", content: "Got it! Based on your preferences, I recommend the following products from our e-commerce site:" },

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
