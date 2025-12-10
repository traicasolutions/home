import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const data = await request.json();
    const { fullName, email, phone, courses, message } = data;

    // Validate required fields
    if (!fullName || !email || !phone || !courses || courses.length === 0) {
      return NextResponse.json(
        { error: 'Please fill all required fields and select at least one course' },
        { status: 400 }
      );
    }

    // Prepare CSV data
    const timestamp = new Date().toISOString();
    const coursesString = courses.join('; ');
    const messageText = message || 'N/A';
    
    // CSV row format: Timestamp, Name, Email, Phone, Courses, Message
    const csvRow = `"${timestamp}","${fullName}","${email}","${phone}","${coursesString}","${messageText}"\n`;

    // Define CSV file path (in project root for now, can be changed)
    const csvFilePath = path.join(process.cwd(), 'course-registrations.csv');

    // Check if file exists, if not create with headers
    if (!fs.existsSync(csvFilePath)) {
      const headers = 'Timestamp,Full Name,Email,Phone,Courses,Message\n';
      fs.writeFileSync(csvFilePath, headers);
    }

    // Append data to CSV
    fs.appendFileSync(csvFilePath, csvRow);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Registration submitted successfully! We will contact you soon.' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to process registration. Please try again.' },
      { status: 500 }
    );
  }
}
