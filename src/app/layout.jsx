import './globals.css';
import React from 'react';
import { PadariaProvider } from '@/context/PadariaContext';
export const metadata = {
    title: 'Padaria Artesanal — Gestão & Pedidos',
    description: 'Sistema completo de gestão de padaria e pedidos online de clientes.',
};
export default function RootLayout({ children, }) {
    return (<html lang="pt-BR">
      <body>
        <PadariaProvider>
          {children}
        </PadariaProvider>
      </body>
    </html>);
}
