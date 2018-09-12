//index.js
//获取应用实例
const app = getApp()
var site = app.globalData.site;
var comm = require("../../common/utils.js");
var http = require("../../common/http.js");

Page({
  data: {
    noData: false,
    isLoadData: false,//是否正在加载数据
    noMore: false, //没有更多数据了
    pageNum: 1,//默认获取资讯第几页
    pageSize: 10,//每页多少条
    //动态列表
    list: [

    ],
  
  },

  onLoad: function () {
    this.getNews() //获取资讯列表
  },
  onShow: function () {

  },
  //分享
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
    }
    return {
      title: '推荐一款公益诉讼资讯小程序，拿走不谢！',
      path: '/pages/index/index',
      imageUrl: '/images/index/forward-img.jpg'
    }
  },
  // 下拉
  onPullDownRefresh: function () {
    var _this = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    _this.setData({
      pageNum: 1,
      pageSize: 10
    })
    setTimeout(() => {
      _this.getNews()
    }, 1000)
  },

  //上拉加载更多资讯
  onReachBottom: function (e) {
    var _this = this;
    //加载更多收起检查入口
    if (this.data.isLoadData) return;
    _this.getMoreNews()

  },

  //获取资讯
  getNews: function () {
    var _this = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: site + '/api/News/GetNews',
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      data: {
        keyword: '',
        p: _this.data.pageNum,
        ps: _this.data.pageSize
      },
      success: function (res) {
        if (res.data.code == 0) {
          for (let i in res.data.data.data) {
            res.data.data.data[i].FBSJ = res.data.data.data[i].FBSJ.split('T')[0]
          }
          if (res.data.data.data.length == 0) {
            _this.setData({
              noData: true
            })
          } else {
            _this.setData({
              list: res.data.data.data
            })
          }
        } else {
          _this.setData({
            noData: true
          })
        }

      },
      fail: function () {

      },
      complete: function () {
        wx.hideLoading()
        wx.stopPullDownRefresh()
      }
    })
  },
  //获取更多资讯

  getMoreNews: function () {
    var _this = this;
    var pageNum = _this.data.pageNum + 1;
    _this.setData({
      isLoadData: true
    })
    wx.request({
      url: site + '/api/News/GetNews',
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      data: {
        keyword: '',
        p: pageNum,
        ps: _this.data.pageSize
      },
      success: function (res) {
        if (res.data.code == 0) {
          for (let i in res.data.data.data) {
            res.data.data.data[i].FBSJ = res.data.data.data[i].FBSJ.split('T')[0]
          }
          if (res.data.data.data.length == 0) {
            setTimeout(() => {
              _this.setData({
                noMore: true,
              })
            }, 1000)
            setTimeout(() => {
              _this.setData({
                noMore: false,
              })
            }, 2000)
          } else {
            setTimeout(() => {
              _this.setData({
                isLoadData: false,
                pageNum: pageNum,
                list: _this.data.list.concat(res.data.data.data)
              })
            }, 1000)

          }

        } else {
          setTimeout(() => {
            _this.setData({
              noMore: true,
            })
          }, 1000)
          setTimeout(() => {
            _this.setData({
              noMore: false,
            })
          }, 2000)
        }
      },
      fail: function () {

      },
      complete: function () {
        setTimeout(() => {
          _this.setData({
            isLoadData: false
          })
        }, 1000)

      }
    })
  },
  //资讯详情页跳转
  newDetails: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/newDetails/newDetails?id=' + id,
      success: function (res) {
      },
      fail: function () {
      },
      complete: function () {
      }
    })
  },

})
