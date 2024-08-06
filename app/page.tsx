'use client';
import React from 'react';
import { BackgroundBeams } from './login/beams';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { LampContainer } from '@/components/ui/lamp';
import { motion } from 'framer-motion';
export default function Home() {
	return (
		// <div className="h-screen w-full rounded-md bg-neutral-200 relative flex flex-col items-center justify-center antialiased">
		// 	<div className="max-w-7xl mx-auto p-4 z-10">
		// 		<h1 className="relative z-10 text-lg md:text-7xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-600 to-neutral-800  text-center font-sans font-bold">
		// 			Welcome to the next generation of Inventory Management
		// 		</h1>
		// 		<p></p>
		// 		<p className="text-neutral-800 max-w-xl mx-auto my-2 text-sm text-center relative z-10">
		// 			Inventy is a web application that allows you to manage your inventory in a simple and efficient way.
		// 		</p>
		// 		<div className="fr w-full">
		// 			<Button>
		// 				<Link href="/login">Login</Link>
		// 			</Button>
		// 		</div>
		// 	</div>
		// 	<BackgroundBeams />
		// </div>
		<div className="h-screen w-full rounded-md bg-neutral-100 relative flex flex-col px-5 sm:px-10 items-center justify-center antialiased">
			<motion.div
				initial={{ opacity: 0.5, y: 100 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{
					delay: 0.3,
					duration: 0.8,
					ease: 'easeInOut',
				}}
			>
				<h1 className="mt-8 bg-gradient-to-br from-slate-600 to-slate-800 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl">
					Inventy: The next generation <br /> of Inventory Management
				</h1>
				<p className="text-neutral-700 max-w-xl mx-auto my-2 text-sm text-center relative z-10">
					Inventy is a web application that allows you to manage your inventory in a simple and efficient way.
				</p>
				<div className="fr w-full gap-4 mt-10">
					<Button>
						<Link href="/login">Login</Link>
					</Button>
					<Button>
						<Link href="/dashboard">Dashboard</Link>
					</Button>
				</div>
			</motion.div>
		</div>
	);
}
