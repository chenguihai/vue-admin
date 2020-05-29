<template>
  <el-popover
    trigger="hover"
    placement="top"
    :content="reason"
  >
    <div slot="reference">
      <div v-if="showFlag" class="refuseReason">未通过原因：{{ reason }}
        <!--        <span class="point">...</span>-->
      </div>
    </div>
  </el-popover>
</template>

<script>
export default {
  name: 'Index',
  props: ['reason'],
  data() {
    return {
      reasons: this.reason,
      showFlag: !!this.reason
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "../../styles/mixin.scss";

  .refuseReason {
    color: #f00;
    padding-top: 10px;
    height: 32px;
    line-height: 22px;
    @include ellipsis();
  }
</style>
