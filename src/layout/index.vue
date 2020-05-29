<template>
  <div>
    <header-info />
    <div :class="classObj" class="app-wrapper">
      <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
      <sidebar class="sidebar-container" />
      <div class="hasTagsView main-container">
        <!--      :class="{hasTagsView:needTagsView}"-->
        <!--        <div :class="{'fixed-header':fixedHeader}">-->
        <!--          <navbar />-->
        <!--          <tags-view v-if="needTagsView" />-->
        <!--        </div>-->
        <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
        <app-main />
      </div>
    </div>
  </div>
</template>

<script>
import { AppMain, Sidebar } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'
import HeaderInfo from './components/HeaderInfo'
import Breadcrumb from '@/components/Breadcrumb'

export default {
  name: 'Layout',
  components: {
    AppMain,
    Sidebar,
    HeaderInfo,
    Breadcrumb
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }

  .breadcrumb-container {
    /*float: left;*/
    border-bottom: solid 1px #e6e6e6;
  }
</style>
