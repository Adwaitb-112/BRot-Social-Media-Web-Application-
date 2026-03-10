import User from "../models/user.model.js"
import uploadOnCloudinary from "../config/cloudinary.js"

export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId
        const user = await User.findById(userId).populate("posts loops posts.author posts.comments saved saved.author story following")
        if (!user) {
            return res.status(400).json({ message: "user not found" })
        }

        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({ message: `get current user error ${error}` })
    }
}

export const suggestedUsers = async (req, res) => {
    try {
        const user = await User.find({
            _id: { $ne: req.userId }
        }).select("-password")
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({ message: `get suggested user error ${error}` })
    }
}

export const editProfile = async (req, res) => {
    try {
        const { name, userName, bio, profession, gender } = req.body
        const user = await User.findById(req.userId).select("-password")
        if (!user) {
            return res.status(400).json({ message: "User not fond" })
        }
        const sameUserWithUserName = await User.findOne({ userName }).select("-password")

        if (sameUserWithUserName && sameUserWithUserName._id != req.userId) {
            return res.status(400).json({ message: "userName already exists" })
        }

        let profileImage;
        if (req.file) {
            profileImage = await uploadOnCloudinary(req.file.path)
        }

        user.name = name
        user.userName = userName
        user.profession = profession
        if (profileImage) {
            user.profileImage = profileImage
        }
        user.gender = gender
        user.bio = bio

        await user.save()
        return res.status(200).json(user)

    } catch (error) {
        return res.status(500).json({ message: `profile edit error ${error}` })
    }
}

export const getProfile = async (req, res) => {
    try {
        const userName = req.params.userName
        const user = await User.findOne({ userName }).select("-password").populate("posts loops followers following");
        if (!user) {
            return res.status(400).json({ message: "User not fond" })
        }
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({ message: `get profile error ${error}` })
    }
}


export const follow = async (req, res) => {
    try {
        const currentUserId = req.userId
        const targetUserId = req.params.targetUserId

        if (!targetUserId) {
            return res.status(400).json({ message: "Target User not fond" })
        }

        if (targetUserId == currentUserId) {
            return res.status(400).json({ message: "you cannot follow yourself" })
        }

        const currentUser = await User.findById(currentUserId)
        const targetUser = await User.findById(targetUserId)

        const isFollowing = currentUser.following.includes(targetUserId)
        if (isFollowing) {
            currentUser.following = currentUser.following.filter(id => id.toString() != targetUserId)
            targetUser.followers = targetUser.followers.filter(id => id.toString() != currentUserId)
            await currentUser.save()
            await targetUser.save()
            return res.status(200).json({
                following: false,
                message: "unfollowed succesfully"
            })
        }
        else {
            currentUser.following.push(targetUserId)
            targetUser.followers.push(currentUserId)

            if (currentUser._id != targetUserId._id) {
                const notification = await Notification.create({
                    sender: currentUser._id,
                    receiver: targetUserId._id,
                    type: "follow",
                    message: "started following you"
                })
                const populatedNotification = await Notification.findById(notification._id).populate("sender receiver")
                const receiverSocketId = getSocketId(targetUserId._id)
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("newNotification", populatedNotification)
                }
            }


            await currentUser.save()
            await targetUser.save()
            return res.status(200).json({
                following: true,
                message: "followed succesfully"
            })
        }

    } catch (error) {
        return res.status(500).json({ message: `follow error ${error}` })
    }
}

export const followingList = async (req, res) => {
    try {
        const result = await User.findById(req.userId)
        return res.status(200).json(result?.following)
    } catch (error) {
        return res.status(500).json({ message: `followingList error ${error}` })

    }
}

export const search = async (req, res) => {
    try {
        const keyWord = req.query.keyWord
        if (!keyWord) {
            return res.status(400).json({ message: "keyword is required" })
        }

        const users = await User.find({
            $or: [
                { userName: { $regex: keyWord, $options: "i" } },
                { name: { $regex: keyWord, $options: "i" } }
            ]
        }).select("-password")

        return res.status(200).json(users)
    } catch (error) {
        return res.status(500).json({ message: `search error ${error}` })

    }
}