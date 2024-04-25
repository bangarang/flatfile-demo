const commerce = require('./commerce.config.json')
const {
  withCommerceConfig,
  getProviderName,
} = require('./framework/commerce/config')
const provider = commerce.provider || getProviderName()
const isBC = provider === 'bigcommerce'
module.exports = withCommerceConfig({
  eslint: {
    ignoreDuringBuilds: true,
  },
  swcMinify: true,
  cleanDistDir: false,
  commerce,
  images: {
    disableStaticImages: true,
    domains: [`${process.env.AWS_BUCKET}.s3.amazonaws.com`],
  },
  async headers() {
    return [{
      source: '/(.*)',
      headers: [
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=300; includeSubDomains;',
        },
      ],
    }]
  },
  rewrites() {
    return [
      isBC && {
        source: '/checkout',
        destination: '/api/checkout'
      },
      // The logout is also an action so this route is not required, but it's also another way
      // you can allow a logout!
      isBC && {
        source: '/logout',
        destination: '/api/logout?redirect_to=/',
      },
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
      {
        source: '/products.rss',
        destination: '/api/products-rss-feed',
      }
    ].filter(Boolean)
  },
  redirects() {
    return []
  },
})

// Don't delete this console log, useful to see the commerce config in Vercel deployments
console.log('next.config.js', JSON.stringify(module.exports, null, 2))
