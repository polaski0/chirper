import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

function App() {

  useEffect(() => {
    const fetchData = async () => {
      const URL = `http://localhost:3000/test`;

      const req = await fetch(URL, {
        method: 'GET'
      });
      const res = await req.json();

      console.log(res);
    };

    fetchData();
  }, []);

  return (
    <Routes>
      <Route path='/' element={<Navbar />}>
        {/* <Route index element={<NewsFeed />} /> */}
      </Route>
    </Routes>
  )
}

export default App;
