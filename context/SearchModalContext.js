import { createContext, useContext, useState, useEffect } from 'react'
import SearchModal from '@/components/Layout/SearchModal'
import Router, { useRouter } from 'next/router'

const SearchModalContext = createContext()

export function useSearchModalContext() {
  return useContext(SearchModalContext)
}

export function SearchProvider({ children }) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [content, setContent] = useState('')
  const [modalType, setModalType] = useState(null)
  const router = useRouter()

  useEffect(() => {
    if (searchOpen) document.querySelector('html').classList.add('disable-scroll')
    if (!searchOpen) document.querySelector('html').classList.remove('disable-scroll')

  }, [searchOpen, content])

  useEffect(() => {
    const onRountChangeComplete = () => {
      if(router.pathname !== '/products/[handle]' || router.pathname !== '/blogs/brand/[category]/[handle]' || router.pathname !== '/blogs/culinary/[category]/[handle]' || router.pathname !== '/blogs/culinary/culinary-contest/[handle]') {
        setsearchOpen(false)
      }
     
      if(router.pathname === '/products/[handle]' && prevContent && !productCustomerTag) {
        setsearchOpen(true)
      }

      if(router.pathname === '/blogs/brand/[category]/[handle]' && prevContent && !articleCustomerTag) {
        setsearchOpen(true)
      }

      if(router.pathname === '/blogs/culinary/[category]/[handle]' && prevContent && !articleCustomerTag) {
        setsearchOpen(true)
      }

      if(router.pathname === '/blogs/culinary/culinary-contest/[handle]' && prevContent && !articleCustomerTag) {
        setsearchOpen(true)
      }
    }
    Router.events.on('routeChangeComplete', onRountChangeComplete)
  }, [router.pathname])

  return (
    <SearchModalContext.Provider value={{ searchOpen, setSearchOpen, content, setContent, modalType, setModalType }}>
      {searchOpen &&
        <SearchModal children={content} />
      }
      {children}
    </SearchModalContext.Provider>
  )
}