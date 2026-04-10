import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const frontendData = await request.formData();
    const djangoPayload = new FormData();

    // Mapping text fields from Screenshot 2
    djangoPayload.append('client_id', frontendData.get('client_id') || '7');

    // Mapping file fields from Screenshot 2
    const fields = ['id_image_front', 'id_image_back', 'profile_picture'];
    
    fields.forEach(field => {
      const file = frontendData.get(field);
      if (file && typeof file !== 'string') {
        djangoPayload.append(field, file);
      }
    });

    const response = await fetch(`${process.env.NEXT_PUBLIC_DJANGO_API_URL}/auth/individual/kyc/`, {
      method: 'POST',
      body: djangoPayload,
    });

    const result = await response.json();
    
    return NextResponse.json(result, { status: response.status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}