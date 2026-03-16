import React from 'react'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function Notifications() {

    const navigate = useNavigate()
    const { notificationData } = useSelector(state => state.user)


    return (
        <div className='bg-black h-[100vh] w-full'>
            <div className='w-full h-[80px] flex items-center gap-[20px] px-[20px] lg:hidden'><IoMdArrowRoundBack className='text-white cursor-pointer w-[25px] h-[25px]' onClick={() => navigate(`/`)} />
                <h1 className='text-white font-semibold text-[20px]'>Notifications</h1>
            </div>

            <div className='overflow-auto flex-col w-full flex gap-[20px] h-[100%]'>
                {notificationData?.map((noti, index) => (
                    <Notifications noti={noti} key={index} />
                ))}
            </div>

        </div>
    )
}

export default Notifications
