import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AvatarUploader from '../components/AvatarUploader'
import OTPModal from '../components/OTPModal'

function fileToBase64(file){
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.onload = () => resolve(reader.result)
		reader.onerror = reject
		reader.readAsDataURL(file)
	})
}

export default function Register(){
	const navigate = useNavigate()
	const { register } = useAuth()

	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [phone, setPhone] = useState('')
	const [aadhaar, setAadhaar] = useState('')
	const [pan, setPan] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [avatarFile, setAvatarFile] = useState(null)
	const [avatarBase64, setAvatarBase64] = useState(null)

	// OTP states - EMAIL ONLY
	const [openOtp, setOpenOtp] = useState(false)
	const [verifiedEmail, setVerifiedEmail] = useState(false)
	const [sendingOTP, setSendingOTP] = useState(false)
	const [verifyingOTP, setVerifyingOTP] = useState(false)

	const handleSendVerify = async () => {
		if (!validateEmail(email)) {
			alert('Please enter a valid email first');
			return;
		}
		
		setSendingOTP(true);
		try {
			const response = await fetch('http://localhost:4000/api/otp/send-email-otp', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email })
			});
			
			const result = await response.json();
			if (response.ok) {
				setOpenOtp(true);
				alert('OTP sent to your email!');
			} else {
				alert(result.error || 'Failed to send OTP');
			}
		} catch (error) {
			console.error('OTP send error:', error);
			alert('Failed to send OTP. Please try again.');
		} finally {
			setSendingOTP(false);
		}
	}

	const handleVerifyOTP = async (otp) => {
		setVerifyingOTP(true);
		try {
			const response = await fetch('http://localhost:4000/api/otp/verify-otp', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, otp })
			});
			
			const result = await response.json();
			if (response.ok) {
				setVerifiedEmail(true);
				setOpenOtp(false);
				alert('Email verified successfully!');
				return true;
			} else {
				alert(result.error || 'Invalid OTP');
				return false;
			}
		} catch (error) {
			console.error('OTP verify error:', error);
			alert('OTP verification failed. Please try again.');
			return false;
		} finally {
			setVerifyingOTP(false);
		}
	}

	const onAvatarChange = async (file) => {
		setAvatarFile(file)
		if (file) {
			try{
				const b = await fileToBase64(file)
				setAvatarBase64(b)
			}catch(e){ console.warn('avatar read failed', e) }
		}
	}

	const validateAadhaar = (v) => {
		const plain = v.replace(/\s+/g,'')
		return /^\d{12}$/.test(plain)
	}

	const validatePAN = (v) => {
		return /^[A-Z]{5}[0-9]{4}[A-Z]$/.test((v||'').toUpperCase())
	}

	const validatePhone = (v) => {
		const plain = v.replace(/\D+/g,'')
		return /^\d{10}$/.test(plain)
	}

	const validateEmail = (v) => {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
	}

	const onSubmit = async (e) => {
		e.preventDefault()
		if(!name || !email || !password) return alert('Please fill name, email and password')
		if(password !== confirmPassword) return alert('Passwords do not match')
		if(!validateEmail(email)) return alert('Please enter a valid email')
		if(!validatePhone(phone)) return alert('Please enter a valid 10-digit phone')
		if(!validateAadhaar(aadhaar)) return alert('Please enter a valid 12-digit Aadhaar number')
		if(!validatePAN(pan)) return alert('Please enter a valid PAN in format ABCDE1234F')
		if(!verifiedEmail) return alert('Please verify your email via OTP')
		try{
			const newUser = await register({ name, email, password, avatar: avatarBase64, pan: pan.toUpperCase(), aadhaar, phone })
			navigate('/dashboard')
		}catch(err){
			alert(err.message || 'Registration failed')
		}
	}

	const isFormValid = () => {
		if(!name || !email || !password) return false
		if(password !== confirmPassword) return false
		if(!validateEmail(email)) return false
		if(!validatePhone(phone)) return false
		if(!validateAadhaar(aadhaar)) return false
		if(!validatePAN(pan)) return false
		if(!verifiedEmail) return false
		return true
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b0020] to-[#17042b] p-4 md:p-6">
			{/* Add pt-28 to push content below navbar */}
			<div className="max-w-4xl w-full grid md:grid-cols-2 gap-6 pt-28"> {/* 👈 Added pt-28 */}
				<div className="card p-6 flex flex-col items-center">
					<AvatarUploader value={avatarBase64 || ''} onChange={onAvatarChange} size={28} />
					<div className="mt-4 text-sm small-muted text-center">Upload a profile image (optional).</div>
				</div>

				<form className="card p-6" onSubmit={onSubmit}>
					<h2 className="text-2xl font-bold gradient-title mb-4">Create account</h2>

					<div className="grid grid-cols-1 gap-4">
						<div>
							<label className="text-sm small-muted">Full name</label>
							<input value={name} onChange={e=>setName(e.target.value)} className="input w-full" />
						</div>

						<div>
							<label className="text-sm small-muted">Email</label>
							<input value={email} onChange={e=>setEmail(e.target.value)} className="input w-full bg-white/5 border border-white/10 placeholder-white/40" placeholder="you@example.com" />
							<div className="mt-2 flex items-center justify-between">
								<div className="flex items-center gap-2">
									<button 
										type="button" 
										onClick={handleSendVerify} 
										className="btn"
										disabled={sendingOTP || !validateEmail(email)}
									>
										{sendingOTP ? 'Sending...' : 'Send OTP'}
									</button>
									<div className="text-xs small-muted">{verifiedEmail ? '✓ Email verified' : 'Email not verified'}</div>
								</div>
							</div>
						</div>

						<div>
							<label className="text-sm small-muted">Phone (Aadhaar linked mobile)</label>
							<input value={phone} onChange={e=>setPhone(e.target.value)} className="input w-full bg-white/5 border border-white/10 placeholder-white/40" placeholder="9xxxxxxxxx" />
						</div>

						<div>
							<label className="text-sm small-muted">Aadhaar number</label>
							<input value={aadhaar} onChange={e=>setAadhaar(e.target.value)} className="input w-full bg-white/5 border border-white/10 placeholder-white/40" placeholder="123412341234" />
						</div>

						<div>
							<label className="text-sm small-muted">PAN card number</label>
							<input value={pan} onChange={e=>setPan(e.target.value)} className="input w-full bg-white/5 border border-white/10 placeholder-white/40" placeholder="ABCDE1234F" />
						</div>

						<div>
							<label className="text-sm small-muted">Password</label>
							<input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="input w-full bg-white/5 border border-white/10" />
						</div>

						<div>
							<label className="text-sm small-muted">Confirm Password</label>
							<input type="password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} className="input w-full bg-white/5 border border-white/10" />
						</div>
					</div>

					<div className="mt-6 flex gap-3">
						<button className="btn" type="submit" disabled={!isFormValid()}>Create account</button>
					</div>
				</form>
			</div>

			<OTPModal 
				open={openOtp} 
				onClose={(verified) => {
					setOpenOtp(false);
					if (verified) {
						setVerifiedEmail(true);
					}
				}} 
				onVerifyOTP={handleVerifyOTP}
				contactLabel={'email'} 
				contactValue={email}
				isLoading={verifyingOTP}
			/>
		</div>
	)
}