// pages/publish/publish.js
const db = wx.cloud.database();
const app = getApp();
let n = ''
let o = ''
let id = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: "",
    fileIDs: [],
    tempFilePaths: []
  },
  //上传图片
  uploadimg: function () {
    let that = this
    console.log("上传图片。。")
    // 让用户选择一张图片
    wx.chooseImage({
      count: n,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],

      success: res => {
        wx.showLoading({
          title: '正在上传...',
        })
        console.log(res)
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        console.log("链接", tempFilePaths)
        this.setData({
          tempFilePaths: tempFilePaths
        })
        wx.hideLoading({
          complete: (res) => {
            title: '完成上传'
          },
        })
      }
    })
  },
  //动态
  bind_text: function (e) {
    // console.log(e);
    this.data.detail = e.detail.value;
    // console.log(e.detail.value);
  },


  //上传图片:墙墙帮发
  qiangqiang: function () {
    var that = this
    wx.showLoading({
      title: '正在发送...',
    })
    const promiseArr = [];
    //只能一张张上传 遍历临时的图片数组
    for (let i = 0; i < this.data.tempFilePaths.length; i++) {

      let filePath = this.data.tempFilePaths[i]
      // console.log("数据1", this.data.tempFilePaths.length)//打印上传图片数
      // console.log("数据2", filePath)                     //打印零时文件地址
      let suffix = /\.[^\.]+$/.exec(filePath)[0]; // 正则表达式，获取文件扩展名
      //在每次上传的时候，就往promiseArr里存一个promise，只有当所有的都返回结果时，才可以继续往下执行
      promiseArr.push(new Promise((reslove, reject) => {
        wx.cloud.uploadFile({
          cloudPath: new Date().getTime() + app.globalData.userInfo.nickName + suffix,
          // cloudPath: app.globalData.userInfo.nickName + suffix + '.png',
          filePath: filePath, // 文件路径
        }).then(res => {
          // get resource ID
          console.log(res.fileID)
          this.setData({
            fileIDs: this.data.fileIDs.concat(res.fileID)
          })
          reslove()
        }).catch(error => {
          console.log(error)
        })
      }))
    }
    Promise.all(promiseArr).then(res => {
      db.collection('yunimg').add({
        data: {
          qiangqiangurl: "../../images/timg.jpg",
          qiangqiangname: "墙墙",
          dianzanshu: 0,
          pinglun: [],
          time: that.getNowFormatDate(),
          userInfo: app.globalData.userInfo,
          text: that.data.detail,
          fileIDs: this.data.fileIDs //只有当所有的图片都上传完毕后，这个值才能被设置，但是上传文件是一个异步的操作，你不知道他们什么时候把fileid返回，所以就得用promise.all
        }
      })
        .then(res => {
          console.log(res)
          wx.hideLoading({
            title: "发送完成"
          })
          //跳转到首页
          wx.reLaunch({
            url: '/pages/index/index'
          })
        })
        .catch(error => {
          console.log(error)
        })
    })
  },
  //个人发送
  bintbtn: function () {
    var that = this
    wx.showLoading({
      title: '正在发送...',
    })
    const promiseArr = [];
    //只能一张张上传 遍历临时的图片数组
    for (let i = 0; i < this.data.tempFilePaths.length; i++) {

      let filePath = this.data.tempFilePaths[i]
      // console.log("数据1", this.data.tempFilePaths.length)//打印上传图片数
      // console.log("数据2", filePath)                     //打印零时文件地址
      let suffix = /\.[^\.]+$/.exec(filePath)[0]; // 正则表达式，获取文件扩展名
      //在每次上传的时候，就往promiseArr里存一个promise，只有当所有的都返回结果时，才可以继续往下执行
      promiseArr.push(new Promise((reslove, reject) => {
        wx.cloud.uploadFile({
          cloudPath: new Date().getTime() + app.globalData.userInfo.nickName + suffix,
          // cloudPath: app.globalData.userInfo.nickName + suffix + '.png',
          filePath: filePath, // 文件路径
        }).then(res => {
          // get resource ID
          console.log(res.fileID)
          this.setData({
            fileIDs: this.data.fileIDs.concat(res.fileID)
          })
          reslove()
        }).catch(error => {
          console.log(error)
        })
      }))
    }
    Promise.all(promiseArr).then(res => {
      db.collection('yunimg').add({
        data: {
          dianzanshu: 0,       
          pinglun: [],
          time: that.getNowFormatDate(),
          userInfo: app.globalData.userInfo,
          text: that.data.detail,
          fileIDs: this.data.fileIDs //只有当所有的图片都上传完毕后，这个值才能被设置，但是上传文件是一个异步的操作，你不知道他们什么时候把fileid返回，所以就得用promise.all
        }
      })
        .then(res => {
          console.log(res)
          wx.hideLoading({
            title: "发送完成"
          })
          //跳转到首页
          wx.reLaunch({
            url: '/pages/index/index'
          })
        })
        .catch(error => {
          console.log(error)
        })
    })


  },
  //预览图片
  PreviewImg: function (e) {
    let index = e.target.dataset.index;
    let that = this;
    // console.log(e)
    // console.log("qw",that.data.tempFilePaths[index]);
    // console.log("as",that.data.tempFilePaths);
    wx.previewImage({
      current: that.data.tempFilePaths[index],
      urls: that.data.tempFilePaths,
    })
  },
  //获取当前时间，返回时间格式：2020-05-22 21:14:22
  getNowFormatDate: function () {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + date.getHours() + seperator2 + date.getMinutes() + seperator2 + date.getSeconds();
    return currentdate;
  },
  //长按删除图片
  DeleteImg: function (e) {
    var that = this;
    var tempFilePaths = that.data.tempFilePaths;
    var index = e.currentTarget.dataset.index; //获取当前长按图片下标
    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      success: function (res) {
        if (res.confirm) {
          //console.log('点击确定了');
          tempFilePaths.splice(index, 1);
        } else if (res.cancel) {
          //console.log('点击取消了');
          return false;
        }
        that.setData({
          tempFilePaths
        });
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("app", app)
    id = app.globalData.openId
    // console.log("id",id)

    // db.collection('userInfo')
    // .where({
    //     _openid : id
    // })
    // .get({
    //   success: function (res) {
    //     console.log("获取用户数据成功", res)
    //     getApp().globalData.userInfo = res.data[0].userInfo;

    //   },
    //   fail: function (res) {
    //     console.log("获取用户数据失败", res)
    //   }
    // })
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
    this.onLoad()
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