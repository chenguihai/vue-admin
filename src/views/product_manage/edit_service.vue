<template>
  <div class="content_list">
    <el-tabs v-model="action" class="mb_10" type="card" @tab-click="handleClick">
      <el-tab-pane
        v-for="item in menulist"
        :key="item.value"
        :label="item.label"
        :name="item.value+''"
      />
    </el-tabs>
    <component :is="currentTabComponent" class="tab" />
  </div>
</template>

<script>
import BaseInfo from "./components/baseinfo";
import DetailsInfo from "./components/details";
import AddPic from "./components/addpic";
import AttriBute from "./components/attribute";
import RelevantCase from "./components/relevantCase";
import RelevantBiog from "./components/relevantBiog";
// import { getbranddata, getEditBaseInfo } from '@/api/service.js'

export default {
  name: "EditService",
  components: {
    BaseInfo,
    DetailsInfo,
    AddPic,
    AttriBute,
    RelevantCase,
    RelevantBiog
  },
  data() {
    const { id = 0, type = "0" } = this.$route.query;
    return {
      menulist: [
        { label: "基础信息", value: "0" },
        { label: "详细介绍", value: "1" },
        { label: "图库", value: "2" },
        { label: "规格属性", value: "3" },
        { label: "相关媒体案例", value: "4" },
        { label: "相关媒主传记", value: "5" }
      ],
      action: type + "",
      id: +id,
      currentTab: [
        "base-info",
        "details-info",
        "add-pic",
        "attri-bute",
        "relevant-case",
        "relevant-biog"
      ]
    };
  },
  computed: {
    currentTabComponent: function() {
      return this.currentTab[this.action];
    }
  },
  created() {
    if (!this.id) {
      this.menulist = [{ label: "基础信息", value: "0" }];
    }
  },
  methods: {
    handleClick(tab, event) {
      this.action = tab.name;
      this.$router.replace(`?id=${this.id}&type=${tab.name}`);
    }
  }
};
</script>

<style scoped="scoped" lang="scss">
</style>
