import React from "react"

const NavigationBar = () => {
    console.log("nav bar called");
  return (
    <React.Fragment>
      <ul id="nav">
        <li className="nav-item">
          <a href="/"><div>Home</div></a>
        </li>
        <li className="item">
          <a href="/aboutMe"><div>About Me</div></a>
        </li>
      </ul>
      </React.Fragment >
  )
}

export default NavigationBar
