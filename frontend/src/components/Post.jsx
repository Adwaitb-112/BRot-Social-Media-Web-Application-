import React, { useEffect, useState } from 'react'
import VideoPlayer from '../components/VideoPlayer'
import dp from "../assets/dp.png";
import { IoMdHeart } from "react-icons/io";
import { IoMdHeartEmpty } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { FaRegCommentAlt } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import axios from "axios"
import { serverUrl } from '../App';
import { setPostData } from '../redux/postSlice';
import { setUserData } from '../redux/userSlice';
import FollowButton from './FollowButton';
import { useNavigate } from 'react-router-dom';
import { setMessages } from '../redux/messageSlice';

function Post({ post }) {
    const { userData } = useSelector(state => state.user)
    const { postData } = useSelector(state => state.post)
    const { socket } = useSelector(state => state.socket)
    const [showComment, setShowComment] = useState(false)
    const [message, setMessage] = useState("")
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLike = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/post/like/${post._id}`, { withCredentials: true })
            const updatedPost = result.data

            const updatedPosts = postData.map(p => p._id == post._id ? updatedPost : p)
            dispatch(setPostData(updatedPosts))
        } catch (error) {
            console.log(error.response)
        }
    }

    const handleComment = async () => {
        try {
            const result = await axios.post(`${serverUrl}/api/post/comment/${post._id}`, { message }, { withCredentials: true })
            const updatedPost = result.data

            const updatedPosts = postData.map(p => p._id == post._id ? updatedPost : p)
            dispatch(setPostData(updatedPosts))
        } catch (error) {
            console.log(error.response)
        }
    }

    const handleSave = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/post/saved/${post._id}`, { withCredentials: true })

            dispatch(setUserData(result.data))
        } catch (error) {
            console.log(error.response)
        }
    }

    useEffect(() => {
        socket?.on("likedPost", (updatedData) => {
            const updatedPosts = postData.map(p => p._id == updatedData.postId ? { ...p, likes: updatedData.likes } : p)
            dispatch(setPostData(updatedPosts))
        })

        socket?.on("commentedPost", (updatedData) => {
            const updatedPosts = postData.map(p => p._id == updatedData.postId ? { ...p, comments: updatedData.comments } : p)
            dispatch(setPostData(updatedPosts))
        })
        return () => {
            socket?.off("likedPost"),
                socket?.off("commentedPost")
        }
    }, [socket, postData, dispatch])

    return (
        <div className='w-[90%] flex flex-col gap-[10px] bg-white items-center shadow-2xl shadow-[#00000058] rounded-2xl pb-[20px]'>
            <div className='w-full h-[80px] flex justify-between items-center px-[10px]'>
                <div className='flex justify-center items-center gap-[10px] md:gap-[20px]' onClick={() => navigate(`/profile/${post.author?.userName}`)}>

                    <div className='w-[40px] h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden md:w-[60px] md:h-[60px]'>
                        <img src={post.author?.profileImage || dp} alt="" className='w-full object-cover' />
                    </div>
                    <div className='font-semibold truncate w-[150px]'>
                        {post.author?.userName}
                    </div>
                </div>
                {post.author._id != userData._id &&
                    <FollowButton tailwind={'px-[10px] min-w-[60px] md:min-w-[100px] py-[5px] h-[30px] md:h-[40px] bg-[black] text-white rounded-2xl text-[14px] md:text-[16px]'} targetUserId={post.author._id} />}
            </div>

            <div className='w-[90%] flex items-center justify-center '>
                {post.mediaType == "image" && <div className='w-[90%]  flex items-center justify-center'>
                    <img src={post.media} alt="" className='w-[80%] rounded-2xl object-cover' /></div>}

                {post.mediaType == "video" && <div className='w-[80%] flex flex-col items-center justify-center '>
                    <img src={post.media} alt="" className='h-[60%] rounded-2xl' />
                    <VideoPlayer media={post.media} /></div>}
            </div>

            <div className='w-full h-[60px] flex justify-between items-center px-[20px] mt-[10px]'>
                <div className='flex justify-center items-center gap-[10px]'>
                    <div className='flex justify-center items-center gap-[5px]'>
                        {post.likes.includes(userData._id) && <IoMdHeart className='w-[25px] cursor-pointer h-[25px] text-red-600' onClick={handleLike} />}
                        {!post.likes.includes(userData._id) && <IoMdHeartEmpty className='w-[25px] cursor-pointer h-[25px]' onClick={handleLike} />}
                        <span>{post.likes.length}</span>
                    </div>
                    <div className='flex justify-center items-center gap-[5px]' onClick={() => setShowComment(prev => !prev)}>
                        <FaRegCommentAlt className='w-[25px] cursor-pointer h-[25px]' />
                        <span>{post.comments.length}</span>
                    </div>
                </div>
                <div onClick={handleSave}>
                    {!userData.saved.includes(post?._id) &&
                        <FaRegBookmark className='w-[25px] cursor-pointer h-[25px]' />}
                    {userData.saved.includes(post?._id) &&
                        <FaBookmark className='w-[25px] cursor-pointer h-[25px]' />}
                </div>
            </div>
            {post.caption &&
                <div className='w-full px-[20px] gap-[10px] flex justify-start items-center'>
                    <h1>{post.author.userName}</h1>
                    <div>{post.caption}</div>
                </div>}
            {showComment &&
                <div className='w-full flex flex-col gap-[30px] pb-[20px] '>
                    <div className='w-full h-[80px] flex items-center justify-between px-[20px] relative'>
                        <div className='w-[40px] h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden md:w-[60px] md:h-[60px]'>
                            <img src={post.author?.profileImage || dp} alt="" className='w-full object-cover' />
                        </div>
                        <input type="text" className='px-[10px] border-b-2 border-b-gray-500 w-[90%] outline-none h-[40px]' placeholder='Comment' onChange={(e) => setMessage(e.target.value)} value={message} />
                        <button className='absolute cursor-pointer right-[20px]'><IoSend className='w-[25px] h-[25px]' onClick={handleComment} /></button>
                    </div>

                    <div className='w-full overflow-auto max-h-[300px]'>
                        {post.comments?.map((com, index) => (
                            <div key={index} className='w-full px-[20px] py-[20px] flex items-center gap-[20px] border-b-2 border-b-gray-200'>
                                <div className='w-[40px] h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden md:w-[60px] md:h-[60px]'>
                                    <img src={com.author.profileImage || dp} alt="" className='w-full object-cover' />
                                </div>
                                <div>{com.message}</div>
                            </div>))}

                    </div>
                </div>}

        </div>
    )
}

export default Post
