import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import { Sheet, SheetContent } from '../../../app/components/ui/sheet';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopbar } from './AdminTopbar';

export function AdminAppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="flex min-h-screen">
        <div className="hidden md:block md:w-[290px] lg:w-[320px]">
          <AdminSidebar />
        </div>

        <div className="flex-1 min-w-0">
          <AdminTopbar onOpenMobileMenu={() => setMobileOpen(true)} />
          <main className="p-4 md:p-6 lg:p-8">
            <div key={location.pathname} className="animate-in fade-in-0 slide-in-from-bottom-1 duration-300">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-[88vw] max-w-[320px]">
          <AdminSidebar onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
