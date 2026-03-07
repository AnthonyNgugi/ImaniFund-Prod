import { NextRequest, NextResponse } from 'next/server';

/**
 * IMANIFUND KYC GATEWAY
 * Forwards frontend FormData to the Django Backend
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Parse the incoming multipart/form-data from the frontend
    const frontendData = await request.formData();

    // 2. Initialize a new FormData object for Django
    const djangoPayload = new FormData();

    // 3. Map Text Fields (Names match your inputs exactly)
    const textFields = [
      'merchant_id',
      'director_fullname',
      'director_mobile_number',
      'director_id_number',
      'director_kra_pin'
    ];

    textFields.forEach(field => {
      const value = frontendData.get(field);
      if (value) djangoPayload.append(field, value as string);
    });

    // 4. Map File Fields (Names match your Postman keys)
    const fileFields = [
      'registration_certificate',
      'institution_kra_pin',
      'board_resolution',
      'director_id_image_front',
      'director_id_image_back',
      'director_kra_pic_certificate',
      'selfie'
    ];

    fileFields.forEach(field => {
      const file = frontendData.get(field);
      // Ensure it's a valid file before appending
      if (file && typeof file !== 'string') {
        djangoPayload.append(field, file);
      }
    });

    // 5. Forward to Django
    // Ensure DJANGO_API_URL is defined in your .env.local
    const DJANGO_ENDPOINT = `${process.env.DJANGO_API_URL}/auth/institution/kyc/`;

    const response = await fetch(DJANGO_ENDPOINT, {
      method: 'POST',
      body: djangoPayload,
      // Note: Do NOT manually set Content-Type header; 
      // the browser/Next.js will set it with the correct boundary automatically.
      headers: {
        'Accept': 'application/json',
        // 'Authorization': `Token ${process.env.DJANGO_AUTH_TOKEN}`, // Uncomment if using Token Auth
      },
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Django Error:', result);
      return NextResponse.json(
        { error: 'Backend rejection', details: result },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, data: result });

  } catch (error: any) {
    console.error('Internal Gateway Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}