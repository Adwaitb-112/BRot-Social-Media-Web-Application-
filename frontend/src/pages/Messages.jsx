import React from 'react'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { useNavigate } from 'react-router-dom';
import OnlineUser from '../components/onlineUser';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '../redux/messageSlice';
import dp from "../assets/dp.png";

function Messages() {

    const navigate = useNavigate()
    const { userData } = useSelector(state => state.user)
    const { onlineUsers } = useSelector(state => state.socket)
    const { prevChatUsers, selectedUsers } = useSelector(state => state.message)
    const dispatch = useDispatch()

    return (
        <div className='w-full min-h-[100vh] flex flex-col bg-black gap-[20px] p-[10px]'>
            <div className='w-full h-[80px] flex items-center gap-[20px] px-[20px]'><IoMdArrowRoundBack className='text-white lg:hidden cursor-pointer w-[25px] h-[25px]' onClick={() => navigate(`/`)} />
                <h1 className='text-white font-semibold text-[20px]'>Messages</h1>
            </div>

            <div className='w-full h-[80px] flex gap-[20px] justify-start items-center overflow-x-auto p-[20px] border-b-2 border-gray-800'>
                {userData.following?.map((user, index) => (
                    (onlineUsers?.includes(user._id)) && <OnlineUser user={user} />
                ))}
            </div>

            <div className='w-full h-full overflow-auto flex flex-col gap-[20px]'>
                {prevChatUsers?.map((user, index) => (
                    <div className='text-white cursor-pointer w-full flex items-center gap-[10px]' onClick={() => {
                        dispatch(setSelectedUser(user))
                        navigate("/messageArea")
                    }}>
                        {onlineUsers?.includes(user._id) ? <OnlineUser user={user} /> : <div className='w-[60px] h-[60px] border-2 border-black rounded-full cursor-pointer overflow-hidden' >
                            <img src={user.profileImage || dp} alt="" className='w-full object-cover' />
                        </div>}
                        <div className='flex flex-col'>
                            <div className='text-white text-[18px] font-semibold'>{user.userName}</div>
                            {onlineUsers?.includes(user?._id) && <div className='text-blue-500 text-[15px]'>Active Now</div>}
                        </div>
                    </div>
                ))}

            </div>

        </div>
    )
}

export default Messages
