import { useState, useEffect } from 'react'
import classes from './ProductSlider.module.scss'
import { useMediaQuery } from 'react-responsive'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Navigation, Thumbs } from "swiper"
import "swiper/css"
import Image from 'next/image'

/*
  Note: need to add timeout/delay to load slider after transition
  from pdp drawer. For some reason, Mounting swiper js immediately
  is breaking css transition, however, unmounting works fine
*/

/*
  Gotchas: ResponsiveImage custom component doesn't work with Swiper.js
  Because all slides need images to have the same aspect ratio
*/

const ProductSlider = ({product, timeout = 0}) => {

  const isDesktop = useMediaQuery(
    { minWidth: 768 }
  )

  const [thumbsSwiper, setThumbsSwiper] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const images = product.content.media

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true)
    }, timeout)
  }, [timeout])

  if (!isLoaded) {
    return ''
  }

  return (
    <div className={classes['product-slider']}>
      <Swiper
        navigation={true}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        className={classes['product-image']}
        autoHeight={true}
        setWrapperSize={true}
      >
        {[...images].slice(0, 5).map((image, index) => {
          return <SwiperSlide key={`${image.id}-${index}`}>
            <div style={{position: 'relative', paddingBottom: '65%'}}>
              <Image className={classes['image']} src={image.src} layout="fill" alt={image.altText} />
            </div>
          </SwiperSlide>
        })}
      </Swiper>
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={isDesktop ? 20 : 10}
        slidesPerView={5}
        watchSlidesProgress={true}
        watchSlidesVisibility={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className={classes['product-image-thumbnails']}
        threshold={2}
      >
        {[...images].slice(0, 5).map((image, index) => {
          return <SwiperSlide key={`${image.id}-${index}`}>
            <div style={{position: 'relative', paddingBottom: '65%'}}>
              <Image className={classes['image']} src={image.src} layout="fill" alt={image.altText} />
            </div>
          </SwiperSlide>
        })}
      </Swiper>
    </div>
  )
}

export default ProductSlider