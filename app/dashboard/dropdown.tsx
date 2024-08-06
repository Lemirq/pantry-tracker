import { Button } from '@/components/ui/button';
import { DropdownMenuShortcut } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuGroup,
	DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import React from 'react';
import { User } from '@/node_modules/@supabase/auth-js/src/lib/types';
import { logout } from '../login/actions';
import { MdLogout } from 'react-icons/md';

const Dropdown = ({ user }: { user: User }) => {
	// console.log(user);
	return (
		<form action={logout}>
			<Button variant={'destructive'} className="rotate-180">
				<MdLogout />
			</Button>
		</form>
	);
};

export default Dropdown;
