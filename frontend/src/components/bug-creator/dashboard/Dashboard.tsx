import React from 'react';
import Navbar from '../../common/Navbar';
import BugsCreatorList from '../bugs/index';

const BugCreatorDashboard: React.FC = () => {
  return (
    <>
      <Navbar />
      <BugsCreatorList />
    </>
  );
};

export default BugCreatorDashboard;
