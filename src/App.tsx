import { Link } from "react-router-dom";
import "./App.css";
import Button from "./components/Button/Button";

function App() {
  return (
    <>
      <p>DevCon Agora</p>
      <Link to="/welcome1">
        <Button>Next</Button>
      </Link>
    </>
  );
}

export default App;
