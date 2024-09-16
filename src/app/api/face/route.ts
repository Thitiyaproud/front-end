import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  const directoryPath = path.join('D:/senior-project-1/back-end/output_frames');

  try {
    await fs.mkdir(directoryPath, { recursive: true });

    const files = await fs.readdir(directoryPath);

    const imageUrls = files.map((file) => {
      // จับคู่เพื่อดึง image_name จากชื่อไฟล์ เช่น film1_6300_210.jpg
      const match = file.match(/^(.+?)_\d+_\d+\.jpg$/); 
      const imageName = match ? match[1] : 'Unknown'; // ดึง image_name
      const timestampMatch = file.match(/_(\d+)\.jpg$/);
      const timestampInSeconds = timestampMatch ? parseInt(timestampMatch[1]) : 0;

      // แปลง timestamp จากวินาทีเป็นรูปแบบ hh:mm:ss
      const timestamp = formatTimestamp(timestampInSeconds);

      return { 
        url: `http://localhost:5000/output_frames/${file}`,
        imageName, // ส่งชื่อ image_name ออกมา
        timestamp 
      };
    });

    return NextResponse.json({ images: imageUrls }, { status: 200 });
  } catch (error) {
    console.error('Error reading directory:', error);
    return NextResponse.json({ error: 'Error fetching images' }, { status: 500 });
  }
}

// ฟังก์ชันสำหรับแปลง timestamp จากวินาทีเป็นรูปแบบ hh:mm:ss
function formatTimestamp(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  // เพิ่มเลขศูนย์ด้านหน้าถ้าจำนวนน้อยกว่า 10
  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}
