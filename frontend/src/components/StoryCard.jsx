import React, { useState, useEffect } from 'react'
import dp from "../assets/dp.png";
import { useSelector } from 'react-redux';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom'
import VideoPlayer from '../components/VideoPlayer'
import { FaEye } from "react-icons/fa";

function StoryCard({ storyData }) {
    // const { storyData } = useSelector(state => state.story)
    const [progress, setProgress] = useState(0)
    const { userData } = useSelector(state => state.user)
    const [showViewers, setShowViewers] = useState(false)
    const navigate = useNavigate()
    // const navigate = useNavigate({storyData})

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval)
                    navigate("/")
                    return 100
                }
                return prev + 1
            })
        }, 150)
        return () => clearInterval(interval)
    }, [navigate])

    return (
        <div className='w-full max-w-[500px] h-[100vh] border-x-2 border-gray-80 pt-[10px] relative flex flex-col justify-center'>
            <div className='flex  items-center gap-[10px] absolute top-[30px] px-[10px]'>
                <IoMdArrowRoundBack className='text-white cursor-pointer w-[25px] h-[25px]' onClick={() => navigate(`/`)} />
                <div className='w-[30px] h-[30px] border-2 border-black rounded-full cursor-pointer overflow-hidden md:w-[40px] md:h-[40px] z-10'>
                    <img src={storyData?.author?.profileImage || dp} alt="" className='w-full object-cover' />
                </div>
                <div className='font-semibold truncate w-[120px] text-white z-10'>
                    {storyData?.author?.userName}</div>
            </div>
            <div className='top-[10px] w-full h-[5px] bg-gray-900 absolute'>
                <div className='h-full w-[200px] bg-white transition-all ease-linear duration-200' style={{ width: `${progress}%` }}>
                </div>
            </div>
            {!showViewers && <>

                <div className='w-full h-[90vh] flex items-center justify-center '>
                    {storyData?.mediaType == "image" && <div className='w-[90%]  flex items-center justify-center'>
                        <img src={storyData?.media} alt="" className='w-[80%] rounded-2xl object-cover' /></div>}

                    {storyData?.mediaType == "video" && <div className='w-[80%] flex flex-col items-center justify-center '>
                        <img src={storyData?.media} alt="" className='h-[60%] rounded-2xl' />
                        <VideoPlayer media={storyData?.media} /></div>}
                </div>

                {storyData?.author?.userName == userData?.userName && <div className='w-full cursor-pointer h-[70px] p-2 left-0 absolute flex items-center bottom-0 text-white gap-[10px]' onClick={()=>setShowViewers(true)}>
                    <div className='text-white flex items-center gap-[5px]'><FaEye />{storyData.viewers.length}</div>

                    <div className='flex relative'>
                        {storyData?.viewers?.slice(0, 3).map((viewers, index) => (
                            <div className={`w-[30px] h-[30px] border-2 border-black rounded-full cursor-pointer overflow-hidden ${index > 0 ? `absolute left-[${index * 10}px]` : ""}`}>
                                <img src={viewers?.profileImage || dp} alt="" className='w-full object-cover' />
                            </div>
                        ))}
                    </div>
                </div>}
            </>}

            {showViewers && <>
                <div className='w-full h-[30%] flex items-center justify-center mt-[100px] py-[30px] overflow-hidden' onClick={()=>setShowViewers(false)}>
                    {storyData?.mediaType == "image" && <div className='h-full cursor-pointer flex items-center justify-center'>
                        <img src={storyData?.media} alt="" className='h-full rounded-2xl object-cover' /></div>}

                    {storyData?.mediaType == "video" && <div className='h-[full] flex flex-col items-center justify-center '>
                        <VideoPlayer media={storyData?.media} /></div>}
                </div>

                <div className='w-full h-[70%] border-t-2 border-t-gray-800 p-[20px]'>
                    <div className='text-white flex items-center gap-[10px]'>
                        <FaEye />
                        <span>{storyData?.viewers?.length}</span>
                        <span>Viewers</span>
                    </div>
                    <div className='w-full max-h-full flex flex-col gap-[10px] overflow-auto pt-[20px]'>
                        {storyData?.viewers?.map((viewers, index) => (
                            <div className='w-full flex items-center gap-[20px]'>
                                <div className='w-[30px] h-[30px] border-2 border-black rounded-full cursor-pointer overflow-hidden md:w-[40px] md:h-[40px] z-10'>
                                    <img src={viewers?.profileImage || dp} alt="" className='w-full object-cover' />
                                </div>
                                <div className='font-semibold truncate w-[120px] text-white z-10'>
                                    {viewers?.userName}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </>}


        </div>
    )
}

export default StoryCard