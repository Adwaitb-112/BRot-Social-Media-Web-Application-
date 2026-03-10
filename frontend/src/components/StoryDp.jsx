import React, { useEffect, useState } from 'react'
import dp from "../assets/dp.png";
import { FaCirclePlus } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import { serverUrl } from '../App'
import { useSelector } from 'react-redux';

function StoryDp({ ProfileImage, userName, story }) {
    const { userData } = useSelector(state => state.user)
    const { storyData, storyList } = useSelector(state => state.story)
    const navigate = useNavigate()
    const [viewed, setViewed] = useState(false)

    useEffect(() => {
        if (story?.viewers?.some((viewer) =>
            viewer?._id?.toString() === userData._id?.toString() || viewer?.toString() == userData._id.toString()
        )) {
            setViewed(true)
        }
        else {
            setViewed(false)
        }
    }, [story, userData, storyList])

    const handelViewers = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/story/view/${story._id}`, { withCredentials: true })
        } catch (error) {
            console.log(error)

        }
    }

    const handleClick = () => {
        if (!story && userName == "Your Story") {
            navigate("/upload")
        }
        else if (story && userName == "Your Story") {
            handelViewers()
            navigate(`/story/${userData.userName}`)
        }
        else {
            handelViewers()
            navigate(`/story/${userName}`)
        }
    }

    return (
        <div className='flex flex-col w-[80px]'>
            <div className={`w-[67px] h-[67px] ${!story ? null : !viewed ? "bg-gradient-to-b from-blue-500 to-blue-950" : "bg-gradient-to-r from-gray-500 to-black-950"}  flex justify-center items-center relative rounded-full`} onClick={handleClick}>
                <div className='w-[60px] h-[60px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                    <img src={ProfileImage || dp} alt="" className='w-full object-cover' />
                    {!story && userName == "Your Story" && <div>
                        <FaCirclePlus className='absolute bottom-[8px] right-[10px] text-black rounded-full w-[20px] h-[20px]' onClick={() => navigate("/upload")} />
                    </div>}
                </div>
            </div>
            <div className='text-[14px] text-center truncate w-full text-white'>{userName}</div>
        </div>
    )
}

export default StoryDp
