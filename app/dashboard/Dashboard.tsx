'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import React from 'react';
import { IoMdListBox } from 'react-icons/io';
import Dropdown from './dropdown';
import { createClient } from '@/utils/supabase/server';
import { User } from '@/node_modules/@supabase/auth-js/src/lib/types';
import AllItems from './AllItems';
import CameraModal from '@/components/Camera';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const Dashboard = ({ user }: { user: User }) => {
	return (
		<div className="min-h-screen w-full fc">
			<CameraModal />
			<div className="w-full min-h-screen fc gap-10 max-w-7xl px-5 sm:px-10 py-36 justify-start">
				<h1 className="text-4xl font-bold">Inventy</h1>
				<AllItems />
			</div>
		</div>
	);
};

export default Dashboard;
