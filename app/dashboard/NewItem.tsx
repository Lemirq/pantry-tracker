import * as React from 'react';
import { Minus, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer';
import { FaPlus } from 'react-icons/fa';
import { Input } from '@/components/ui/input';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { useMainStore } from '@/main-store-provider';
import { IoSparkles } from 'react-icons/io5';

export default function NewItem({ revalidate }: { revalidate: () => void }) {
	const supabase = createClient();
	const { drawerOpen, setDrawerOpen, itemName, setItemName, quantity, setQuantity, aiUpdatedQuantity, setAiUpdatedQuantity } = useMainStore(
		(state) => state
	);
	const handleSubmit = async () => {
		if (!itemName) return;
		const user = await supabase.auth.getUser()?.then((user) => user?.data.user?.id);
		const { data, error } = await supabase.from('pantry_items').insert({
			item: itemName,
			quantity: quantity,
			user_id: user,
		});
		if (error) {
			if (error.code === '23505') {
				// update instead
				const { data, error } = await supabase.from('pantry_items').update({ quantity: quantity }).eq('user_id', user).eq('item', itemName);
				if (error) {
					console.error(error);
					toast.error('Failed to update item');
					return;
				}
				if (data) toast.success('Item updated');
				revalidate();
				setItemName('');
				setQuantity(1);
				setDrawerOpen(false);
				setAiUpdatedQuantity(false);
				return;
			}
			console.error(error);
			toast.error('Failed to create item');
			return;
		}
		if (data) toast.success('Item created');
		revalidate();
		setDrawerOpen(false);
	};
	return (
		<Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
			<DrawerTrigger asChild>
				<Button>
					<FaPlus className="mr-3" /> Create New
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<div className="mx-auto w-full max-w-sm">
					<DrawerHeader>
						<DrawerTitle>New Item</DrawerTitle>
						<DrawerDescription>Create a new pantry item</DrawerDescription>
					</DrawerHeader>
					<div className="p-4 pb-0 fc gap-2">
						<Input
							placeholder="New item name"
							className="max-w-sm text-lg"
							value={itemName}
							onChange={(e) => setItemName(e.target.value)}
						/>
						{aiUpdatedQuantity && (
							<p className="fr gap-2">
								<IoSparkles className="h-5 w-5" /> AI updated quantity
							</p>
						)}
						<div className="flex items-center justify-center space-x-2">
							<Button
								variant="outline"
								size="icon"
								className="h-8 w-8 shrink-0 rounded-full"
								onClick={() => setQuantity(quantity - 1)}
								disabled={quantity <= 1}
							>
								<Minus className="h-4 w-4" />
								<span className="sr-only">Decrease</span>
							</Button>
							<div className="flex-1 text-center">
								<div className="text-7xl font-bold tracking-tighter">{quantity}</div>
								<div className="text-[0.70rem] uppercase text-muted-foreground">Items</div>
							</div>
							<Button
								variant="outline"
								size="icon"
								className="h-8 w-8 shrink-0 rounded-full"
								onClick={() => setQuantity(quantity + 1)}
								disabled={quantity >= 400}
							>
								<Plus className="h-4 w-4" />
								<span className="sr-only">Increase</span>
							</Button>
						</div>
					</div>
					<DrawerFooter>
						<Button onClick={handleSubmit}>Submit</Button>
						<DrawerClose asChild>
							<Button variant="outline">Cancel</Button>
						</DrawerClose>
					</DrawerFooter>
				</div>
			</DrawerContent>
		</Drawer>
	);
}
