<template>
  <div class="sidebar">
    <!-- :collapse="collapse" -->
    <el-menu
      class="sidebar-el-menu"
      :default-active="this.$route.path.substr(1).split('/')[0]"
      background-color="#324157"
      text-color="#bfcbd9"
      active-text-color="#20a0ff"
      :unique-opened="true"
    >
      <template v-for="item in items">
        <template v-if="item.subs">
          <!-- <template>
          </template>-->
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="item.icon" v-if="item.icon"></i>
              <i class="xicon" v-else :style="{backgroundImage:'url('+item.xicon+')'}"></i>
              <span slot="title">{{item.title }}</span>
            </template>

            <template v-for="(subItem,ind) in item.subs">
              <template v-if="subItem.subs">
                <el-submenu :index="subItem.index" :key="subItem.index">
                  <template slot="title">{{subItem.title}}</template>
                  <el-menu-item
                    v-for="(ss,i) in subItem.subs"
                    :key="i"
                    :index="ss.index"
                    @click="goPage(ss.index)"
                  >{{ ss.title }}</el-menu-item>
                </el-submenu>
              </template>
              <template v-else>
                <el-menu-item
                  :key="ind"
                  :index="subItem.index"
                  @click="goPage(subItem.index)"
                >{{ subItem.title }}</el-menu-item>
              </template>
            </template>
            <!-- <template>
              <el-menu-item
                v-for="(subItem,i) in item.subs"
                :key="i"
                :index="subItem.index"
                @click="goPage(subItem.index)"
              >{{ subItem.title }}</el-menu-item>
            </template>-->
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index" @click="goPage(item.path)">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import bus from "../common/bus";
var iconU = "../../../static/images/icon";
export default {
  data() {
    return {
      collapse: true,
    };
  },
  computed: {
    onRoutes() {
      return this.$route.path.substr(1).split("/")[0];
    },
  },
  methods: {
    goPage(v) {
      // console.log(v)
      this.$router.push("/" + v);
    },
  },
  created() {
    if (this.$newActive) {
      this.items = [
        // {
        //   icon: "el-icon-office-building",
        //   index: "1",
        //   title: "首页",
        //   subs: [
        //     {
        //       index: 'home',
        //       title: "智能看板"
        //     }
        //   ]
        // },
        {
          xicon: iconU + "/a1.png",
          index: "2",
          title: "赛事管理",
          subs: [
            {
              index: "MatchList",
              title: "赛事列表",
            },
            {
              index: "MatchNotice",
              title: "赛事公告",
            },
            {
              index: "MatchAdver",
              title: "商品推荐",
            },
          ],
        },
        {
          xicon: iconU + "/a2.png",
          index: "3",
          title: "报名管理",
          subs: [
            {
              index: "upList",
              title: "赛事报名",
            },
            {
              index: "member",
              title: "赛事排行",
            },
          ],
        },
        {
          xicon: iconU + "/a5.png",
          index: "4",
          title: "订单管理",
          subs: [
            {
              index: "order",
              title: "订单列表",
            },
          ],
        },
        {
          xicon: iconU + "/a3.png",
          index: "5",
          title: "活动管理",
          subs: [
            {
              index: "banner",
              title: "轮播列表",
            },
            // {
            //   index: "luckyDraw",
            //   title: "抽奖活动",
            // },
          ],
        },
        {
          xicon: iconU + "/a9.png",
          index: "6",
          title: "用户反馈",
          subs: [
            {
              index: "feedback",
              title: "用户反馈",
            },
          ],
        },
        {
          xicon: iconU + "/a6.png",
          index: "7",
          title: "留言管理",
          subs: [
            {
              index: "adMsg",
              title: "留言管理",
            },
          ],
        },
      ];
    } else {
      this.items = [
        // {
        //   icon: "el-icon-office-building",
        //   index: "1",
        //   title: "首页",
        //   subs: [
        //     {
        //       index: 'home',
        //       title: "智能看板"
        //     }
        //   ]
        // },
        {
          xicon: iconU + "/a1.png",
          index: "2",
          title: "赛事管理",
          subs: [
            {
              index: "MatchList",
              title: "赛事列表",
            },
            {
              index: "MatchNotice",
              title: "赛事公告",
            },
          ],
        },
        {
          xicon: iconU + "/a2.png",
          index: "3",
          title: "报名管理",
          subs: [
            {
              index: "upList",
              title: "赛事报名",
            },
            {
              index: "sginCou",
              title: "报名优惠券",
            },
            // {
            //   index: "set_group",
            //   title: "团报设置",
            // },
            {
              index: "sgin_G_Admin",
              title: "团报管理",
            },
            // {
            //   index: "shareRule",
            //   title: "邀请设置",
            // },
            {
              index: "shareCount",
              title: "邀请管理",
            },
            {
              index: "signUpPer",
              title: "选手名单",
            },
          ],
        },
        {
          xicon: iconU + "/a3.png",
          index: "4",
          title: "活动管理",
          subs: [
            {
              index: "luckyDraw",
              title: "抽奖活动",
            },
            {
              index: "raod",
              title: "路书管理",
            },
            {
              index: "MatchAdver",
              title: "商品推荐",
            },
            {
              index: "adMsg",
              title: "留言管理",
            },
          ],
        },
        // {
        //   xicon: iconU + "/a4.png",
        //   index: "5",
        //   title: "短信管理",
        //   subs: [
        //     {
        //       index: "empowerTemp",
        //       title: "签名/模板",
        //     },
        //     {
        //       index: "recharge",
        //       title: "短信充值",
        //     },
        //     {
        //       index: "sendHis",
        //       title: "发送记录",
        //     },
        //   ],
        // },
        // {
        //   xicon: iconU + "/a5.png",
        //   index: "6",
        //   title: "账户管理",
        //   subs: [
        //     {
        //       index: "account",
        //       title: "账户管理",
        //     },
        //   ],
        // },
        {
          xicon: iconU + "/a5.png",
          index: "5",
          title: "系统管理",
          subs: [
            // {
            //   xicon: iconU + "/a4.png",
            //   index: "5-1",
            //   title: "短信管理",
            //   subs: [
            //     {
            //       index: "empowerTemp",
            //       title: "签名/模板",
            //     },
            //     {
            //       index: "recharge",
            //       title: "短信充值",
            //     },
            //     {
            //       index: "sendHis",
            //       title: "发送记录",
            //     },
            //   ],
            // },
            // {
            //   index: "account",
            //   title: "账户管理",
            // },
            {
              index: "feedback",
              title: "用户反馈",
            },
          ],
        },
        // {
        //   xicon: iconU+"/a6.png",
        //   index: "7",
        //   title: "留言管理",
        //   subs: [
        //     {
        //       index: "adMsg",
        //       title: "留言管理",
        //     },
        //   ],
        // },
        // {
        //   icon: "el-icon-edit",
        //   index: "8",
        //   title: "路书管理",
        //   subs: [
        //     {
        //       index: "raod",
        //       title: "路书管理",
        //     },
        //   ],
        // },

        // {
        //   xicon: iconU+"/a8.png",
        //   index: "9",
        //   title: "邀请管理",
        //   subs: [
        //     {
        //       index: "shareRule",
        //       title: "邀请设置",
        //     },
        //     {
        //       index: "shareCount",
        //       title: "邀请统计",
        //     },
        //   ],
        // },
      ];
      let orgId = window.sessionStorage.getItem("orgId");
      if (orgId == 1) {
        // this.items.push({
        //   xicon: iconU + "/a9.png",
        //   index: this.items.length + 2 + "",
        //   title: "用户反馈",
        //   subs: [
        //     {
        //       index: "feedback",
        //       title: "用户反馈",
        //     },
        //   ],
        // });
        this.items.push(
          // {
          //   path: "trainPerson",
          //   index: this.items.length + 2 + "",
          //   title: "训练计划",
          // },
          {
            xicon: iconU + "/a10.png",
            index: this.items.length + 2 + "",
            title: "资金明细",
            subs: [
              // {
              //   index: "Cashback",
              //   title: "返现设置",
              // },
              {
                index: "spend_record",
                title: "资金明细",
              },
              {
                index: "takeM",
                title: "提现管理",
              },
              {
                index: "allOrder",
                title: "订单管理",
              },
              {
                index: "setPayPassword",
                title: "密码设置",
              },
            ],
          }
        );
      }
    }
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on("collapse", (msg) => {
      this.collapse = msg;
    });
  },
};
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 200px;
}
.sidebar > ul {
  height: 100%;
}
.xicon {
  display: inline-block;
  width: 24px;
  height: 24px;
  margin-right: 5px;
  /* background-size: contain; */
  background-repeat: no-repeat;
  background-position: center;
}
</style>
