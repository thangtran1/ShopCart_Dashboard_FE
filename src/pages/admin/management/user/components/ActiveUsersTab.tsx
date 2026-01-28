import { useUserManagement } from "../hooks/useUserManagement";
import CommonUserFilters from "./CommonUserFilters";
import UserActionBar from "./UserActionBar";
import UserTable from "./userTable";
import { useNavigate } from "react-router";

export default function ActiveUsersTab() {
  const {
    users,
    loading,
    selectedUsers,
    filters,
    pagination,
    handleSoftDelete,
    handleDeleteMany,
    handleFilterChange,
    handlePageChange,
    handleSelectUser,
    handleSelectAll,
    handleClearFilters,
  } = useUserManagement(false); // false = active users

  const navigate = useNavigate();
  const handleView = async (userId: string) => {
    navigate(`/admin/management/user/${userId}`);
  };

  return (
    <div className="space-y-6">
      <CommonUserFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      <UserActionBar
        selectedUsers={selectedUsers}
        tabType="active"
        onDeleteMany={() => handleDeleteMany(selectedUsers as string[])}
      />

      <UserTable
        users={users}
        loading={loading}
        selectedUsers={selectedUsers}
        pagination={pagination}
        onSelectUser={handleSelectUser}
        onSelectAll={handleSelectAll}
        onDelete={handleSoftDelete}
        onPageChange={handlePageChange}
        onView={handleView}
      />
    </div>
  );
}
