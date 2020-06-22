const app = getApp()
const db = wx.cloud.database();
let id = ''
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    // isshouquan:true
  },
  onLoad: function () {
    let that = this
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          //用户已经授权过
          // that.setData({
          //   isshouquan:false
          // })
          wx.showModal({
            title: '提示',
            content: "登录成功",
                     showCancel: false,
            complete() {
              db.collection('userInfo')
                .where({
                  _openid: id
                })
                .get({
                  success: function (res) {
                    console.log("获取用户数据成功", res)
                    getApp().globalData.userInfo = res.data[0].userInfo;
                    if (app) {
                      wx.switchTab({
                        url: '/pages/index/index'
                      })
                    } else {
                      wx.hideToast({
                        title: '加载中'
                      })
                    }
                  },
                  fail: function (res) {
                    console.log("获取用户数据失败", res)
                  }
                })
            }
          })
        }
      }
    })

    wx.cloud.callFunction({
      name: 'add',
      success(res) {
        console.log("获取云数据id成功", res)
        getApp().globalData.openId = res.result.openid
        id = res.result.openid
      },
      fail(res) {
        console.log("获取数据失败", res)
      }

    })

    setTimeout(function () {
      wx.hideLoading()
    }, 1000)
  },


  bindGetUserInfo: function (e) {
    console.log(e);
    if (e.detail.userInfo) {

      db.collection('userInfo').add({
        data: {
          userInfo: e.detail.userInfo
        }
      })
        .then(res => {
          console.log("上传个人信息成功", res)
        })
        .catch(res => {
          console.log("上传个人信息失败", res)
        })

   

      wx.showModal({
        title: '提示',
        content: "登录成功",
        showCancel: false,

        complete() {
          db.collection('userInfo')
            .where({
              _openid: id
            })
            .get({
              success: function (res) {
                console.log("获取用户数据成功", res)
                getApp().globalData.userInfo = res.data[0].userInfo;
                if (app) {
                  wx.switchTab({
                    url: '/pages/index/index'
                  })
                } else {
                  wx.hideToast({
                    title: '加载中'
                  })
                }
              },
              fail: function (res) {
                console.log("获取用户数据失败", res)
              }
            })

        }

      })

    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }

  },

  onShow: function () {
    //  this.queryUsreInfo()
    this.onLoad()
  },


})