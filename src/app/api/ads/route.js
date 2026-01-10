import { readdirSync } from 'fs';
import { resolve } from 'path';
import { NextResponse } from 'next/server';

//export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const adsDir = resolve(process.cwd(), 'public/ads');
    console.log('Reading ads directory:', adsDir);
    
    const files = readdirSync(adsDir, { withFileTypes: true })
      .filter(file => file.isFile())
      .map(file => file.name)
      .sort();
    
    console.log('Found files:', files);
    return NextResponse.json(files);
  } catch (error) {
    console.error('Error reading ads directory:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
