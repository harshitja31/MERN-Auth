import UserModel from "../models/userModel.js";

const getUserData = async (req, res) => {
    const userId = req.userId;

    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "Missing user ID"
        });
    }

    try {
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            userData: {
                name: user.name,
                email: user.email,
                isAccountVerified: user.isAccountVerified
            }
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

export { getUserData };
