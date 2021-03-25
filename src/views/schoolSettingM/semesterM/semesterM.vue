<template>
  <div class="app-container calendar-list-container">

    <div class="filter-container">
      <el-button v-if="g_hasPerm('semester:add')" class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('operate.add')}}</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" :element-loading-text="$t('msg.loading')" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" :label="$t('list.id')" width="65">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>

      <!-- <el-table-column width="220px" align="center" :label="$t('list.year')" prop="year">
        <template slot-scope="scope">
          <span v-text="getYear(scope.row)"> </span>
        </template>
      </el-table-column> -->

      <el-table-column width="220px" align="center" :label="$t('list.semesterName')" prop="semesterName">
      </el-table-column>

      <el-table-column width="220px" align="center" :label="$t('list.semesterTime')" prop="time">
        <template slot-scope="scope">
          <span v-text="getTime(scope.row)"> </span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('operate.actions')" width="220" class-name="small-padding fixed-width" v-if="g_hasPerm('semester:update') ||g_hasPerm('semester:delete') ">
        <template slot-scope="scope">
          <el-button v-if="g_hasPerm('semester:update')" type="primary" icon="edit" @click="handleUpdate(scope.row)">{{$t('operate.edit')}}
          </el-button>
          <el-button v-if="g_hasPerm('semester:delete')" type="danger" icon="delete" @click="handleDelete(scope.$index,scope.row)">
            {{$t('operate.delete')}}
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageRow" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog width="70%" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">

      <el-form :rules="rules" ref="dynamicValidateForm" :model="dynamicValidateForm" label-position="right" label-width="130px">

        <el-form-item v-for="(domain, index) in dynamicValidateForm.domains" :label="$t('new.semesterName')" :key="index">

          <!-- <el-form-item :label="$t('new.semesterName')" >
            <el-input v-model="domain.semesterName"></el-input>
          </el-form-item> -->
          <el-input style="width:300px" class="input" v-model="domain.semesterName"></el-input>

          <el-date-picker style="margin-left: 10px;" v-model="domain.startTime" type="daterange" :range-separator="$t('new.to')" :start-placeholder="$t('new.startTime')" :end-placeholder="$t('new.endTime')" value-format="yyyy/MM/dd">
          </el-date-picker>

          <!-- <el-button @click.prevent="removeDomain(domain)">删除</el-button> -->

          <el-button style="margin-left: 10px;" v-if="dialogStatus=='create'" type="danger" icon="delete" @click.prevent="removeDomain(domain)">{{$t('operate.delete')}}
          </el-button>

        </el-form-item>

        <el-form-item>
          <el-button v-if="dialogStatus=='create'" type="primary" icon="edit" @click="addDomain">{{$t('operate.add')}}</el-button>
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
  listSysSemester,
  addSysSemester,
  updateSysSemester,
  deleteSysSemester
} from '@/api/schoolSettingM'

export default {
  name: 'semesterM',
  directives: {
    waves
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageRow: 20
      },

      dynamicValidateForm: {
        domains: [
          {
            semesterName: '',
            startTime: '',
            endTime: ''
          }
        ]
      },

      temp: {},

      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        semesterName: [
          { required: true, message: '必填项', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      listSysSemester(this.listQuery).then(response => {
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
    getYear(row) {
      return (
        parseTime(row.startTime, '{y}') +
                '-' +
                parseTime(row.endTime, '{y}')
      )
    },
    getTime(row) {
      return (
        parseTime(row.startTime, '{y}.{m}.{d}') +
                '-' +
                parseTime(row.endTime, '{y}.{m}.{d}')
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

    removeDomain(item) {
      var index = this.dynamicValidateForm.domains.indexOf(item)
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1)
      }
    },
    addDomain() {
      this.dynamicValidateForm.domains.push({
        semesterName: '',
        startTime: '',
        endTime: ''
      })
    },

    resetTemp() {
      this.temp = {}
      this.dynamicValidateForm = {
        domains: [
          {
            semesterName: '',
            startTime: '',
            endTime: ''
          }
        ]
      }
    },
    // 编辑的时候配置参数
    configTemp(item) {
      this.temp = {
        id: item.id,
        semesterName: item.semesterName,
        startTime: item.startTime,
        endTime: item.endTime
      }

      const arr = [item.startTime, item.endTime]
      this.dynamicValidateForm.domains = [
        {
          semesterName: item.semesterName,
          startTime: arr,
          endTime: ''
        }
      ]
    },

    // 添加 界面出来
    handleCreate() {
      this.resetTemp()

      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dynamicValidateForm'].clearValidate()
      })
    },

    createData() {
      this.$refs['dynamicValidateForm'].validate(valid => {
        if (valid) {
          var arr = this.dynamicValidateForm.domains
          var arr_temp = []
          for (var key in arr) {
            if (arr.hasOwnProperty(key)) {
              var ele = arr[key]
              if (ele.semesterName === '' || ele.startTime === '' || ele.startTime === undefined) {
                this.$message({
                  message: '学期名称或时间不能为空',
                  type: 'warning'
                })
                return
              }
              var e = { 'semesterName': ele.semesterName, 'startTime': ele.startTime[0], 'endTime': ele.startTime[1] }
              arr_temp.push(e)
            }
          }
          this.temp = arr_temp
          addSysSemester(this.temp).then(() => {
            // 更新list
            this.getList()
            this.dialogFormVisible = false
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
        this.$refs['dynamicValidateForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dynamicValidateForm'].validate(valid => {
        if (valid) {
          const p = this.dynamicValidateForm.domains[0]
          const arr_time = p.startTime

          if (p.semesterName === '' || p.startTime === '' || p.startTime === undefined) {
            this.$message({
              message: '学期名称或时间不能为空',
              type: 'warning'
            })
            return
          }

          this.temp.semesterName = p.semesterName
          this.temp.startTime = arr_time[0]
          this.temp.endTime = arr_time[1]

          updateSysSemester(this.temp).then(() => {
            this.getList()
            this.dialogFormVisible = false
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
        deleteSysSemester(params)
          .then(() => {
            _vue.getList()
          })
          .catch(e => {})
      })
    }
  }
}
</script>

<style>
.el-date-editor .el-range-separator{
  width: 20px;
}
</style>








