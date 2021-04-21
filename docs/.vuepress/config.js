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
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
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
        text: 'Products',
        ariaLabel: 'Products Menu',
        items: [
          {
            text: 'Rsyslog',
            link: '/rsyslog/',
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
        ]
      },
      {
        text: 'Support',
        link: 'https://support.0x4447.com/',
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
  ]
}
