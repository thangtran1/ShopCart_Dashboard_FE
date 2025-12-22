import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useMaintenancePolling } from "./useMaintenancePolling";
import { CreateMaintenanceDto, Maintenance, maintenanceApi, MaintenanceFilter, MaintenanceStatus, UpdateMaintenanceDto } from "@/api/services/maintenanceApi";
export function useMaintence(isScheduled: boolean = false) {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMaintenances, setSelectedMaintenances] = useState<string[]>(
    []
  );

  // Get initial filters from URL params
  const getInitialFilters = (): MaintenanceFilter => ({
    page: parseInt(searchParams.get("page") || "1", 10),
    limit: parseInt(searchParams.get("limit") || "10", 10),
    title: searchParams.get("title") || undefined,
    type: (searchParams.get("type") as any) || undefined,
    status: isScheduled
      ? MaintenanceStatus.SCHEDULED
      : (searchParams.get("status") as any) || undefined,
    from: searchParams.get("from") || undefined,
    to: searchParams.get("to") || undefined,
  });

  const [filters, setFilters] = useState<MaintenanceFilter>(
    getInitialFilters()
  );

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Update URL params when filters change
  const updateUrlParams = (newFilters: MaintenanceFilter) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.set(key, String(value));
      } else {
        params.delete(key);
      }
    });

    setSearchParams(params);
  };

  // ========== FETCH DATA ==========

  const fetchMaintenances = async (queryParams?: MaintenanceFilter) => {
    try {
      setLoading(true);
      const params = { ...filters, ...queryParams };
      const response = await maintenanceApi.getList(params);
      if (response.data.success) {
        setMaintenances(response.data.data);
        const pageInfo = response.data.pagination;
        setPagination({
          page: pageInfo.page || 1,
          limit: pageInfo.limit,
          total: pageInfo.total,
          totalPages: pageInfo.totalPages,
        });
      }
    } catch (error) {
      console.error("❌ fetchMaintenances ~ error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ========== CRUD OPERATIONS ==========

  const handleCreate = async (values: CreateMaintenanceDto) => {
    try {
      setLoading(true);
      await maintenanceApi.create(values);
      toast.success(t("maintenance.create-success"));
      await fetchMaintenances();
      setupTimers(); // Thiết lập lại timer khi tạo mới
      return true;
    } catch (error) {
      console.error("❌ createMaintenance ~ error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (id: string, values: UpdateMaintenanceDto) => {
    try {
      setLoading(true);
      const response = await maintenanceApi.update(id, values);
      if (response.data.success) {
        toast.success(t("maintenance.update-success"));
        await fetchMaintenances();
        setupTimers(); // Thiết lập lại timer khi cập nhật
        return true;
      } else {
        toast.error(response.data.message);
        return false;
      }
    } catch (error) {
      console.error("❌ updateMaintenance ~ error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (ids: string | string[]) => {
    if (!ids) return;

    try {
      setLoading(true);
      const response = await maintenanceApi.remove(ids);
      if (response.data.success) {
        toast.success(t("maintenance.delete-success"));
        setSelectedMaintenances([]);
        await refreshData();
        return true;
      } else {
        toast.error(response.data.message);
        return false;
      }
    } catch (error) {
      console.error("❌ deleteMaintenance ~ error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartNow = async (id: string) => {
    try {
      setLoading(true);
      await maintenanceApi.startNow(id);

      toast.success(t("maintenance.start-success"));
      await fetchMaintenances();
    } catch (error) {
      console.error("❌ startMaintenance ~ error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async (id: string) => {
    try {
      setLoading(true);
      await maintenanceApi.stop(id);

      toast.success(t("maintenance.stop-success"));
      await fetchMaintenances();
    } catch (error) {
      console.error("❌ stopMaintenance ~ error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    try {
      setLoading(true);
      await maintenanceApi.cancel(id);

      toast.success(t("maintenance.cancel-success"));
      await fetchMaintenances();
    } catch (error) {
      console.error("❌ cancelMaintenance ~ error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMany = async (ids: string[]) => {
    await handleDelete(ids);
  };

  // ========== UI HANDLERS ==========

  const handleFilterChange = (key: keyof MaintenanceFilter, value: any) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
    updateUrlParams(newFilters);
    fetchMaintenances(newFilters);
  };

  const handlePageChange = (page: number, pageSize?: number) => {
    const newFilters = { ...filters, page, limit: pageSize || filters.limit };
    setFilters(newFilters);
    updateUrlParams(newFilters);
    fetchMaintenances(newFilters);
  };

  const handleSelectMaintenance = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedMaintenances([...selectedMaintenances, id]);
    } else {
      setSelectedMaintenances(selectedMaintenances.filter((mId) => mId !== id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedMaintenances(maintenances.map((m) => m._id));
    } else {
      setSelectedMaintenances([]);
    }
  };

  const handleClearFilters = () => {
    const defaultFilters: MaintenanceFilter = {
      page: 1,
      limit: 10,
      title: undefined,
      type: undefined,
      status: isScheduled ? MaintenanceStatus.SCHEDULED : undefined,
      from: undefined,
      to: undefined,
    };
    setFilters(defaultFilters);
    updateUrlParams(defaultFilters);
    fetchMaintenances(defaultFilters);
  };

  const refreshData = async () => {
    await fetchMaintenances();
  };

  // ========== EFFECTS ==========

  // Sử dụng timer để tự động cập nhật đúng thời điểm
  const { setupTimers } = useMaintenancePolling(() => {
    fetchMaintenances(filters);
  });

  useEffect(() => {
    const initialFetch = async () => {
      await fetchMaintenances(filters);
    };
    initialFetch();
  }, []);

  // Update filters when URL params change
  useEffect(() => {
    const newFilters = getInitialFilters();
    setFilters(newFilters);
    fetchMaintenances(newFilters);
  }, [searchParams]);

  return {
    // State
    maintenances,
    loading,
    selectedMaintenances,
    filters,
    pagination,

    // Actions
    handleCreate,
    handleUpdateUser,
    handleDelete,
    handleStartNow,
    handleStop,
    handleCancel,
    handleDeleteMany,
    handleFilterChange,
    handlePageChange,
    handleSelectMaintenance,
    handleSelectAll,
    handleClearFilters,
    refreshData,
  };
}
