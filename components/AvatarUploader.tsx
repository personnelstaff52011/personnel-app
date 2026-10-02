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
      <label className="block text-sm font-semibold text-gray-700 mb-2">
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
        className={`relative border-2 border-dashed rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-center gap-6 cursor-pointer transition-all duration-200 ${
          isDragOver
            ? 'border-blue-500 bg-blue-50/50'
            : 'border-gray-300 hover:border-gray-400 bg-gray-50/50'
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
        <div className="relative w-32 h-40 rounded-xl overflow-hidden bg-gray-200 border-2 border-white shadow-md flex-shrink-0 flex items-center justify-center">
          {preview ? (
            <Image
              src={preview}
              alt="Avatar preview"
              fill
              className="object-cover object-top"
              unoptimized
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400">
              <User className="w-12 h-12" />
              <span className="text-[10px] mt-1 text-gray-400">ยังไม่มีรูป</span>
            </div>
          )}

          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white text-xs">
              <Loader2 className="w-6 h-6 animate-spin mb-1 text-blue-400" />
              <span>กำลังอัปโหลด...</span>
            </div>
          )}

          {preview && !isUploading && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-1.5 right-1.5 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-md transition-colors"
              title="ลบรูปภาพ"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Instructions */}
        <div className="text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start space-x-2 text-sm font-semibold text-gray-800">
            <Upload className="w-4 h-4 text-blue-600" />
            <span>ลากไฟล์รูปภาพมาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            รองรับไฟล์ PNG, JPG หรือ WebP (แนะนำรูปหน้าตรง พื้นหลังสุภาพ)
          </p>
          <div className="mt-2.5 inline-block text-[11px] font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
            📦 จัดเก็บอัตโนมัติที่ Supabase Bucket: <code className="font-mono">personnel-avatars</code>
          </div>
        </div>
      </div>
    </div>
  );
}
