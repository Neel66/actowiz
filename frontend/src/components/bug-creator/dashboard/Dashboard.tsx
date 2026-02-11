import React from 'react';
import Navbar from '../../common/Navbar';
import BugsIndex from '../bugs/index';

const BugCreatorDashboard: React.FC = () => {
  return (
    <>
      <Navbar />
      <BugsIndex />
    </>
  );
};

export default BugCreatorDashboard;
