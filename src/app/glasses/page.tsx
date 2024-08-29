"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loader from '@/components/Loader/Loader';
import toast from 'react-hot-toast';

const Glasses: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Choose the Type of Glasses');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const resetForm = () => {
    setSelectedOption('Choose the Type of Glasses');
    setVideoFile(null);
    setProgress(0);
    setIsLoading(false);
  };

  const handleSubmit = async () => {
    if (!videoFile || selectedOption === 'Choose the Type of Glasses') {
      toast.error('Please select a video file and a type of glasses.');
      return;
    }    

    if (!videoFile.type.startsWith('video/')) {
      toast.error("Please upload a valid video file.");
      return;
    }

    setIsLoading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('glasses_type', selectedOption); // ส่งค่า glasses_type ไปยังเซิร์ฟเวอร์

    try {
      for (let i = 0; i <= 50; i += 20) {
        setProgress(i);
        await new Promise((resolve) => setTimeout(resolve, 50));
      }

      const response = await fetch('http://localhost:5000/result_glasses', {
        method: 'POST',
        body: formData,
      });
        

      if (response.ok) {
        for (let i = 60; i <= 100; i += 10) {
          setProgress(i);
          await new Promise((resolve) => setTimeout(resolve, 150));
        }

        const result = await response.json();

        const importantData = result.results.map((item: any) => ({
          timestamp: item.timestamp,
          class: item.class,
          filename: item.filename,
        }));

        window.localStorage.setItem('detectionResult', JSON.stringify(importantData));

        resetForm();
        router.push('/result_glasses');
      } else {
        console.error('Error:', response.statusText);
        toast.error("Error submitting form.");
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Error submitting form.");
    } finally {
      setIsLoading(false); // หยุดการโหลดเมื่อเกิดข้อผิดพลาดหรือการประมวลผลเสร็จสิ้น
    }
  };

  useEffect(() => {
    if (isLoading) {
      console.log(`Loading... ${progress}%`);
    }
  }, [isLoading, progress]);

  if (isLoading) {
    return <Loader progress={progress} />;
  }

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-2xl mb-4 font-bold">Detection Glasses</h2>
      <div className="bg-gray-200 p-6 rounded-lg shadow-lg">
        <div className="mb-4 relative">
          <button
            id="dropdownDefaultButton"
            data-dropdown-toggle="dropdown"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            type="button"
            onClick={toggleDropdown}
          >
            {selectedOption}
            <svg
              className="w-2.5 h-2.5 ms-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>
          {isDropdownOpen && (
            <ul className="absolute left-0 mt-2 w-full bg-white border rounded-lg shadow-lg">
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleOptionClick('Clear Lens Glasses')}
              >
                Clear Lens Glasses
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleOptionClick('Sunglasses')}
              >
                Sunglasses
              </li>
            </ul>
          )}
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
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>
      <button
        className="mt-4 bg-success text-white px-4 py-2 rounded-lg shadow"
        onClick={handleSubmit}
      >
        Check
      </button>
    </div>
  );
};

export default Glasses;
