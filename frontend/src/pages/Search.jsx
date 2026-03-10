import React, { useEffect, useState } from 'react'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import { IoSearch } from "react-icons/io5";
import axios from 'axios';
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchData } from '../redux/userSlice';
import dp from "../assets/dp.png"

function Search() {

    const navigate = useNavigate()
    const [input, setInput] = useState("")
    const dispatch = useDispatch()
    const { searchData } = useSelector(state => state.user)

    const handleSearch = async (e) => {
        // e.preventDefault()
        try {
            const result = await axios.get(`${serverUrl}/api/user/search?keyword=${input}`)
            dispatch(setSearchData(result.data))
                console.log(result.data);

        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(() => {
            handleSearch(input)
    }, [input])


    return (
        <div className='w-full min-h-[100vh] bg-black flex items-center flex-col gap-[20px]'>
            <div className='w-full h-[80px] flex items-center gap-[20px] px-[20px] absolute top-0'>
                <IoMdArrowRoundBack className='text-white cursor-pointer w-[25px] h-[25px]' onClick={() => navigate(`/`)} />
            </div>
            <div className='items-center flex justify-center h-[80px] mt-[80px]'>
                <form className='w-[90%] max-w-[800px] h-[80%] rounded-full bg-[#0f1414] flex items-center px-[20px]' >
                    <IoSearch className='w-[25px] h-[25px] text-white' />
                    <input type="text" placeholder='search...' className='w-full h-full outline-0 rounded-full px-[20px] text-white text-[18px]'
                        onChange={(e) => setInput(e.target.value)} value={input} />
                </form>

            </div>
            {input && searchData?.map((user) => (
                <div className='w-[90vw] max-w-[700px] h-[60px] rounded-full bg-white flex items-center gap-[20px] hover:bg-gray-200 px-[5px]' onClick={() => navigate(`/profile/${user.userName}`)}>
                    <div className='w-[50px] h-[50px] border-2 border-black rounded-full cursor-pointer overflow-hidden' >
                        <img src={user.profileImage || dp} alt="" className='w-full object-cover' />
                    </div>

                    <div className='text-black text-[18px] font-semibold'>
                        <div>{user.userName}</div>
                        <div className='text-[14px] text-gray-400'>
                            {user.name}
                        </div>
                    </div>
                </div>
            ))}

            {!input && <div className='font-bold text-[30px] text-gray-700'>
                Search Here...
            </div>}

        </div>
    )
}

export default Search
