/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/
 */

/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    title: `Meetanshi Blog`,
    description: `A brief description of your site`,
    author: `Admin`,  // Add this line
  },
  plugins: [
    {
      resolve: "gatsby-source-wordpress",
      options: {
        url: "https://webguru.dev/graphql",
        type: {
          Post: {
            limit: 3000, // Adjust limit if needed for faster builds
          },
        },
      },
    },
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
  ],
};
