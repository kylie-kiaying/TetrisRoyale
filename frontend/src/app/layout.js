import { Inter } from 'next/font/google';
import './globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClientInitialiser from './ClientInitialiser';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'TetriTracker',
  description: 'Made by the TetriTracker team',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientInitialiser />
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
