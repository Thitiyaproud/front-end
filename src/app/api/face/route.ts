import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  const directoryPath = path.join('D:/senior-project-1/back-end/output_frames');

  try {
    await fs.mkdir(directoryPath, { recursive: true });

    const files = await fs.readdir(directoryPath);

    const imageUrls = files.map((file) => {
      const timestampMatch = file.match(/_(\d+(\.\d+)?)\.jpg$/);
      const timestampInSeconds = timestampMatch ? parseFloat(timestampMatch[1]) : 0;

      // แปลง timestamp จากวินาทีเป็นรูปแบบ hh:mm:ss
      const timestamp = formatTimestamp(timestampInSeconds);

      const name = path.basename(file, path.extname(file));
      const personName = name.includes('result') ? 'film' : 'Unknown';

      return { 
        url: `http://localhost:5000/output_frames/${file}`,
        name: personName,
        timestamp 
      };
    });

    return NextResponse.json({ images: imageUrls, personName: 'film' }, { status: 200 });
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
