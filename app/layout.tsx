import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from './context/ThemeContext';
import ThemeToggle from './components/ThemeToggle';

export const metadata: Metadata = {
  title: 'Computer Science Jobs',
  description: 'Find the latest computer science jobs',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">
        <ThemeProvider>
          <div className="theme-toggle-container">
            <ThemeToggle />
          </div>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
} 