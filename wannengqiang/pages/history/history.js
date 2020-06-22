// pages/history/history.js
const app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datayun: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.getHistory()
  },
  //获取我的历史记录
  getHistory: function () {
    let that = this
    // 查询我发表的信息
    db.collection("yunimg")
      .where({
        _openid: app.globalData.openId
      })
      .get({
        success(res) {
          console.log("查询数据成功", res)
          that.setData({
            datayun: res.data
          })
        },
        fail() {
          console.log("查询数据成功", res)
        }
      })
  },
  shuanchu: function (event) {
 let that= this 
    // console.log("点击获取", event.currentTarget.dataset.item._id)
    let shuanchuid = event.currentTarget.dataset.item._id
    // console.log("id",shuanchuid)
    db.collection("yunimg").doc(shuanchuid).remove({
      success: function (res) {
        console.log("删除成功", res)
        that.onLoad()
      },
      fail: function (res) {
        console.log("删除失败", res)
      }
    })
  },
  //获取某数据id并跳转
  huoquid: function (event) {
    console.log("点击获取", event.currentTarget.dataset.item._id)
    this.setData({
      shuanchuid: event.currentTarget.dataset.item._id
    })
    wx.redirectTo({
      url: '/pages/xiangqing/xiangqing?id=' + event.currentTarget.dataset.item._id,
    })
  },
  // 下拉刷新
  
  onPullDownRefresh: function () {
    let that = this
    wx.showNavigationBarLoading() //在标题栏中显示加载
    //模拟加载
    setTimeout(function () {
      that.onLoad()
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})