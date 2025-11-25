import React, { useState } from 'react'
import OTPModal from '../components/OTPModal'
import { useNavigate } from 'react-router-dom'


export default function ForgotPassword(){
const [emailOrPhone, setEmailOrPhone] = useState('')
const [openOtp, setOpenOtp] = useState(false)
const [verified, setVerified] = useState(false)
const navigate = useNavigate()


const startReset = ()=>{
if(!emailOrPhone) return alert('Enter email or phone')
setOpenOtp(true)
}


const onOtpClose = (ok)=>{
setOpenOtp(false)
if(ok){
setVerified(true)
const newPass = prompt('Enter new password (demo)')
if(newPass){
alert('Password changed (demo). Use it to login.')
navigate('/login')
}
}
}


return (
<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b0020] to-[#17042b] p-6">
<div className="max-w-md w-full card p-6">
<h2 className="text-2xl font-bold gradient-title mb-2">Forgot password</h2>
<p className="small-muted mb-4">Enter your registered email or Aadhaar-linked mobile number to reset password.</p>
<input value={emailOrPhone} onChange={e=>setEmailOrPhone(e.target.value)} className="input w-full mb-3" placeholder="Email or mobile" />
<div className="flex justify-end gap-2">
<button onClick={startReset} className="btn">Send OTP</button>
</div>
</div>


<OTPModal open={openOtp} onClose={onOtpClose} onSendOTP={(c)=>console.log('DEV OTP', c)} contactLabel={'email/phone'} />
</div>
)
}

