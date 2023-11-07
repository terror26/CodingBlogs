import React, { useState } from "react"
import { Document, Page } from "react-pdf"

function aboutMe() {
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages)
  }

  return (
    <iframe
      src="https://docs.google.com/gview?url= https://github.com/terror26/Resume/blob/56f6fa6994a9d3f7cfd226f0aae4d39dd4e0e5b0/Kanishk_Resume_Final_2023%20(1).pdf &embedded=true"
      style="width:100%; height:100%;"
      frameborder="0"
    ></iframe>
  )
}
export default aboutMe
