'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, User, Loader2 } from 'lucide-react';
import { personnelService } from '@/lib/personnelService';

interface AvatarUploaderProps {
  currentUrl?: string | null;
  onUrlChange: (url: string) => void;
}

export default function AvatarUploader({ currentUrl, onUrlChange }: AvatarUploaderProps) {
  const [preview, setPreview] = useState<string>(currentUrl || '');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น (JPG, PNG, WebP)');
      return;
    }

    try {
      setIsUploading(true);
      // Generate instant local preview
      const localPreviewUrl = URL.createObjectURL(file);
      setPreview(localPreviewUrl);

      // Upload to Supabase Storage bucket 'personnel-avatars'
      const publicUrl = await personnelService.uploadAvatar(file);
      setPreview(publicUrl);
      onUrlChange(publicUrl);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview('');
    onUrlChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <label className="block text-base sm:text-lg font-bold text-slate-800 mb-2.5">
        รูปถ่ายหน้าตรงข้าราชการ (Official Portrait Photo)
      </label>

      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-center gap-6 cursor-pointer transition-all duration-200 active:scale-[0.99] ${
          isDragOver
            ? 'border-blue-500 bg-blue-50/50'
            : 'border-slate-300 hover:border-slate-400 bg-slate-50/60'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept="image/*"
          className="hidden"
        />

        {/* Image Preview Box */}
        <div className="relative w-36 h-48 rounded-2xl overflow-hidden bg-slate-200 border-2 border-white shadow-md flex-shrink-0 flex items-center justify-center">
          {preview ? (
            <Image
              src={preview}
              alt="Avatar preview"
              fill
              className="object-cover object-top"
              unoptimized
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400">
              <User className="w-14 h-14" />
              <span className="text-xs mt-1 font-bold text-slate-400">ยังไม่มีรูป</span>
            </div>
          )}

          {isUploading && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white text-sm font-bold">
              <Loader2 className="w-8 h-8 animate-spin mb-1.5 text-blue-400" />
              <span>กำลังอัปโหลด...</span>
            </div>
          )}

          {preview && !isUploading && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-md transition-colors active:scale-95"
              title="ลบรูปภาพ"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Instructions */}
        <div className="text-center sm:text-left space-y-1.5">
          <div className="flex items-center justify-center sm:justify-start space-x-2 text-base sm:text-lg font-black text-slate-800">
            <Upload className="w-5 h-5 text-blue-600" />
            <span>แตะเพื่อเลือกรูป หรือลากไฟล์มาวางที่นี่</span>
          </div>
          <p className="text-sm text-slate-500 font-medium">
            รองรับไฟล์ PNG, JPG หรือ WebP (แนะนำรูปหน้าตรง พื้นหลังสุภาพ)
          </p>
          <div className="mt-2 inline-block text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200">
            📦 จัดเก็บอัตโนมัติที่ Supabase Bucket: <code className="font-mono font-bold">personnel-avatars</code>
          </div>
        </div>
      </div>
    </div>
  );
}
