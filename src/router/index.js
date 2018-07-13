import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/index';
Vue.use(Router)

const router = new Router({
  routes: [{
      path: '/home/index',
      name: 'Index',
      component: require('../pages/home/index'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/home/subcolumn/:id',
      name: 'SubColumn',
      component: require('../pages/home/subcolumn'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/home/subcolumn2/:id',
      name: 'SubColumn2',
      component: require('../pages/home/subcolumn2'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/home/search',
      name: 'Search',
      component: require('../pages/home/search'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/home/searchresult',
      name: 'SearchResult',
      component: require('../pages/home/searchresult'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/near/index',
      name: 'Near',
      component: require('../pages/near/index'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/online/index',
      name: 'Online',
      component: require('../pages/online/index'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/online/jdindex',
      name: 'JingDong',
      component: require('../pages/online/jdindex'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/online/tmindex',
      name: 'TianMao',
      component: require('../pages/online/tmindex'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/online/tmdetail',
      name: 'TMDetail',
      component: require('../pages/online/tmdetail'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/online/allcolumn',
      name: 'AllColumn',
      component: require('../pages/online/allcolumn'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/online/products',
      name: 'Products',
      component: require('../pages/online/products'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/online/product',
      name: 'Product',
      component: require('../pages/online/product'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/online/comment',
      name: 'Comment',
      component: require('../pages/online/comment'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/online/settle',
      name: 'SettleBalance',
      component: require('../pages/online/settle'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/online/shoppingcart',
      name: 'ShoppingCart',
      component: require('../pages/online/cart'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/address/city',
      name: 'City',
      component: require('../pages/address/city'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/address/index',
      name: 'AddressManage',
      component: require('../pages/address/index'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/address/edit',
      name: 'AddressEdit',
      component: require('../pages/address/edit'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/address/new',
      name: 'AddressNew',
      component: require('../pages/address/new'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/me/index',
      name: 'Me',
      component: require('../pages/me/index'),
      meta: {
        requireAuth: true,
        keepAlive: true
      }
    }, {
      path: '/order/index',
      name: 'MyOrder',
      component: require('../pages/order/index'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/order/detail',
      name: 'OrderDetail',
      component: require('../pages/order/orderdetail'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/order/addcomment',
      name: 'AddComment',
      component: require('../pages/order/addcomment'),
      meta: {
        keepAlive: false
      }
    },{
      path: '/order/return',
      name: 'Return',
      component: require('../pages/order/return'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/me/mywallet',
      name: 'MyWallet',
      component: require('../pages/me/mywallet'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/me/qrcode',
      name: 'Qrcode',
      component: require('../pages/me/qrcode'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/me/recommend',
      name: 'Recommend',
      component: require('../pages/me/recommend'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/me/about',
      name: 'About',
      component: require('../pages/me/about'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/me/updateApp',
      name: 'UpdateApp',
      component: require('../pages/me/updateApp'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/me/login',
      name: 'Login',
      component: require('../pages/me/login'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/me/regpro',
      name: 'RegPro',
      component: require('../pages/me/regpro'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/me/forgetpwd',
      name: 'Forgetpwd',
      component: require('../pages/me/forgetpwd'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/me/pwdmanage',
      name: 'PwdManage',
      component: require('../pages/me/pwdmanage'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/me/update',
      name: 'Update',
      component: require('../pages/me/update'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/me/collect',
      name: 'MyCollect',
      component: require('../pages/me/collect'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/me/help',
      name: 'Help',
      component: require('../pages/me/help'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/shop/index/:id',
      name: 'Shop',
      component: require('../pages/shop/index'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/shop/map',
      name: 'ShopMap',
      component: require('../pages/shop/map'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/store/settle-2',
      name: 'IndividualSettle',
      component: require('../pages/store/settle2'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/store/settle-3',
      name: 'EnterpriseSettle',
      component: require('../pages/store/settle3'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/store/my',
      name: 'MyStore',
      component: require('../pages/store/my'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/store/service',
      name: 'StoreService',
      component: require('../pages/store/storeservice'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/store/productmanage',
      name: 'ProductManage',
      component: require('../pages/store/productmanage'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/store/ordermanage',
      name: 'OrderManage',
      component: require('../pages/store/ordermanage'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/store/publishmanage',
      name: 'PublishManage',
      component: require('../pages/store/publishmanage'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/store/updateproduct',
      name: 'UpdateProduct',
      component: require('../pages/store/publishmanage'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/store/receipt',
      name: 'Receipt',
      component: require('../pages/store/receiptmanage'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/trade/download',
      name: 'Download',
      component: require('../pages/trade/download'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/trade/bankcard',
      name: 'BankCard',
      component: require('../pages/trade/bankcard'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/trade/newbank',
      name: 'NewBank',
      component: require('../pages/trade/newbank'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/trade/service',
      name: 'Service',
      component: require('../pages/trade/service'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/trade/consumerule',
      name: 'ConsumeRule',
      component: require('../pages/trade/consumerule'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/trade/participate',
      name: 'Participate',
      component: require('../pages/trade/participate'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/trade/salerecord',
      name: 'SaleRecord',
      component: require('../pages/trade/salerecord'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/trade/salehistory',
      name: 'SaleHistory',
      component: require('../pages/trade/salehistory'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/trade/salewelfare',
      name: 'SaleWelfare',
      component: require('../pages/trade/salewelfare'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/trade/interest',
      name: 'Interest',
      component: require('../pages/trade/interest'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/trade/cashhistory',
      name: 'CashHistory',
      component: require('../pages/trade/cashhistory'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/trade/welfrecord',
      name: 'WelfareRecord',
      component: require('../pages/trade/welfrecord'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/trade/shouxin',
      name: 'Shouxin',
      component: require('../pages/trade/shouxin'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/trade/buyshouxin',
      name: 'BuyShouxin',
      component: require('../pages/trade/buyshouxin'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/trade/buyshouxin2',
      name: 'BuyShouxin2',
      component: require('../pages/trade/buyshouxin2'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/trade/shouxinlist',
      name: 'ShouxinList',
      component: require('../pages/trade/shouxinlist'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/trade/transfer',
      name: 'Transfer',
      component: require('../pages/trade/transfer'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/trade/transferhistory',
      name: 'TransferHistory',
      component: require('../pages/trade/transferhistory'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/trade/merge',
      name: 'MergeHistory',
      component: require('../pages/trade/merge'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/order/yinlian',
      name: 'YinLian',
      component: require('../pages/order/yinlian'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/order/yinlianconfirm',
      name: 'YinLianConfirm',
      component: require('../pages/order/yinlianconfirm'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/agent/index',
      name: 'Agent',
      component: require('../pages/agent/index'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/agent/shoplist',
      name: 'ShopList',
      component: require('../pages/agent/shoplist'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/agent/history',
      name: 'AgentHistory',
      component: require('../pages/agent/history'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/agent/rule',
      name: 'AgentRule',
      component: require('../pages/agent/rule'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/treasure/index',
      name: 'TreasureIndex',
      component: require('../pages/treasure/index'),
      meta: {
        keepAlive: true
      }
    }, {
      path: '/treasure/in',
      name: 'TreasureIn',
      component: require('../pages/treasure/in'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/treasure/out',
      name: 'TreasureOut',
      component: require('../pages/treasure/out'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/treasure/list',
      name: 'TreasureList',
      component: require('../pages/treasure/list'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/treasure/cash',
      name: 'TreasureCash',
      component: require('../pages/treasure/cash'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/scan/index',
      name: 'Scan',
      component: require('../pages/scan/index'),
      meta: {
        keepAlive: true
      }
    },  {
      path: '/merchant/index',
      name: 'MerchantIndex',
      component: require('../pages/merchant/index'),
      meta: {
        keepAlive: true
      }
    },{
      path: '/merchant/give',
      name: 'MerchantGive',
      component: require('../pages/merchant/give'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/merchant/give2',
      name: 'MerchantGive2',
      component: require('../pages/merchant/give2'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/merchant/givehistory',
      name: 'GiveHistory',
      component: require('../pages/merchant/givehistory'),
      meta: {
        keepAlive: false
      }
    }, {
      path: '/merchant/upgrade',
      name: 'Upgrade',
      component: require('../pages/merchant/upgrade'),
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/merchant/coupon',
      name: 'Coupon',
      component: require('../pages/merchant/coupon'),
      meta: {
        keepAlive: true
      }
    },{
      path: '/merchant/couponhistory',
      name: 'CouponHistory',
      component: require('../pages/merchant/couponhistory'),
      meta: {
        keepAlive: false
      }
    },{
      path: '/merchant/protocol',
      name: 'MerchantProtocol',
      component: require('../pages/merchant/protocol'),
      meta: {
        keepAlive: false
      }
    },{
      path: '/merchant/recommendhistory',
      name: 'MerchantRecommendHistory',
      component: require('../pages/merchant/recommendhistory'),
      meta: {
        keepAlive: false
      }
    },{
      path: '*',
      redirect: '/home/index'
    }
  ]
})
router.afterEach((to, from) => {
  let s = document.querySelector("main") && document.querySelector("main").scrollTop
  store.commit('SAVE_POSITION', {
    name: from.path,
    position: s
  });
})
export default router;
