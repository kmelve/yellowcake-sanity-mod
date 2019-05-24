import React, { Fragment } from 'react'
import _get from 'lodash/get'
import _format from 'date-fns/format'
import { Link, graphql } from 'gatsby'
import { ChevronLeft } from 'react-feather'

import Content from '../components/Content'
import Layout from '../components/Layout'
import './SinglePost.css'

export const SinglePostTemplate = ({
  title,
  date,
  _rawBody,
  nextPostURL,
  prevPostURL,
  categories = []
}) => (
  <main>
    <article
      className="SinglePost section light"
      itemScope
      itemType="http://schema.org/BlogPosting"
    >
      <div className="container skinny">
        <Link className="SinglePost--BackButton" to="/blog/">
          <ChevronLeft /> BACK
        </Link>
        <div className="SinglePost--Content relative">
          <div className="SinglePost--Meta">
            {date && (
              <time
                className="SinglePost--Meta--Date"
                itemProp="dateCreated pubdate datePublished"
                date={date}
              >
                {_format(date, 'MMMM Do, YYYY')}
              </time>
            )}
            {categories && (
              <Fragment>
                <span>|</span>
                {categories.map((cat, index) => (
                  <span
                    key={cat.category}
                    className="SinglePost--Meta--Category"
                  >
                    {cat.category}
                    {/* Add a comma on all but last category */}
                    {index !== categories.length - 1 ? ',' : ''}
                  </span>
                ))}
              </Fragment>
            )}
          </div>

          {title && (
            <h1 className="SinglePost--Title" itemProp="title">
              {title}
            </h1>
          )}

          <div className="SinglePost--InnerContent">
            <Content source={_rawBody} />
          </div>

          <div className="SinglePost--Pagination">
            {prevPostURL && (
              <Link
                className="SinglePost--Pagination--Link prev"
                to={prevPostURL}
              >
                Previous Post
              </Link>
            )}
            {nextPostURL && (
              <Link
                className="SinglePost--Pagination--Link next"
                to={nextPostURL}
              >
                Next Post
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  </main>
)

// Export Default SinglePost for front-end
const SinglePost = ({ data: { post, allPosts } }) => {
  const thisEdge = allPosts.edges.find(edge => edge.node.id === post.id)
  return (
    <Layout
      meta={post.meta || false}
      title={post.title || false}
    >
      <SinglePostTemplate
        {...post}
        {...post}
        body={post._rawBody}
        nextPostURL={_get(thisEdge, 'next.fields.slug.current')}
        prevPostURL={_get(thisEdge, 'previous.fields.slug.current')}
      />
    </Layout>
  )
}

export default SinglePost

export const pageQuery = graphql`
  ## Query for SinglePost data
  ## Use GraphiQL interface (http://localhost:8000/___graphql)
  ## $id is processed via gatsby-node.js
  ## query name must be unique to this file
  query SinglePost($id: String!, $date: Date) {
  post: sanityPost(slug: {current: {eq: $id}}) {
    date: publishedAt
    _rawBody
    id
    title
    categories {
      title
    }
  }
  allPosts: allSanityPost(filter: {publishedAt: {gt: $date}}, sort: {order: DESC, fields: [publishedAt]}) {
    edges {
      node {
        id
      }
      next {
        slug {
          current
        }
        title
      }
      previous {
        slug {
          current
        }
        title
      }
    }
  }
}

`
