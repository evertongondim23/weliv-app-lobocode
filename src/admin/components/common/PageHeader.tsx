import React from 'react';
import { Button } from '../../../app/components/ui/button';

type PageHeaderProps = {
  title: string;
  description?: string;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
};

export function PageHeader({ title, description, primaryActionLabel, onPrimaryAction }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight" style={{ color: '#4A3728' }}>
          {title}
        </h1>
        {description ? (
          <p className="text-sm md:text-base" style={{ color: '#6B5D53' }}>
            {description}
          </p>
        ) : null}
      </div>

      {primaryActionLabel ? (
        <Button
          type="button"
          onClick={onPrimaryAction}
          className="text-white"
          style={{ background: 'linear-gradient(135deg, #FFA500, #FF8C00)' }}
        >
          {primaryActionLabel}
        </Button>
      ) : null}
    </div>
  );
}
