import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import React from 'react';
import Dashboard from './Dashboard';

const DashboardPage = async () => {
	const supabase = createClient();
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();
	if (!user || error) {
		redirect('/login');
	}

	return <Dashboard user={user} />;
};

export default DashboardPage;
