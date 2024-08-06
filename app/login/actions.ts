'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';

export async function login(origin) {
	const supabase = createClient();

	// type-casting here for convenience
	// in practice, you should validate your inputs
	const { data: google, error } = await supabase.auth.signInWithOAuth({
		provider: 'google',
		options: {
			redirectTo: `${origin}/auth/callback`,
		},
	});

	console.log(google);

	// redirect to google
	if (google) {
		redirect(google.url);
	}

	if (error) {
		redirect('/error');
	}

	revalidatePath('/', 'layout');
	redirect('/dashboard');
}

export async function logout() {
	const supabase = createClient();

	await supabase.auth.signOut();
	revalidatePath('/', 'layout');
	redirect('/login');
}

// export async function signup(formData: FormData) {
// 	const supabase = createClient();

// 	// type-casting here for convenience
// 	// in practice, you should validate your inputs
// 	const data = {
// 		email: formData.get('email') as string,
// 		password: formData.get('password') as string,
// 	};

// 	const { error } = await supabase.auth.signUp(data);

// 	if (error) {
// 		redirect('/error');
// 	}

// 	revalidatePath('/', 'layout');
// 	redirect('/');
// }
