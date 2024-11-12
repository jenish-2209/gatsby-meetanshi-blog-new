import React from 'react';
import { graphql } from 'gatsby';

const PostDetail = ({ data }) => {
  const post = data.wpPost;

  return (
    <div>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
};

export const query = graphql`
  query($id: String!) {
    wpPost(id: { eq: $id }) {
      title
      content
    }
  }
`;

export default PostDetail;
