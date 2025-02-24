import Link from 'next/link'
import ResponsiveImage from '@/components/ResponsiveImage'
import IconFacebook from '@/svgs/facebook.svg'
import IconInstagram from '@/svgs/instagram.svg'
import IconPinterest from '@/svgs/pinterest.svg'
import IconTwitter from '@/svgs/twitter.svg'
import IconVimeo from '@/svgs/vimeo.svg'
import IconYoutube from '@/svgs/youtube.svg'
import FooterMenuItems from '../FooterMenuItems'

const logoImgLoader = ({ src }) => {
  return `${src}?w=500`
}

const socialLinkItem = (item, classes) => {
  function getIcon(platform) {
    switch(platform) {
      case 'facebook':
        return <IconFacebook />
      case 'instagram':
        return <IconInstagram />
      case 'pinterest':
        return <IconPinterest />
      case 'twitter':
        return <IconTwitter />
      case 'vimeo':
        return <IconVimeo />
      case 'youtube':
        return <IconYoutube />
      default:
        return ''
    }
  }
  return <li
            key={item._key}
            className={[classes.socialLinkItem, classes[item.platform]].join(' ')}>
              <Link prefetch={false} href={item.socialLink ? item.socialLink : '/'}>
                <a>{getIcon(item.platform)}</a>
              </Link>
          </li>
}

const FooterNavigation = ({props, classes}) => {
  const { footerNavigationList } = props
  const { socialLinks } = props
  const { logo } = props

  return (
    <div className={[classes.footerSection, classes.footerNavigation].join(' ')}>
      <div className={classes.footerLogoAndSocials}>
        <div className={classes.footerLogo}>
          <Link prefetch={false} href="/">
            <a>
              <ResponsiveImage loader={logoImgLoader} src={logo.asset.url} alt={logo.asset.alt || 'Logo'} />
            </a>
          </Link>
        </div>
        <ul className={classes.footerSocials}>
          {socialLinks.map(item => {
            return socialLinkItem(item, classes)
          })}
        </ul>
      </div>
      <ul className={classes.footerNavigationList}>
        {footerNavigationList.map(item => {
          return <FooterMenuItems item={item} classes={classes} key={item._key} />
        })}
      </ul>
    </div>
  )
}

export default FooterNavigation