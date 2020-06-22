//index.js
//获取应用实例
const app = getApp();
const db = wx.cloud.database()
let totolnum = -1
Page({
  data: {
    dataList: [],
    openid: '',
    index: "",
    scindex: "",
  },

  //获取动态信息
  getdata: function () {
    let length = this.data.dataList.length;
    let that = this;
    // console.log("数据长度", length)
    if (totolnum == length) {
      wx.showToast({
        title: '完成加载',
      })
      return
    }
    wx.showLoading({
      title: '加载中...',
    })
    // 1. 获取数据库树洞引用
    db.collection('yunimg')
      .skip(length)
      .limit(10)
      .get({
        success: function (res) {
          console.log("获取数据成功", res)
          that.setData({
            dataList: that.data.dataList.concat(res.data).reverse(),
         
          })
          length = ''
          wx.hideLoading({
            title: '加载完成'
          })
        },
        fail: function (res) {
          console.log("获取数据失败", res)
          wx.hideLoading()
          wx.showToast({
            title: '加载失败'
          })
        }
      })
  },
  onLoad: function () {
    console.log("app打印", app)
    //获取页面显示数据长度
    db.collection('yunimg').count()
      .then(res => {
        // console.log("数据总数", res)
        totolnum = res.total
      })
    this.getdata()
  },
  //自动更新页面
  onShow: function () {
    this.getdata()
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    let that = this
    wx.showNavigationBarLoading() //在标题栏中显示加载
    //模拟加载
    setTimeout(function () {
      that.onShow()
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },

  // onPullDownRefresh: function () {
  //   var that = this;
  //   that.setData({
  //     currentTab: 0 //当前页的一些初始数据，视业务需求而定
  //   })
  //   this.onLoad(); //重新加载onLoad()
  // },

  //获取某数据id
  huoquid: function (event) {
    console.log("点击获取", event.currentTarget.dataset.item._id)
    wx.reLaunch({
      url: '/pages/xiangqing/xiangqing?id=' + event.currentTarget.dataset.item._id,
    })
  },
  onReachBottom: function () {
    // console.log("分页成功")
    this.getdata()
  }
})