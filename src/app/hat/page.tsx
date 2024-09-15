'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const Hat: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('video/')) {
        setVideoFile(file);
      } else {
        toast.error('Please upload a valid video file.');
      }
    }
  };

  const resetForm = () => {
    setVideoFile(null);
    setIsLoading(false);
  };

  const handleSubmit = async () => {
    if (!videoFile) {
      toast.error('Please select a video file.');
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('video', videoFile);

    try {
      const response = await fetch('http://localhost:5000/result_hats', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Detection Result:', result);

        toast.success('Detection completed successfully!');
        resetForm();
        router.push('/result_hats');
      } else {
        console.error('Error:', response.statusText);
        toast.error('Error submitting form.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error submitting form.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-2xl mb-4 font-bold">Hat Detection</h2>
      <div className="bg-gray-200 p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Select Video File
          </label>
          <div className="flex items-center">
            <input
              type="file"
              accept="video/*"
              className="file-input file-input-bordered file-input-sm w-full max-w-xs"
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>
      <button
        className="mt-4 bg-success text-white px-4 py-2 rounded-lg shadow"
        onClick={handleSubmit}
        disabled={isLoading} 
      >
        {isLoading ? 'Processing...' : 'Check'}
      </button>
    </div>
  );
};

export default Hat;
