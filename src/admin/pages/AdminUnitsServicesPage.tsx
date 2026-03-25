import React, { useMemo, useState } from "react";

import { RotateCcw } from "lucide-react";

import { StyledTabs } from "../../app/components/common/StyledTabs";
import { Button } from "../../app/components/ui/button";
import { Card, CardContent, CardDescription } from "../../app/components/ui/card";
import { Checkbox } from "../../app/components/ui/checkbox";
import { PageHeader } from "../components/common/PageHeader";
import { FilterBar } from "../components/filters/FilterBar";
import { BulkActionBar } from "../components/bulk/BulkActionBar";
import {
  AssignSpecialtyDrawer,
  type AssignSpecialtyOption,
} from "../components/drawers/AssignSpecialtyDrawer";
import { DataTable, type DataTableColumn } from "../components/tables/DataTable";
import {
  adminCatalogServicesSeed,
  adminCatalogSpecialties,
  type AdminCatalogService,
} from "../mocks/adminCatalogEntities";

type StatusFilter = "all" | "active" | "inactive";

function statusLabel(status: AdminCatalogService["status"]) {
  return status === "active" ? "Ativo" : "Inativo";
}

export function AdminUnitsServicesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [services, setServices] = useState<AdminCatalogService[]>(
    adminCatalogServicesSeed,
  );

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [drawerOpen, setDrawerOpen] = useState(false);

  const specialtyById = useMemo(() => {
    return adminCatalogSpecialties.reduce<Record<string, string>>((acc, s) => {
      acc[s.id] = s.name;
      return acc;
    }, {});
  }, []);

  const specialtyOptions: AssignSpecialtyOption[] = useMemo(() => {
    return adminCatalogSpecialties.map((s) => ({
      id: s.id,
      label: s.name,
      disabled: s.status !== "active",
    }));
  }, []);

  const filteredServices = useMemo(() => {
    const text = search.trim().toLowerCase();
    return services.filter((svc) => {
      const matchesSearch =
        text.length === 0 ||
        `${svc.id} ${svc.name}`.toLowerCase().includes(text);
      const matchesStatus =
        statusFilter === "all" || svc.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, services, statusFilter]);

  const selectedCount = selectedIds.size;
  const hasActiveFilters =
    search.trim().length > 0 || statusFilter !== "all";

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
  };

  const toggleRow = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const allFilteredSelected =
    filteredServices.length > 0 &&
    filteredServices.every((svc) => selectedIds.has(svc.id));

  const toggleSelectPage = (checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) filteredServices.forEach((svc) => next.add(svc.id));
      else filteredServices.forEach((svc) => next.delete(svc.id));
      return next;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  const onConfirmAssign = (specialtyId: string) => {
    setServices((prev) =>
      prev.map((svc) =>
        selectedIds.has(svc.id) ? { ...svc, specialtyId } : svc,
      ),
    );
    setDrawerOpen(false);
    clearSelection();
  };

  const serviceColumns: DataTableColumn<AdminCatalogService>[] = useMemo(() => {
    return [
      {
        key: "select",
        header: "",
        className: "w-[44px]",
        render: (row) => (
          <div
            className="flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Checkbox
              checked={selectedIds.has(row.id)}
              onCheckedChange={(v) => toggleRow(row.id, Boolean(v))}
            />
          </div>
        ),
      },
      {
        key: "name",
        header: "Serviço",
        className: "min-w-[360px]",
        render: (row) => (
          <div className="space-y-0.5">
            <div className="text-sm font-medium" style={{ color: "#4A3728" }}>
              {row.name}
            </div>
            <div className="text-xs" style={{ color: "#6B5D53" }}>
              {row.id}
            </div>
          </div>
        ),
      },
      {
        key: "specialty",
        header: "Especialidade",
        render: (row) => (
          <span className="text-sm" style={{ color: "#6B5D53" }}>
            {row.specialtyId ? specialtyById[row.specialtyId] : "—"}
          </span>
        ),
      },
      {
        key: "status",
        header: "Status",
        render: (row) => (
          <span className="text-xs font-medium" style={{ color: "#6B5D53" }}>
            {statusLabel(row.status)}
          </span>
        ),
      },
    ];
  }, [selectedIds, specialtyById]);

  const servicesTab = (
    <div className="space-y-6">
      <PageHeader
        title="Unidades e serviços"
        description="Catálogo de unidades, especialidades e serviços ofertados."
      />

      <Card
        className="border-2"
        style={{ borderColor: "rgba(255, 165, 0, 0.2)" }}
      >
        <CardContent className="pt-6 space-y-4">
          <FilterBar
            searchPlaceholder="Buscar por nome ou ID do serviço..."
            searchValue={search}
            onSearchChange={setSearch}
            filterValue={statusFilter}
            onFilterChange={(v) => setStatusFilter(v as StatusFilter)}
            filterLabel="Status"
            options={[
              { label: "Todos", value: "all" },
              { label: "Ativo", value: "active" },
              { label: "Inativo", value: "inactive" },
            ]}
          />

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <CardDescription>
              {filteredServices.length} registro(s) encontrado(s)
            </CardDescription>

            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 bg-white">
                <Checkbox
                  checked={allFilteredSelected}
                  onCheckedChange={(v) => toggleSelectPage(Boolean(v))}
                  disabled={filteredServices.length === 0}
                />
                <span className="text-xs" style={{ color: "#4A3728" }}>
                  Selecionar página
                </span>
              </div>

              {hasActiveFilters ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={clearFilters}
                  className="h-8 px-2 text-[#6B5D53]"
                >
                  <RotateCcw className="size-3.5 mr-1" />
                  Limpar filtros
                </Button>
              ) : null}
            </div>
          </div>

          <div className="space-y-3">
            <DataTable
              rows={filteredServices}
              columns={serviceColumns}
              rowKey={(row) => row.id}
            />

            <BulkActionBar
              selectedCount={selectedCount}
              onClearSelection={clearSelection}
              onPrimaryAction={() => setDrawerOpen(true)}
            />
          </div>
        </CardContent>
      </Card>

      <AssignSpecialtyDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        selectedCount={selectedCount}
        specialtyOptions={specialtyOptions}
        onConfirm={onConfirmAssign}
      />
    </div>
  );

  return (
    <StyledTabs
      defaultValue="services"
      tabs={[
        {
          value: "units",
          label: "Unidades",
          content: (
            <div className="space-y-6">
              <PageHeader
                title="Unidades"
                description="Em construção — esta aba receberá a listagem de unidades."
              />
            </div>
          ),
        },
        {
          value: "specialties",
          label: "Especialidades",
          count: adminCatalogSpecialties.length,
          content: (
            <div className="space-y-6">
              <PageHeader
                title="Especialidades"
                description="Em construção — esta aba receberá a listagem de especialidades."
              />
            </div>
          ),
        },
        {
          value: "services",
          label: "Serviços",
          count: services.length,
          content: servicesTab,
        },
      ]}
    />
  );
}

