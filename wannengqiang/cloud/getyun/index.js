// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'wang-czevh'
})

// 云函数入口函数
exports.main = async (event, context) => {
  return cloud.database().collection("imagelist").get();
}