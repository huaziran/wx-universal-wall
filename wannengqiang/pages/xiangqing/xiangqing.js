
//index.js
//获取应用实例
const db = wx.cloud.database();
const app = getApp();
let ID = '';
let isdianzan = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topic: {},
    id: '',
    openid: '',
    isLike: false,
    isLikedianzan: false,
    dianzanshu: 0,
    dataList2: [],
    content: '',
    pinglun1: [],
    imag:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    let that = this;
    ID = e.id
    console.log("详情接受id", ID)
    db.collection('yunimg')
      .doc(ID)
      .get({
        success: function (res) {
          console.log("详情页获取数据成功", res)
          that.setData({
            pinglun1: res.data.pinglun.reverse(),
            dataList2: res.data,
            imag:res.data.fileIDs,
            dianzanshu: res.data.dianzanshu
          })
        },
        fail: function (res) {
          console.log("详情页获取数据失败", res)
        }
      })
    // 获取收藏情况
    db.collection('collect')
      .where({
        _openid: app.globalData.openId,
        id: ID
      })
      .get({
        success: function (res) {
          console.log("详情页收藏数据成功", res)
              
          if (res.data.length > 0) {
            that.refreshLikeIcon(true)
          } else {
            that.refreshLikeIcon(false)
          }
        },
        fail: function (res) {
          console.log("详情页收藏数据失败", res)
        }
      })
    //获取点赞情况
    db.collection('dianzan')
      .where({
        _openid: app.globalData.openId,
        id: ID
      })
      .get({
        success: function (res) {
          console.log("获取点赞情况成功", res)
          if (res.data.length > 0) {
            that.dianzantop(true)
          } else {
            that.dianzantop(false)
          }
        },
        fail: function (res) {
          console.log("获取点赞情况失败", res)
        }
      })
  },

  onShow: function () {
     

  },
      // //  下拉刷新
      // onPullDownRefresh: function () {
      //   var that = this;
      //   that.setData({
      //     currentTab: 0 //当前页的一些初始数据，视业务需求而定
      //   })
      //   this.onLoad(e); //重新加载onLoad()
      // },
  
  
  /**
   * 刷新点赞
   * @param {*} isLike 
   */
  dianzantop: function (isLikedianzan) {
    isdianzan = isLikedianzan
    console.log("点赞值", isdianzan)
    let that = this
    that.setData({
      isLikedianzan: isdianzan,
    })
  },
  // 喜欢点赞点击
  onLikeDianzan: function (event) {
    let that = this;
    console.log("判断点赞值",that.data.isLikedianzan);
    if (that.data.isLikedianzan) {
      // 需要判断是否存在
      that.removeFromDianzanServer();
    } else {
      that.saveToDianzanServer();
    }
    //改变点赞数值
    let dianzanshuzhi = this.data.dianzanshu
    let isLikedianzan = that.data.isLikedianzan
    isdianzan = !isdianzan

    if (!isdianzan) {
      this.setData({
        dianzanshu: --dianzanshuzhi
      })
    }
    else {
      this.setData({
        dianzanshu: ++dianzanshuzhi
      })
    }
       console.log("点赞id",ID)
      // 添加点赞数到数据库
    wx.cloud.callFunction({
      name: "dzscpl",
      data: {
        action: "dianzan",
        _id: ID,
        dianzanshuzhi:that.data.dianzanshu
      }
    })
      .then(res => {
        console.log("修改点赞成功", res)
      })
      .catch(res => {
        console.log("修改点赞失败", res)
      })

  },

  // 添加到点赞集合中

  saveToDianzanServer: function (event) {
    let that = this;
    db.collection('dianzan').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        id: ID,
        date: new Date(),
      },
      success: function (res) {
        that.dianzantop(true)
        console.log(res)
      },
      fail: function (res) {
        console.log("添加到收点赞合中失败", res)
      }
    })
  },
  /**
   * 从收点赞合中移除
   */
  removeFromDianzanServer: function (event) {
    let that = this;
    db.collection('dianzan')
    .where({ 
      _openid:app.globalData.openId,
      id:ID
    })
    .remove({
      success: function () {
        that.dianzantop(false)
      },
      fail: function (res) {
        console.log("从收点赞合中移除失败", res)
      }

    })
  },

  /**
   * 收藏
   * @param {} isLike 
   */
  // 刷新收藏icon
  refreshLikeIcon(isLike) {
    let that = this;
   console.log("收藏值",isLike)
    that.setData({
      isLike: isLike,
    })
  },

  // 喜欢点击
  onLikeClick: function (event) {
    let that = this;
    console.log("判断收藏值",that.data.isLike);
    if (that.data.isLike) {
      // 需要判断是否存在
      that.removeFromCollectServer();
    } else {
      that.saveToCollectServer();
    }
  },

  // 添加到收藏集合中

  saveToCollectServer: function (event) {
    let that = this;
    db.collection('collect').add({
      // data 字段表示需新增的 JSON 数据
      data: { 
        id: ID,
        date: new Date(),
      },
      success: function (res) {
        console.log("添加到收藏集合成功", res)
        that.refreshLikeIcon(true)
        console.log(res)
      },
      fail: function (res) {
        console.log("添加到收藏集合失败", res)
      }
    })
  },
  /**
   * 从收藏集合中移除
   */
  removeFromCollectServer: function (event) {
    let that = this;
    db.collection('collect')
    .where({ 
      _openid:app.globalData.openId,
      id:ID
    })
    .remove({

      success: function (res) {
        that.refreshLikeIcon(false)
      },
      fail: function (res) {
        console.log("从收藏集合中移除失败", res)
      }
    })
  },


  /**
   * //评论
   * @param {*} e 
   */
  pinglunInput: function (e) {
    // console.log("pinglun", e.detail.value)
    this.data.content = e.detail.value
  },
  //发表
  fabiao: function () {

    let content = this.data.content
    if (content.length < 1) {
      wx.showToast({
        icon: "none",
        title: "评论不能为空"
      })
      return
    }
    let pinglunitem = {}
    pinglunitem.name = app.globalData.userInfo.nickName
    pinglunitem.content = content
    let pinglun = this.data.pinglun1
    pinglun.push(pinglunitem)
    console.log("新加评论", pinglun)
    wx.showLoading({
      title: '正在发表',
    })
    wx.cloud.callFunction({
      name: "dzscpl",
      data: {
        action: "fabiao",
        id: ID,
        pinglun: pinglun,
      }
    })
      .then(res => {
        console.log("评论成功", res)
        this.setData({
          pinglun1: pinglun.reverse(),
          content: ''
        })
        wx.hideLoading({
          title: "完成"
        })
      })
      .catch(res => {
        console.log("评论失败", res)
      })
  },



  /**
   * 预览图片
   * @param {*} e 
   */
  previewImg: function (e) {
    console.log(e) 
    var that = this
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    var src = e.target.dataset.src
    var img = that.data.imag
    wx.previewImage({
      //当前显示图片
      current: src,
      //所有图片
      urls:img
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onUnload:function(){
    wx.switchTab({
      url: '/pages/index/index'
    })
  }
})















