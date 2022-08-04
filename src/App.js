import { Route, Routes } from "react-router-dom";
import IncdntInq from "./components/incdntinq";
import Main from "./components/main";
import Login from "./components/login";

const App = () => {

  return (
    <Routes>
      <Route path = '/' element={<Main />} />
      <Route path = '/incdnt-inq' element={<IncdntInq />} />
      <Route path = '/login' element={<Login />} />
    </Routes>
  )
}

export default App;
