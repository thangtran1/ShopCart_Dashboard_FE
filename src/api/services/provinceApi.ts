export interface Province {
    province_id: string;
    province_name: string;
  }
  
  export interface District {
    district_id: string;
    district_name: string;
  }
  
  export interface Ward {
    ward_id: string;
    ward_name: string;
  }
  
  export const locationApi = {
    // Lấy tất cả tỉnh/thành
    getProvinces: async (): Promise<Province[]> => {
      const response = await fetch("https://api.vnappmob.com/api/v2/province/");
      const data = await response.json();
      // API trả về { code: 200, data: [...] }
      return data.results as Province[];
    },
  
    // Lấy quận/huyện theo province_id
    getDistricts: async (provinceId: string): Promise<District[]> => {
      const response = await fetch(`https://api.vnappmob.com/api/v2/province/district/${provinceId}`);
      const data = await response.json();
      return data.results as District[];
    },
  
    // Lấy phường/xã theo district_id
    getWards: async (districtId: string): Promise<Ward[]> => {
      const response = await fetch(`https://api.vnappmob.com/api/v2/province/ward/${districtId}`);
      const data = await response.json();
      return data.results as Ward[];
    },
  };
  