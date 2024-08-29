import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const directoryPath = path.join('D:/senior-project-1/back-end/output_frames');

  try {
    const files = fs.readdirSync(directoryPath);
    const imageUrls = files.map((file) => {
      const timestamp = getTimestampFromFilename(file);

      // ตรวจสอบประเภทของแว่นโดยการตรวจสอบคำที่ชัดเจนมากขึ้น
      const glassesType = file.includes('sunglasses') ? 'Sunglasses' : 
                         file.includes('glasses_frame') ? 'Clear Lens Glasses' : 
                         'Unknown';

      return { url: `http://localhost:5000/output_frames/${file}`, timestamp, glassesType };
    });

    return NextResponse.json({ images: imageUrls }, { status: 200 });
  } catch (error) {
    console.error('Error reading directory:', error);
    return NextResponse.json({ error: 'Error fetching images' }, { status: 500 });
  }
}

function getTimestampFromFilename(filename: string): string {
  const match = filename.match(/frame_(\d+)\.jpg/);
  if (match) {
    const frameNumber = parseInt(match[1], 10);
    const seconds = (frameNumber / 30).toFixed(2);  // สมมติว่า FPS เป็น 30, ปรับตามที่เหมาะสม
    return `${seconds}s`;
  }
  return "00:00";
}
