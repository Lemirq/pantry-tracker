'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export function ComboboxDemo({
	data,
	selected,
	setSelected,
}: {
	data: {
		[key: string]: any;
	};
	selected: string;
	setSelected: (value: string) => void;
}) {
	const [open, setOpen] = React.useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
					{selected}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command>
					<CommandGroup>
						{data.map((item) => (
							<CommandItem
								key={item.value}
								value={item.value}
								onSelect={(currentValue) => {
									setSelected(currentValue === selected ? '' : currentValue);
									setOpen(false);
								}}
							>
								<Check className={cn('mr-2 h-4 w-4', selected === item.value ? 'opacity-100' : 'opacity-0')} />
								{item.label}
							</CommandItem>
						))}
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
