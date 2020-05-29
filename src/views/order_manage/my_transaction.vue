<template>
  <div class="content_list">
    <el-tabs v-model="action" type="card" @tab-click="handleClick">
      <el-tab-pane label="服务订单" name="1">
        <service-order v-if="action === '1'" />
      </el-tab-pane>
      <el-tab-pane label="线索订单" name="2">
        <clue-order v-if="action === '2'" />
      </el-tab-pane>
      <el-tab-pane label="案例订单" name="3">
        <media-order v-if="action === '3'" :type="1" />
      </el-tab-pane>
      <el-tab-pane label="传记订单" name="4">
        <media-order v-if="action === '4'" :type="2" />
      </el-tab-pane>
      <el-tab-pane label="实时上刊订单" name="5">
        <last-order v-if="action === '5'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ServiceOrder from './components/serviceOrder'
import ClueOrder from './components/clueOrder'
// import ParticipateTask from './components/participate_task'
import MediaOrder from './components/mediaOrder'
import LastOrder from './components/lastOrder'

export default {
  name: 'MyTransaction',
  components: { ServiceOrder, ClueOrder, MediaOrder, LastOrder },
  data() {
    return {
      action: '1'
    }
  },
  methods: {
    handleClick(tab, event) {
      this.action = tab.name
    }
  }
}
</script>

<style scoped lang="scss">
</style>
