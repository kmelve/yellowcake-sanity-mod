import React from 'react'
import ReactDOMServer from 'react-dom/server'
import BlockContent from '@sanity/block-content-to-react'
import PropTypes from 'prop-types'
import Image from './Image'

import './Content.css'

const encodeMarkdownURIs = (source = '') => {
  const markdownLinkRegex = /\[(.+)\]\((.+)(".+)\)/g
  console.log(source)
  return source.replace(markdownLinkRegex, (match, linkURI) => {
    if (!linkURI) return match
    const replaced = match.replace(linkURI, encodeURI(linkURI))
    return replaced
  })
}

const withContentImages = source => {
  const images = source.match(/<img(.*?)\\?>/gim)

  for (let i in images) {
    const src = /src="(.*?)"/g.exec(images[i]),
      alt = /alt="(.*?)"/g.exec(images[i]),
      title = /title="(.*?)"/g.exec(images[i])
    source = source.replace(
      images[i],
      ReactDOMServer.renderToStaticMarkup(
        <Image
          resolutions="medium"
          className="Content--Image"
          lazy={false}
          src={src ? src[1] : null}
          alt={alt ? alt[1] : null}
          title={title ? title[1] : null}
        />
      )
    )
  }

  return source
}

const MyImage = ({ nodeKey, src, title, alt }) => {
  const decodedSrc = decodeURI(src)
  return (
    <Image
      className="Content--Image markdown-preview"
      resolutions="medium"
      lazy={false}
      src={decodedSrc}
      title={title}
      alt={alt}
    />
  )
}

const HtmlBlock = ({ value }) => {
  if (value.indexOf('<iframe') !== 0) return value
  return (
    <div
      className={`Content--Iframe`}
      dangerouslySetInnerHTML={{
        __html: value
      }}
    />
  )
}

const Content = ({ source, className = '' }) => {
  return <BlockContent className={className} blocks={source} />
}

Content.propTypes = {
  source: PropTypes.string,
  src: PropTypes.string,
  className: PropTypes.string
}

export default Content
