'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { LuLoader } from 'react-icons/lu';
import { IoLogoGithub, IoLogoGoogle } from 'react-icons/io';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { login } from './actions';
import { FaGoogle } from 'react-icons/fa';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
	const [isLoading, setIsLoading] = React.useState<boolean>(false);

	async function onSubmit(event: React.SyntheticEvent) {
		event.preventDefault();
		setIsLoading(true);

		setTimeout(() => {
			setIsLoading(false);
		}, 3000);
	}

	return (
		<div className={cn('grid gap-6', className)} {...props}>
			<form className="fr w-full" action={() => login(location.origin)}>
				<Button className="w-full" variant="outline" type="submit" disabled={isLoading}>
					{isLoading ? <LuLoader className="mr-2 h-4 w-4 animate-spin" /> : <IoLogoGoogle className="mr-2 h-4 w-4" />} Google
				</Button>
			</form>
		</div>
	);
}
