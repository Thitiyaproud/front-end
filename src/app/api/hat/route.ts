import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const directoryPath = path.join('D:/senior-project-1/back-end/output_frames');

  try {
    const files = fs.readdirSync(directoryPath);
    const imageUrls = files.map((file) => {
      const timestamp = getTimestampFromFilename(file);

      // ตรวจสอบประเภทของหมวกในชื่อไฟล์
      const hatType = getHatTypeFromFilename(file);

      return { url: `http://localhost:5000/output_frames/${file}`, timestamp, hatType };
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
    const seconds = (frameNumber / 30).toFixed(2);
    return `${seconds}s`;
  }
  return "00:00";
}

function getHatTypeFromFilename(filename: string): string {
  const lowerCaseFilename = filename.toLowerCase();
  
  // เพิ่มการ log ชื่อไฟล์เพื่อการตรวจสอบ
  console.log(`Checking hat type for file: ${filename}`);

  if (lowerCaseFilename.includes('balaclava')) return 'Balaclava';
  if (lowerCaseFilename.includes('baseball cap')) return 'Baseball Cap';
  if (lowerCaseFilename.includes('beanie')) return 'Beanie';
  if (lowerCaseFilename.includes('bucket hat')) return 'Bucket Hat';
  if (lowerCaseFilename.includes('helmet')) return 'Helmet';
  
  return 'Unknown';
}

