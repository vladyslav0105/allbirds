import { useSearchBox } from 'react-instantsearch-hooks-web'
import classes from "./CustomSearchBox.module.scss"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Stats from '../Stats'
import IconSearch from '@/svgs/search.svg'

const CustomSearchBox = (props) => {
  const { query, refine } = useSearchBox(props)
  const [searchTerm, setSearchTerm] = useState("")
  const {currentIndex, setCurrentIndex} = props

  const router = useRouter()

  useEffect(() => {
    let query

    if(!router.query.index) {
      if(router.asPath.split('=').length > 1) {
        query = router.asPath.split('=')[1]
        const decoded = decodeURI(query)
        setSearchTerm(decoded)
      } else {
        query = searchTerm
      }
      
      refine(query)
    } else {
      query = router.asPath.split('=')[1].split('&')[0]
      const decoded = decodeURI(query)
      setSearchTerm(decoded)
      refine(query)
    }
  }, [])

  const handleChange = (e) => {
    setSearchTerm(e.target.value)
    refine(e.target.value)
   
    if(router.asPath === 'pages/search' || router.asPath.includes("?query")) {
      router.replace({
        pathname: '/pages/search',
        query: { 
          query: searchTerm,
          index: currentIndex
        }
      },
      undefined, { shallow: true }
      )
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && router.asPath !== '/pages/search') {
     router.push(`/pages/search?query=${searchTerm}`)
    }
  }

  let refinedSearchTerm
  if(searchTerm.includes('&index')) {
    refinedSearchTerm = searchTerm.replaceAll("&index", '').replaceAll(/[^\w\s]/gi, ' ')
    refinedSearchTerm = decodeURI(refinedSearchTerm)
  } else {
    refinedSearchTerm = searchTerm.replaceAll(/[^\w\s]/gi, ' ')
    refinedSearchTerm = decodeURI(refinedSearchTerm)
  }

  return (
    <div className={classes['searchbox-wrap']}>
      {/* {query && <Stats />} */}
      <div className={classes['searchbox']}>
        <IconSearch />
        <input 
          className="h6" 
          type="text" 
          autoFocus 
          placeholder="Search the site..."
          onKeyDown={(e) => handleKeyDown(e)} 
          onChange={(e) => handleChange(e)} 
          value={refinedSearchTerm}
        />
      </div>
    </div>
  )
}

export default CustomSearchBox