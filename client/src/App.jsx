import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// pages
import Home from "./components/pages/Home.jsx";
import UserLoginRegister from './components/pages/UserLoginRegister.jsx';
import UserDashboard from './components/pages/UserDashboard/UserDashboard.jsx';

import CompanyLoginRegisterPage from './components/pages/CompanyLoginRegister/CompanyLoginRegisterPage.jsx';
import CompanyDashboard from './components/pages/CompanyDashboard/CompanyDashboard.jsx';

// context
import { UserProvider } from './context/userContext.jsx';
import { CompanyProvider } from './context/companyContext.jsx';
import { MessageProvider } from './context/messageContext.jsx';

// global UI
import Message from './components/sections/actions/Message.jsx';

const App = () => {
  return (
    <>
      <UserProvider>
        <CompanyProvider>
          <MessageProvider>
            <Message />

            <Router>
              <Routes>
                <Route path='/' element={<Home />} />

                {/* User routes */}
                <Route path='/user-login-register' element={<UserLoginRegister />} />
                <Route path='/user/dashboard' element={<UserDashboard />} />

                {/* Company routes */}
                <Route path='/company-login-register' element={<CompanyLoginRegisterPage />} />
                <Route path='/company/dashboard' element={<CompanyDashboard />} />
              </Routes>
            </Router>

          </MessageProvider>
        </CompanyProvider>
      </UserProvider>
    </>
  );
};

export default App;
