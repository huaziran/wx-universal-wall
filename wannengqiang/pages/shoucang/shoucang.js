// pages/me/me.js

const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 0,
    pageSize: 5,
    totalCount: 0,
    collects: {},
    topics: [],
    flog: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    console.log("收藏数据",that.data.topics)
    that.getData(that.data.page);
  }, 

  onShow: function () {
    let that = this
   
  },
 

  /**
   * 获取列表数据
   * 
   */
  getData: function (page) {
    console.log("pge",page)
    let that = this
    db.collection('collect')
      .where({
        _openid: app.globalData.openId, // 填入当前用户 openid
      })
      .get({
        success: function (res) {
          // res.data 是包含以上定义的两条记录的数组
          console.log("获取信息ID",res)
          that.data.collects = res.data;
          that.getTopicFromCollects();
        },
        fail: function (res) {
          console.log("111", res)
        }

      })

  },
  /**
   * 获取收藏中的 id 的话题
   */
  getTopicFromCollects: function (event) {
    let that = this
    var tempTopics = {};
    // for (var i = 0; i < that.data.collects.length; i++) {
    for (var i in that.data.collects) {
      var topicId = that.data.collects[i].id;
      console.log("444", topicId)
        db.collection('yunimg')
          .doc(topicId)
          .get({
            success: function (res) {
              that.data.topics.push(res.data);
              console.log("qwe",res)
              that.setData({
                topics: that.data.topics,
              })
            },
            fail: function (res) {
              console.log("222", res)
            }
          })
      
    }
  },


 //获取某数据id
 huoquid: function (event) {
  console.log("点击获取", event.currentTarget.dataset.item._id)
  wx.redirectTo({
    url: '/pages/xiangqing/xiangqing?id=' + event.currentTarget.dataset.item._id,
  })
},
    //  下拉刷新
    // onPullDownRefresh: function () {
    //   var that = this;
    //   that.setData({
    //     currentTab: 0 //当前页的一些初始数据，视业务需求而定
    //   })
    //   this.onLoad(); //重新加载onLoad()
    // },
    

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})

