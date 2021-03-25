<template>
  <div class="app-container calendar-list-container">

    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('operate.add')}}</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" :element-loading-text="$t('msg.loading')" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" :label="$t('list.id')" width="65">
        <template slot-scope="scope">
          <span>{{scope.$index+1}}</span>
        </template>
      </el-table-column>
      <el-table-column width="110px" align="center" :label="$t('list.name')" prop="userName">
      </el-table-column>

      <el-table-column width="110px" align="center" :label="$t('list.grade')" prop="gradeName">
      </el-table-column>

      <el-table-column width="110px" align="center" :label="$t('list.class')" prop="className">
      </el-table-column>

      <el-table-column width="110px" align="center" :label="$t('list.comment')" prop="comment">
      </el-table-column>

      <el-table-column width="150px" align="center" :label="$t('list.registerTime')" prop="createTime">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('operate.actions')" width="220" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" icon="edit" @click="handleUpdate(scope.row)">{{$t('operate.edit')}}
          </el-button>
          <el-button type="danger" icon="delete" @click="handleDelete(scope.$index,scope.row)">
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
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="right" label-width="130px" style='width: 500px; margin-left:50px;'>

        <el-form-item :label="$t('new.grade')" prop="gradeId">
          <el-select v-model="temp.gradeId" @change="onGradeChange">
            <el-option v-for="item in gradeOptions" :key="item.value" :label="item.label" :value="item.value">
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('new.class')" prop="classId">
          <el-select v-model="temp.classId" @change="onClassChange">
            <el-option v-for="item in classOptions" :key="item.value" :label="item.label" :value="item.value">
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item :label="$t('new.name')" prop="userId">
          <el-select v-model="temp.userId">
            <el-option v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value">
              <span>{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('new.comment')" prop="comment">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6}" v-model="temp.comment"></el-input>
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
import { mapGetters } from 'vuex'
import { listSysGrade } from '@/api/schoolSettingM'
import { selectClass, selectStu } from '@/api/common'
import {
  listCommentManage,
  addCommentManage,
  updateCommentManage,
  deleteCommentManage
} from '@/api/commentM'

export default {
  name: 'commentM',
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
      gradeOptions: [], // 年级
      classOptions: [], // 班级
      userOptions: [], // 人

      temp: {},
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        // type: [
        //   {
        //     required: true,
        //     message: 'type is required',
        //     trigger: 'change'
        //   }
        // ]
      }
    }
  },
  filters: {},
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      listCommentManage(this.listQuery).then(response => {
        this.list = response.list
        this.total = response.totalCount
        this.listLoading = false
      })
    },

    handleSizeChange(val) {
      this.listQuery.pageRow = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getList()
    },
    resetTemp() {
      this.temp = {
        userId: '',
        gradeId: '',
        classId: '',
        comment: ''
      }

      // 配置年级
      this.gradeOptions = []
      listSysGrade().then(res => {
        for (var i = 0; i < res.list.length; i++) {
          var element = res.list[i]
          const e = {
            value: element.id + '',
            label: element.gradeName,
            labelEn: element.gradeNameEn
          }
          this.gradeOptions.push(e)
        }
      })
    },
    onGradeChange() {
      // 根据年级找班级
      this.classOptions = []
      this.temp.classId = ''
      this.userOptions = []
      this.temp.userId = ''
      const params = { gradeId: this.temp.gradeId }
      selectClass(params).then(res => {
        for (var i = 0; i < res.length; i++) {
          var element = res[i]
          const e = {
            value: element.id + '',
            label: element.className,
            labelEn: element.classNameEn
          }
          this.classOptions.push(e)
        }
      })
    },
    onClassChange() {
      // 根据班级找人
      this.userOptions = []
      this.temp.userId = ''
      const p = { classId: this.temp.classId }
      selectStu(p).then(res => {
        for (var i = 0; i < res.length; i++) {
          var element = res[i]
          const e = {
            value: element.id + '',
            label: element.studentName
          }
          this.userOptions.push(e)
        }
      })
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          addCommentManage(this.temp).then(() => {
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
    // 编辑的时候配置参数
    configTemp(item) {
      this.temp = {
        id: item.id,
        userId: item.userId + '',
        gradeId: item.gradeId + '',
        classId: item.classId + '',
        comment: item.comment
      }

      // 配置年级
      this.gradeOptions = []
      listSysGrade().then(res => {
        for (var i = 0; i < res.list.length; i++) {
          var element = res.list[i]
          const e = {
            value: element.id + '',
            label: element.gradeName,
            labelEn: element.gradeNameEn
          }
          this.gradeOptions.push(e)
        }
      })

      // 根据年级找班级
      this.classOptions = []
      const params = { gradeId: item.gradeId }
      selectClass(params).then(res => {
        for (var i = 0; i < res.length; i++) {
          var element = res[i]
          const e = {
            value: element.id + '',
            label: element.className,
            labelEn: element.classNameEn
          }
          this.classOptions.push(e)
        }
      })

      // 根据班级找人
      this.userOptions = []
      const p = { classId: item.classId }
      selectStu(p).then(res => {
        for (var i = 0; i < res.length; i++) {
          var element = res[i]
          const e = {
            value: element.id + '',
            label: element.studentName
          }
          this.userOptions.push(e)
        }
      })
    },
    handleUpdate(row) {
      this.configTemp(row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          updateCommentManage(this.temp).then(() => {
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
        deleteCommentManage(params)
          .then(() => {
            _vue.getList()
          })
          .catch(e => {})
      })
    }
  }
}
</script>




