"use client";

import React, { useEffect, useState } from 'react';

interface ImageData {
  filename: string;
  timestamp: string;
  name: string; // ใช้ชื่อที่ดึงมาจากข้อมูล JSON
  url: string;
}

const ResultPage = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [personName, setPersonName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/face'); // ใช้ GET
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched Images:', data.images);

          // ตรวจสอบว่า data มี personName หรือไม่ ถ้ามีให้ตั้งค่าให้ state
          if (data.personName) {
            setPersonName(data.personName);
          }

          if (Array.isArray(data.images) && data.images.length > 0) {
            const sortedImages = data.images.sort((a: ImageData, b: ImageData) => {
              const timeA = convertTimestampToSeconds(a.timestamp);
              const timeB = convertTimestampToSeconds(b.timestamp);
              return timeA - timeB;
            });

            setImages(sortedImages);
          } else {
            console.error('Error: No valid image data received:', data);
            setError('No images available');
          }
        } else {
          console.error('Error fetching images:', response.statusText);
          setError('Error fetching images');
        }
      } catch (error) {
        console.error('Error fetching images:', error);
        setError('Failed to fetch images');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const convertTimestampToSeconds = (timestamp: string): number => {
    const parts = timestamp.split(':').map(part => parseInt(part, 10));
    const [hours, minutes, seconds] = parts.length === 3 ? parts : [0, parts[0], parts[1]];
    return (hours * 3600) + (minutes * 60) + seconds;
  };

  const totalPages = Math.ceil(images.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = images.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Detection Results for {personName || 'Unknown'}</h1>
      {images.length === 0 ? (
        <div className="text-center">No results available</div>
      ) : (
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border">
              <tr>
                <th scope="col" className="px-6 py-3 border">Name</th>
                <th scope="col" className="px-6 py-3 border">Time (hh:mm:ss)</th>
                <th scope="col" className="px-6 py-3 border">Result Photo</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((image, index) => (
                <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td className="px-6 py-4 border">{image.name}</td>
                  <td className="px-6 py-4 border">{image.timestamp}</td>
                  <td className="px-6 py-4 border">
                    <img src={image.url} alt={`Result for ${image.name || personName || 'Unknown'} at ${image.timestamp}`} className="w-32 h-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
            
          </table>
          <div className="flex justify-center mt-4">
            <nav>
              <ul className="inline-flex -space-x-px">
                {[...Array(totalPages)].map((_, index) => (
                  <li key={index}>
                    <button
                      onClick={() => paginate(index + 1)}
                      className={`px-3 py-2 leading-tight ${currentPage === index + 1
                        ? 'text-blue-600 bg-blue-50 border border-blue-300'
                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700'
                        }`}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultPage;
