module.exports = {
  pages: ['pages/notes/index', 'pages/me/index'],
  window: {
    navigationBarTitleText: "Innei's 日记本",
    navigationBarBackgroundColor: '#282c34',
  },
  tabBar: {
    color: '#999',
    selectedColor: '#333',
    background: '#fff',
    // custom: true,
    list: [
      {
        text: '日记',
        pagePath: 'pages/notes/index',
        iconPath: '/images/note.png',
        selectedIconPath: '/images/note.png',
      },
      {
        text: '我',
        pagePath: 'pages/me/index',
        iconPath: '/images/me.png',
        selectedIconPath: '/images/me.png',
      },
    ],
    usingComponents: {},
  },
  useExtendedLib: {
    weui: true,
  },
}
