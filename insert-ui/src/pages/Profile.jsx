// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AvatarUploader from '../components/AvatarUploader';

export default function Profile(){
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [pan, setPan] = useState('');
  const [avatarBase64, setAvatarBase64] = useState('');
  const [isUploading, setIsUploading] = useState(false); // 👈 Add loading state

// In Profile.jsx, update the useEffect to use profile_picture_url
  useEffect(()=>{
    if(!user) return;
    setName(user.full_name || '');
    setPhone(user.phone || '');
    setAadhaar(user.aadhaar_number || '');
    setPan(user.pan_card_number || '');
    setAvatarBase64(user.profile_picture_url || ''); // 👈 Use profile_picture_url
  },[user]);

// Alternative: Auto-save after avatar upload
const onAvatarChange = async (file) => {
  if (!file) return;

  setIsUploading(true);
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('http://localhost:4000/api/upload/profile-picture', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('insert_token')}` },
      body: formData,
    });

    const result = await response.json();
    if (response.ok) {
      const newAvatarUrl = result.url;
      setAvatarBase64(newAvatarUrl);
      
      // Auto-save profile with new avatar
      await updateProfile({
        full_name: name,
        phone: phone,
        aadhaar_number: aadhaar,
        pan_card_number: pan,
        profile_picture_url: newAvatarUrl
      });
      
      alert('Profile picture updated successfully!');
    } else {
      throw new Error(result.error || 'Upload failed');
    }
  } catch (error) {
    console.error('Failed to upload avatar:', error);
    alert('Failed to upload avatar: ' + error.message);
  } finally {
    setIsUploading(false);
  }
};

// In Profile.jsx, update the onSave function
  const onSave = async () => {
    if (!user) return;

    try {
      const profileData = {
        full_name: name,
        phone: phone,
        aadhaar_number: aadhaar,
        pan_card_number: pan,
        profile_picture_url: avatarBase64 // This should be the Cloudinary URL
      };

      const updatedUser = await updateProfile(profileData);
      
      // ✅ Also update local state for immediate UI update
      setAvatarBase64(updatedUser.profile_picture_url);
      alert('Profile updated successfully!');
    } catch(e) {
      console.error('Profile update error:', e);
      alert('Update failed: ' + (e.message || 'Please try again'));
    }
  };

  // 👈 Handle avatar upload AND save in one click
  const handleSaveWithAvatar = async (file) => {
    let avatarUrl = avatarBase64;
    
    // If there's a new file to upload
    if (file) {
      try {
        avatarUrl = await onAvatarChange(file);
      } catch (error) {
        // onAvatarChange already shows error, just return
        return;
      }
    }
    
    // Now save with the (possibly updated) avatar URL
    const profileData = {
      full_name: name,
      phone: phone,
      aadhaar_number: aadhaar,
      pan_card_number: pan,
      profile_picture_url: avatarUrl
    };

    try {
      const updatedUser = await updateProfile(profileData);
      alert('Profile updated successfully!');
    } catch(e) {
      console.error('Profile update error:', e);
      alert('Update failed: ' + (e.message || 'Please try again'));
    }
  };

  if(!user) return <div className="pt-28 max-w-4xl mx-auto p-6 text-white">Please login to view your profile.</div>;

  return (
    <main className="pt-28 max-w-4xl mx-auto p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card p-6 flex flex-col items-center">
          <AvatarUploader value={avatarBase64} onChange={onAvatarChange} />
          <div className="mt-4 text-sm small-muted text-center">Profile photo</div>
          {isUploading && <div className="mt-2 text-sm text-indigo-300">Uploading...</div>}
        </div>

        <div className="md:col-span-2 card p-6">
          <div className="mb-4">
            <label className="text-sm small-muted">Full name</label>
            <input className="input w-full mt-1" value={name} onChange={e=>setName(e.target.value)} />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm small-muted">Email (read-only)</label>
              <input className="input w-full mt-1" value={user.email || ''} readOnly />
            </div>
            <div>
              <label className="text-sm small-muted">Phone</label>
              <input className="input w-full mt-1" value={phone} onChange={e=>setPhone(e.target.value)} />
            </div>
            <div>
              <label className="text-sm small-muted">Aadhaar</label>
              <input className="input w-full mt-1" value={aadhaar} onChange={e=>setAadhaar(e.target.value)} />
            </div>
            <div>
              <label className="text-sm small-muted">PAN</label>
              <input className="input w-full mt-1" value={pan} onChange={e=>setPan(e.target.value)} />
            </div>
          </div>

          <div className="mt-6">
            <button 
              className="btn" 
              onClick={onSave}
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Save profile'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}