import React from 'react';
import { Route, Routes } from "react-router-dom";
// import cookie from 'react-cookies';
// import axios from "axios";

// CSS 파일 import
import '../css/new.css';

// 헤더 컴포넌트 import
import Header from './Header/Header';

// 메인 컴포넌트 import
import MainForm from './Main/MainForm';

// 푸터 컴포넌트 import
import Footer from './Footer/Footer';

// 로그인 컴포넌트 import
import LoginForm from './LoginForm';

// 회원 관리 컴포넌트 import
import Register from './Member/Register';
import Modify from './Member/Modify';
import MyPage from './Member/MyPage';

import ChallengeList from './Challenge/ChallengeList';
import ChallengeInsert from './Challenge/ChallengeInsert';
import ChallengeRead from './Challenge/ChallengeRead';
import ChallengeUpdate from './Challenge/ChallengeUpdate';

// import NewsList from './Api/NewsList';
// import SList from './Api/SList';
import SubscribeList    from './subscribe/SubscribeList';
import SubscribeInsert  from './subscribe/SubscribeInsert';
import SubscribeRead    from './subscribe/SubscribeRead';
import SubscribeUpdate  from './subscribe/SubscribeUpdate';
import SubscribeLList   from './subscribe/SubscribeLList';
import SubscribeLInsert from './subscribe/SubscribeLInsert';
import SubscribeLRead   from './subscribe/SubscribeLRead';
import SubscribeLUpdate from './subscribe/SubscribeLUpdate';

const App = () => {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path='/' element={<LoginForm />} />
        <Route path='/login' element={<LoginForm />} />
        <Route path='/MainForm' element={<MainForm />} />
        <Route path='/Register' element={<Register />} />
        <Route path='/MyPage' element={<MyPage />} />
        <Route path='/Modify' element={<Modify />} />
        <Route path='/ChallengeList' element={<ChallengeList />} />
        <Route path='/ChallengeRead/:bno' element={<ChallengeRead/>}/>
        <Route path='/ChallengeInsert' element={<ChallengeInsert />} />
        <Route path='/ChallengeUpdate/:bno' element={<ChallengeUpdate />} />
        <Route path='/SubscribeList' element={<SubscribeList/>} />
        <Route path='/SubscribeInsert' element={<SubscribeInsert/>} />
        <Route path='/SubscribeRead/:sno' element={<SubscribeRead/>} />
        <Route path='/SubscribeUpdate/:sno' element={<SubscribeUpdate/>} />
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
