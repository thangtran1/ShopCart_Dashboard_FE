const BANNER_PREFIX = '/banners';
const BANNER_SETTINGS = `${BANNER_PREFIX}/settings`;
const ACTIVITY_LOG_PREFIX = "/activity-log";
const BRAND_PREFIX = "/brands";
const CATEGORY_PREFIX = "/categories";
const USER_PREFIX = "/user";
const NOTIFICATION_PREFIX = "/notifications";
const MAINTENANCE_PREFIX = "/maintenance";
const DATABASE_PREFIX = "/database";
const FEEDBACK_PREFIX = "/feedback";
const AUTH_PREFIX = "/auth";
const SYSTEM_PREFIX = "/system";
const PRODUCT_PREFIX = "/products"
const ADDRESSES_PREFIX = "/addresses"
export const API_URL = {
  BANNER: {
    CREATE: `${BANNER_PREFIX}`,
    GET_ALL: `${BANNER_PREFIX}`,
    GET_ACTIVE: `${BANNER_PREFIX}/active`,
    GET_BY_ID: (id: string) => `${BANNER_PREFIX}/${id}`,
    UPDATE: (id: string) => `${BANNER_PREFIX}/${id}`,
    TOGGLE: (id: string) => `${BANNER_PREFIX}/${id}/toggle`,
    ORDER: (id: string) => `${BANNER_PREFIX}/${id}/order`,
    DELETE: (id: string) => `${BANNER_PREFIX}/${id}`,
    SETTINGS: BANNER_SETTINGS,
    SETTINGS_RESET: `${BANNER_SETTINGS}/reset`,
  },

  ACTIVITY_LOG: {
    GET_BY_ID: (id: string) => `${ACTIVITY_LOG_PREFIX}/${id}`,
    GET_ADMIN: `${ACTIVITY_LOG_PREFIX}/admin`,
    GET_ALL_SESSIONS: `${ACTIVITY_LOG_PREFIX}/sessions/all`,
  },

  BRAND: {
    CREATE: `${BRAND_PREFIX}`,
    GET_ALL: `${BRAND_PREFIX}`,
    GET_ACTIVE: `${BRAND_PREFIX}/active`,
    GET_BY_SLUG: (slug: string) => `${BRAND_PREFIX}/slug/${slug}`,
    GET_BY_ID: (id: string) => `${BRAND_PREFIX}/${id}`,
    GET_FEATURED: `${BRAND_PREFIX}/featured`,
    UPDATE: (id: string) => `${BRAND_PREFIX}/${id}`,
    DELETE: (id: string) => `${BRAND_PREFIX}/${id}`,
  },

  CATEGORY: {
    CREATE: `${CATEGORY_PREFIX}`,
    GET_ALL: `${CATEGORY_PREFIX}`,
    GET_ACTIVE: `${CATEGORY_PREFIX}/active`,
    GET_BY_SLUG: (slug: string) => `${CATEGORY_PREFIX}/slug/${slug}`,
    GET_BY_ID: (id: string) => `${CATEGORY_PREFIX}/${id}`,
    UPDATE: (id: string) => `${CATEGORY_PREFIX}/${id}`,
    DELETE: (id: string) => `${CATEGORY_PREFIX}/${id}`,
  },

  STATS: {
    USER: `${USER_PREFIX}/stats`,
    BANNER: `${BANNER_PREFIX}/stats`,
    NOTIFICATION: `${NOTIFICATION_PREFIX}/stats`,
    ACTIVITY_LOG: `${ACTIVITY_LOG_PREFIX}/stats`,
    MAINTENANCE: `${MAINTENANCE_PREFIX}/stats`,
  },

  DATABASE: {
    INFO: `${DATABASE_PREFIX}/info`,
    BACKUP: `${DATABASE_PREFIX}/backup`,
    RESTORE: `${DATABASE_PREFIX}/restore`,
    DELETE: `${DATABASE_PREFIX}/delete`,
    BACKUPS: `${DATABASE_PREFIX}/backups`,
    BACKUP_DOWNLOAD_JSON: (filename: string) => `${DATABASE_PREFIX}/backups/download-json/${filename}`,
    BACKUP_VIEW: (filename: string) => `${DATABASE_PREFIX}/backups/view/${filename}`,
    BACKUP_DELETE: (filename: string) => `${DATABASE_PREFIX}/backups/${filename}`,
  },

  FEEDBACK: {
    CREATE: `${FEEDBACK_PREFIX}`,
    GET_ALL: `${FEEDBACK_PREFIX}/admin`,
    GET_BY_ID: (id: string) => `${FEEDBACK_PREFIX}/admin/${id}`,
    DELETE: (id: string) => `${FEEDBACK_PREFIX}/admin/${id}`,
  },

  MAINTENANCE: {
    BASE: MAINTENANCE_PREFIX,
    BY_ID: (id: string) => `${MAINTENANCE_PREFIX}/${id}`,
    START: (id: string) => `${MAINTENANCE_PREFIX}/${id}/start`,
    STOP: (id: string) => `${MAINTENANCE_PREFIX}/${id}/stop`,
    CANCEL: (id: string) => `${MAINTENANCE_PREFIX}/${id}/cancel`,
    CURRENT_STATUS: `${MAINTENANCE_PREFIX}/current-status`,
  },

  NOTIFICATIONS: {
    // ===== ADMIN =====
    ADMIN: {
      BASE: `${NOTIFICATION_PREFIX}/admin`,
      BY_ID: (id: string) => `${NOTIFICATION_PREFIX}/admin/${id}`,
    },

    // ===== USER =====
    USER: {
      BASE: NOTIFICATION_PREFIX,
      UNREAD_COUNT: `${NOTIFICATION_PREFIX}/unread-count`,
      MARK_READ: (id: string) => `${NOTIFICATION_PREFIX}/${id}/mark-read`,
    },
  },

  AUTH: {
    LOGIN: `${AUTH_PREFIX}/login`,
    FORGOT_PASSWORD: `${AUTH_PREFIX}/forgot-password`,
    VERIFY_OTP: `${AUTH_PREFIX}/verify-otp`,
    RESET_PASSWORD: `${AUTH_PREFIX}/reset-password`,
    LOGOUT: `${AUTH_PREFIX}/logout`,
  },

  USER: {
    GetAll: `${USER_PREFIX}`,
    Create: `${USER_PREFIX}`,
    GetById: `${USER_PREFIX}/:id`,
    Update: `${USER_PREFIX}/:id`,
    Delete: `${USER_PREFIX}`,
    SoftDelete: `${USER_PREFIX}/soft-delete`,
    Restore: `${USER_PREFIX}/restore`,
    BulkCreate: `${USER_PREFIX}/bulk-create`,
    BulkUpdateStatus: `${USER_PREFIX}/bulk/status`,
    AdminUpdateUserPassword: `${USER_PREFIX}/admin/:id/password`,
  },

  PROFILE: {
    GetProfile: `${USER_PREFIX}/profile`,
    UpdateProfile: `${USER_PREFIX}/profile`,
    ChangePassword: `${USER_PREFIX}/profile/password`,
    UploadAvatar: `${USER_PREFIX}/upload-avatar`,
    AdminChangePassword: `${USER_PREFIX}/admin/change-password`,
    GetSystemSettings: `${SYSTEM_PREFIX}/settings`,
    UpdateSystemSettings: `${SYSTEM_PREFIX}/settings`,
    GetDefaultLanguage: `${SYSTEM_PREFIX}/default-language`,
  },

  PRODUCT: {
    CREATE: `${PRODUCT_PREFIX}`,
    GET_ALL: `${PRODUCT_PREFIX}`,
    GET_ACTIVE: `${PRODUCT_PREFIX}/active`,
  
    FEATURED: `${PRODUCT_PREFIX}/featured`,
    NEW: `${PRODUCT_PREFIX}/new`,
    BEST_SELLERS: `${PRODUCT_PREFIX}/best-sellers`,
    DEALS: `${PRODUCT_PREFIX}/deals`,
  
    BY_ID: (id: string) => `${PRODUCT_PREFIX}/${id}`,
    BY_SLUG: (slug: string) => `${PRODUCT_PREFIX}/slug/${slug}`,
  
    BY_CATEGORY: (categoryId: string) =>
      `${PRODUCT_PREFIX}/category/${categoryId}`,
  
    BY_BRAND: (brandId: string) =>
      `${PRODUCT_PREFIX}/brand/${brandId}`,
  
    RELATED: (productId: string) =>
      `${PRODUCT_PREFIX}/${productId}/related`,
  
    REVIEWS: (productId: string) =>
      `${PRODUCT_PREFIX}/${productId}/reviews`,
  
    REVIEW_REPLY: (productId: string, reviewId: string) =>
      `${PRODUCT_PREFIX}/${productId}/reviews/${reviewId}/reply`,
  
    REVIEW_DELETE: (productId: string, reviewId: string) =>
      `${PRODUCT_PREFIX}/${productId}/reviews/${reviewId}`,
  },

  ADDRESSES: {
      CREATE: `${ADDRESSES_PREFIX}`,
      GET_ALL_USER: `${ADDRESSES_PREFIX}`,
      GET_ALL_ADMIN: `${ADDRESSES_PREFIX}`,
      GET_BY_ID_ADMIN: (id: string) =>  `${ADDRESSES_PREFIX}/admin/user/${id}`,
      UPDATE: (id: string) => `${ADDRESSES_PREFIX}/${id}`,
      DELETE: (id: string) => `${ADDRESSES_PREFIX}/${id}`,
      DELETE_ADMIN: (id: string) => `${ADDRESSES_PREFIX}/admin/${id}`,
    },
};
