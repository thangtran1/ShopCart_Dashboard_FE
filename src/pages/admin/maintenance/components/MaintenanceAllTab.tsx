import { useState } from "react";
import { Maintenance } from "@/api/services/maintenanceApi";

import { useMaintence } from "../hooks/useMaintence";
import MaintenanceActionBar from "./MaintenanceActionBar";
import MaintenanceTable from "./MaintenanceTable";
import CommonMaintenanceFilters from "./CommonMaintenanceFilters";
import MaintenanceModal from "./MaintenanceModal";
import { Separator } from "@/ui/separator";

export default function MaintenanceAllTab() {
  const {
    maintenances,
    loading,
    selectedMaintenances,
    filters,
    pagination,
    handleDelete,
    handleStartNow,
    handleStop,
    handleCancel,
    handleDeleteMany,
    handleFilterChange,
    handlePageChange,
    handleUpdateUser,
    handleSelectMaintenance,
    handleSelectAll,
    handleClearFilters,
  } = useMaintence(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] =
    useState<Maintenance | null>(null);

  // ========== MODAL HANDLERS ==========

  const handleDetail = (maintenance: Maintenance) => {
    setSelectedMaintenance(maintenance);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMaintenance(null);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <CommonMaintenanceFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        isScheduledTab={false}
      />

      <Separator />
      {/* Action Bar */}
      <MaintenanceActionBar
        selectedMaintenances={selectedMaintenances}
        tabType="all"
        onDeleteMany={() => handleDeleteMany(selectedMaintenances)}
      />

      {/* Maintenance Table */}
      <MaintenanceTable
        maintenances={maintenances}
        loading={loading}
        selectedMaintenances={selectedMaintenances}
        pagination={pagination}
        onSelectMaintenance={handleSelectMaintenance}
        onSelectAll={handleSelectAll}
        onDetail={handleDetail}
        onDelete={handleDelete}
        onStartNow={handleStartNow}
        onStop={handleStop}
        onCancel={handleCancel}
        onPageChange={handlePageChange}
        onUpdate={handleUpdateUser}
      />

      <MaintenanceModal
        isOpen={isModalOpen}
        maintenance={selectedMaintenance}
        onClose={handleCloseModal}
      // onUpdate={handleUpdate}
      />
    </div>
  );
}
