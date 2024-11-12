import React from 'react';
import { graphql, Link } from 'gatsby';

const IndexPage = ({ data, pageContext }) => {
  const posts = data.allWpPost.nodes;
  const { currentPage, numberOfPages } = pageContext;
  console.log(numberOfPages);
  const nextPage = currentPage === numberOfPages ? null : `/${currentPage + 1}`;
  
  return (
    <div>
      <h1>All Posts</h1>
      <div>
        {posts.map((post) => (
          <div key={post.id}>
            <h2>{post.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: post.excerpt }} />
            <Link to={`/${post.slug}`}>Read more</Link>
          </div>
        ))}
      </div>

      <div className="pagination">
        <div className="pagination-buttons">
          {
          
          Array.from({ length: numberOfPages }).map((_, index) => {
            const pageNumber = index + 1;
            return (
              <Link
                key={pageNumber}
                to={pageNumber === 1 ? "/" : `/posts/${pageNumber}`}
                className={`page-number ${currentPage === pageNumber ? "active" : ""}`}
              >
                {pageNumber}
              </Link>
            );
          })}

          {nextPage && (
            <Link to={nextPage} className="next-button">
              Next
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

// Static skip and limit
export const query = graphql`
  query {
    allWpPost(limit: 10, skip: 10) {
      nodes {
        id
        slug
        title
      }
    }
  }
`;

export default IndexPage;
