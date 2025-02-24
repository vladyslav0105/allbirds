import { nacelleClient } from 'services'
import CustomizeYourPlan from '@/components/PurchaseFlow/CustomizeYourPlan'
import { usePurchaseFlowContext } from '@/context/PurchaseFlowContext'
import PageSEO from '@/components/SEO/PageSEO'
import { getNacelleReferences } from '@/utils/getNacelleReferences'
import { getRecentArticlesHandles } from '@/utils/getRecentArticleHandles'

const PurchaseFlow = ({page}) => {
  const purchaseFlowContext = usePurchaseFlowContext()
  if (purchaseFlowContext.options.is_loaded) {
    return (
      <>
        <PageSEO seo={page.seo} />
        <CustomizeYourPlan props={page} />
      </>
    )
  }
  return ''
}

export async function getStaticProps() {
  const page = await nacelleClient.content({
    type: 'purchaseFlow'
  })

  const fullRefPage = await getNacelleReferences(page[0])
  const { fields } = fullRefPage
  const { step2 } = fields

  if (fullRefPage?.fields?.content?.some(content => content._type === 'featuredBlogContent')) {
    await getRecentArticlesHandles(fullRefPage.fields.content)
  }

  return {
    props: {
      page: step2,
      handle: 'purchase-flow'
    }
  }
}


export default PurchaseFlow