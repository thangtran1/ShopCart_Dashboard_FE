import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router";
import { useUserInfo } from "@/store/userStore";
import { AuthSessionStatus } from "@/types/enum";
import { AuthSession, getAllAuthSessions, Pagination } from "@/api/services/activity-logApi";

export const useAuthSession = () => {
  const userInfo = useUserInfo();
  const [searchParams, setSearchParams] = useSearchParams();

  const [authSessions, setAuthSessions] = useState<AuthSession[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    onPageChange: () => {},
  });

  // Get initial values from URL params
  const getInitialSearchOptions = (): {
    keyword?: string;
    sessionStatus?: AuthSessionStatus;
    from?: string;
    to?: string;
  } => ({
    keyword: searchParams.get("keyword") || undefined,
    sessionStatus: searchParams.get("sessionStatus") as AuthSessionStatus | undefined,
    from: searchParams.get("from") || undefined,
    to: searchParams.get("to") || undefined,
  });

  const getInitialPage = () => {
    const pageParam = searchParams.get("page");
    return pageParam ? parseInt(pageParam, 10) : 1;
  };

  const getInitialLimit = () => {
    const limitParam = searchParams.get("limit");
    return limitParam ? parseInt(limitParam, 10) : 10;
  };

  const [page, setPage] = useState<number>(getInitialPage());
  const [limit, setLimit] = useState<number>(getInitialLimit());
  const [searchOptions, setSearchOptions] = useState<{
    keyword?: string;
    sessionStatus?: AuthSessionStatus;
    from?: string;
    to?: string;
  }>(getInitialSearchOptions());

  const isAdmin = userInfo?.role === "admin";

  // Update URL params
  const updateUrlParams = useCallback(
    (newPage: number, newOptions: any, newLimit?: number) => {
      const params = new URLSearchParams();

      // Always set page, even if it's 1
      params.set("page", newPage.toString());

      // Nếu limit khác 10 thì set limit = ''
      if (newLimit && newLimit !== 10) params.set("limit", newLimit.toString());

      // Set search options
      if (newOptions.keyword) params.set("keyword", newOptions.keyword);
      if (newOptions.sessionStatus) params.set("sessionStatus", newOptions.sessionStatus);
      if (newOptions.from) params.set("from", newOptions.from);
      if (newOptions.to) params.set("to", newOptions.to);

      setSearchParams(params);
    },
    [setSearchParams]
  );

  const loadNotifications = useCallback(
    async (
      pageNum: number = 1,
      limitNum: number = limit,
      options?: {
        keyword?: string;
        sessionStatus?: AuthSessionStatus;
        from?: string;
        to?: string;
      }
    ) => {
      if (!isAdmin) return;

      setLoading(true);
      setError(null);

      try {
        const searchParams = options || searchOptions;
        const response = await getAllAuthSessions.getAll(
          pageNum,
          limitNum,
          searchParams as {
            keyword?: string;
            sessionStatus?: AuthSessionStatus;
            from?: string;
            to?: string;
          }
        );
        setAuthSessions(response.data.authSessions);
        setTotal(response.data.total);
        setPage(pageNum);
        setPagination({
          page: pageNum,
          limit: limitNum,
          total: response.data.total,
          totalPages: Math.ceil(response.data.total / limitNum),
          onPageChange: (page: number, pageSize?: number) => {
            loadNotifications(page, pageSize || limitNum, searchOptions);
          },
        });
        // Update search options and URL
        const finalOptions = options || searchOptions;
        if (options) {
          setSearchOptions(options);
        }
        updateUrlParams(pageNum, finalOptions, limitNum);
      } catch (err: any) {
        setError(err.message || "Failed to load notifications");
        console.error("Error loading notifications:", err);
      } finally {
        setLoading(false);
      }
    },
    [isAdmin, limit, searchOptions, updateUrlParams]
  );


  const deleteNotification = useCallback(
    () => {
      console.log("deleteNotification");
    },
    []
    // async (id: string): Promise<void> => {
    //   if (!isAdmin) throw new Error("Unauthorized");

    //   try {
    //     await notificationAdminService.delete(id);

    //     setAuthSessions((prev) => prev.filter((n) => n.userId !== id));
    //     setTotal((prev) => Math.max(0, prev - 1));
    //   } catch (err: any) {
    //     setError(err.message || "Failed to delete auth session");
    //     throw err;
    //   }
    // },
    // [isAdmin]
  );

  // Search and filter functions
  const handleSearch = useCallback(
    (searchText: string) => {
      const newOptions = { ...searchOptions, search: searchText };
      // Keep current page when searching
      loadNotifications(page, limit, newOptions);
    },
    [loadNotifications, searchOptions, limit, page]
  );

  const handleFilterChange = useCallback(
    (filterOptions: {
      search?: string;
      type?: string;
      startDate?: string;
      endDate?: string;
    }) => {
      const newOptions = { ...searchOptions, ...filterOptions };
      // Keep current page when filtering
      loadNotifications(page, limit, newOptions);
    },
    [loadNotifications, searchOptions, limit, page]
  );

  const clearFilters = useCallback(() => {
    const emptyOptions = {};
    setSearchOptions(emptyOptions);
    setPage(1);
    setLimit(10);
    // Clear URL params
    setSearchParams(new URLSearchParams());
    loadNotifications(1, 20, emptyOptions);
  }, [loadNotifications, setSearchParams]);

  // Load data from URL params on mount
  useEffect(() => {
    if (isAdmin) {
      const initialOptions = getInitialSearchOptions();
      const initialPage = getInitialPage();
      const initialLimit = getInitialLimit();

      // Set initial states
      setSearchOptions(initialOptions);
      setPage(initialPage);
      setLimit(initialLimit);

      // Load data và thống kê
      loadNotifications(initialPage, initialLimit, initialOptions);
    }
  }, [isAdmin]);

  return {
    authSessions,
    loading,
    error,
    total,
    pagination,
    isAdmin,
    searchOptions,
    loadNotifications,
    deleteNotification,
    handleSearch,
    handleFilterChange,
    clearFilters,
    onPageChange: pagination.onPageChange,
  };
};
