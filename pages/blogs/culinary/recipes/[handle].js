import ArticleHero from '@/components/Article/ArticleHero'
import ArticleNav from '@/components/Article/ArticleNav'
import ArticleMain from '@/components/Article/ArticleMain'
import { nacelleClient } from 'services'
import { GET_PRODUCTS } from '@/gql/index.js'

const RecipeArticle = ({ page, product }) => {

  console.log("page:", page)
  console.log("product:", product)

  const { hero } = page.fields
  const { content } = page.fields

  return (
    <>
      <ArticleHero fields={hero}  />
      <ArticleNav fields={content} />
      <ArticleMain fields={content} product={product} />
    </>
  )
}

export default RecipeArticle

export async function getStaticPaths() {
  const recipeArticles = await nacelleClient.content({
    type: 'recipeArticle'
  })

  const handles = recipeArticles.map((article) => ({ params: { handle: article.handle } }))

  return {
    paths: handles,
    fallback: 'blocking'
  }
}

export async function getStaticProps({ params }) {

  const pages = await nacelleClient.content({
    handles: [params.handle],
    type: 'recipeArticle'
  })

  if (!pages.length) {
    return {
      notFound: true
    }
  }

  const page = pages[0]

  const props = {
    page,
    product: null
  }

  if (page.fields?.content?.addToCartProduct) {
    const handle = page.fields.content.addToCartProduct
    let { products } = await nacelleClient.query({
      query: GET_PRODUCTS,
      variables: {
        "filter": {
          "handles": [handle]
        }
      }
    })
    if (products) {
      props.product = products[0]
    }
  }

  return {
    props
  }
}
