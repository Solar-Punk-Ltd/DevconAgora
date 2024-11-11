import React from 'react';

import './BlogPostBoxItem.scss';

const BlogPostBoxItem: React.FC = () => {
  return (
    <div
      style={{
        minWidth: '118px',
        height: '92px',
        borderRadius: '8px',
        backgroundColor: 'white',
        marginRight: '8px',
      }}
    ></div>
  );
};

export default BlogPostBoxItem;
