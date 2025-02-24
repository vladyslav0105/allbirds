import React, { useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import classes from './AccountMainPage.module.scss'
import AccountHeader from '@/components/Account/AccountHeader'
import Tabs from '@/components/Tabs/Tabs'
import ReferralsPage from '@/components/Account/Referrals/Referrals'
import AccountDetailsPage from '@/components/Account/AccountDetails/AccountDetails'
import OrderHistoryPage from '@/components/Account/OrderHistory/OrderHistory'
import SubscriptionsPage from '@/components/Account/Subscriptions/Subscriptions'
import CardsContainer from '@/components/Account/CardsContainer/CardsContainer'
import { useMemberAccountContext } from '@/context/MemberAccountContext'
import { useCustomerContext } from '@/context/CustomerContext'

const AccountMainPage = () => {
  const router = useRouter();
  const customerContext = useCustomerContext();
  const MemberAccountContext = useMemberAccountContext();

  const { tab } = router.query

  const getTabKey = (tabValue) =>
    Object.keys(tabs).find((key) => tabs[key] === tabValue)

  const tabs = useMemo(
    () => ({
      subscriptions: 'Your Subscriptions',
      'account-details': 'Account Details',
      'order-history': 'Order History',
      referrals: 'Refer a Friend',
    }),
    [],
  )
  const [selectedTab, setSelectedTab] = useState(tab)

  const onTabSelected = (tab) => {
    const tabKey = getTabKey(tab)
    setSelectedTab(tabKey)

    router.push(
      {
        pathname: `/account/${tabKey}`,
      },
      undefined,
      { shallow: true },
    )
  }

  const renderBody = (pickedTab) => {
    switch(pickedTab) {
      case 'subscriptions':
        console.log('MemberAccountContext: ', MemberAccountContext);
        return (<SubscriptionsPage subsData={MemberAccountContext.subsData} membershipData={MemberAccountContext.membershipData}/>);
      case 'account-details':
        return (<AccountDetailsPage subscriptions={MemberAccountContext.subsData} membershipData={MemberAccountContext.membershipData} customer={customerContext.customer}/>)
      case 'order-history':
        return (<OrderHistoryPage/>)
      case 'referrals':
        return (<ReferralsPage customer={customerContext.customer} />)
    }
  }

  return (
    <div className={`${classes['main']}`}>
      {!MemberAccountContext.reloadingData && MemberAccountContext.subsData !== null && MemberAccountContext.membershipData !== null ? (
        <div>
          <AccountHeader
            firstName={customerContext.customer?.firstName}
          ></AccountHeader>
          <div className={classes['tabs-container']}>
            <Tabs
              tabs={Object.values(tabs)}
              selected={tabs[selectedTab]}
              onSelected={onTabSelected}
              onSignOut={() => {
                customerContext.logout().then(
                  router.push('/')
                );
              }}
            ></Tabs>
          </div>
          {/* Cards */}
          {
            MemberAccountContext.subsData.length > 0 ? ( // all cards are specific to members who have subscription
              <div className={classes['cards']}>
                <CardsContainer subscriptions={MemberAccountContext.subsData}></CardsContainer>
              </div>
            ) : undefined
          }
          {/* Body Content */}
          <div>{renderBody(tab)}</div>
        </div>
      ) : (
        <h4 className={classes['loading']}>Loading your information</h4>
      )}
    </div>
  )
}

export default AccountMainPage
