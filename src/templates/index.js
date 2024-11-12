import React from 'react';
import { graphql, Link } from 'gatsby';
import Header from "../components/header.js";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

const IndexPage = ({ data, pageContext }) => {
  const stickyPosts = data.stickyPosts.nodes;
  const regularPosts = data.regularPosts.nodes;
  const categories = data.allWpCategory.nodes;
  const { currentPage, numberOfPages } = pageContext;

  // Helper function for ellipsis logic
  const getPagination = () => {
    const pageNumbers = [];
    const delta = 1; // Number of pages to show around the current page

    for (let i = 1; i <= numberOfPages; i++) {
      if (
        i === 1 || // First page
        i === numberOfPages || // Last page
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
      <Hero />

      {/* Categories List */}
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <ul className="category-list-hero list-inline text-center">
              <li className="list-inline-item">
                <Link to="/" className="btn btn-category-link active">All</Link>
              </li>
              {categories
                .filter(category => category.name !== "Uncategorized")
                .map(category => (
                  <li key={category.id} className="list-inline-item">
                    <Link to={`/category/${category.slug}/`} className="btn btn-category-link">
                      {category.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Sticky Posts Section */}
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            {stickyPosts.length > 0 && (
              <div className="sticky-posts-homepage text-center border p-3 mt-3 mb-3">
                {stickyPosts.map(post => (
                  <div key={post.id} className="post">
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
                    <h2>
                      <Link to={`/${post.slug}`}>{post.title}</Link>
                    </h2>
                    
                    <div dangerouslySetInnerHTML={{ __html: post.excerpt.replace(/<a[^>]*class="read-more"[^>]*>.*?<\/a>/, "") }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Regular Posts Section */}
      <div className="container blog-list-main-container">
        <div className="row">
          {regularPosts.map(post => (
            <div key={post.id} className="col-md-6 mb-4 blog-list-content-wrapper">
              <h3>
                <Link to={`/${post.slug}`}>{post.title}</Link>
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
                  <Link to={`/author/${post.author.node.slug}`}>{post.author.node.name}</Link>
                </span>
                <span>
                  {" | "}{formatDate(post.date)}
                </span>
                <span>
                  {" | "}{calculateReadingTime(post.excerpt)} min read
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Section */}
      <div className="container blog-pagination-main-container">
        <div className="row">
          <div className="col-md-12">
            <div className="pagination">
              {getPagination().map((page, index) => {
                if (page === "...") {
                  return <span key={index} className="page-ellipsis">...</span>;
                }
                return (
                  <Link
                    key={page}
                    to={page === 1 ? "/" : `/posts/${page}`}
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
  query($skip: Int!, $limit: Int!) {
    allWpCategory {
      nodes {
        id
        name
        slug
      }
    }
    stickyPosts: allWpPost(filter: { isSticky: { eq: true } }, limit: 1) {
      nodes {
        id
        title
        slug
        excerpt
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
    regularPosts: allWpPost(
      filter: { isSticky: { eq: false } }
      sort: { fields: date, order: DESC }
      limit: $limit
      skip: $skip
    ) {
      nodes {
        id
        title
        slug
        excerpt
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

export default IndexPage;
