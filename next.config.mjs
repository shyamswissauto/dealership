
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    qualities: [75, 90],
  },
  async redirects() {
    return [
      // Redirect
      { source: '/bolden-business', destination: '/', permanent: false },
      { source: '/contact-us', destination: '/', permanent: true },
      { source: '/emi-calculator', destination: '/', permanent: true },
      { source: '/experience-the-drive', destination: '/', permanent: true },
      { source: '/locations', destination: '/', permanent: true },
      { source: '/privacy-policy', destination: '/', permanent: true },
      { source: '/service-and-parts', destination: '/', permanent: true },
      { source: '/terms-of-use', destination: '/', permanent: true },
      { source: '/book-a-test-drive', destination: '/', permanent: true },
    ];
  },
};

export default nextConfig;
