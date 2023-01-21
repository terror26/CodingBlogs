import * as React from "react"

const CustomCategoryContainer = ({ id, activeCategory , categoryChangeHandler }) => {
  return (
    <li
      className={`item ${activeCategory === id ? "active" : ""}`}
      role="tab"
      aria-selected={activeCategory === id}
      onClick={() => {categoryChangeHandler(id)}}
    >
      <div> {id}</div>
    </li>
  )
}

export default CustomCategoryContainer
