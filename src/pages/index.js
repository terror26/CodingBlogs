import * as React from "react"

import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"
import CustomCategoryContainer from "../components/CustomCategoryContainer"

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.posts.nodes;
  const [currentCategory, setCurrentCategory] = React.useState();
  
  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <Bio />
        <p>
          No blog posts found. Add markdown posts to "content/blog" (or the
          directory you specified for the "gatsby-source-filesystem" plugin in
          gatsby-config.js).
        </p>
      </Layout>
    )
  }

  const uniqueCategories = [...new Set(posts.map(item => {
    return item.frontmatter.category;
  }
    )
  )]; // [ 'DSA', 'SystemDesign']
  if(currentCategory === "" || currentCategory === undefined) {
    setCurrentCategory(uniqueCategories[0]);
  }

  function categoryChangeHandler(selectedCategory) {
    console.log("selectedCategory = " + selectedCategory);
    setCurrentCategory(selectedCategory);
  }

  return (
    <Layout location={location} title={siteTitle}>
      <Bio />
      <ul className="category-container" role = "tablist" id="category">
      {
          uniqueCategories.map(category => {
            return (
              <CustomCategoryContainer id={category} activeCategory ={currentCategory} key = {category}
              categoryChangeHandler={categoryChangeHandler}
              />
            )
          })
        }
      </ul>
      <ol style={{ listStyle: `none` }}>
        {posts.map(post => {
          const title = post.frontmatter.title || post.fields.slug
          const category = post.frontmatter.category;
          console.log("currentCategory = " + currentCategory);
          if(( currentCategory !== "" || currentCategory !== undefined) && category !== currentCategory) {
            return ;
          }
          return (
            <li key={post.fields.slug}>
              <article
                className="post-list-item"
                itemScope
                itemType="http://schema.org/Article"
              >
                <header>
                  <h2>
                    <Link to={post.fields.slug} itemProp="url">
                      <span itemProp="headline">{title}</span>
                    </Link>
                  </h2>
                  <small>{post.frontmatter.date}</small>
                </header>
                <section>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: post.frontmatter.description || post.excerpt,
                    }}
                    itemProp="description"
                  />
                </section>
              </article>
            </li>
          )
        })}
      </ol>
    </Layout>
  )
}

export default BlogIndex

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title="All posts" />

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
      }
    }
    posts : allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
          category
        }
      }
    }
  }
`
