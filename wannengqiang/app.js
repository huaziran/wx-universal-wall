//app.js
App({
  onLaunch: function () {
    wx.cloud.init({
      traceUser:true,
      env: 'wang-czevh'
    })
   
  },
  globalData: {
    user:{},//后代返回用户全部信息
    userInfo: {},//获取微信用户信息
  }
})