import "./BlogPostBoxItem.scss";

interface BlogPostBoxItemProps {}

const BlogPostBoxItem: React.FC<BlogPostBoxItemProps> = ({}) => {
  return (
    <div
      style={{
        width: "118px",
        height: "92px",
        borderRadius: "8px",
        backgroundColor: "white",
      }}
    ></div>
  );
};

export default BlogPostBoxItem;
