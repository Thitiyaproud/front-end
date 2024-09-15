import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const directoryPath = path.join('D:/senior-project-1/back-end/output_frames');

  try {
    // อ่านไฟล์ทั้งหมดใน directory
    const files = fs.readdirSync(directoryPath);
    const imageUrls = files.map((file) => {
      // ดึงข้อมูล timestamp จากชื่อไฟล์ เช่น "hat_frame_15.45.jpg"
      const timestamp = getTimestampFromFilename(file);

      // ตรวจสอบประเภทของหมวกจากชื่อไฟล์ เช่น "bucket hat", "helmet"
      const hatType = getHatTypeFromFilename(file);

      return { url: `http://localhost:5000/output_frames/${file}`, timestamp, hatType };
    });

    return NextResponse.json({ images: imageUrls }, { status: 200 });
  } catch (error) {
    console.error('Error reading directory:', error);
    return NextResponse.json({ error: 'Error fetching images' }, { status: 500 });
  }
}

// ฟังก์ชันสำหรับดึง timestamp จากชื่อไฟล์
function getTimestampFromFilename(filename: string): string {
  // ใช้ regular expression เพื่อจับค่าที่เป็นตัวเลขหลัง 'frame_' และก่อน '.jpg'
  const match = filename.match(/frame_(\d+(\.\d+)?)\.jpg/); 
  if (match) {
    // ดึงค่าที่ตรงกับ pattern ที่จับได้ (เช่น "15.45")
    const seconds = parseFloat(match[1]);
    return formatTimestamp(seconds); // แปลงวินาทีเป็นรูปแบบ hh:mm:ss
  }
  return "00:00:00"; // คืนค่า "00:00:00" ถ้าไม่พบรูปแบบที่ต้องการ
}

// ฟังก์ชันสำหรับแปลงวินาทีเป็นรูปแบบ hh:mm:ss
function formatTimestamp(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600); // คำนวณจำนวนชั่วโมง
  const minutes = Math.floor((totalSeconds % 3600) / 60); // คำนวณจำนวนที่เหลือเป็นนาที
  const remainingSeconds = Math.floor(totalSeconds % 60); // คำนวณจำนวนที่เหลือเป็นวินาที

  // เพิ่มเลขศูนย์ด้านหน้าถ้าจำนวนน้อยกว่า 10
  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

// ฟังก์ชันสำหรับตรวจสอบประเภทของหมวกจากชื่อไฟล์
function getHatTypeFromFilename(filename: string): string {
  const lowerCaseFilename = filename.toLowerCase(); // แปลงเป็นตัวพิมพ์เล็กเพื่อการตรวจสอบที่ไม่สนใจตัวพิมพ์

  // เพิ่มการ log ชื่อไฟล์เพื่อการตรวจสอบ
  console.log(`Checking hat type for file: ${filename}`);

  // ตรวจสอบประเภทของหมวกจากส่วนของชื่อไฟล์
  if (lowerCaseFilename.includes('balaclava')) return 'Balaclava';
  if (lowerCaseFilename.includes('baseball cap')) return 'Baseball Cap';
  if (lowerCaseFilename.includes('beanie')) return 'Beanie';
  if (lowerCaseFilename.includes('bucket hat')) return 'Bucket Hat';
  if (lowerCaseFilename.includes('helmet')) return 'Helmet';
  
  return 'Unknown'; 
}
