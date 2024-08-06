import React from 'react';
import { IoMdListBox } from 'react-icons/io';
import { Button } from './ui/button';
import Dropdown from '@/app/dashboard/dropdown';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

const Navbar = async () => {
	const supabase = createClient();
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	return (
		<nav className="fixed top-0 px-5 sm:px-10 fr py-4 bg-neutral-100 border-b w-screen border-neutral-700/20 justify-between z-30">
			<div className="relative z-20 flex items-center text-lg font-medium">
				<IoMdListBox />
				Inventy
			</div>

			<div className="fr gap-2">
				<Link href="/suggest">
					<Button>Suggest Recipe</Button>
				</Link>
				<Link href="/dashboard">
					<Button>Pantry</Button>
				</Link>
				{user && <Dropdown user={user} />}
			</div>
		</nav>
	);
};

export default Navbar;
