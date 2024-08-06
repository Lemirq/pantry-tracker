'use client';

import * as React from 'react';
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';
import { ChevronDown, MoreHorizontal } from 'lucide-react';
import styles from '@/components/toasts.module.css';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Database, Tables } from '@/database.types';
import NewItem from './NewItem';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { IoIosCamera, IoMdTrash } from 'react-icons/io';
import CameraModal from '@/components/Camera';
import { useMainStore } from '@/main-store-provider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { IoPencil } from 'react-icons/io5';

export default function AllItems() {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});
	const [data, setData] = React.useState<Tables<'pantry_items'> | null>(null);
	const { setShowCamera } = useMainStore((state) => state);

	const supabase = createClient();

	const fetchItems = async () => {
		const { data, error } = await supabase.from('pantry_items').select('*').order('created_at', { ascending: false });
		console.log(data);
		if (error) {
			console.error(error);
			toast.error('Failed to fetch items');
			return;
		}
		setData(data);
	};
	const deleteItem = async (id: string) => {
		const { error } = await supabase.from('pantry_items').delete().eq('id', id);
		if (error) {
			console.error(error);
			toast.error('Failed to delete item');
			return;
		}
		toast.success('Item deleted');
		fetchItems();
	};
	const columns: ColumnDef<Tables<'pantry_items'>>[] = [
		{
			accessorKey: 'id',
			header: () => <p>ID</p>,
			cell: ({ row }) => {
				return <p>{row.getValue('id')}</p>;
			},
		},
		{
			accessorKey: 'item',
			header: () => <div>Quantity</div>,
			cell: ({ row }) => {
				return <div className="font-medium">{row.getValue('item')}</div>;
			},
		},
		{
			accessorKey: 'quantity',
			header: ({ column }) => {
				return <p>Amount</p>;
			},
			cell: ({ row }) => <div className="lowercase">{row.getValue('quantity')}</div>,
		},
		{
			id: 'actions',
			header: () => <p>Actions</p>,
			cell: ({ row }) => {
				const update = async (e: React.FormEvent<HTMLFormElement>) => {
					e.preventDefault();
					const quantity = e.currentTarget.querySelector('[type="number"]')?.value;
					const item = e.currentTarget.querySelector('[type="text"]')?.value;
					if (!quantity) return;
					const { error } = await supabase
						.from('pantry_items')
						.update({ quantity: parseInt(quantity), item })
						.eq('id', row.getValue('id'));
					if (error) {
						console.error(error);
						toast.error('Failed to update item');
						return;
					}
					toast.success('Item updated');
					fetchItems();
				};
				return (
					<div className="fr gap-2 justify-start">
						<Button onClick={() => deleteItem(row.getValue('id'))} variant="destructive">
							<IoMdTrash />
						</Button>
						<Popover>
							<PopoverTrigger asChild>
								<Button variant="outline">
									<IoPencil />
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-80">
								<div className="grid gap-4">
									<div className="space-y-2">
										<h4 className="font-medium leading-none"></h4>
										<p className="text-sm text-muted-foreground">Update item</p>
									</div>
									<div className="grid gap-2">
										<div className="fr items-center gap-4">
											<form className="w-full fr gap-2" onSubmit={(e) => update(e)}>
												<Input type="text" id="item" className="w-full h-8" defaultValue={row.getValue('item')} />
												<Input type="number" id="quantity" className="w-full h-8" defaultValue={row.getValue('quantity')} />
												<Button type="submit">Submit</Button>
											</form>
										</div>
									</div>
								</div>
							</PopoverContent>
						</Popover>
					</div>
				);
			},
		},
	];

	React.useEffect(() => {
		fetchItems();
	}, []);

	const table = useReactTable({
		data: data,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility: {
				id: false,
			},
			rowSelection,
		},
	});

	if (data === null) {
		return <div>Loading...</div>;
	}

	return (
		<div className="w-full">
			<div className="fc gap-2 sm:fr py-4 w-full justify-center items-center sm:justify-between">
				<Input
					placeholder="Filter items..."
					value={(table.getColumn('item')?.getFilterValue() as string) ?? ''}
					onChange={(event) => table.getColumn('item')?.setFilterValue(event.target.value)}
					className="max-w-sm"
				/>

				<div className="fr flex-wrap justify-start gap-2">
					<NewItem revalidate={fetchItems} />
					<Button onClick={() => setShowCamera(true)}>
						<IoIosCamera className="mr-3" />
						Use Camera
					</Button>
					{/* <DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" className="ml-auto">
								Columns <ChevronDown className="ml-2 h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{table
								.getAllColumns()
								.filter((column) => column.getCanHide())
								.map((column) => {
									return (
										<DropdownMenuCheckboxItem
											key={column.id}
											className="capitalize"
											checked={column.getIsVisible()}
											onCheckedChange={(value) => column.toggleVisibility(!!value)}
										>
											{column.id}
										</DropdownMenuCheckboxItem>
									);
								})}
						</DropdownMenuContent>
					</DropdownMenu> */}
				</div>
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4">
				<div className="space-x-2">
					<Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
						Previous
					</Button>
					<Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
						Next
					</Button>
				</div>
			</div>
		</div>
	);
}
