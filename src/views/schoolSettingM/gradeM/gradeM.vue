<template>
  <div class="app-container calendar-list-container">

    <div class="filter-container">
      <el-button v-if="g_hasPerm('grade:add')" class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('operate.add')}}</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" :element-loading-text="$t('msg.loading')" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" :label="$t('list.id')" width="65">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>

      <el-table-column width="220px" align="center" :label="$t('list.gradeName')" :prop="renderlanguage(l_params.gradeName)">
      </el-table-column>

      <el-table-column width="220px" align="center" label="班级数" prop="class">
        <template slot-scope="scope">
          <div v-if="scope.row.count == '0'" class="text-no">{{scope.row.count}}</div>
          <div v-else class="text-underline" @click="handleOpen(scope.row)">{{scope.row.count}}</div>
        </template>
      </el-table-column>

      <el-table-column width="220px" align="center" :label="$t('list.registerTime')" prop="createTime">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('operate.actions')" width="220" class-name="small-padding fixed-width" v-if="g_hasPerm('grade:update') ||g_hasPerm('grade:delete') ">
        <template slot-scope="scope">
          <el-button v-if="g_hasPerm('grade:update')" type="primary" icon="edit" @click="handleUpdate(scope.row)">{{$t('operate.edit')}}
          </el-button>
          <el-button v-if="g_hasPerm('grade:delete')" type="danger" icon="delete" @click="handleDelete(scope.$index,scope.row)">
            {{$t('operate.delete')}}
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageRow" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="temp" :model="temp" label-position="right" label-width="130px" style='width: 500px; margin-left:50px;'>

        <el-form-item :label="$t('new.gradeName')" prop="gradeName">
          <el-input v-model="temp.gradeName"></el-input>
        </el-form-item>

        <el-form-item :label="$t('new.gradeNameEn')" prop="gradeNameEn">
          <el-input v-model="temp.gradeNameEn"></el-input>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('new.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('new.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateData">{{$t('new.confirm')}}</el-button>
      </div>

    </el-dialog>

  </div>
</template>

<script>
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
import {
  listSysGrade,
  addSysGrade,
  updateSysGrade,
  deleteSysGrade
} from '@/api/schoolSettingM'

export default {
  name: 'deptM',
  directives: {
    waves
  },
  data() {
    return {
      l_params: {
        // 中英文 属性
        gradeName: 'p.gradeName'
      },
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageRow: 20
      },

      temp: {
        id: '',
        gradeName: '',
        gradeNameEn: ''
      },

      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        userName: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        userNameEn: [
          { required: true, message: '必填项', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    renderlanguage(string) {
      return this.$t(string)
    },
    getList() {
      this.listLoading = true
      listSysGrade(this.listQuery).then(response => {
        this.list = response.list
        this.total = response.totalCount
        this.listLoading = false
      })
    },
    getIndex($index) {
      // 表格序号
      return (
        (this.listQuery.pageNum - 1) * this.listQuery.pageRow +
                $index +
                1
      )
    },
    handleCurrentChange(val) {
      // 改变页码
      this.listQuery.pageNum = val
      this.getList()
    },
    handleSizeChange(val) {
      // 改变每页数量
      this.listQuery.pageRow = val
      this.getList()
    },

    resetTemp() {
      this.temp = {
        gradeName: '',
        gradeNameEn: ''
      }
    },
    // 编辑的时候配置参数
    configTemp(item) {
      this.temp = {
        id: item.id,
        gradeName: item.gradeName,
        gradeNameEn: item.gradeNameEn
      }
    },

    // 添加 界面出来
    handleCreate() {
      this.resetTemp()

      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['temp'].clearValidate()
      })
    },

    createData() {
      this.$refs['temp'].validate(valid => {
        if (valid) {
          addSysGrade(this.temp).then(() => {
            // 更新list
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: this.$t('msg.success'),
              message: this.$t('msg.createSuccess'),
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // 编辑 界面出来
    handleUpdate(row) {
      this.configTemp(row)

      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['temp'].clearValidate()
      })
    },
    updateData() {
      this.$refs['temp'].validate(valid => {
        if (valid) {
          updateSysGrade(this.temp).then(() => {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: this.$t('msg.success'),
              message: this.$t('msg.updateSuccess'),
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, val) {
      const _vue = this
      this.$confirm(this.$t('msg.delete'), this.$t('msg.prompt'), {
        confirmButtonText: this.$t('msg.confirm'),
        showCancelButton: false,
        type: 'warning'
      }).then(() => {
        const params = {
          id: val.id
        }
        deleteSysGrade(params)
          .then(() => {
            _vue.getList()
          })
          .catch(e => {})
      })
    },
    handleOpen(row) {
      this.$router.push({
        path: '/classM/classList/classList',
        query: { item: row }
      })
    }
  }
}
</script>

<style>
.text-underline {
    text-decoration: underline;
    color: #409eff;
    cursor: pointer;
}
</style>








