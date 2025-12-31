import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { locationApi } from "@/api/services/provinceApi";

/** * Dữ liệu địa giới hành chính rất ít thay đổi, 
 * thiết lập Infinity để cache vĩnh viễn trong phiên làm việc.
 */
const LOCATION_STALE_TIME = Infinity;

export const useLocation = (provinceId?: string | number, districtId?: string | number) => {
  
  // 1. Lấy danh sách Tỉnh/Thành
  const provincesQuery = useQuery({
    queryKey: ["provinces"],
    queryFn: locationApi.getProvinces,
    staleTime: LOCATION_STALE_TIME,
  });

  // 2. Lấy danh sách Quận/Huyện (Phụ thuộc vào provinceId)
  const districtsQuery = useQuery({
    queryKey: ["districts", provinceId],
    queryFn: () => locationApi.getDistricts(String(provinceId)),
    enabled: !!provinceId,
    staleTime: LOCATION_STALE_TIME,
    placeholderData: keepPreviousData, // Giữ lại danh sách cũ trong lúc tải danh sách mới
  });

  // 3. Lấy danh sách Phường/Xã (Phụ thuộc vào districtId)
  const wardsQuery = useQuery({
    queryKey: ["wards", districtId],
    queryFn: () => locationApi.getWards(String(districtId)),
    enabled: !!districtId,
    staleTime: LOCATION_STALE_TIME,
    placeholderData: keepPreviousData,
  });

  return {
    provinces: provincesQuery.data || [],
    districts: districtsQuery.data || [],
    wards: wardsQuery.data || [],
    
    // Trạng thái load cho UI
    isLoadingProvinces: provincesQuery.isLoading,
    isLoadingDistricts: districtsQuery.isLoading,
    isLoadingWards: wardsQuery.isLoading,
    
    // Trạng thái đang tải ngầm (nếu cần hiện icon loading nhỏ)
    isFetching: districtsQuery.isFetching || wardsQuery.isFetching,
  };
};