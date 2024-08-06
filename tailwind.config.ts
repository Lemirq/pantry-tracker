import type { Config } from 'tailwindcss';
const defaultTheme = require('tailwindcss/defaultTheme');

const colors = require('tailwindcss/colors');
const { default: flattenColorPalette } = require('tailwindcss/lib/util/flattenColorPalette');
function addVariablesForColors({ addBase, theme }: any) {
	let allColors = flattenColorPalette(theme('colors'));
	let newVars = Object.fromEntries(Object.entries(allColors).map(([key, val]) => [`--${key}`, val]));

	addBase({
		':root': newVars,
	});
}

const config = {
	darkMode: ['class'],
	content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
	prefix: '',
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			backgroundImage: {
				'ai-gradient': `radial-gradient(18% 28% at 24% 50%, #cefaffff 7%, #073aff00 100%),
		radial-gradient(18% 28% at 18% 71%, #ffffff59 6%, #073aff00 100%), radial-gradient(70% 53% at 36% 76%, #73f2ffff 0%, #073aff00 100%),
		radial-gradient(42% 53% at 15% 94%, #ffffffff 7%, #073aff00 100%), radial-gradient(42% 53% at 34% 72%, #ffffffff 7%, #073aff00 100%),
		radial-gradient(18% 28% at 35% 87%, #ffffffff 7%, #073aff00 100%), radial-gradient(31% 43% at 7% 98%, #ffffffff 24%, #073aff00 100%),
		radial-gradient(21% 37% at 72% 23%, #d3ff6d9c 24%, #073aff00 100%), radial-gradient(35% 56% at 91% 74%, #8a4ffff5 9%, #073aff00 100%),
		radial-gradient(74% 86% at 67% 38%, #6dffaef5 24%, #073aff00 100%), linear-gradient(125deg, #4eb5ffff 1%, #4c00fcff 100%)`,
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
			},
		},
	},
	plugins: [require('tailwindcss-animate'), addVariablesForColors],
} satisfies Config;

export default config;
