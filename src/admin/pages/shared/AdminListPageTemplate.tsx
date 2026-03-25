import React, { useMemo, useState } from "react";
import { FileSearch, RotateCcw, X } from "lucide-react";
import { Button } from "../../../app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../app/components/ui/card";
import { PageHeader } from "../../components/common/PageHeader";
import { FilterBar } from "../../components/filters/FilterBar";
import {
  DataTable,
  type DataTableColumn,
} from "../../components/tables/DataTable";

type ListPageOption = { label: string; value: string };

type AdminListPageTemplateProps<T extends { id: string; status?: string }> = {
  title: string;
  description: string;
  rows: T[];
  columns: DataTableColumn<T>[];
  searchIn: (row: T) => string;
  filterOptions: ListPageOption[];
  filterLabel: string;
  drawerTitle: (row: T) => string;
  drawerDescription?: (row: T) => string;
  renderDetails: (row: T) => React.ReactNode;
};

export function AdminListPageTemplate<
  T extends { id: string; status?: string },
>({
  title,
  description,
  rows,
  columns,
  searchIn,
  filterOptions,
  filterLabel,
  drawerTitle,
  drawerDescription,
  renderDetails,
}: AdminListPageTemplateProps<T>) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<T | null>(null);

  const filtered = useMemo(() => {
    const text = search.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesSearch =
        text.length === 0 || searchIn(row).toLowerCase().includes(text);
      const matchesStatus =
        statusFilter === "all" || row.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [rows, search, searchIn, statusFilter]);

  const hasActiveFilters = search.trim().length > 0 || statusFilter !== "all";
  const statusFilterLabel = filterOptions.find(
    (opt) => opt.value === statusFilter,
  )?.label;

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
  };

  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} />

      <Card
        className="border-2"
        style={{ borderColor: "rgba(255, 165, 0, 0.2)" }}
      >
        <CardContent className="pt-6 space-y-4">
          <FilterBar
            searchPlaceholder="Buscar por nome, ID ou referência..."
            searchValue={search}
            onSearchChange={setSearch}
            filterValue={statusFilter}
            onFilterChange={setStatusFilter}
            filterLabel={filterLabel}
            options={filterOptions}
          />

          <div className="flex items-center justify-between">
            <CardDescription>
              {filtered.length} registro(s) encontrado(s)
            </CardDescription>
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

          {hasActiveFilters ? (
            <div className="flex flex-wrap items-center gap-2">
              {search.trim().length > 0 ? (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs"
                  style={{
                    borderColor: "rgba(255, 165, 0, 0.25)",
                    color: "#4A3728",
                    background: "#FFF8E7",
                  }}
                >
                  Busca: {search.trim()}
                  <span style={{ color: "#6B5D53" }}>x</span>
                </button>
              ) : null}
              {statusFilter !== "all" ? (
                <button
                  type="button"
                  onClick={() => setStatusFilter("all")}
                  className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs"
                  style={{
                    borderColor: "rgba(255, 165, 0, 0.25)",
                    color: "#4A3728",
                    background: "#FFF8E7",
                  }}
                >
                  {filterLabel}: {statusFilterLabel}
                  <span style={{ color: "#6B5D53" }}>x</span>
                </button>
              ) : null}
            </div>
          ) : null}

          {filtered.length > 0 ? (
            <div
              className={`grid gap-4 ${selected ? "xl:grid-cols-[1fr_340px]" : "grid-cols-1"}`}
            >
              <DataTable
                rows={filtered}
                columns={columns}
                rowKey={(row) => row.id}
                onRowClick={setSelected}
                selectedRowKey={selected?.id ?? null}
              />

              {selected ? (
                <Card
                  className="border-2 h-fit xl:sticky xl:top-24"
                  style={{ borderColor: "rgba(255, 165, 0, 0.2)" }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <CardTitle
                          className="text-base"
                          style={{ color: "#4A3728" }}
                        >
                          {drawerTitle(selected)}
                        </CardTitle>
                        {drawerDescription ? (
                          <CardDescription>
                            {drawerDescription(selected)}
                          </CardDescription>
                        ) : null}
                      </div>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="size-8"
                        onClick={() => setSelected(null)}
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {renderDetails(selected)}
                  </CardContent>
                </Card>
              ) : null}
            </div>
          ) : (
            <div
              className="rounded-xl border p-8 text-center"
              style={{
                borderColor: "rgba(255, 165, 0, 0.2)",
                background: "#FAFAFA",
              }}
            >
              <div
                className="inline-flex size-12 items-center justify-center rounded-full bg-white border mb-3"
                style={{ borderColor: "rgba(255, 165, 0, 0.2)" }}
              >
                <FileSearch className="size-5 text-[#FFA500]" />
              </div>
              <p className="text-sm font-medium" style={{ color: "#4A3728" }}>
                Nenhum registro encontrado
              </p>
              <p className="text-xs mt-1" style={{ color: "#6B5D53" }}>
                Ajuste os filtros ou busque por outro termo para encontrar
                registros.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
