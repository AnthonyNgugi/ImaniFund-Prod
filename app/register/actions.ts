// // actions.ts

// interface ServerActionResponse {
//   status: boolean;
//   message: string;
//   data?: any; // Optional, in case your API returns user/token data
// }

// export async function requestOtpAction(
//   mobile_number: string, 
//   user_type: string
// ): Promise<ServerActionResponse> {
//   try {
//     const response = await fetch("http://127.0.0.1:8000/apps/imanifund/api/v2/auth/register/send/otp/", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ mobile_number, user_type }),
//     });

//     const result = await response.json();

//     // Mapping your API response to the expected return type
//     return {
//       status: result.status, // True or False
//       message: result.message,
//     };
//   } catch (error) {
//     return {
//       status: false,
//       message: "Network error: Unable to reach the server.",
//     };
//   }
// }

// export async function registerAction(
//   formData: any, 
//   user_type: string
// ): Promise<ServerActionResponse> {
//   try {
//     const endpoint = user_type === "individual" 
//       ? "http://127.0.0.1:8000/apps/imanifund/api/v2/auth/onboarding/individual/" 
//       : "http://127.0.0.1:8000/apps/imanifund/api/v2/auth/onboarding/institution/";

//     const response = await fetch(endpoint, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(formData),
//     });

//     const result = await response.json();

//     return {
//       status: result.status,
//       message: result.message,
//       data: result.data || null
//     };
//   } catch (error) {
//     return {
//       status: false,
//       message: "Critical registration error. Please try again later.",
//     };
//   }
// }


// actions.ts

interface ServerActionResponse {
  status: boolean;
  message: string;
  data?: any;
}

export async function requestOtpAction(
  mobile_number: string, 
  user_type: string
): Promise<ServerActionResponse> {
  try {
    const response = await fetch("http://127.0.0.1:8000/apps/imanifund/api/v2/auth/register/send/otp/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile_number, user_type }),
    });

    const result = await response.json();
    return { status: result.status, message: result.message };
  } catch (error) {
    return { status: false, message: "Network error: Unable to reach the server." };
  }
}

export async function registerAction(
  formData: any, 
  persona: string
): Promise<ServerActionResponse> {
  try {
    // Transform the categories array to the required object format
    const transformedCategories = formData.merchant_type_categories.map((id: number) => ({
      merchant_type_category_id: id
    }));

    // Construct the final payload
    const payload = {
      ...formData,
      merchant_type_categories: transformedCategories
    };

    const endpoint = persona === "individual" 
      ? "http://127.0.0.1:8000/apps/imanifund/api/v2/auth/onboarding/individual/" 
      : "http://127.0.0.1:8000/apps/imanifund/api/v2/auth/onboarding/institution/";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    return {
      status: result.status,
      message: result.message,
      data: result.data || null
    };
  } catch (error) {
    return {
      status: false,
      message: "Critical registration error. Please check your connection.",
    };
  }
}