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
      const response = await fetch("https://esgoo.net/api-tinhthanh/1/0.htm");
      const res = await response.json();
      return res.data.map((item: any) => ({
        province_id: item.id,
        province_name: item.name,
      }));
    },
  
    // Lấy quận/huyện
    getDistricts: async (provinceId: string): Promise<District[]> => {
      const response = await fetch(`https://esgoo.net/api-tinhthanh/2/${provinceId}.htm`);
      const res = await response.json();
      return res.data.map((item: any) => ({
        district_id: item.id,
        district_name: item.name,
      }));
    },
  
    // Lấy phường/xã
    getWards: async (districtId: string): Promise<Ward[]> => {
      const response = await fetch(`https://esgoo.net/api-tinhthanh/3/${districtId}.htm`);
      const res = await response.json();
      return res.data.map((item: any) => ({
        ward_id: item.id,
        ward_name: item.name,
      }));
    },
  };
  