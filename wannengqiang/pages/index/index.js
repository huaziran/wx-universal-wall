//index.js
//获取应用实例
const app = getApp();
const db = wx.cloud.database()
let dianzan = false
let shoucang = false

Page({
  data: {
    dataList:[],
    index:"",
    scindex:"",
    dianzanUrl: "../../assets/dianzan-no.png",
    shoucangUrl: "../../assets/shoucang-no.png",
  },
  //点赞
  dianzantop() {
    this.setData({
      dianzanUrl: dianzan ? "../../assets/dianzan-no.png" : "../../assets/dianzan-yes.png"
     
    })
    dianzan = !dianzan
    if (dianzan) {
      this.setData({
        index:1
      })
    }else{
      index:0
    }
  },
  //收藏
  shoucangtop() {
    this.setData({
      shoucangUrl: shoucang ? "../../assets/shoucang-no.png" : "../../assets/shoucang-yes.png"
    })
    shoucang = !shoucang

  },
  onLoad: function() {
    let that = this
    // 1. 获取数据库引用
    db.collection('yunimg').get({
      success: function(res) {
        console.log("获取数据成功", res)
        that.setData({
          dataList: res.data
          // text: res.data[0].text,
          // imgUrl: res.data[0].name.avatarUrl,
          // nichen: res.data[0].name.nickName
        })
      },
      fail: function(res) {
        console.log("获取数据失败", res)
      }
    })
  },
})