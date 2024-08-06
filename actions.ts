'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from './utils/supabase/server';

export async function describeImage(formData: FormData) {
	const supabase = createClient();
	const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

	let text = '';

	if (!formData.get('image')) {
		console.log('No image found');
		return 'No image found';
	}

	const {
		data: { user },
	} = await supabase.auth.getUser();
	const { data, error } = await supabase.from('pantry_items').select('*').eq('user_id', user!.id);

	const base64 = formData.get('image');
	const imageData = base64.split(',')[1];

	const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
	let prompt;
	if (data) {
		prompt = `Give the name of the food item in this image, only the name of the food item, nothing else. If the item is one of the following, return the item name: ${data
			.map((i: any) => i.item)
			.join(', ')}`;
	} else {
		prompt = `Give the name of the food item in this image, only the name of the food item, nothing else.`;
	}

	const image = {
		inlineData: {
			data: imageData,
			mimeType: 'image/png',
		},
	};

	const result = await model.generateContent([prompt, image]);
	text = result.response.text();
	console.log(text);
}
