"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

function FaceInputPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<any>(null); // เก็บข้อมูลผลลัพธ์
  const router = useRouter(); // ใช้ useRouter สำหรับเปลี่ยนเส้นทาง

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImageFile(event.target.files[0]);
    }
  };

  const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setVideoFile(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!imageFile || !videoFile) {
      alert('Please select both image and video files.');
      return;
    }

    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('video', videoFile);

    setProcessing(true); // เริ่มการประมวลผล
    try {
      const response = await fetch('http://localhost:5000/result_face', { 
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setResult(result); // เก็บข้อมูลผลลัพธ์ใน state
        console.log('Processing completed:', result);
        router.push('/result_face'); // เปลี่ยนเส้นทางไปยังหน้า result_face
      } else {
        console.error('Error:', response.statusText);
        alert('Error processing the files.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error connecting to the server.');
    } finally {
      setProcessing(false); // จบการประมวลผล
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-2xl mb-4 font-bold">Detection Face</h2>
      <div className="bg-gray-200 p-6 rounded-lg shadow-lg space-x-15">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Select Image File
          </label>
          <div className="flex items-center">
            <input 
              type="file" 
              accept="image/*" 
              className="file-input file-input-bordered file-input-sm w-full max-w-xs"
              onChange={handleImageChange} 
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Select Video File
          </label>
          <div className="flex items-center">
            <input 
              type="file" 
              accept="video/*" 
              className="file-input file-input-bordered file-input-sm w-full max-w-xs"
              onChange={handleVideoChange} 
            />
          </div>
        </div>
      </div>
      <button 
        className="mt-4 bg-success text-white px-4 py-2 rounded-lg shadow"
        onClick={handleSubmit}
        disabled={processing}
      >
        {processing ? 'Processing...' : 'Check'}
      </button>

      {/* แสดงผลลัพธ์หลังจากประมวลผล */}
      {result && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Processing Results</h3>
          <pre className="p-4 bg-gray-100 rounded-lg">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default FaceInputPage;
