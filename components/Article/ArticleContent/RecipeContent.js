import React, { forwardRef } from 'react'
import ResponsiveImage from '@/components/ResponsiveImage'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import classes from './ArticleContent.module.scss'
import Link from 'next/link'
import IconStar from '@/svgs/empty-star.svg'
import IconCaretThin from '@/svgs/caret-thin.svg'
import ArticleProduct from '../ArticleProduct'
import ArticleSocialSharing from '../ArticleSocialSharing'
import Video from '@/components/Video'

const RecipeContent = forwardRef(({fields, products}, ref) => {

  const { description, content } = fields

  const myPortableTextComponents = {
    block: {
      h1: ({children}) => {
        const h1Text = (typeof children[0] !== 'object') ? children[0] : children[0].props.text
        if (h1Text && ref.current[h1Text]) {
          return <h1 ref={ref.current[h1Text]}>{children}</h1>
        }
        return <h1>{children}</h1>
      },
      blockquote: ({children}) => {
        return <div className={classes['article-blockquote']}>
          <div className={classes['article-blockquote__bracket-outer']}></div>
          <div className={classes['article-blockquote__bracket-upper']}></div>
          <div className={classes['article-blockquote__bracket-lower']}></div>
          <blockquote>{children}</blockquote>
        </div>
      }
    },
    marks: {
      arrowLink: ({ children, value }) => (<Link href={value.href || ''}>
        <a className={classes['article-section__arrow-link']}>{children}<IconCaretThin /></a>
      </Link>),
      buttonLink: ({ children, value }) => {
        return <Link href={value.href}>
          <a className={`${classes['article-ingredient__btn-link']} btn salmon`}>{children}</a>
        </Link>
      },
      color: ({ children, value}) => {
        return <span style={{'color': value.hex }}>{children}</span>
      },
      link: ({children, value}) => {
        if (!value.href) return <span>{children}</span>
        if (value.href.includes('mailto')) {
          return <a rel="noreferrer noopener" href={value.href} target="_blank">{children}</a>
        }
        return (
          <Link href={value.href}>
            <a>{children}</a>
          </Link>
        )
      }
    },
    types: {
      image: ({value}) => {
        if (value.link) {
          return <div className={classes['article-section__image']}>
            <Link href={value.link}>
              <a>
                <ResponsiveImage sizes="(min-width: 1080px) 50vw, (min-width: 1400px) 40vw, 100vw" src={value.asset.url} alt={value.asset.alt || ''} />
              </a>
            </Link>
            {value.caption && <span className={classes['article-section__image-caption']}>{value.caption}</span>}
          </div>
        }

        return (
          <div className={classes['article-section__image']}>
            {value?.asset &&
              <ResponsiveImage sizes="(min-width: 1080px) 50vw, (min-width: 1400px) 40vw, 100vw" src={value.asset.url} alt={value.asset.alt || ''} />
            }
            {value.caption && <span className={classes['article-section__image-caption']}>{value.caption}</span>}
          </div>
        )
      },
      iconWithTextBlock: ({value}) => {
        const iconUrl = value.icon?.image?.asset?.url
        if (!iconUrl) return <></>
        return (<p className={classes['article-section__cooking-tool']}>
          <span className={classes['article-section__cooking-tool-icon']}><Image src={iconUrl} layout="fill" alt={value.text} /></span>
          <span className={classes['article-section__cooking-tool-text']}>{value.text}</span>
        </p>)
      },
      productBlock: ({value}) => {
        if (!products || products.length < 1) return <></>
        const product = products.find(product => product.content.handle === value.product)
        if (product) return <ArticleProduct product={product} parentClasses={classes} />
        return <></>
      },
      youtubeVideoBlock: ({value}) => <Video youtubeVideoId={value.youtubeVideoId} autoplay={false} startVideo="true" className={classes['article-section__video']} />
    },
    list: {
      bullet: ({children}) => (<ul className={classes['article-ingredients']}>{children}</ul>)
    },
    listItem: {
      bullet: ({children}) => {
        return (
          <li>
            <p>{children}</p>
          </li>
        )
      }
    }
  }

  return (
    <div className={`${classes['article-content']}`}>

      {/* description */}
      <div className={`${classes['article-description']} ${classes['article-section']}`}>
        <PortableText value={description} />
      </div>

      <ArticleSocialSharing seo={fields.seo} />

      <div className={`${classes['article-section__content']}`}>
        <PortableText value={content} components={myPortableTextComponents} />
      </div>

      {/* Rate Recipe */}
      {/* <div className={`${classes['article-rate-recipe']} ${classes['article-section']}`}>
        <div className={classes['article-rate-recipe__card']}>
          <div className={classes['article-rate-recipe__content']}>
            <h4>Rate This Recipe</h4>
            <h6>Requires Account</h6>
            <div className={classes['article-rate-recipe__rating']}>
              <ul>
                {[...Array(5).keys()].map((_, x) => {
                  return <li key={x}><IconStar /></li>
                })}
              </ul>
              <button class="btn salmon">Rate</button>
            </div>
          </div>
        </div>
      </div> */}

    </div>
  )
})

export default RecipeContent