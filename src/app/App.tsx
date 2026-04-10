import React from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider } from './components/auth';
import { DataProvider } from './contexts/DataContext';
import { Toaster } from './components/ui/sonner';
export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" />
      </DataProvider>
    </AuthProvider>
  );
}
