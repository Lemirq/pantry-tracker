'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraType } from 'react-camera-pro';
import { Button } from './ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { IoCamera, IoFlashlight } from 'react-icons/io5';
import { useMainStore } from '@/main-store-provider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY!);

const CameraModal = () => {
	const { showCamera, setShowCamera, setItemName, setQuantity, setDrawerOpen, setAiUpdatedQuantity } = useMainStore((state) => state);

	async function describeImage(base64: string) {
		const supabase = createClient();

		if (!base64) {
			console.log('No image found');
			return 'No image found';
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		const { data, error } = await supabase.from('pantry_items').select('*').eq('user_id', user!.id);

		if (error) {
			console.error(error);
			toast.error('Failed to create item');
			return;
		}

		const imageData = base64.split(',')[1];

		const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
		let prompt =
			'In JSON format, Give the name and quantity of the food item in this image, only the name of the food item and quantity, nothing else. Always be plural with the item name and use title case when one word only. If the item is not food, if quantity is unidentifiable, return null for that key. return "not food" for that key. ex. { "item": "apple", "quantity": 1 }';
		if (data) {
			prompt += `If the item is one of the following, return the item name: ${data.map((i: any) => i.item).join(', ')}`;
		}

		const image = {
			inlineData: {
				data: imageData,
				mimeType: 'image/png',
			},
		};

		const promise = () =>
			new Promise(async (resolve, reject) => {
				const result = await model.generateContent([prompt, image]);
				let text = result.response.text();

				const food = JSON.parse(text);
				console.log(text);

				// // remove trailing whitespace from text
				// text = text.trim();
				// // remove any special characters from text
				// text = text.replace(/[^a-zA-Z ]/g, '');

				if (food.item.includes('not food')) {
					reject('Not a food item');
					setShowCamera(false);
					return;
				} else {
					// if any object in data matches the text, return the item name
					const item = data?.find((i: any) => i.item === food.item);
					resolve(food);
					setShowCamera(false);
					setItemName(item?.item || food.item);
					const quantity =
						item?.quantity !== undefined && food.quantity
							? item?.quantity + food.quantity
							: !item?.quantity
							? food.quantity
							: item?.quantity;
					setQuantity(quantity || 1);
					setAiUpdatedQuantity(true);
					setDrawerOpen(true);
				}
			});

		toast.promise(promise, {
			loading: 'AI is doing its magic...',
			success: (data) => {
				return data.quantity ? `Identified ${data.quantity} ${data.item}` : `Identified ${data.item}`;
			},
			error: (data) => {
				return `${data}`;
			},
		});

		// toast.custom(
		// 	(t) => (
		// 		<div className="p-4 w-[356px] rounded-2xl bg-white border border-gray-400 relative overflow-hidden">
		// 			<div className="z-50 relative">
		// 				<p className="text-xl font-bold">Item Found!</p>
		// 				<p className="text-sm text-gray-800">Identified as: {item?.item || text}</p>
		// 				<button
		// 					className="absolute cursor-pointer top-2 right-2 h-6 w-6 flex justify-center items-center left-headless-close-start right-headless-close-end text-gray-10 p-0 bg-transparent border-none transition-colors duration-200"
		// 					onClick={() => toast.dismiss(t)}
		// 				>
		// 					<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
		// 						<path d="M2.96967 2.96967C3.26256 2.67678 3.73744 2.67678 4.03033 2.96967L8 6.939L11.9697 2.96967C12.2626 2.67678 12.7374 2.67678 13.0303 2.96967C13.3232 3.26256 13.3232 3.73744 13.0303 4.03033L9.061 8L13.0303 11.9697C13.2966 12.2359 13.3208 12.6526 13.1029 12.9462L13.0303 13.0303C12.7374 13.3232 12.2626 13.3232 11.9697 13.0303L8 9.061L4.03033 13.0303C3.73744 13.3232 3.26256 13.3232 2.96967 13.0303C2.67678 12.7374 2.67678 12.2626 2.96967 11.9697L6.939 8L2.96967 4.03033C2.7034 3.76406 2.6792 3.3474 2.89705 3.05379L2.96967 2.96967Z"></path>
		// 					</svg>
		// 				</button>
		// 			</div>
		// 			<div className="absolute inset-0 bg-ai-gradient opacity-60"></div>
		// 		</div>
		// 	),
		// 	{
		// 		position: 'top-center',
		// 	}
		// );

		// update
	}
	const camera = useRef<CameraType>(null);
	const [numberOfCameras, setNumberOfCameras] = useState(0);
	const [image, setImage] = useState<string | null>(null);
	const [showImage, setShowImage] = useState<boolean>(false);
	const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
	const [activeDeviceId, setActiveDeviceId] = useState<string | null>(null);
	const [open, setOpen] = React.useState(false);
	const [torchToggled, setTorchToggled] = useState<boolean>(false);

	useEffect(() => {
		(async () => {
			// ask for camera permissions on ios
			const devices = await navigator.mediaDevices.enumerateDevices();
			if (!devices) return;
			const videoDevices = devices.filter((i) => i.kind == 'videoinput');
			setDevices(videoDevices.map((i) => ({ deviceId: i.deviceId, label: i.label })));
			// set first camera as active
			if (videoDevices.length > 0 && !activeDeviceId) {
				setActiveDeviceId(videoDevices[0].deviceId);
			}
		})();
	});
	if (!showCamera) return null;

	return (
		<AnimatePresence mode="wait">
			{showCamera && (
				<motion.div
					initial={{ opacity: 0, y: 100 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 100 }}
					className="w-full h-screen overflow-hidden fc z-50"
				>
					<div
						onClick={(e) => {
							setShowCamera(false);
						}}
						className="absolute inset-0 bg-black bg-opacity-70"
					/>
					<AnimatePresence mode="wait">
						<motion.div
							key={'camera'}
							initial={{ opacity: 0, scale: 0, y: 100 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0, y: 100 }}
							// flip the camera horizontally
							className="w-full overflow-hidden h-screen z-40 fixed -scale-x-100"
						>
							{!image && (
								<>
									<Camera
										videoSourceDeviceId={activeDeviceId || (devices.length > 0 ? devices[0].deviceId : undefined)}
										ref={camera}
										errorMessages={{
											noCameraAccessible: 'No camera device accessible',
											permissionDenied: 'Permission denied',
											switchCamera: 'Switch camera is not supported',
											canvas: 'Canvas is not supported',
										}}
									/>
									<div className="fixed bottom-0 py-4 gap-5 mx-auto w-screen fr z-40">
										<div className="max-w-xl fr gap-3">
											{activeDeviceId && (
												<Select onValueChange={setActiveDeviceId} defaultValue={activeDeviceId}>
													<SelectTrigger>
														<SelectValue placeholder="Select Camera" />
													</SelectTrigger>
													<SelectContent>
														{devices.map((device) => (
															<SelectItem key={device.deviceId} value={device.deviceId}>
																{device.label}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											)}
											<button
												className="p-5 outline-offset-2 outline-4 outline outline-white rounded-full bg-white z-10"
												onClick={() => {
													if (camera.current) {
														const photo = camera.current.takePhoto();
														console.log(photo);
														setImage(photo as string);
													}
												}}
											>
												{<IoCamera />}
											</button>
											<Button onClick={() => setShowCamera(false)}>Close</Button>
											{camera.current?.torchSupported && (
												<Button
													onClick={() => {
														if (camera.current) {
															setTorchToggled(camera.current.toggleTorch());
														}
													}}
												>
													<IoFlashlight className={cn({ 'text-yellow-500': torchToggled })} />
												</Button>
											)}
										</div>
									</div>
								</>
							)}
							{image && (
								<>
									<img className="w-full object-cover" src={image} alt="Captured Image" />
									<div className="fr w-full gap-3 absolute bottom-5">
										<Button type="submit" onClick={() => describeImage(image)}>
											Use Image
										</Button>
										<Button onClick={() => setImage(null)}>Take Another</Button>
									</div>
								</>
							)}
						</motion.div>
					</AnimatePresence>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default CameraModal;
