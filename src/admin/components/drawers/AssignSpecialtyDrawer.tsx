import React, { useEffect, useMemo, useState } from "react";

import { Button } from "../../../app/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../../../app/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../app/components/ui/select";

export type AssignSpecialtyOption = {
  id: string;
  label: string;
  disabled?: boolean;
};

type AssignSpecialtyDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCount: number;
  specialtyOptions: AssignSpecialtyOption[];
  onConfirm: (specialtyId: string) => void;
  title?: string;
};

export function AssignSpecialtyDrawer({
  open,
  onOpenChange,
  selectedCount,
  specialtyOptions,
  onConfirm,
  title = "Vincular a especialidade",
}: AssignSpecialtyDrawerProps) {
  const [specialtyId, setSpecialtyId] = useState<string>("");

  useEffect(() => {
    if (!open) setSpecialtyId("");
  }, [open]);

  const enabledOptions = useMemo(
    () => specialtyOptions.filter((o) => !o.disabled),
    [specialtyOptions],
  );

  const canConfirm =
    selectedCount > 0 &&
    specialtyId.trim().length > 0 &&
    enabledOptions.some((o) => o.id === specialtyId);

  const description =
    selectedCount > 0
      ? `Aplicar a alteração para ${selectedCount} serviço(s) selecionado(s).`
      : "Selecione ao menos 1 serviço para usar esta ação em massa.";

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="data-[vaul-drawer-direction=right]:w-[92vw] data-[vaul-drawer-direction=right]:max-w-[480px]">
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>

        <div className="px-4 pb-2 space-y-3 overflow-y-auto">
          <div className="space-y-2">
            <div className="text-sm font-medium" style={{ color: "#4A3728" }}>
              Especialidade
            </div>
            <Select value={specialtyId} onValueChange={setSpecialtyId}>
              <SelectTrigger
                className="border-2 bg-white"
                style={{ borderColor: "rgba(255, 165, 0, 0.2)" }}
              >
                <SelectValue placeholder="Selecione uma especialidade..." />
              </SelectTrigger>
              <SelectContent>
                {specialtyOptions.map((opt) => (
                  <SelectItem
                    key={opt.id}
                    value={opt.id}
                    disabled={opt.disabled}
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DrawerFooter>
          <Button
            type="button"
            onClick={() => onConfirm(specialtyId)}
            disabled={!canConfirm}
            style={{ background: "linear-gradient(135deg, #FFA500, #FF8C00)" }}
          >
            Confirmar vínculo
          </Button>

          <DrawerClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

