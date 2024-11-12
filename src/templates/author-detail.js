import React from "react";
import Header from "../components/header.js";
import { graphql, Link } from "gatsby";
import Footer from "../components/Footer";

const AuthorDetail = ({ data, pageContext }) => {
  const posts = data.allWpPost.nodes;
  const author = data.wpUser; // Author details from GraphQL
  const { authorSlug, currentPage, numPages } = pageContext;

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

  // Function to format date
  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  };

    // Helper function to calculate reading time
    const calculateReadingTime = (content) => {
      const wordsPerMinute = 200; // Average reading speed
      const textLength = content.split(' ').length;
      const time = Math.ceil(textLength / wordsPerMinute);
      return time;
    };

  return (
    <div>
      <Header />
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            {/* Author Details */}
            <div className="author-details text-center mb-4">
              {author.avatar && author.avatar.url && (
                <img
                  src={author.avatar.url}
                  alt={author.name}
                  className="author-image"
                />
              )}
              <h2>{author.name}</h2>
              <p>{author.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container blog-list-main-container">
        {/* Post List */}
        <div className="row">
          {posts.map((post) => {
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
                        ? `/author/${authorSlug}/`
                        : `/author/${authorSlug}/${page}`
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
  query ($authorSlug: String!, $skip: Int!, $limit: Int!) {
    wpUser(slug: { eq: $authorSlug }) {
      name
      avatar {
        url
      }
      description
    }
    allWpPost(
      filter: { author: { node: { slug: { eq: $authorSlug } } } }
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

export default AuthorDetail;
