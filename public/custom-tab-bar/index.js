Page({
  data: {
    list: [
      {
        text: '日记',
        pagePath: '/pages/notes/index',
        iconPath: '/images/note.png',
        selectedIconPath: '/images/note.png',
      },
      {
        text: '我',
        pagePath: '/pages/me/index',
        iconPath: '/images/me.png',
        selectedIconPath: '/images/me.png',
      },
    ],
  },
  tabChange(e) {
    const index = e.detail.index
    switch (index) {
      case 0:
        wx.switchTab({ url: '/pages/notes/index' })
        break
      case 1:
        wx.switchTab({ url: '/pages/me/index' })
        break
      default:
        break
    }
    console.log('tab change', e)
  },
})
