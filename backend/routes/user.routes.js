import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { getCurrentUser, getProfile, suggestedUsers, editProfile, follow, followingList, search, getAllNotifications, markAsRead } from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.js"

const userRouter = express.Router()

userRouter.get("/current", isAuth, getCurrentUser)
userRouter.get("/suggested", isAuth, suggestedUsers)
userRouter.get("/followingList", isAuth, followingList)
userRouter.get("/getProfile/:userName", isAuth, getProfile)
userRouter.get("/search", isAuth, search)
userRouter.get("/getAllNotifications", isAuth, getAllNotifications)
userRouter.post("/markAsRead/", isAuth, markAsRead)
userRouter.get("/follow/:targetUserId", isAuth, follow)
userRouter.post("/editProfile", isAuth, upload.single("profileImage"), editProfile)

export default userRouter