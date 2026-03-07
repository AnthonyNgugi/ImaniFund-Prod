const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/apps/imanifund/api/v2";

export const api = {
  // Dropdown Data
  getDocumentTypes: () => fetch(`${BASE_URL}/manage/document-types/`).then(res => res.json()),
  getMerchantTypes: () => fetch(`${BASE_URL}/manage/merchant-type/`).then(res => res.json()),
  getMerchantCategories: (typeId: string) => fetch(`${BASE_URL}/manage/merchant-type-categories/?merchant_type_id=${typeId}`).then(res => res.json()),
  getRegions: () => fetch(`${BASE_URL}/regions/`).then(res => res.json()),
  getSubRegions: (regionId: string) => fetch(`${BASE_URL}/manage/country-sub-region/?country_region_id=${regionId}`).then(res => res.json()),

  // Auth Actions
  triggerOtp: (mobile: string) => 
    fetch(`${BASE_URL}/auth/trigger-otp/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile_number: mobile })
    }).then(res => res.json()),

  register: (data: any) => 
    fetch(`${BASE_URL}/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()),
};