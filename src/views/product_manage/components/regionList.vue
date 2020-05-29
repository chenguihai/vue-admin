<template>
  <!--  地区列表-->
  <el-dialog title="已选地区" custom-class="region_wrap" :visible.sync="showFlag" width="600px" @close="handleClose">
    <div class="select_area">
      <!--      <span>已选地区</span>-->
      <el-tag
        v-for="(item, index) in selectArea"
        :key="item.cityes"
        closable
        class="lister"
        @close="handleClosearea(index)"
      >{{ item.cityes }}
      </el-tag>
    </div>
    <div class="area_list">
      <ul class="province_list">
        <li
          v-for="(itemer,index) of arealist"
          :key="itemer.id"
          :class="['province_item',provinceIndex === index?'active':'']"
          @click="selectProvince(index)"
        >{{
          itemer.name }}
        </li>
      </ul>
      <ul class="city_list">
        <li
          v-for="(item,index) of cityList"
          :key="item.id"
          :class="['city_item',cityIndex === index?'active':'']"
          :value="item.id"
          @click="selectCity(index)"
        >{{ item.name }}
        </li>
      </ul>
    </div>
    <div class="region_btn">
      <el-button type="danger" @click="submitForm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import citydata from '@/utils/city.json'

  export default {
    name: 'RegionList',
    props: ['list'],
    data() {
      return {
        showFlag: true,
        arealist: [],
        cityList: [],
        selectArea: this.list || [],
        provinceIndex: 0,
        cityIndex: -1
      }
    },
    created() {
      const data = JSON.parse(JSON.stringify(citydata))
      for (let i = 0; i < data.length; i++) {
        if (data[i].id !== '100000' && Array.isArray(data[i].child)) {
          data[i].child.unshift({
            'id': data[i].id,
            'pid': data[i].id,
            'name': '全部'
          })
        }
      }
      this.arealist = data
      this.cityList = data[0].child
    },
    methods: {
      selectProvince(index) {
        this.provinceIndex = index
        this.cityIndex = -1
        this.cityList = this.arealist[index].child
      },
      submitForm() {
        this.$emit('submit', this.selectArea)
      },
      handleClose() {
        this.$emit('close')
      },
      handleClosearea(index) { // 关闭服务地区数据
        this.selectArea.splice(index, 1)
        this.cityIndex = -1
      },
      selectCity(index) {
        if (this.cityIndex === index) { // 点击的是相同项，返回
          return
        }
        const item = this.cityList[index]
        const area = JSON.parse(JSON.stringify(this.selectArea))
        if (index === 0) { // 点击全部
          const newArea = []
          if (item.id === '100000') { //如果点击是全国

          } else {
            for (let i = 0; i < area.length; i++) {
              if (item.pid !== area[i].pid) { // 把相等的pid项去除掉
                newArea.push(area[i])
              }
            }
          }
          newArea.push({
            cityes: this.arealist[this.provinceIndex].name,
            id: item.id,
            pid: item.pid
          })
          this.selectArea = newArea
        } else { // 选择除全部以外的项
          if (area.length === 1 && area[0].id === '100000') {//如果上一步点击是全国
            area.splice(0, 1)
            area.push({ // 添加新添加的一项
              cityes: item.name,
              id: item.id,
              pid: item.pid
            })
            this.selectArea = area
          } else if (this.cityIndex === 0) { // 如果上步点击的是全部
            for (let i = 0; i < area.length; i++) {
              if (this.cityList[0].pid === area[i].pid) { // 把全部那一项去掉
                area.splice(i, 1)
              }
            }
            area.push({ // 添加新添加的一项
              cityes: item.name,
              id: item.id,
              pid: item.pid
            })
            this.selectArea = area
          } else { // 点击的还是其他的单项
            const flag = this.selectArea.some(subItem => item.id === subItem.id)
            if (!flag) { // 判断之前是否选中过
              this.selectArea.push({
                cityes: item.name,
                id: item.id,
                pid: item.pid
              })
            }
          }
        }
        this.cityIndex = index
      }
    }
  }
</script>

<style lang="scss" scoped>
  .region_wrap {
    border-top: 1px solid #ddd;
    margin-top: -25px;
    padding-top: 10px;
  }

  .select_area {
    line-height: 40px;
    max-height: 160px;
    overflow-y: auto;
    margin-bottom: 10px;
  }

  .area_list {
    display: flex;
    border-top: 1px solid #ddd;
    height: 200px;
    padding-top: 10px;

    .province_list, .city_list {
      overflow-y: auto;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .province_list {
      width: 150px;
      overflow-y: auto;
    }

    .province_item {
      height: 25px;
      line-height: 25px;
      cursor: pointer;
      text-indent: 10px;

      &:hover, &.active {
        background-color: rgba(24, 144, 255, 0.1);
        color: #1890ff;
      }
    }

    .city_list {
      flex: 1;
      border-left: 1px solid #ddd;
      padding-left: 10px;
    }

    .city_item {
      line-height: 30px;
      padding: 0px 10px;
      float: left;
      font-size: 14px;
      cursor: pointer;
      border: 1px solid transparent;

      &.active, &:hover {
        border-color: #0a81f8;
        color: #0a81f8;
      }
    }
  }

  .region_btn {
    text-align: center;
    margin-top: 20px;
  }

  .lister {
    margin-right: 10px;
  }
</style>
