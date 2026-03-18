import React, { useEffect } from 'react'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import NotificationCard from '../components/NotificationCard'
import axios from 'axios'
import { serverUrl } from '../App'
import { setNotificationData } from '../redux/userSlice'

function Notifications() {

    const navigate = useNavigate()
    const { notificationData } = useSelector(state => state.user)
    const ids = notificationData.map((n) => n._id)
    const dispatch = useDispatch()

    const markAsRead = async () => {
        try {
            const result = await axios.post(`${serverUrl}/api/user/markAsRead`, { notificationId: ids }, { withCredentials: true })
            await fetchNotifications()
        } catch (error) {
            console.error(error);
        }
    }

    const fetchNotifications = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/user/getAllNotifications`, { withCredentials: true })
            dispatch(setNotificationData(result.data))
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        markAsRead()
    }, [])

    return (
        <div className='bg-black h-[100vh] w-full overflow-auto'>
            <div className='w-full h-[80px] flex items-center gap-[20px] px-[20px] lg:hidden'><IoMdArrowRoundBack className='text-white cursor-pointer w-[25px] h-[25px]' onClick={() => navigate(`/`)} />
                <h1 className='text-white font-semibold text-[20px]'>Notifications</h1>
            </div>

            <div className='flex-col w-full flex gap-[20px] h-[100%] px-[10px]'>
                {notificationData?.map((noti, index) => (
                    <NotificationCard noti={noti} key={index} />
                ))}
            </div>

        </div>
    )
}

export default Notifications
