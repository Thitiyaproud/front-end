"use client";
import React, { useEffect, useState } from 'react';

interface ImageData {
  filename: string;
  timestamp: string;
  hatType: string;
  url: string;
}

const ResultHat = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // จำนวนรายการต่อหน้า

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/hat');
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched Images:', data.images);

          if (Array.isArray(data.images)) {
            setImages(data.images);
          } else {
            console.error('Error: Data is not an array:', data);
          }
        } else {
          console.error('Error fetching images:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  // คำนวณจำนวนหน้าทั้งหมด
  const totalPages = Math.ceil(images.length / itemsPerPage);

  // หารายการที่จะแสดงในแต่ละหน้า
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = images.slice(indexOfFirstItem, indexOfLastItem);

  // ฟังก์ชันสำหรับเปลี่ยนหน้า
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 flex justify-center">Hat Detection Results</h1>
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border">
            <tr>
              <th scope="col" className="px-6 py-3 border">
                The type of hat
              </th>
              <th scope="col" className="px-6 py-3 border">
                Time (s)
              </th>
              <th scope="col" className="px-6 py-3 border">
                Result photo
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((image, index) => (
              <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {image.hatType} {/* เปลี่ยนจาก glassesType เป็น hatType */}
                </td>
                <td className="px-6 py-4 border">
                  {image.timestamp}
                </td>
                <td className="px-6 py-4 border">
                  <div className="flex items-center">
                    <div
                      className="border rounded-lg overflow-hidden"
                      style={{ width: "120px", height: "auto" }} // ปรับขนาดความกว้างของ container
                    >
                      <img
                        src={image.url}
                        alt={`Result ${index}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover" // ปรับขนาดภาพให้เติมเต็ม container และตัดส่วนเกิน
                        }}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* แสดงการแบ่งหน้า */}
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
    </div>
  );
};

export default ResultHat;
