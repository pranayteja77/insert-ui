// src/components/OTPModal.jsx
import React, { useState, useEffect } from 'react'

export default function OTPModal({ 
  open, 
  onClose, 
  onVerifyOTP, // Renamed from onSendOTP to onVerifyOTP for clarity
  contactLabel, 
  contactValue,
  isLoading = false
}) {
  const [otp, setOtp] = useState('')
  
  useEffect(() => { 
    if (!open) { 
      setOtp('') 
    } 
  }, [open])

  const verify = async () => {
    if (!contactValue) {
      alert('No contact to verify')
      return
    }
    
    if (otp.length !== 6) {
      alert('Please enter a 6-digit OTP')
      return
    }
    
    // Call the parent component's verification function
    const success = await onVerifyOTP(otp)
    if (success) {
      onClose(true)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      verify()
    }
  }

  if (!open) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white/6 backdrop-blur rounded-xl p-6 w-96 text-white">
        <h3 className="font-semibold mb-2">Verify {contactLabel}</h3>
        <p className="small-muted mb-4">
          A one-time code was sent to: <span className="font-medium">{contactValue || '—'}</span>
        </p>
        <div className="flex gap-2 mb-3">
          <input 
            placeholder="Enter 6-digit OTP" 
            value={otp} 
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="input w-full"
            maxLength={6}
            onKeyPress={handleKeyPress}
          />
        </div>
        <div className="flex justify-end gap-2 mt-2">
          <button 
            onClick={() => onClose(false)} 
            className="px-3 py-1 rounded bg-white/10"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button 
            onClick={verify} 
            className="btn"
            disabled={isLoading || otp.length !== 6}
          >
            {isLoading ? 'Verifying...' : 'Verify'}
          </button>
        </div>
      </div>
    </div>
  )
}