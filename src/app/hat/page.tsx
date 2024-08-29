'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const Hat: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Choose the Type of Hat');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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
    setSelectedOption('Choose the Type of hats');
    setVideoFile(null);
    setIsLoading(false);
  };

  const handleSubmit = async () => {
    if (!videoFile || selectedOption === 'Choose the Type of Hat') {
      toast.error('Please select a video file and a type of hat.');
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('hat_type', selectedOption); // ส่งประเภทของหมวกไปยังเซิร์ฟเวอร์

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
      <h2 className="text-2xl mb-4 font-bold">Detection Hat</h2>
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
                onClick={() => handleOptionClick('Balaclava')}
              >
                Balaclava
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleOptionClick('Baseball Cap')}
              >
                Baseball Cap
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleOptionClick('Beanie')}
              >
                Beanie
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleOptionClick('Bucket Hat')}
              >
                Bucket Hat
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleOptionClick('Helmet')}
              >
                Helmet
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
        disabled={isLoading} 
      >
        {isLoading ? 'Processing...' : 'Check'}
      </button>
    </div>
  );
};

export default Hat;
