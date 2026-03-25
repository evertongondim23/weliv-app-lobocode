import React from "react";
import { X, CheckCheck } from "lucide-react";

import { Button } from "../../../app/components/ui/button";

type BulkActionBarProps = {
  selectedCount: number;
  onClearSelection: () => void;
  onPrimaryAction: () => void;
  primaryActionLabel?: string;
  primaryActionDisabled?: boolean;
};

export function BulkActionBar({
  selectedCount,
  onClearSelection,
  onPrimaryAction,
  primaryActionLabel = "Vincular a especialidade",
  primaryActionDisabled = false,
}: BulkActionBarProps) {
  if (selectedCount <= 0) return null;

  return (
    <div className="sticky bottom-0 z-30">
      <div
        className="rounded-xl border-2 px-3 py-3 md:px-4 md:py-3 shadow-sm"
        style={{
          borderColor: "rgba(255, 165, 0, 0.25)",
          background: "#FFF8E7",
        }}
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-medium" style={{ color: "#4A3728" }}>
              {selectedCount} selecionado(s)
            </div>
            <Button
              type="button"
              variant="ghost"
              onClick={onClearSelection}
              className="h-8 px-2 text-[#6B5D53]"
            >
              <X className="size-3.5 mr-1" />
              Limpar
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              onClick={onPrimaryAction}
              disabled={primaryActionDisabled}
              className="w-full md:w-auto"
              style={{ background: "linear-gradient(135deg, #FFA500, #FF8C00)" }}
            >
              <CheckCheck className="size-4" />
              {primaryActionLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

