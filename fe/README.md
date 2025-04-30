# Edviron Frontend

A sleek, modern frontend application for the Edviron school fee management system, built with Next.js and featuring a dark-themed UI with green accents.

![Edviron UI](https://via.placeholder.com/800x400?text=Edviron+UI)

## Features

- **Modern UI**: Dark theme with glassmorphism effects and vibrant green accents
- **Responsive Design**: Fully responsive layouts for all device sizes
- **Interactive Elements**: Micro-interactions and animations for enhanced user experience
- **Data Visualization**: Interactive charts and stats displays
- **Modular Components**: Reusable component architecture for maintainability

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Motion](https://motion.dev/)
- **Icons**: [Lucide Icons](https://lucide.dev/)
- **State Management**: React Context API and Hooks

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/edviron.git
   cd edviron/fe
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
fe/
├── app/                 # Next.js app directory with routes
├── components/          # Reusable components
│   ├── ui/              # UI components (buttons, cards, etc.)
│   └── layout/          # Layout components
├── lib/                 # Utility functions and hooks
├── public/              # Static files
└── styles/              # Global styles
```

## Key Components

### UI Components

- **Navbar**: Responsive navigation with animated width changes on scroll
- **StatCard**: Cards for displaying key statistics with animations
- **GraphCard**: Interactive graph visualization component
- **FeatureCard**: Component for displaying feature highlights

### Pages

- **Landing Page**: Main marketing page with feature highlights
- **Dashboard**: User dashboard with financial analytics
- **Payment**: Fee payment processing interface

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_API_URL=https://edbe.yashprojects.online
NEXT_PUBLIC_PG_API_URL=https://dev-vanilla.edviron.com/erp
NEXT_PUBLIC_PG_KEY=edvtest01
```

## Building for Production

```bash
npm run build
# or
yarn build
```

The build output will be in the `.next` folder.

## Deployment

The application can be deployed on Vercel, Netlify, or any other Next.js-compatible hosting platform.

```bash
npm run build
npm run start
```

## Docker Support

A Dockerfile is included for containerized deployment:

```bash
# Build the Docker image
docker build -t edviron-frontend .

# Run the container
docker run -p 3000:3000 edviron-frontend
```

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 