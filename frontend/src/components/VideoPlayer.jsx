import React, { useEffect, useRef, useState } from 'react'
import { CiVolumeHigh } from "react-icons/ci";
import { CiVolumeMute } from "react-icons/ci";

function VideoPlayer({ media }) {
    const videoTag = useRef()
    const [mute, setMute] = useState(false)
    const [isPlaying, setIsPlaying] = useState(true)

    const handleClick = () => {
        if (isPlaying) {
            videoTag.current.pause()
            setIsPlaying(false)
        } else {
            videoTag.current.play()
            setIsPlaying(true)
        }
    }
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            const video = videoTag.current
            if (entry.isIntersecting) {
                video.play()
                setIsPlaying(true)
            }
            else {
                video.pause()
                setIsPlaying(false)
            }
        }, { threshold: 0.6 })
        if (videoTag.current) {
            observer.observe(videoTag.current)
        }
        return () => {
            if (videoTag.current) {
                observer.unobserve(videoTag.current)
            }
        }

    }, [])

    return (
        <div className='cursor-pointer rounded-2xl overflow-hidden h-[100%] relative max-w-full'>
            <video ref={videoTag} src={media} autoPlay loop muted={mute} className='cursor-pointer rounded-2xl overflow-hidden h-[100%] relative w-full object-cover' onClick={handleClick} />
            <div className='absolute bottom-[10px] right-[10px]' onClick={() => setMute(prev => !prev)}>
                {!mute ? <CiVolumeHigh className='w-[20px] h-[20px]  text-white
font-semibold'/> : <CiVolumeMute className='w-[20px] h-[20px]  text-white
font-semibold'/>}
            </div>

        </div>
    )
}

export default VideoPlayer
