import React, { useState } from 'react';
import NavigationBar from "../components/NavigationBar"


const aboutMe = (props) => {
  console.log(props);
  return (
    <React.Fragment>
    <NavigationBar />
    <div>
    <img src="https://i.imgur.com/IAmjUoe.png" alt="Resume" height="auto" width="85%" />      
    </div>
    </React.Fragment>
  );
};

export default aboutMe;
