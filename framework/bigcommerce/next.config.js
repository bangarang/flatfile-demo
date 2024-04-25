const commerce = require('./commerce.config.json')

module.exports = {
  commerce,
  images: {
    domains: ['cdn11.bigcommerce.com', `${process.env.AWS_BUCKET}.s3.amazonaws.com`],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    minimumCacheTTL: 31536000,
    disableStaticImages: true
  },
}
