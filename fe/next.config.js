/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: 'https://edbe.itsyash.space',
    NEXT_PUBLIC_PG_API_URL: 'https://dev-vanilla.edviron.com/erp',
    NEXT_PUBLIC_PG_KEY: 'edvtest01'
  }
}

module.exports = nextConfig 