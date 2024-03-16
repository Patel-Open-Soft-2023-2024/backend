import GoogleSignIn from './pages/googlesignin'
import { Routes, Route } from 'react-router-dom';
import Register from './pages/register';
import EmailSignIn from './pages/emailsignin';

const App = () => {
  return (
    <>
      <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/signin" element={<GoogleSignIn />} />
          <Route path="/signinwithemail" element={<EmailSignIn />} />
          {/* <Route path="/about" element={<About />} /> */}
      </Routes>
    </>
  );
};
 
export default App;