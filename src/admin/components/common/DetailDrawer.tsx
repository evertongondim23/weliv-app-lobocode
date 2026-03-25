import React from 'react';
import { Button } from '../../../app/components/ui/button';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '../../../app/components/ui/drawer';

type DetailDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function DetailDrawer({ open, onOpenChange, title, description, children }: DetailDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="data-[vaul-drawer-direction=right]:w-[92vw] data-[vaul-drawer-direction=right]:max-w-[480px]">
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          {description ? <DrawerDescription>{description}</DrawerDescription> : null}
        </DrawerHeader>
        <div className="px-4 pb-6 space-y-3 overflow-y-auto">{children}</div>
        <div className="px-4 pb-4">
          <DrawerClose asChild>
            <Button type="button" variant="outline" className="w-full">
              Fechar
            </Button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
