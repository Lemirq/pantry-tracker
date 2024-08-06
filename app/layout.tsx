import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import Providers from './Providers';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Create Next App',
	description: 'Generated by create next app',
};
// disallow scaling
export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
			</head>
			<body className={inter.className}>
				<Navbar />
				<Providers>{children}</Providers>
			</body>
			<Toaster richColors />
		</html>
	);
}
