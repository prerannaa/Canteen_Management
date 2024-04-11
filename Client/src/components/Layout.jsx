import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children, hideNavbar }) => {
  return (
    <div className='flex gap-5 justify-start '>
        <Navbar />
      <main className="flex justify-center">{children}</main>
    </div>
  );
};

export default Layout;