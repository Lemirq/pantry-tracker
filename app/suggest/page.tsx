'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { createClient } from '@/utils/supabase/client';
import { ChatSession, GoogleGenerativeAI } from '@google/generative-ai';
import { redirect } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import Markdown from 'react-markdown';
import { motion } from 'framer-motion';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY!);
const Suggest = () => {
	// const supabase = createClient();
	// const {
	// 	data: { user },
	// 	error,
	// } = await supabase.auth.getUser();
	// if (!user || error) {
	// 	redirect('/login');
	// }

	const [history, setHistory] = useState({
		history: [],
	});

	const [chat, setChat] = useState<ChatSession | null>(null);
	useEffect(() => {
		// setup initial chat
		const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
		const chat = model.startChat(history);
		setChat(chat);
	}, []);

	const sendMessage = async (e: React.FormEvent, message: string, include?: boolean) => {
		setValue('');
		// scroll to the bottom
		document.getElementById('chat')?.scrollTo(0, document.getElementById('chat')?.scrollHeight!);
		e.preventDefault();
		setLoading(true);
		if (include !== false)
			setHistory((prev) => {
				return {
					history: [
						...prev.history,
						{
							role: 'user',
							parts: [{ text: message }],
						},
					],
				};
			});
		if (!chat) {
			setLoading(false);
			return;
		}
		let result = await chat.sendMessage(message);
		console.log(result.response.text());
		setHistory((prev) => {
			return {
				history: [
					...prev.history,
					{
						role: 'model',
						parts: [{ text: result.response.text() }],
					},
				],
			};
		});
		setLoading(false);
	};
	const supabase = createClient();

	const sendInitialMessage = async () => {
		console.log('sending initial message');
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) return;
		const { data, error } = await supabase.from('pantry_items').select('*').eq('user_id', user.id);
		if (!chat) return;
		let result = await chat.sendMessage(`
			You are an AI that can suggest recipes based on data about what a user has in their pantry. Your response should introduce you and end with 'here's what I came up with: ' or something similar. Keep in mind the data is provided programmatically, not by the user.
			`);
		console.log(result.response.text());
		setHistory(() => ({
			history: [
				{
					role: 'model',
					parts: [{ text: result.response.text() }],
				},
			],
		}));
		result =
			await chat.sendMessage(`Suggest 10 food items with a short description that could be made with the data provided and return data in json format. example: {type: 'Food Items', items:[{"name": "food item", "description": "short description"}]}
			here's the users pantry items, don't return markdown, just pure json: ${JSON.stringify(
				data
			)} If there aren't enough or none, just reply with a message saying there aren't enough items.
			`);
		console.log(result.response.text());
		setHistory((prev) => {
			return {
				history: [
					...prev.history,
					{
						role: 'model',
						parts: [{ text: result.response.text() }],
					},
				],
			};
		});
		setLoading(false);
	};

	const getRecipe = async (foodItem: string) => {};

	useEffect(() => {
		console.log(history);
	}, [history]);

	const [value, setValue] = useState('');
	const [loading, setLoading] = useState(false);

	return (
		<div className="w-full h-screen overflow-x-hidden px-5 sm:px-10">
			<div className="h-screen fc overflow-hidden justify-evenly gap-5 w-full max-w-7xl mx-auto pb-5 pt-24">
				{history.history.length === 0 && (
					<div className="fc gap-3">
						<h1 className="text-4xl font-bold text-center">Inventy Recipe Suggester</h1>
						<p className="text-center max-w-[70ch] text-gray-600 text-sm">
							Welcome to the Inventy Recipe Suggester! Ask and Inventy will respond with a recipe suggestion. You can also ask Inventy
							to include pantry items in the recipe suggestions.
						</p>
						<Button onClick={() => sendInitialMessage()}>Generate Recipes</Button>
					</div>
				)}
				<div id="chat" className="w-full overflow-y-scroll h-full bg-white fc justify-start items-start gap-5 sm:px-10 py-10">
					{history.history.map((chat, index) => {
						return (
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3 }}
								key={index + 'int'}
								className="fc gap-5"
							>
								{chat.role === 'user' && (
									<>
										{chat.parts.map((part, index) => {
											return (
												<div key={index} className="bg-gray-100 p-4 w-full rounded-2xl">
													<p>{part.text}</p>{' '}
												</div>
											);
										})}
									</>
								)}
								{chat.role === 'model' && (
									<>
										{chat.parts.map((part, index) => {
											if (part.text.startsWith('{') || part.text.startsWith('`')) {
												let newPart: string = part.text;
												if (newPart.startsWith('```')) {
													// Remove the backticks and the ```json tag
													let cleanedString = newPart.replace(/```json|```/g, '');
													newPart = cleanedString;
												}
												const foodItems: {
													type: string;
													items: { name: string; description: string }[];
												} = JSON.parse(newPart);
												console.log(foodItems);
												return (
													<>
														<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
															{foodItems.items.map((item) => {
																return (
																	<motion.div
																		initial={{ opacity: 0, y: 20 }}
																		animate={{ opacity: 1, y: 0 }}
																		transition={{ duration: 0.3 }}
																		onClick={() => {
																			sendMessage(
																				{ preventDefault: () => {} } as any,
																				item.name +
																					' recipe, reply as if the user asked for this recipe, not in json',
																				false
																			);
																		}}
																		className="bg-gray-100 p-4 w-full rounded-2xl hover:shadow-md cursor-pointer border transition-all border-gray-400/50"
																	>
																		<h1 className="text-xl font-bold">{item.name}</h1>
																		<p>{item.description}</p>
																	</motion.div>
																);
															})}
														</div>
													</>
												);
											}
											return (
												<div key={index} className="bg-neutral-800 text-white w-full p-4 rounded-2xl">
													<Markdown>{part.text}</Markdown>{' '}
												</div>
											);
										})}
									</>
								)}
							</motion.div>
						);
					})}
					<p className="text-gray-600 text-xl">{loading && 'Inventy is thinking...'}</p>
				</div>
				{history.history.length > 1 && (
					<form onSubmit={(e) => sendMessage(e, value)} className="fr w-full gap-3">
						<Input
							placeholder="Ask a question..."
							type="text"
							className="w-full"
							value={value}
							onChange={(e) => setValue(e.target.value)}
						/>
						<Button type="submit">Send</Button>
					</form>
				)}
			</div>
		</div>
	);
};

export default Suggest;
