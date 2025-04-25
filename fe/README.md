# School Payment Dashboard

A modern, responsive financial dashboard built with Next.js, Tailwind CSS, shadcn/ui, and TanStack Query.

![Finance Dashboard](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/desing_payment_1-WNXJc0L3AAsOg5wkMW2XjSu0BW4EyY.webp)

## Features

- **Dashboard Overview**: View net worth, investments, and financial analytics
- **Investment Tracking**: Monitor investment growth and performance
- **Credit Management**: Track credit usage and remaining balance
- **Planning History**: View financial planning history and status
- **Responsive Design**: Fully responsive UI that works on all devices
- **Dark Mode**: Beautiful dark theme with bright green accents
- **Real-time Data**: Simulated API endpoints with TanStack Query for data fetching

## Tech Stack

- **Next.js**: App Router, Server Components, API Routes
- **Tailwind CSS**: Utility-first styling with custom theme
- **shadcn/ui**: High-quality UI components
- **TanStack Query**: Data fetching, caching, and state management
- **Recharts**: Data visualization with customizable charts
- **TypeScript**: Type safety throughout the application

## Color Scheme

The application uses a sleek dark theme with bright green accents:

- Background: #000000 (Pure Black)
- Card Background: #202020 (Dark Gray)
- Primary: #2BE82A (Bright Green)
- Secondary: #98E498 (Light Green)
- Text: #FFFFFF (White)

## Getting Started

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

\`\`\`
src/
├── app/                 # Next.js App Router
│   ├── investments/     # Investments page
│   ├── credit/          # Credit page
│   ├── planning-history/ # Planning history page
│   ├── settings/        # Settings page
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Dashboard page
├── components/          # Reusable UI components
├── lib/                 # Utility functions
└── hooks/               # Custom React hooks
\`\`\`

## Customization

You can customize the theme by modifying the `tailwind.config.ts` file and the CSS variables in `globals.css`.

## License

MIT

## Acknowledgements

- Design inspiration from the provided mockups
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)
