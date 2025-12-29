import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { getUserProfile, UserProfile } from "@/api/services/profileApi";
import { useUserActions, useUserToken } from "@/store/userStore";

export const useUserProfile = () => {
  const queryClient = useQueryClient();
  const { setUserInfo } = useUserActions();
  const { accessToken, refreshToken } = useUserToken();
  const transformUserData = (profileData: UserProfile) => ({
    id: profileData._id,
    email: profileData.email,
    gender: profileData.gender,
    username: profileData.name,
    avatar: profileData.avatar,
    role: profileData.role,
    status: profileData.status,
    phone: profileData.phone,
    dateOfBirth: profileData.dateOfBirth,
    address: profileData.address,
    bio: profileData.bio,
    lastLoginAt: profileData.lastLoginAt,
    loginCount: profileData.loginCount,
    isEmailVerified: profileData.isEmailVerified,
    createdAt: profileData.createdAt,
    updatedAt: profileData.updatedAt,
  });

  const {
    data: profile,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["profile"], // Query Key quan trọng để quản lý cache
    queryFn: getUserProfile,
    enabled: !!accessToken && !!refreshToken, // Chỉ gọi khi có token
    staleTime: 1000 * 60 * 5, // Dữ liệu được coi là mới trong 5 phút
  });

  useEffect(() => {
    if (profile) {
      setUserInfo(transformUserData(profile));
    }
  }, [profile, setUserInfo]);

  const updateProfile = (updatedProfile: UserProfile) => {
    queryClient.setQueryData(["profile"], updatedProfile);
  };

  useEffect(() => {
    const handleProfileUpdate = (event: CustomEvent) => {
      updateProfile(event.detail);
    };
    window.addEventListener("profileUpdated", handleProfileUpdate as EventListener);
    return () => window.removeEventListener("profileUpdated", handleProfileUpdate as EventListener);
  }, [queryClient]);

  return {
    profile,
    error: error ? (error as any).message : null,
    isLoading,
    refetch,
    updateProfile,
  };
};