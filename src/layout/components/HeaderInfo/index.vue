<template>
  <div class="header_top">
    <div class="head_logo">
      <img class="head_img" src="../../../assets/img/logo.png">
      <span class="head_dot" />
      <span class="head_name">店铺管理中心</span>
    </div>
    <ul class="header_right">
      <li class="header_li">
        <svg-icon icon-class="geren" />
        <a :href="shopInfo.id | shopIndexUrlF">我的店铺</a>
      </li>
      <li class="header_li">
        <img v-if="avatar" class="head_avatar" :src="avatar | avatarFilter">
        <img v-else class="head_avatar" src="../../../assets/img/header.jpg">
        <span>{{ nickname }}</span>
      </li>
      <!--
      <li class="header_li">
        <svg-icon icon-class="logout"/>
        <span @click="logout">退出登录</span>
      </li>
      -->
    </ul>
  </div>
</template>

<script>
import { setToken } from '@/utils/auth'
import { getShopInfo } from '@/api/user'

export default {
  name: 'HeaderInfo',
  data() {
    return {
      nickname: '',
      avatar: '',
      shopInfo: {}
    }
  },
  mounted() {
    const userInfo = localStorage.getItem('userInfo')
    if (userInfo) {
      const { original: { name = '', avatar = '' }} = JSON.parse(userInfo) || {}
      this.nickname = name
      this.avatar = avatar
    }
    const token = localStorage.getItem('access_token')
    token && setToken(token)
    this.getShopInfoHttp()
  },
  methods: {
    logout() {
      // async await
      // this.$store.dispatch('user/logout')
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      localStorage.clear()
      sessionStorage.clear()
      // this.$router.push({ path: '/login' })
      window.location.href = location.origin + '/login'
    },
    getShopInfoHttp() {
      getShopInfo().then(res => {
        const { code, data } = res
        if (code === 200) {
          this.shopInfo = data
          localStorage.setItem('shopInfo', JSON.stringify(data))
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .header_top {
    position: fixed;
    top: 0;
    z-index: 99;
    display: flex;
    align-items: center;
    width: 100%;
    height: 64px;
    background: #fff;
    box-shadow: 0 0 3px #ddd;
    padding: 0 20px 0 16px;
  }

  .head_logo {
    display: flex;
    align-items: center;
    flex: 1;
    height: 47px;
  }

  .head_img {
    width: 167px;
    // height: 47px;
  }

  .head_dot {
    width: 6px;
    height: 6px;
    background: #999;
    border-radius: 3px;
    margin: 0 10px 0 6px;
  }

  .head_name {
    color: #F3262D;
    font-size: 20px;
  }

  .head_avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 1px solid #eee;
  }

  .header_right {
    display: flex;
    align-items: center;
    color: #666;
    font-size: 14px;

    .header_li {
      margin-left: 10px;
      display: inline-flex;
      align-items: center;

      > span, > a {
        margin-left: 10px;
      }

      > span {
        cursor: pointer;
      }
    }
  }
</style>
