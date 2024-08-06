import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
	const { searchParams, origin } = new URL(request.url);

	const code = searchParams.get('code');
	console.log(code);
	if (code) {
		const supabase = createClient();

		const { error } = await supabase.auth.exchangeCodeForSession(code);

		if (!error) {
			return NextResponse.redirect(`${origin}/dashboard`);
		}
	}

	// TODO: Create this page
	// return the user to an error page with instructions
	return NextResponse.redirect(`${origin}/auth/auth-error`);
}
