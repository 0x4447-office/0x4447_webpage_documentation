const { description } = require('../../package')

module.exports = {
    /**
     * Ref：https://v1.vuepress.vuejs.org/config/#title
     */
    title: 'documentation for',
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
        logo: '/images/logo.png',
        search: false,
        docsRepo: '0x4447-office/0x4447_webpage_documentation',
        docsDir: 'docs',
        editLinks: true,
        editLinkText: 'Edit on GitHub',
        nav: [
            {
                text: 'Products',
                items: [
                    {
                        text: 'Rsyslog',
                        image: '/images/products/rsyslog.png',
                        items: [
                            {
                                text: '1.3.x',
                                link: '/rsyslog/1.3.x/'
                            }
                        ]
                    },
                    {
                        text: 'SFTP',
                        image: '/images/products/sftp.png',
                        items: [
                            {
                                text: '1.0.x',
                                link: '/sftp/1.0.x/'
                            }
                        ]
                    },
                    {
                        text: 'VPN',
                        image: '/images/products/vpn.png',
                        items: [
                            {
                                text: '1.2.x',
                                link: '/vpn/1.2.x/'
                            }
                        ]
                    },
                    {
                        text: 'Samba',
                        image: '/images/products/samba.png',
                        items: [
                            {
                                text: '1.2.x',
                                link: '/samba/1.2.x/'
                            }
                        ]
                    }
                ]
            },
            {
                text: 'Support',
                link: 'https://support.0x4447.com/'
            },
            {
                text: 'Feedback',
                link: 'https://feedback.0x4447.com/'
            }
        ],
        sidebar: 'auto'
    },

    markdown: {
        lineNumbers: true
    },

    /**
     * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
     */
    plugins: [
        '@vuepress/plugin-back-to-top',
        '@vuepress/plugin-medium-zoom',
        '@vuepress/active-header-links',
        'vuepress-plugin-smooth-scroll',
        ['vuepress-plugin-code-copy', {
            align: 'top'
        }],
        [
            '@vuepress/pwa',
            {
                serviceWorker: true,
                updatePopup: true
            }
        ]
    ]
}
