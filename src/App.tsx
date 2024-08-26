import { Link } from "react-router-dom";
import "./App.css";
import Button from "./components/Button/Button";

function App() {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        <p style={{ marginBottom: "40px" }}>DevCon Agora</p>
        <Link to="/welcome1">
          <Button>Next</Button>
        </Link>
      </div>
    </>
  );
}

export default App;
