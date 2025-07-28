import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
        primary: 'hsl(var(--primary))',
        secondary: 'hsl(var(--secondary))',
        light: '#f5f5f7',
        dark: '#1d1d1f',
        'glass-light': 'rgba(255, 255, 255, 0.7)',
        'glass-dark': 'rgba(255, 255, 255, 0.1)',
        'genie-gold': '#FDD20E',

  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',

  			card: 'hsl(var(--card))',
  			'card-foreground': 'hsl(var(--card-foreground))',

  			popover: 'hsl(var(--popover))',
  			'popover-foreground': 'hsl(var(--popover-foreground))',

  			'primary-foreground': 'hsl(var(--primary-foreground))',
  			'secondary-foreground': 'hsl(var(--secondary-foreground))',

  			muted: 'hsl(var(--muted))',
  			'muted-foreground': 'hsl(var(--muted-foreground))',

  			accent: 'hsl(var(--accent))',
  			'accent-foreground': 'hsl(var(--accent-foreground))',

  			destructive: 'hsl(var(--destructive))',
  			'destructive-foreground': 'hsl(var(--destructive-foreground))',

  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',

  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif'
        ]
      },
  		keyframes: {
  			'accordion-down': {
  				from: { height: '0' },
  				to: { height: 'var(--radix-accordion-content-height)' }
  			},
  			'accordion-up': {
  				from: { height: 'var(--radix-accordion-content-height)' },
  				to: { height: '0' }
  			},
        'wiggle': {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        'fly-across': {
          '0%': {
            transform: 'translateX(-30%) translateY(130%) scale(0.4) rotate(-40deg)',
            opacity: '0',
          },
          '20%': {
            opacity: '1',
            transform: 'translateX(10%) translateY(70%) scale(0.6) rotate(-20deg)',
          },
          '80%': {
            opacity: '1',
            transform: 'translateX(90%) translateY(-10%) scale(0.9) rotate(10deg)',
          },
          '100%': {
            transform: 'translateX(130%) translateY(-40%) scale(1) rotate(25deg)',
            opacity: '0',
          },
        },
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 5px hsla(var(--accent), 0.3), 0 0 10px hsla(var(--accent), 0.2), 0 0 0 0px hsla(var(--accent), 0.3)'
          },
          '50%': {
            boxShadow: '0 0 10px hsla(var(--accent), 0.5), 0 0 20px hsla(var(--accent), 0.3), 0 0 0 5px hsla(var(--accent), 0)'
          },
        },
        'shine': {
          '0%': { 'background-position': '-200% center' },
          '20%': { 'background-position': '200% center' },
          '100%': { 'background-position': '200% center' },
        },
        'throb': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' }
        }
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
        'wiggle': 'wiggle 3s ease-in-out infinite',
        'fly-across': 'fly-across 18s linear infinite',
        'pulse-glow': 'pulse-glow 2.5s infinite ease-in-out',
        'shine': 'shine 8s ease-in-out infinite',
        'throb': 'throb 1.5s ease-in-out infinite'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
