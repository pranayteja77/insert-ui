import React, { useState, useEffect } from 'react'

export default function AvatarUploader({ value, onChange, size = 28 }){
	const [preview, setPreview] = useState('')

	useEffect(()=>{
		if(typeof value === 'string' && value) setPreview(value)
	},[value])

	const handleFile = (e)=>{
		const f = e.target.files && e.target.files[0]
		if(!f) return
		const url = URL.createObjectURL(f)
		setPreview(url)
		onChange && onChange(f)
	}

	// Inline SVG placeholder so we never show broken image icons
	const Placeholder = () => (
		<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
			<defs>
				<linearGradient id="g" x1="0" x2="1">
					<stop offset="0" stopColor="#6b21a8" />
					<stop offset="1" stopColor="#db2777" />
				</linearGradient>
			</defs>
			<rect width="128" height="128" rx="64" fill="url(#g)" />
			<g fill="#fff" opacity="0.9">
				<circle cx="64" cy="44" r="20" />
				<path d="M24 98c6-16 22-26 40-26s34 10 40 26H24z" />
			</g>
		</svg>
	)

	const dim = { width: size * 4, height: size * 4 }

	return (
		<div className="flex flex-col items-center gap-3">
			<div className="rounded-full overflow-hidden ring-4 ring-white/10 shadow-lg bg-white/6 flex items-center justify-center" style={dim}>
				{ preview ? (
					<img src={preview} alt="avatar" className="w-full h-full object-cover" />
				) : (
					<div className="w-full h-full">
						<Placeholder />
					</div>
				) }
			</div>

			<label className="px-3 py-2 bg-white/6 rounded-md text-sm cursor-pointer hover:bg-white/8 transition">
				Choose Photo
				<input type="file" accept="image/*" onChange={handleFile} className="hidden" />
			</label>
		</div>
	)
}