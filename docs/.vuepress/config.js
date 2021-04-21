const { description } = require('../../package')

module.exports = {
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: '0x4447 Documentation',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    ['meta', { name: 'msapplication-TileColor', content: '#2b5797' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    [
      'meta',
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    [
      'meta',
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    [
      'meta',
      {
        name: 'msapplication-TileImage',
        content: '/icons/mstile-150x150.png'
      }],
    ['meta', { name: 'msapplication-TileColor', content: '#2b5797' }],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png'
      }],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png'
      }],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    ['link', { rel: 'apple-touch-icon', href: '/icons/apple-touch-icon.png' }],
    [
      'link',
      {
        rel: 'mask-icon',
        href: '/icons/safari-pinned-tab.svg',
        color: '#5bbad5'
      }]
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    repo: '0x4447-office/0x4447_webpage_documentation',
    search: false,
    editLinks: true,
    editLinkText: '',
    lastUpdated: false,
    nav: [
      {
        text: 'Rsyslog',
        link: '/rsyslog/'
      },
      {
        text: 'SFTP',
        link: '/sftp/'
      },
      {
        text: 'VPN',
        link: '/vpn/'
      },
      {
        text: 'Samba',
        link: '/samba/'
      }
    ],
    plugins: {
      "vuepress-plugin-auto-sidebar": {
        titleMap: {
          'samba': 'Samba'
        },
        sort: {
          mode: "asc",
          readmeFirst: true,
        },
        title: {
          mode: "titlecase",
          map: {}
        },
        sidebarDepth: 1,
        collapse: {
          open: false,
          collapseList: [],
          uncollapseList: []
        },
        ignore: []
      }
    }
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
    [
      '@vuepress/pwa',
      {
        serviceWorker: true,
        updatePopup: true
      }
    ]
  ]
}
