"use client"; 
import React, { useEffect, useState } from 'react';

interface ImageData {
  filename: string;
  timestamp: string;
  hatType: string;
  url: string;
}

const ResultPage = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // จำนวนรายการต่อหน้า
  const pagesToShow = 5; // จำนวนหน้าที่จะแสดงในแต่ละคราว
  const [loading, setLoading] = useState(true); // สำหรับแสดงสถานะโหลดข้อมูล
  const [error, setError] = useState<string | null>(null); // สำหรับแสดงข้อผิดพลาด
  const [filter, setFilter] = useState<string>('All'); // ตัวกรองประเภทหมวก

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/hat');
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched Images:', data.images);

          if (Array.isArray(data.images)) {
            const sortedImages = data.images.sort((a: ImageData, b: ImageData) => {
              const timeA = convertTimestampToSeconds(a.timestamp);
              const timeB = convertTimestampToSeconds(b.timestamp);
              return timeA - timeB; // เรียงจากเวลาน้อยไปมาก
            });
            setImages(sortedImages);
          } else {
            console.error('Error: Data is not an array:', data);
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

  // ฟังก์ชันสำหรับแปลง timestamp จากรูปแบบ hh:mm:ss เป็นวินาทีทั้งหมด
  const convertTimestampToSeconds = (timestamp: string): number => {
    const parts = timestamp.split(':').map(part => parseInt(part, 10));
    const [hours, minutes, seconds] = parts.length === 3 ? parts : [0, parts[0], parts[1]];
    return (hours * 3600) + (minutes * 60) + seconds;
  };

  // กรองรายการตามประเภทของหมวก
  const filteredImages = filter === 'All' 
  ? images
  : images.filter(image => {
      if (filter === 'balaclava') {
        // กรองเฉพาะ clear glasses ที่มีเลข 1 ขึ้นไปตามหลัง
        return /balaclava[1-9]\d*/.test(image.hatType);
      } else if (filter === 'baseball cap') {
        // กรองเฉพาะ sunglasses ที่มีเลข 1 ขึ้นไปตามหลัง
        return /baseball cap[1-9]\d*/.test(image.hatType);
      } else if (filter === 'beanie') {
        // กรองเฉพาะ sunglasses ที่มีเลข 1 ขึ้นไปตามหลัง
        return /beanie[1-9]\d*/.test(image.hatType);
      }else if (filter === 'bucket hat') {
        // กรองเฉพาะ sunglasses ที่มีเลข 1 ขึ้นไปตามหลัง
        return /bucket hat[1-9]\d*/.test(image.hatType);
      }else if (filter === 'Helmet') {
        // กรองเฉพาะ sunglasses ที่มีเลข 1 ขึ้นไปตามหลัง
        return /Helmet[1-9]\d*/.test(image.hatType);
      }
      return false;
    });
  // คำนวณจำนวนหน้าทั้งหมด
  const totalPages = Math.ceil(filteredImages.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredImages.slice(indexOfFirstItem, indexOfLastItem);

  // ฟังก์ชันสำหรับคำนวณเลขหน้าที่จะแสดง
  const getPageNumbers = () => {
    const startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + pagesToShow - 1);
    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  // ฟังก์ชันสำหรับเปลี่ยนหน้า
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // ฟังก์ชันสำหรับไปหน้าก่อนหน้าและหน้าถัดไป
  const goToPreviousPage = () => setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  const goToNextPage = () => setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));

  if (loading) {
    return <div className="text-center">Loading...</div>; // แสดงข้อความโหลด
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>; // แสดงข้อความข้อผิดพลาด
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 flex justify-center">Detection Results</h1>

      {/* ตัวกรองประเภทหมวก */}
      <div className="flex justify-center mb-4">
        <select
          className="border rounded p-2"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="balaclava">balaclava</option>
          <option value="baseball cap">baseball cap</option>
          <option value="beanie">beanie</option>
          <option value="bucket hat">bucket hat</option>
          <option value="helmet">helmet</option>
        </select>
      </div>

      {filteredImages.length === 0 ? (
        <div className="text-center">No results available</div>
      ) : (
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border">
              <tr>
                <th scope="col" className="px-6 py-3 border">The type of hat</th>
                <th scope="col" className="px-6 py-3 border">Time (hh:mm:ss)</th>
                <th scope="col" className="px-6 py-3 border">Result photo</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((image, index) => (
                <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {image.hatType}
                  </td>
                  <td className="px-6 py-4 border">{image.timestamp}</td>
                  <td className="px-6 py-4 border">
                    <div className="flex items-center">
                      <div
                        className="border rounded-lg overflow-hidden"
                        style={{ width: "120px", height: "auto" }}
                      >
                        <img
                          src={image.url}
                          alt={`Result ${index}`}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* การแบ่งหน้า */}
          <div className="flex justify-center mt-4">
            <button
              onClick={goToPreviousPage}
              className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <ul className="inline-flex -space-x-px">
              {getPageNumbers().map((pageNumber) => (
                <li key={pageNumber}>
                  <button
                    onClick={() => paginate(pageNumber)}
                    className={`px-3 py-2 leading-tight ${currentPage === pageNumber
                      ? 'text-blue-600 bg-blue-50 border border-blue-300'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700'
                      }`}
                  >
                    {pageNumber}
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={goToNextPage}
              className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultPage;
