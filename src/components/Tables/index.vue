<template>
  <div class="tables">
    <div class="table-area">
      <el-table ref="multipleTable" class="table"  :highlightCurrentRow="true" :data="tableData.dataSource" border :empty-text='renderlanguage(tableData.transformLang.empty)'
        tooltip-effect="dark" show-overflow-tooltip="true" style="width: 100%;" @selection-change="handleSelectionChange">

        <el-table-column type="selection" width="55" headerAlign="center">
        </el-table-column>

        <el-table-column v-for="(label,index) in tableData.labelArr" :prop="renderlanguage(tableData.propArr[index])" :label="renderlanguage(label)" :key="index" width="130" headerAlign="center"
          show-overflow-tooltip>
        </el-table-column>

        <el-table-column :label="renderlanguage(tableData.transformLang.actions)" headerAlign="center" width="260">
          <template slot-scope="scope">
            <el-button v-for="(operate,index) in tableData.operateArr" :class="tableData.operateHandleClassArr[index]" :key="index" size="small" @click="handleClick(scope.$index, scope.row , operate)">
                {{renderlanguage(operate)}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <input v-model="testLang"> -->
    </div>
  </div>
  
</template>

<script>
  /**
   * 1.从上一级进入该组件需要传入四个参数：
   * labelArr（title名称数组）
   * operateArr（操作名称数组）
   * operateHandleClassArr（操作对应的class数组）
   * propArr（prop属性数组）
   *
   */

  export default {
    name: 'tables',
    props: {
      tableData: {
        type: Object
      }
    },
    data() {
      return {
        keyWord: ''
      }
    },
    methods: {
      handleClick(index, rowData, operate) {
        this.$emit('table-click-args', {
          operateName: operate, // 操作：删除、编辑、禁用等等
          rowData: rowData // 操作的栏目的数据
        })
      },
  
      handleSelectionChange() {},
      renderlanguage(string) {
        return this.$t(string)
      }
    },
    mounted() {
      console.log(this.$t('operate.operation'))
  }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .tables {
    width: 100%;
  }

  .table-area {
    padding-left: 0.3rem;
    margin-top: 0.2rem;
  }

  .edit {}

  .disabled {
    /* background-color: #ff7597;
        border-color: #ff7597; */
  }

  .delete {
    /* background-color: #ff4643;
        border-color: #ff4643; */
  }

  .table {
    /* height: 10rem !important; */
  }

</style>
