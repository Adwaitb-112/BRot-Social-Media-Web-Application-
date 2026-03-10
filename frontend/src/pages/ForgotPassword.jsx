import React from 'react'
import { useState } from 'react'
import axios from "axios"
import { serverUrl } from '../App';
import { ClipLoader } from "react-spinners"


function ForgotPassword() {
    const [step, setStep] = useState(1)
    const [inputClicked, setInputClicked] = useState({
        email: false,
        otp: false,
        newPassword: false,
        confirmNewPassword: false,
    })
    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [newPassword, setnewPassword] = useState("")
    const [confirmNewPassword, setconfirmNewPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [err, setErr] = useState("")


    const handleStep1 = async () => {
        setLoading(true)
        setErr("")

        try {
            const result = await axios.post(`${serverUrl}/api/auth/sendOtp`, { email }, { withCredentials: true })
            console.log(result.data)
            setStep(2)
            setLoading(false)
        } catch (error) {
            setErr(error.response?.data?.message)
            console.log(error)
            setLoading(false)
        }
    }

    const handleStep2 = async () => {
        setLoading(true)
        setErr("")
        try {
            const result = await axios.post(`${serverUrl}/api/auth/verifyOtp`, { email, otp }, { withCredentials: true })
            setStep(3)
            setLoading(false)
        } catch (error) {
            setErr(error.response?.data?.message)
            console.log(error)
            setLoading(false)
        }
    }

    const handleStep3 = async () => {
        if (newPassword !== confirmNewPassword) {
            return setErr("password does not match")
        }
        setLoading(true)
        setErr("")

        try {
            const result = await axios.post(`${serverUrl}/api/auth/resetPassword`, { email, password: newPassword }, { withCredentials: true })
            setLoading(false)
        } catch (error) {
            setErr(error.response?.data?.message)
            console.log(error.message)
            setLoading(false)
        }
    }

    return (
        <div className='w-full h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col justify-center items-center '>

            {step == 1 && <div className='w-[90%] lg:max-w-[60%] h-[600px] bg-white rounded-2xl flex justify-center items-center overflow-hidden border-2 border-[#1a1f23]  flex-col'>
                <h2 className='text-[30px] font-semibold'>Forgot Password</h2>
                <div className='relative flex items-center justify-start w-[90%] h-[50px] rounded-2xl mt-[30px] border-2 border-black' onClick={() => setInputClicked({ ...inputClicked, email: true })}>
                    <label htmlFor="email" className={`text-gray-700 absolute left-[20px] p-[5px] bg-white text-[15px] ${inputClicked.email ? "top-[-15px]" : ""}`}> Enter Your email</label>
                    <input type="text" id='email' className='w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0 required' onChange={(e) => setEmail(e.target.value)} value={email} />

                </div>
                {err && <p className='bg-red-500'>{err}</p>}

                <button className='w-[70%] px-[20px] py-[10px] bg-black text-white font-semibold h-[50px] cursor-pointer rounded-2xl mt-[30px]' onClick={handleStep1} disabled={loading}>{loading ? <ClipLoader size={30} color='white' /> : "Send OTP"}</button>
            </div>}

            {step == 2 && <div className='w-[90%] lg:max-w-[60%] h-[600px] bg-white rounded-2xl flex justify-center items-center overflow-hidden border-2 border-[#1a1f23]  flex-col'>
                <h2 className='text-[30px] font-semibold'>Forgot Password</h2>
                <div className='relative flex items-center justify-start w-[90%] h-[50px] rounded-2xl mt-[30px] border-2 border-black' onClick={() => setInputClicked({ ...inputClicked, otp: true })}>
                    <label htmlFor="otp" className={`text-gray-700 absolute left-[20px] p-[5px] bg-white text-[15px] ${inputClicked.otp ? "top-[-15px]" : ""}`}> Enter Otp</label>
                    <input type="text" id='otp' className='w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0 required' onChange={(e) => setOtp(e.target.value)} value={otp} />

                </div>
                {err && <p className='bg-red-500'>{err}</p>}

                <button className='w-[70%] px-[20px] py-[10px] bg-black text-white font-semibold h-[50px] cursor-pointer rounded-2xl mt-[30px]' onClick={handleStep2} disabled={loading}>{loading ? <ClipLoader size={30} color='white' /> : "Submit"}</button>
            </div>}

            {step == 3 && <div className='w-[90%] lg:max-w-[60%] h-[600px] bg-white rounded-2xl flex justify-center items-center overflow-hidden border-2 border-[#1a1f23]  flex-col'>
                <h2 className='text-[30px] font-semibold'>Reset Password</h2>
                <div className='relative flex items-center justify-start w-[90%] h-[50px] rounded-2xl mt-[30px] border-2 border-black' onClick={() => setInputClicked({ ...inputClicked, newPassword: true })}>
                    <label htmlFor="newPassword" className={`text-gray-700 absolute left-[20px] p-[5px] bg-white text-[15px] ${inputClicked.newPassword ? "top-[-15px]" : ""}`}> Enter New Password</label>
                    <input type="text" id='newPassword' className='w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0 required' onChange={(e) => setnewPassword(e.target.value)} value={newPassword} />
                </div>

                <div className='relative flex items-center justify-start w-[90%] h-[50px] rounded-2xl mt-[30px] border-2 border-black' onClick={() => setInputClicked({ ...inputClicked, confirmNewPassword: true })}>
                    <label htmlFor="confirmNewPassword" className={`text-gray-700 absolute left-[20px] p-[5px] bg-white text-[15px] ${inputClicked.confirmNewPassword ? "top-[-15px]" : ""}`}> Confirm New Password</label>
                    <input type="text" id='confirmNewPassword' className='w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0 required' onChange={(e) => setconfirmNewPassword(e.target.value)} value={confirmNewPassword} />
                </div>
                {err && <p className='bg-red-500'>{err}</p>}

                <button className='w-[70%] px-[20px] py-[10px] bg-black text-white font-semibold h-[50px] cursor-pointer rounded-2xl mt-[30px]' onClick={handleStep3} disabled={loading}>{loading ? <ClipLoader size={30} color='white' /> : "Change Password"}</button>
            </div>}


        </div >
    )
}

export default ForgotPassword