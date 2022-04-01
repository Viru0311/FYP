import "./App.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "boxicons/css/boxicons.min.css";
import AppLayout from "./components/Layout/AppLayout";
import Blank from "./pages/Blank";
import SignIn from "./components/Auth/SignIn/SignIn.jsx";
import SignUp from "./components/Auth/SignUp/SignUp.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Blank text="home" />} />
          <Route path="/started" element={<Blank text="started" />} />
          <Route path="/calendar" element={<Blank text="calendar" />} />
          <Route path="/user" element={<Blank text="user" />} />
          <Route path="/order" element={<Blank text="order" />} />
          <Route path="/signin" element={<SignIn text="signin" />} />
          <Route path="/signup" element={<SignUp text="signup" />} />
        </Route>{" "}
      </Routes>
    </BrowserRouter>
  );
  // return <div className="App">Learn React</div>;
}

export default App;
