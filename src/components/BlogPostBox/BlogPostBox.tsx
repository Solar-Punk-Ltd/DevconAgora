import BlogPostBoxItem from "./BlogPostBoxItem/BlogPostBoxItem";
import "./BlogPostBox.scss";

interface BlogPostBoxProps {}

const BlogPostBox: React.FC<BlogPostBoxProps> = ({}) => {
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
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <BlogPostBoxItem />
        <BlogPostBoxItem />
        <BlogPostBoxItem />
      </div>
    </div>
  );
};

export default BlogPostBox;
