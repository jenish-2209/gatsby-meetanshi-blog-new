import React from "react"
import { graphql, Link } from "gatsby"
import { paginate } from "gatsby-awesome-pagination"

const PostsList = ({ data, pageContext }) => {
  const posts = data.allWpPost.nodes
  const { currentPage, numberOfPages, pathPrefix } = pageContext

  // Create an array for page numbers
  const pageNumbers = []
  for (let i = 1; i <= numberOfPages; i++) {
    pageNumbers.push(i)
  }

  // Previous and Next page links
  const prevPage = currentPage === 1 ? null : `${pathPrefix}/${currentPage - 1}`
  const nextPage = currentPage === numberOfPages ? null : `${pathPrefix}/${currentPage + 1}`

  return (  
    <main>
      <h1>Latest Posts</h1>
      <ul>
  {posts.map(post => (
    <li key={post.id}>
      <h2>
        <Link to={post.uri}>{post.title}</Link>
      </h2>
      <div dangerouslySetInnerHTML={{ __html: post.excerpt }} />
    </li>
  ))}
</ul>


      {/* Pagination */}
      <div className="pagination">
        <div className="pagination-buttons">
          {prevPage && (
            <Link to={prevPage} className="prev-button">Previous</Link>
          )}

          <div className="page-numbers">
            {pageNumbers.map(number => (
              <Link
                key={number}
                to={`/posts/${number}`}
                className={`page-number ${currentPage === number ? "active" : ""}`}
              >
                {number}
              </Link>
            ))}
          </div>

          {nextPage && (
            <Link to={nextPage} className="next-button">Next</Link>
          )}
        </div>
      </div>
    </main>
  )
}

export const query = graphql`
  query($skip: Int!, $limit: Int!) {
    allWpPost(sort: { date: DESC }, limit: $limit, skip: $skip) {
      nodes {
        id
        title
        excerpt
        uri
      }
    }
  }
`

export default PostsList
