import defaultSettings from '@/settings'

const title = defaultSettings.title || '店铺管理中心'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    // ${pageTitle} - ${title}
    return `${pageTitle}`
  }
  return `${title}`
}
