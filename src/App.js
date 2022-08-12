import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SignUp from "./pages/SignUp";
import SignIn from './pages/SignIn';
import Home from './pages/Home';
import ForgotPassword from "./pages/ForgotPassword";
import PrivateRoute from "./components/PrivateRoute";
import Menu from './components/Menu';
import Profile from './pages/Profile';
import CreateBooks from "./pages/CreateBooks";

function App() {
  return (
    <div className="App">
      <Router>
      <Menu />
        <Routes>
          <Route path='/' element={<PrivateRoute />}>
           <Route path='/' element={<Home />} />
          </Route>
          <Route path='/profile' element={<PrivateRoute />}>
           <Route path='/profile' element={<Profile />} />
          </Route>
          <Route path='/create-book' element={<PrivateRoute />}>
           <Route path='/create-book' element={<CreateBooks />} />
          </Route>
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </Router>
      <ToastContainer />
    </div>
  );
}

export default App;
