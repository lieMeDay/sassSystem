import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
export default new Router({
  mode: 'hash',
  routes: [{
      path: '/',
      name: '登录',
      component: () => import('@/components/logon/login.vue'),
    },
    {
      path: '/register',
      name: '注册',
      component: () => import('@/components/logon/register.vue'),
    },
    {
      path: '/',
      component: () => import('@/components/common/Home.vue'),

      children: [
        // 首页
        {
          path: '/home',
          component: () => import('@/components/home/home.vue'),
          name: '首页',
          meta: {
            title: '首页'
          }
        },
        // 赛事赛项 基本
        {
          path: '/MatchList',
          component: () => import('@/components/match/matchList.vue'),
          name: '赛事列表',
          meta: {
            title: '赛事列表'
          }
        },
        {
          path: '/MatchNotice',
          component: () => import('@/components/component/match/notice'),
          name: '赛事公告',
          meta: {
            title: '赛事公告'
          }
        },
        {
          path: '/MatchAdver',
          component: () => import('@/components/match/adver.vue'),
          name: '商品推荐',
          meta: {
            title: '商品推荐'
          }
        },
        {
          path: '/MatchList/cavcer',
          component: () => import('@/components/match/cavcer.vue'),
          name: '证书模板',
          meta: {
            title: '证书模板'
          }
        }, {
          path: '/MatchList/addMatch',
          component: () => import('@/components/match/addMatch.vue'),
          name: '添加赛事',
          meta: {
            title: '添加赛事'
          }
        }, {
          path: '/MatchList/editMatch',
          component: () => import('@/components/match/editMatch.vue'),
          name: '修改赛事',
          meta: {
            title: '修改赛事'
          }
        }, {
          path: '/MatchList/msg',
          component: () => import('@/components/match/seeMatch.vue'),
          name: '赛事详情',
          meta: {
            title: '赛事详情'
          }
        }, 
        // {
        //   path: '/MatchList/Per',
        //   component: () => import('@/components/match/matchPer.vue'),
        //   name: '参赛选手名单',
        //   meta: {
        //     title: '参赛选手名单'
        //   }
        // },
         {
          path: '/MatchList/res',
          component: () => import('@/components/match/resreview.vue'),
          name: '成绩审核',
          meta: {
            title: '成绩审核'
          }
        },
        // 报名
        {
          path: '/upList',
          component: () => import('@/components/signUp/upList.vue'),
          name: '报名列表',
          meta: {
            title: '报名列表'
          }
        },
        // 报名名单
        {
            path: '/signUpPer',
            component: () => import('@/components/match/matchPer.vue'),
            name: '选手名单',
            meta: {
              title: '选手名单'
            }
          },
        {
          path: '/upList/AddSignUp',
          component: () => import('@/components/signUp/addSignUp.vue'),
          name: '报名发布',
          meta: {
            title: '报名发布'
          }
        },
        {
          path: '/upList/editSignUp',
          component: () => import('@/components/signUp/editSignUp.vue'),
          name: '修改报名',
          meta: {
            title: '修改报名'
          }
        },
        {
          path: '/upList/signUpAll',
          component: () => import('@/components/signUp/signUpAll.vue'),
          name: '查看报名',
          meta: {
            title: '查看报名'
          }
        },
        // 活动中有
        {
          path: '/member',
          component: () => import('@/components/signUp/member.vue'),
          name: '赛事排行',
          meta: {
            title: '赛事排行'
          }
        },
        // 订单管理 活动中购买记录
        {
          path: '/order',
          component: () => import('@/components/order/order.vue'),
          name: '订单列表',
          meta: {
            title: '订单列表'
          }
        },
        /* 活动设置 */
        // 轮播设置
        {
          path: '/banner',
          component: () => import('@/components/Events/banner/bannerList.vue'),
          name: '轮播列表',
          meta: {
            title: '轮播列表'
          }
        },
        {
          path: '/banner/AE',
          component: () => import('@/components/Events/banner/bannerAE.vue'),
          name: '轮播操作',
          meta: {
            title: '轮播操作'
          }
        },
        {
          path: '/banner/see',
          component: () => import('@/components/Events/banner/bannerSee.vue'),
          name: '轮播详情',
          meta: {
            title: '轮播详情'
          }
        },
        // 抽奖活动
        {
          path: '/luckyDraw',
          component: () => import('@/components/Events/LD/LuckyDraw.vue'),
          name: '抽奖活动',
          meta: {
            title: '抽奖活动'
          }
        },
        {
          path: '/luckyDraw/add',
          component: () => import('@/components/Events/LD/ldAdd.vue'),
          name: '抽奖详情',
          meta: {
            title: '抽奖详情'
          }
        },
        {
          path: '/luckyDraw/ldRecord',
          component: () => import('@/components/Events/LD/ldRecord.vue'),
          name: '抽奖记录',
          meta: {
            title: '抽奖记录'
          }
        },
        {
          path: '/luckyDraw/ldper',
          component: () => import('@/components/Events/LD/luckPer.vue'),
          name: '抽奖人员',
          meta: {
            title: '抽奖人员'
          }
        },
        // 短信管理 
        {
          path: '/empowerTemp',
          component: () => import('@/components/shortMsg/empowerTemp.vue'),
          name: '签名/模板',
          meta: {
            title: '签名/模板'
          }
        },
        {
          path: '/recharge',
          component: () => import('@/components/shortMsg/recharge.vue'),
          name: '短信详情',
          meta: {
            title: '短信详情'
          }
        },
        {
          path: '/recharge/shortRecharge',
          component: () => import('@/components/shortMsg/shortRecharge.vue'),
          name: '短信充值',
          meta: {
            title: '短信充值'
          }
        },
        {
          path: '/recharge/pay',
          component: () => import('@/components/shortMsg/reachargePay.vue'),
          name: '充值付款',
          meta: {
            title: '充值付款'
          }
        },
        {
          path: '/recharge/detail',
          component: () => import('@/components/shortMsg/rechargeDetail.vue'),
          name: '充值记录',
          meta: {
            title: '充值记录'
          }
        },
        {
          path: '/sendHis',
          component: () => import('@/components/shortMsg/sendHis.vue'),
          name: '发送记录',
          meta: {
            title: '发送记录'
          }
        },
        // 账户管理
        {
          path: '/account',
          component: () => import('@/components/account/account.vue'),
          name: '账户管理',
          meta: {
            title: '账户管理'
          }
        },
        // 留言管理
        {
          path: '/adMsg',
          component: () => import('@/components/message/message.vue'),
          name: '留言管理',
          meta: {
            title: '留言管理'
          }
        },
        // 路书管理
        {
          path: '/raod',
          component: () => import('@/components/raodBook/raod.vue'),
          name: '路书管理',
          meta: {
            title: '路书管理'
          }
        },
        {
          path: '/raod/eRoad',
          component: () => import('@/components/raodBook/raodE.vue'),
          name: '路书修改',
          meta: {
            title: '路书修改'
          }
        },
        // 用户反馈 feedback
        {
          path: '/feedback',
          component: () => import('@/components/feedback/feedback.vue'),
          name: '用户反馈',
          meta: {
            title: '用户反馈'
          }
        },
        // 邀请规则设置
        // {
        //   path: '/shareRule',
        //   component: () => import('@/components/invitation/invitation_rule.vue'),
        //   name: '邀请设置',
        //   meta: {
        //     title: '邀请设置'
        //   }
        // },
        // 分享邀请统计
        {
          path: '/shareCount',
          component: () => import('@/components/invitation/shareCount.vue'),
          name: '邀请管理',
          meta: {
            title: '邀请管理'
          }
        },
        // 资金明细
        {
          path: '/spend_record',
          component: () => import('@/components/moneyAdmin/spend_record.vue'),
          name: '资金明细',
          meta: {
            title: '资金明细'
          }
        },
        // 提现管理
        {
          path: '/takeM',
          component: () => import('@/components/moneyAdmin/take_money.vue'),
          name: '提现管理',
          meta: {
            title: '提现管理'
          }
        },
        // 订单管理
        {
          path: '/allOrder',
          component: () => import('@/components/moneyAdmin/all_order.vue'),
          name: '订单管理',
          meta: {
            title: '订单管理'
          }
        },
      /* 团报设置 */
        // 团报信息
        // {
        //   path: '/set_group',
        //   component: () => import('@/components/sginGroup/set_group.vue'),
        //   name: '团报信息',
        //   meta: {
        //     title: '团报信息'
        //   }
        // },
        // 团报管理
        {
          path: '/sgin_G_Admin',
          component: () => import('@/components/sginGroup/sgin_G_Admin.vue'),
          name: '团报管理',
          meta: {
            title: '团报管理'
          }
        },
        // 返现设置
        {
          path: '/Cashback',
          component: () => import('@/components/moneyAdmin/Cashback.vue'),
          name: '返现设置',
          meta: {
            title: '返现设置'
          }
        },
        // 报名优惠券
        {
          path: '/sginCou',
          component: () => import('@/components/signUp/sginCou.vue'),
          name: '报名优惠券',
          meta: {
            title: '报名优惠券'
          }
        },
        // 训练计划
        {
          path: '/trainPerson',
          component: () => import('@/components/train/trainPerson.vue'),
          name: '定制人员',
          meta: {
            title: '定制人员'
          }
        },
        {
          path: '/trainPerson/trainPlan',
          component: () => import('@/components/train/trainPlan.vue'),
          name: '训练计划',
          meta: {
            title: '训练计划'
          }
        },
        {
          path: '/trainPerson/trainCon',
          component: () => import('@/components/train/trainCon.vue'),
          name: '训练内容',
          meta: {
            title: '训练内容'
          }
        },
        {
          path: '/setPayPassword',
          component: () => import('@/components/setPayPassword.vue'),
          name: '密码设置',
          meta: {
            title: '密码设置'
          }
        },
      ]
    },
    {
      path: '/404',
      component: resolve => require(['../components/404.vue'], resolve)
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
})
