import React, { useState } from 'react';
import NavigationBar from "../components/NavigationBar"


const aboutMe = (props) => {
  console.log(props);
  return (
    <React.Fragment>
    <NavigationBar />
    <div>
    <img src="https://i.imgur.com/kmUwBAn.png" alt="Resume" height="auto" width="70%" />      
    </div>
    </React.Fragment>
  );
};

export default aboutMe;
