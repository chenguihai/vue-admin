<template>
  <div>
    <el-form ref="form" :model="former" label-width="110px">
      <el-form-item label="服务可选规格">
        <el-checkbox-group v-model="former.type" @change="optionalSpecsChange">
          <el-checkbox
            v-for="(item) in specUp"
            :key="item.id"
            :label="item.id"
            name="type"
          >{{ item.attr_name }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <div v-if="former.type.length > 0" class="app-container">
      <el-table :data="list" border fit highlight-current-row style="width: 100%">
        <!-- v-if="item.checked===1" -->
        <el-table-column
          v-for="(item,index) in specUp.filter(sItem => sItem.checked===1)"
          :key="index"
          align="center"
          :label="item.attr_name"
          min-width="150px"
        >
          <template slot-scope="scope">
            <el-input
              v-if="item.input_type === 1"
              v-model="scope.row[item.id]"
              clearable
              type="text"
            />
            <el-select v-else-if="item.input_type === 2" v-model="scope.row[item.id]" clearable>
              <el-option
                v-for="(subItem,subIndex) in item.input_select_val.split('|')"
                :key="subIndex"
                :label="subItem"
                :value="subItem"
              />
            </el-select>
            <el-checkbox-group v-else v-model="scope.row[item.id]">
              <el-checkbox
                v-for="(sub2Item,sub2Index) in item.input_select_val.split('|')"
                :key="sub2Index"
                :label="sub2Index"
              >{{ sub2Item }}</el-checkbox>
            </el-checkbox-group>
          </template>
        </el-table-column>
        <el-table-column min-width="150px" align="center" label="售价">
          <template slot-scope="scope">
            <el-input v-model="scope.row.price" clearable type="number" />
          </template>
        </el-table-column>

        <el-table-column min-width="150px" align="center" label="市场价">
          <template slot-scope="scope">
            <el-input v-model="scope.row.m_price" clearable type="number" />
          </template>
        </el-table-column>

        <el-table-column min-width="150px" align="center" label="库存">
          <template slot-scope="scope">
            <el-input v-model="scope.row.stock" clearable type="number" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="编辑" width="150px">
          <template slot-scope="scope">
            <el-button size="small" @click="deleter(scope.$index)">删除</el-button>
            <el-button size="small" @click="addrow">添加</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="btn_save">
        <el-button type="primary" @click="handleOptionSpecsSave">保存</el-button>
      </div>
    </div>
    <div v-else class="nodate">
      <el-row>
        <div class="nodatepic">
          <img src="@/assets/img/nodate.png" class="imglister" name="name">
        </div>
        <div class="texter">请勾选规格填充信息哦～</div>
      </el-row>
    </div>
    <!--服务可选属性-->
    <div style="margin-top: 20px">
      <el-form ref="form" :model="form" label-width="110px">
        <el-form-item label="服务可选属性">
          <el-checkbox-group v-model="form.type" @change="optionalAttChange">
            <el-checkbox
              v-for="item in specDown"
              :key="item.id"
              :label="item.id"
              name="type"
            >{{ item.attr_name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <div v-if="form.type.length > 0">
          <el-row>
            <!-- v-show="item.checked === 1" -->
            <el-col
              v-for="(item,index) in specDown.filter(sItem=>sItem.checked === 1)"
              :key="index"
              :span="item.input_type === 3 ?24:6"
            >
              <el-form-item :label="item.attr_name">
                <el-input v-if="item.input_type === 1" v-model="item.checked_list" clearable />
                <el-select
                  v-else-if="item.input_type === 2"
                  v-model="item.checked_list[0].value"
                  tinymce
                  placeholder="线下广告投放"
                  clearable
                >
                  <el-option
                    v-for="(subItem,subIndex) in item.input_select_val.split('|')"
                    :key="subIndex"
                    :label="subItem"
                    :value="subItem"
                  />
                </el-select>
                <el-checkbox-group v-else-if="item.input_type === 3" v-model="item.checked_list">
                  <el-checkbox
                    v-for="(sub2Item,sub2Index) in item.input_select_val.split('|')"
                    :key="sub2Index"
                    :label="sub2Item"
                  >{{ sub2Item }}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="btn_save">
            <el-button type="primary" @click="handleOptionArrSave">保存</el-button>
          </div>
        </div>
        <div v-else class="nodate">
          <el-row>
            <div class="nodatepic">
              <img src="@/assets/img/nodate.png" class="imglister" name="name">
            </div>
            <div class="texter">请勾选规格填充信息哦～</div>
          </el-row>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getEditBaseInfo, baseInfoEdit } from "@/api/service.js";
import { selectChangeCommonFun, messageCommon } from "@/utils/common.js";

export default {
  name: "Attribute",
  data() {
    return {
      params: {
        id: 0,
        action: 4
      },
      specUp: [],
      specDown: [],
      form: {
        type: []
      },
      former: {
        type: []
      },
      list: [{ price: "", m_price: "", stock: "", sale_attr: 1 }],
      oldList: [],
      defaultList: { price: "", m_price: "", stock: "", sale_attr: 1 },
      selectSpecType: [],
      upCount: 0
    };
  },
  created() {
    const { id = 0 } = this.$route.query;
    if (id) {
      this.params.id = +id;
      this.getEditBaseInfoHttp();
    }
  },
  methods: {
    optionalAttChange(option) {
      // 服务可选属性
      const data = JSON.parse(JSON.stringify(this.specDown));
      this.specDown = [];
      this.specDown = selectChangeCommonFun(data, option);
    },
    optionalSpecsChange(option) {
      // 服务可选规格
      let list = [];
      // const item = {};
      const oldList = JSON.parse(JSON.stringify(this.list));
      const data = JSON.parse(JSON.stringify(this.specUp));
      if (this.selectSpecType.length > option.length) {
        // 减少选项
        list = this.selectSpecType.filter(item => {
          return option.indexOf(item) === -1;
        });
        for (let i = 0; i < oldList.length; i++) {
          list.length > 0 && delete oldList[i][list[0]];
        }
      } else {
        // 增加选项
        list = option.filter(item => {
          return this.selectSpecType.indexOf(item) === -1;
        });
        for (let i = 0; i < oldList.length; i++) {
          oldList[i][list[0]] = "";
        }
      }
      this.list = oldList;
      this.specUp = [];
      this.specUp = selectChangeCommonFun(data, option);
      this.selectSpecType = option;
    },
    handleOptionArrSave() {
      // 属性保存
      this.baseInfoEditAttHttp();
    },
    handleOptionSpecsSave() {
      // 规格保存
      this.baseInfoEditHttp();
    },
    addrow() {
      const item = JSON.parse(JSON.stringify(this.defaultList));
      this.list.push(item);
    },
    deleter(index) {
      // if (this.list.length === 1) {
      //   let item = JSON.parse(JSON.stringify(this.list))
      //   this.oldList = item
      // }
      this.list.splice(index, 1);
    },
    getEditBaseInfoHttp() {
      const { id, action } = this.params;
      const params = {
        id,
        action // 1基础信息,2详细介绍,3图库,4规格属性
      };
      getEditBaseInfo(params)
        .then(res => {
          if (res.code === 200) {
            const { up = [], down = [] } = res.data.spec;
            const obj = {}; // 选中复选框key的对象
            let key = "";
            let listData = [];
            let listKey = "";
            let subItem = [];
            const selectSpecs = []; // up 选择了那些项目
            const selectAtt = []; // down 选择了那些项目
            for (let i = 0; i < up.length; i++) {
              // up
              if (up[i].input_type === 1) {
                // 选择项目id作为key
                key = up[i].id;
                obj[key] = "";
              } else {
                key = up[i].id;
                obj[key] = [];
              }
              if (up[i].checked === 1) {
                // 选择了那些项
                selectSpecs.push(up[i].id);
                subItem = up[i].checked_list || "";
                if (this.upCount === 0) {
                  // 确定数组长度 listData
                  this.upCount = 1;
                  listData = subItem || this.list;
                  for (let j = 0; j < listData.length; j++) {
                    if (listData[j].key) {
                      // key存在才执行
                      listKey = listData[j].key;
                      listData[j][listKey] = listData[j].value;
                    }
                  }
                } else {
                  // 把其他项的值赋给第一项 listData
                  if (subItem) {
                    for (let j = 0; j < subItem.length; j++) {
                      if (subItem[j].key) {
                        listKey = subItem[j].key;
                        listData[j][listKey] = subItem[j].value;
                      }
                    }
                  }
                }
              }
            }
            for (let i = 0; i < down.length; i++) {
              // down
              if (down[i].checked === 1) {
                selectAtt.push(down[i].id);
              } else {
                if (down[i].input_type === 1) {
                  // 给选择项字段赋值 imput
                  down[i].checked_list = "";
                } else if (down[i].input_type === 2) {
                  // select
                  down[i].checked_list = [{ value: "" }];
                } else {
                  // check
                  down[i].checked_list = [];
                }
              }
            }
            this.list = listData.length > 0 ? listData : this.list;
            this.former.type = selectSpecs;
            this.selectSpecType = selectSpecs;
            this.form.type = selectAtt;
            this.defaultList = { ...this.defaultList, ...obj }; // 新增item的时候用的上
            this.specUp = up;
            this.specDown = down;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    baseInfoEditHttp() {
      const data = this.list;
      let item = {};
      for (let i = 0; i < data.length; i++) {
        item = data[i];
        for (const key in item) {
          if (!item[key]) {
            messageCommon(this, "数据不能为空", "error");
            return;
          }
        }
      }
      const { id, action } = this.params;
      const listArr = JSON.parse(JSON.stringify(this.list));
      const spliceArr = [];
      const [one, two, three] = this.former.type;
      for (let i = 0; i < listArr.length; i++) {
        for (let j = 1; j < listArr.length; j++) {
          if (
            i !== j &&
            listArr[i][one] === listArr[j][one] &&
            listArr[i][two] === listArr[j][two] &&
            listArr[i][three] === listArr[j][three]
          ) {
            // console.log( listArr[i][one], listArr[i][two], listArr[i][three])
            listArr[i].stock = listArr[i].stock - -listArr[j].stock;
            // listArr.splice(j, 1);
            spliceArr.push(j);
            // break;
          }
        }
      }
      for (let i = 0; i < spliceArr.length; i++) {
        listArr.splice(spliceArr[i], 1);
      }
      var params = {
        id,
        action,
        sale_attr: 1,
        val: listArr.length > 0 ? JSON.stringify(listArr) : "",
        chk: this.former.type.toString()
      };
      baseInfoEdit(params)
        .then(res => {
          if (res.code === 200) {
            messageCommon(this, "保存成功");
            this.routerJumpFun();
            // this.list = JSON.parse(JSON.stringify(this.oldList))
          } else {
            messageCommon(this, res.message, "error");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    baseInfoEditAttHttp() {
      const { id, action } = this.params;
      const data = this.specDown.filter(item => item.checked === 1);
      const val1 = [];
      let index = "";
      let selectItem = [];
      let value = "";
      for (let i = 0; i < data.length; i++) {
        index = data[i].id;
        selectItem = data[i].checked_list;
        value =
          data[i].input_type === 2
            ? selectItem[0].value
            : data[i].input_type === 3
              ? selectItem.toString()
              : selectItem;
        if (value) {
          // 有值才添加
          val1.push({
            [index]: value
          });
        }
      }
      const params = {
        id,
        action,
        sale_attr: 0,
        val1: JSON.stringify(val1),
        chk: this.form.type.toString()
      };
      baseInfoEdit(params)
        .then(res => {
          if (res.code === 200) {
            messageCommon(this, "保存成功");
            this.routerJumpFun();
          } else {
            messageCommon(this, res.message, "error");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    routerJumpFun() {
      this.$router.push({
        path: "/product_manage/service_manage"
      });
    }
  }
};
</script>

<style scoped lang="scss">
.texter {
  width: 100%;
  height: 115px;
  line-height: 115px;
  color: #333;
  font-size: 16px;
}

.imglister {
  width: 97px;
  height: 115px;
  float: left;
}

.nodate {
  width: 300px;
  height: 115px;
  margin: 0 auto;
}

.btn_save {
  margin-top: 20px;
  text-align: center;
}
</style>
