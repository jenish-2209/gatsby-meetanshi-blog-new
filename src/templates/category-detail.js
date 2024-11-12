import React from "react";
import Header from "../components/header.js";
import Footer from "../components/Footer";
import { graphql, Link } from "gatsby";

const CategoryDetail = ({ data, pageContext }) => {
  const categories = data.allWpCategory.nodes;
  const posts = data.allWpPost.nodes;
  const { categorySlug, categoryName, currentPage, numPages } = pageContext;

  // Helper function to create pagination with ellipses
  const getPagination = () => {
    const pageNumbers = [];
    const delta = 1; // Number of pages to show around the current page

    for (let i = 1; i <= numPages; i++) {
      if (
        i === 1 || // First page
        i === numPages || // Last page
        i === currentPage || // Current page
        (i >= currentPage - delta && i <= currentPage + delta) // Pages around current page
      ) {
        pageNumbers.push(i);
      } else if (i === currentPage - delta - 1 || i === currentPage + delta + 1) {
        // Add ellipsis between distant pages
        pageNumbers.push("...");
      }
    }

    return pageNumbers;
  };


  // Helper function to calculate reading time
  const calculateReadingTime = (content) => {
    const wordsPerMinute = 200; // Average reading speed
    const textLength = content.split(' ').length;
    const time = Math.ceil(textLength / wordsPerMinute);
    return time;
  };

  // Function to format date
  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  return (
    <div>
      <Header />
      <section>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="home-hero-section">
                <h1>{categoryName}</h1>
                <p>Find expert articles on Magento, Shopify, and Digital Marketing topics</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="row">
          <div className="col-md-12">
            {/* Categories List */}
            <div className="categories mb-4">
              <ul className="category-list-hero list-inline text-center">
                <li className="list-inline-item">
                  <Link
                    to="/"
                    className={`btn btn-category-link ${!categorySlug ? "active" : ""}`}
                  >
                    All
                  </Link>
                </li>
                {categories
                  .filter((category) => category.name !== "Uncategorized")
                  .map((category) => (
                    <li key={category.id} className="list-inline-item">
                      <Link
                        to={`/category/${category.slug}/`}
                        className={`btn btn-category-link ${category.slug === categorySlug ? "active" : ""}`}
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="container blog-list-main-container">
        {/* Post List */}
        <div className="row">
          {posts.map((post) => {
            // Get the post's author details
            return (
              <div
                key={post.id}
                className="col-md-6 mb-4 blog-list-content-wrapper"
              >
                <h3>
                  <Link to={`/${post.slug}`}>
                    {post.title}
                  </Link>
                </h3>
                <div dangerouslySetInnerHTML={{ __html: post.excerpt.replace(/<a[^>]*class="read-more"[^>]*>.*?<\/a>/, "") }} />
                  <div className="listing-blog-info">
                    {post.author.node.avatar.url && (
                        <img
                          className="listing-inner-author-image"
                          src={post.author.node.avatar.url}
                          alt={`${post.author.node.name} Image`}
                        />
                    )}
                    <span>
                      By <Link to={`/author/${post.author.node.slug}`}>{post.author.node.name}</Link>
                    </span>
                    <span>
                      {" | "}{formatDate(post.date)} 
                    </span>
                    <span>
                      {" | "}{calculateReadingTime(post.excerpt)} min read
                    </span>
                  </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="container blog-pagination-main-container">
        <div className="row">
          <div className="col-md-12">
            {/* Pagination with Ellipsis */}
            <div className="pagination">
              {getPagination().map((page, index) => {
                if (page === "...") {
                  return <span key={index} className="page-ellipsis">...</span>;
                }
                return (
                  <Link
                    key={page}
                    to={
                      page === 1
                        ? `/category/${categorySlug}/`
                        : `/category/${categorySlug}/${page}`
                    }
                    className={`page-number ${currentPage === page ? "active" : ""}`}
                  >
                    {page}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export const query = graphql`
  query ($categorySlug: String!, $skip: Int!, $limit: Int!) {
    allWpCategory {
      nodes {
        id
        name
        slug
      }
    }
    allWpPost(
      filter: {
        categories: { nodes: { elemMatch: { slug: { eq: $categorySlug } } } }
      }
      sort: { fields: date, order: DESC }
      limit: $limit
      skip: $skip
    ) {
      nodes {
        id
        title
        slug
        excerpt
        content
        date
        author {
          node {
            name
            slug
            avatar {
              url
            }
          }
        }
      }
    }
  }
`;

export default CategoryDetail;
