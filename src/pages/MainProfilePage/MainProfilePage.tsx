import React from "react";
import { Link } from "react-router-dom";
import BlogPostBox from "../../components/BlogPostBox/BlogPostBox";
import DevConMainBox from "../../components/DevConMainBox/DevConMainBox";
import RecentBox from "../../components/RecentBox/RecentBox";
import UpcomingTalkBox from "../../components/UpcomingTalkBox/UpcomingTalkBox";
import Header from "../Header/Header";
import "./MainProfilePage.scss";

const MainProfilePage: React.FC = () => {
  return (
    <div
      style={{
        height: "100vh",
        boxSizing: "border-box",
        backgroundColor: "#f5f5f5",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Header name="Agora"></Header>
      <Link to="/recent">
        <DevConMainBox />
      </Link>
      <RecentBox />
      <UpcomingTalkBox />
      <BlogPostBox />
    </div>
  );
};

export default MainProfilePage;
