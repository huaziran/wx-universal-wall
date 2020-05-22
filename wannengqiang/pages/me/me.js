// pages/me/me.js
const app = getApp();
const db = wx.cloud.database();
let id =""
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datayun:[]
  },
  //查询数据
  getshuju(){
    db.collection("imagelist").get({
      success(res){
        console.log("查询数据成功",res)
      },
      fail(){
        console.log("查询数据成功", res)
      }
    })
  },
  //删除数据
  shan(){
    db.collection("imagelist").doc(id).remove({
      success(res) {
        console.log("删除数据成功", res)
      },
      fail() {
        console.log("删除数据成功", res)
      }
    })
  },
  dslinput:function(e){
     console.log(e.detail.value)
    id = e.detail.value
  },
  //获取云函数数据
  yunhanshu:function(){
    let that = this
   wx.cloud.callFunction({
     name:"getyun",
     success(res) {
       console.log("获取云函数数据成功", res)
       that.setData({
         datayun1:res.result.data
       })
     },
     fail() {
       console.log("获取云函数数据成功", res)
     }
   })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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