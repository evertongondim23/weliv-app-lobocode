import React from 'react';
import { ChevronDown, Building2, Check } from 'lucide-react';
import { useClinic } from '../../contexts/ClinicContext';

export function ClinicUnitSelector() {
  const { clinic, selectedUnitId, setSelectedUnitId } = useClinic();
  const [open, setOpen] = React.useState(false);

  if (!clinic || clinic.units.length === 0) return null;

  const selectedUnit = clinic.units.find((u) => u.id === selectedUnitId);
  const displayLabel = selectedUnit ? selectedUnit.name : 'Todas as unidades';

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 rounded-xl border-2 px-3 py-2 text-sm font-medium transition-colors hover:bg-[#FFF8E7]"
        style={{ borderColor: 'rgba(255, 165, 0, 0.25)', color: '#4A3728' }}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Building2 className="size-4 shrink-0 text-[#FFA500]" />
        <span className="flex-1 truncate text-left">{displayLabel}</span>
        <ChevronDown className={`size-4 shrink-0 text-[#6B5D53] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} aria-hidden />
          <ul
            role="listbox"
            className="absolute left-0 right-0 top-full mt-1 z-20 rounded-xl border-2 bg-white shadow-lg py-1 overflow-hidden"
            style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
          >
            <li
              role="option"
              aria-selected={!selectedUnitId}
              onClick={() => { setSelectedUnitId(null); setOpen(false); }}
              className="flex items-center gap-2.5 px-3 py-2.5 text-sm cursor-pointer hover:bg-[#FFF8E7] transition-colors"
              style={{ color: '#4A3728' }}
            >
              <Check className={`size-4 shrink-0 text-[#FFA500] ${!selectedUnitId ? 'opacity-100' : 'opacity-0'}`} />
              Todas as unidades
            </li>
            <li className="mx-3 my-1 border-t" style={{ borderColor: 'rgba(74, 55, 40, 0.08)' }} />
            {clinic.units.filter((u) => u.isActive).map((unit) => (
              <li
                key={unit.id}
                role="option"
                aria-selected={selectedUnitId === unit.id}
                onClick={() => { setSelectedUnitId(unit.id); setOpen(false); }}
                className="flex items-center gap-2.5 px-3 py-2.5 text-sm cursor-pointer hover:bg-[#FFF8E7] transition-colors"
                style={{ color: '#4A3728' }}
              >
                <Check className={`size-4 shrink-0 text-[#FFA500] ${selectedUnitId === unit.id ? 'opacity-100' : 'opacity-0'}`} />
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium">{unit.name}</p>
                  {unit.address && (
                    <p className="text-xs truncate" style={{ color: '#6B5D53' }}>{unit.address}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
