import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { serverUrl } from '../App'
import { toggleFollow } from '../redux/userSlice'
import axios from "axios"

function FollowButton({ targetUserId, tailwind, onFollowChange }) {
    const { following } = useSelector(state => state.user)
    const isFollowing = following.includes(targetUserId)
    const dispatch = useDispatch()
    const handleFollow = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/user/follow/${targetUserId}`, { withCredentials: true })
            if(onFollowChange){
                onFollowChange()
            }
            dispatch(toggleFollow(targetUserId))
        } catch (error) {
            console.log(error.response)
        }
    }

    return (
        <button className={`${tailwind} font-medium `} onClick={handleFollow}>
            {isFollowing ? "Following" : "Follow"}
        </button>
    )
}

export default FollowButton
