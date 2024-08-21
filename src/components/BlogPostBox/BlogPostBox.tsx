import React from "react";
import BlogPostBoxItem from "./BlogPostBoxItem/BlogPostBoxItem";
import "./BlogPostBox.scss";

const BlogPostBox: React.FC = () => {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <div>Blog Posts</div>
        <div style={{ textDecoration: "underline" }}>All</div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          overflowX: "scroll",
        }}
      >
        <BlogPostBoxItem />
        <BlogPostBoxItem />
        <BlogPostBoxItem />
        <BlogPostBoxItem />
        <BlogPostBoxItem />
        <BlogPostBoxItem />
        <BlogPostBoxItem />
        <BlogPostBoxItem />
        <BlogPostBoxItem />
        <BlogPostBoxItem />
      </div>
    </div>
  );
};

export default BlogPostBox;
