import React, { useEffect } from 'react';
import { Route, Routes } from "react-router-dom";
// import cookie from 'react-cookies';
import axios from "axios";

// CSS 파일 import
import '../css/new.css';

// 헤더 컴포넌트 import
import Header from './Header/Header';

// 메인 컴포넌트 import
// import MainForm from './Main/MainForm';

// 푸터 컴포넌트 import
import Footer from './Footer/Footer';

// 로그인 컴포넌트 import
// import LoginForm from './LoginForm';

// import NewsList from './Api/NewsList';
// import SList from './Api/SList';
import SubscribeLList   from './subscribe/SubscribeLList';
import SubscribeLInsert from './subscribe/SubscribeLInsert';
import SubscribeLRead   from './subscribe/SubscribeLRead';
import SubscribeLUpdate from './subscribe/SubscribeLUpdate';

const App = () => {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path='/SubscribeLList' element={<SubscribeLList/>} />
        <Route path='/SubscribeLInsert' element={<SubscribeLInsert/>} />
        <Route path='/SubscribeLRead/:sno' element={<SubscribeLRead/>} />
        <Route path='/SubscribeLUpdate/:sno' element={<SubscribeLUpdate/>} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
