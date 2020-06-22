// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {

  if (event.action == "dianzan") {
    return await cloud.database().collection("yunimg").doc(event._id)
      .update({
        data: {
          dianzanshu: event.dianzanshuzhi
        }
      })
      .then(res => {
        console.log("修改点赞成功", res)
        return res
      })
      .catch(res => {
        console.log("修改点赞失败", res)
        return res
      })
  } else if (event.action == "fabiao") {
    return await cloud.database().collection("yunimg").doc(event.id)
      .update({
        data: {
          pinglun: event.pinglun
        }
      })
      .then(res => {
        console.log("修改评论成功", res)
        return res
      })
      .catch(res => {
        console.log("修改评论失败", res)
        return res
      })
  } else {
    return await cloud.database().collection("yunimg").doc(event.id)
      .update({
        data: {
          shoucang: event.shoucang,
          ifshoucang:event.ifshoucang
        }
      })
      .then(res => {
        console.log("修改收藏成功", res)
        return res
      })
      .catch(res => {
        console.log("修改收藏失败", res)
        return res
      })
  }
}