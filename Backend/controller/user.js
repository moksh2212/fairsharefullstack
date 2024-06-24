import { User } from "../models/user.js";

export const insertUser = async (req, res) => {
    try {
        const u = req.body;
        console.log(u);
        
        // Check if the user already exists
        let existingUser = await User.findOne({ email: u.email });  // Assuming email is a unique identifier
        let createdUser;

        if (!existingUser) {
            createdUser = await User.create(u);
            console.log('User created:', createdUser);
            res.status(201).json(createdUser);
        } else {
            console.log('User already exists');
            res.status(200).json({ message: "Already Present" });
        }
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Error creating user' });
    }
};
