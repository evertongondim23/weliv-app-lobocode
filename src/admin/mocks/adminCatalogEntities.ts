export type AdminCatalogStatus = "active" | "inactive";

export type AdminCatalogSpecialty = {
  id: string;
  name: string;
  status: AdminCatalogStatus;
};

export type AdminCatalogService = {
  id: string;
  name: string;
  status: AdminCatalogStatus;
  specialtyId: string | null;
};

export const adminCatalogSpecialties: AdminCatalogSpecialty[] = [
  { id: "sp-derm", name: "Dermatologia", status: "active" },
  { id: "sp-card", name: "Cardiologia", status: "active" },
  { id: "sp-psiq", name: "Psiquiatria", status: "active" },
  { id: "sp-neuro", name: "Neurologia", status: "inactive" },
];

export const adminCatalogServicesSeed: AdminCatalogService[] = [
  {
    id: "svc-001",
    name: "Consulta em Dermatologia",
    status: "active",
    specialtyId: "sp-derm",
  },
  {
    id: "svc-002",
    name: "Consulta em Cardiologia",
    status: "active",
    specialtyId: "sp-card",
  },
  {
    id: "svc-003",
    name: "Retorno (Psiquiatria)",
    status: "inactive",
    specialtyId: "sp-psiq",
  },
  {
    id: "svc-004",
    name: "Avaliação Neurológica",
    status: "active",
    specialtyId: null,
  },
];

