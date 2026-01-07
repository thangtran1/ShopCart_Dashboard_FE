// export interface Province {
//     province_id: string;
//     province_name: string;
//   }
  
//   export interface District {
//     district_id: string;
//     district_name: string;
//   }
  
//   export interface Ward {
//     ward_id: string;
//     ward_name: string;
//   }
  
//   export const locationApi = {
//     // Lấy tất cả tỉnh/thành
//     getProvinces: async (): Promise<Province[]> => {
//       const response = await fetch("https://esgoo.net/api-tinhthanh/1/0.htm");
//       const res = await response.json();
//       return res.data.map((item: any) => ({
//         province_id: item.id,
//         province_name: item.name,
//       }));
//     },
  
//     // Lấy quận/huyện
//     getDistricts: async (provinceId: string): Promise<District[]> => {
//       const response = await fetch(`https://esgoo.net/api-tinhthanh/2/${provinceId}.htm`);
//       const res = await response.json();
//       return res.data.map((item: any) => ({
//         district_id: item.id,
//         district_name: item.name,
//       }));
//     },
  
//     // Lấy phường/xã
//     getWards: async (districtId: string): Promise<Ward[]> => {
//       const response = await fetch(`https://esgoo.net/api-tinhthanh/3/${districtId}.htm`);
//       const res = await response.json();
//       return res.data.map((item: any) => ({
//         ward_id: item.id,
//         ward_name: item.name,
//       }));
//     },
//   };
  
// 2 cách lấy địa chỉ

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
    const response = await fetch("https://provinces.open-api.vn/api/p/");
    const res = await response.json();

    return res.map((item: any) => ({
      province_id: String(item.code),
      province_name: item.name,
    }));
  },

  // Lấy quận/huyện theo tỉnh
  getDistricts: async (provinceId: string): Promise<District[]> => {
    const response = await fetch(
      `https://provinces.open-api.vn/api/p/${provinceId}?depth=2`
    );
    const res = await response.json();

    return res.districts.map((item: any) => ({
      district_id: String(item.code),
      district_name: item.name,
    }));
  },

  // Lấy phường/xã theo huyện
  getWards: async (districtId: string): Promise<Ward[]> => {
    const response = await fetch(
      `https://provinces.open-api.vn/api/d/${districtId}?depth=2`
    );
    const res = await response.json();

    return res.wards.map((item: any) => ({
      ward_id: String(item.code),
      ward_name: item.name,
    }));
  },
};
