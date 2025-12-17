
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    qualities: [75, 90],
  },
  async redirects() {
    return [
      // Redirect
      //{ source: '/bolden-business', destination: '/', permanent: false },
      //{ source: '/emi-calculator', destination: '/', permanent: true },
      //{ source: '/experience-the-drive', destination: '/', permanent: true },
      { source: '/locations', destination: '/', permanent: true },
      //{ source: '/contact-us', destination: '/', permanent: true },
      { source: '/service-and-parts', destination: '/', permanent: true },
      { source: '/terms-of-use', destination: '/', permanent: true },
      { source: '/book-a-test-drive', destination: '/', permanent: true },
      { source: '/sinotruk-vgv-u70-pro', destination: '/', permanent: true },
      { source: '/sinotruk-vgv-u75-plus', destination: '/', permanent: true },
      { source: '/models/sinotruk-vgv-u70-pro', destination: '/', permanent: true },
      { source: '/models/sinotruk-vgv-u75-plus', destination: '/', permanent: true },
      { source: '/test', destination: '/', permanent: true },
      { source: '/test2', destination: '/', permanent: true },
      { source: '/models/test11', destination: '/', permanent: true },
      
    ];
  },
};

export default nextConfig;
