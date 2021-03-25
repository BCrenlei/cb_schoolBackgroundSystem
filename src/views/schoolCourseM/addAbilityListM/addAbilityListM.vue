<template>
  <transition name="fade" mode="out-in">
    <div class="app-container calendar-list-container">
      <div class="filter-container">
        <el-button v-if="g_hasPerm('ability:add')" class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('operate.add')}}</el-button>
        <div class="table-area">
          <el-table ref="multipleTable" class="table" :highlightCurrentRow="true" :data="dataTotal.dataSource" border :empty-text="$t('msg.empty')" tooltip-effect="dark" show-overflow-tooltip="true" style="width: 100%;">

            <el-table-column align="center" v-for="(label,index) in dataTotal.labelArr" :prop="renderlanguage(dataTotal.propArr[index])" :label="renderlanguage(label)" :key="index" headerAlign="center" show-overflow-tooltip>
            </el-table-column>
            
            <el-table-column align="center" :label="$t('operate.actions')" width="220" class-name="small-padding fixed-width" v-if="g_hasPerm('ability:update') ||g_hasPerm('ability:delete') ">
              <template slot-scope="scope">
                <el-button v-if="g_hasPerm('ability:update')" type="primary" icon="edit" @click="handleUpdate(scope.row)">{{$t('operate.edit')}}
                </el-button>
                <el-button v-if="g_hasPerm('ability:delete')" type="danger" icon="delete" @click="handleDelete(scope.$index,scope.row)">
                  {{$t('operate.delete')}}
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <div class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageRow" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
          </div>

        </div>

        <el-dialog  title="Create" :visible.sync="dialogFormVisible">
          <el-form ref="temp" :model="temp" label-position="right" label-width="130px" style='width: 500px; margin-left:50px;'>
             <el-form-item :label="$t('new.categoryName')">
              <el-select v-model="temp.categoryId" @change="onCategoryChange" placeholder="Please select">
                <el-option v-for="item in  typeOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

           <el-form-item :label="$t('new.abilityCategoryName')">
              <el-select v-model="temp.abilityCategoryId"  placeholder="Please select">
                <el-option v-for="item in abilityOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item :label="$t('new.capabilityName')">
              <el-input v-model="temp.capabilityName"></el-input>
            </el-form-item>

           <el-form-item :label="$t('new.grade')">
              <el-select v-model="temp.gradeId" @change="onGradeChange" placeholder="Please select">
                <el-option v-for="item in  gradeOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

           <el-form-item :label="$t('new.course')">
              <el-select v-model="temp.courseId" multiple default-first-option placeholder="Please select">
                <el-option v-for="item in courseOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>


          </el-form>
          <div v-if="dialogStatus!='Look'" slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">{{$t('new.cancel')}}</el-button>
            <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('new.confirm')}}</el-button>
            <el-button v-else type="primary" @click="updateData">{{$t('new.confirm')}}</el-button>
          </div>
        </el-dialog>

      </div>
    </div>
  </transition>
</template>

<script>
import moment from 'moment'
import {
  listAbility,
  listAbilityCategoryAll,
  listNewCategory,
  listSysGrade,
  addAbility,
  deleteAbility,
  updateAbility
} from '@/api/ability'
import { selectCourse } from '@/api/common'
export default {
  name: 'addAbilityList',
  data() {
    return {
      dataTotal: {
        labelArr: [
          'list.id',
          'list.categoryName', // 类别
          'list.abilityName', // 能力分类名称
          'list.capabilityName', // 能力名称
          'list.courseName', // 课程名字
          'list.createTime', // 发布时间
          // 'list.deleteStatus' // 状态
        ],
        propArr: [
          'id',
          'categoryName',
          'abilityCategoryName',
          'capabilityName',
          'courseName',
          'createTime',
          // 'deleteStatus'
        ],
        operateArr: ['operate.allow'],
        operateHandleClassArr: ['edit', 'disabled', 'delete'],
        listLoading: true,
        dataSource: []
      },
      total: null,
      listQuery: {
        pageNum: 1,
        pageRow: 20
      },
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      temp: {
        abilityCategoryId: '',
        capabilityName: '', // 能力名称
        categoryId: '', // 类别id
        courseId: [], // 课程id
        gradeId: '' // 年纪id
      },
      dialogStatus: '',
      dialogFormVisible: false,

      typeOptions: [],
      gradeOptions: [],
      courseOptions: [],
      abilityOptions: []
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 翻译
    renderlanguage(string) {
      return this.$t(string)
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
    getList() {
      listAbility(this.listQuery).then(res => {
        var data = res.list
        this.total = res.totalCount

        data.forEach(function(value, index, array) {
          value.createTime = moment(value.createTime)
            .format('YYYY-MM-DD')
            .toString()
        })
        this.dataTotal.dataSource = data
      })
    },
    resetTemp() {
      this.temp.courseId = ''
      this.temp = {
        abilityCategoryId: '',
        capabilityName: '', // 能力名称
        categoryId: '', // 类别id
        courseId: [], // 课程id
        gradeId: '' // 年纪id
      }
      this.typeOptions = []
      this.gradeOptions = []
      this.courseOptions = []
      this.abilityOptions = []
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.resetTemp()
      this.dialogFormVisible = true
      this.configAddOptions()
    },
    configAddOptions() {
      // 配置类别
      const p = {
        module: '4'
      }
      // 分类接口
      listNewCategory(p).then(res => {
        const data = res
        for (var i = 0; i < data.length; i++) {
          this.typeOptions.push({
            value: data[i].id + '',
            label: data[i].typeName
          })
        }
      })
      // 年级选择
      listSysGrade().then(res => {
        const data = res.list
        for (var i = 0; i < data.length; i++) {
          this.gradeOptions.push({
            value: data[i].id + '',
            label: data[i].gradeName
          })
        }
      })
    },
    configCourse() {
      this.courseOptions = []
      if (this.temp.gradeId != '' && this.categoryId != '') {
        var p = {
          gradeId: this.temp.gradeId,
          categoryId: this.temp.categoryId
        }
        selectCourse(p).then(res => {
          const data = res
          for (var i = 0; i < data.length; i++) {
            this.courseOptions.push({
              value: data[i].id + '',
              label: data[i].courseName
            })
          }
        })
      }
    },
    onCategoryChange() {
      this.configCourse()

      this.abilityOptions = []
      var p = { categoryId: this.temp.categoryId }
      listAbilityCategoryAll(p).then(res => {
        const data = res
        for (var i = 0; i < data.length; i++) {
          this.abilityOptions.push({
            value: data[i].id + '',
            label: data[i].abilityCategoryName
          })
        }
      })
    },
    onGradeChange() {
      this.configCourse()
    },
    createData() {
      const resultgradeArray = []
      this.temp.courseId.forEach(function(value1, index1, array) {
        resultgradeArray.push({
          courseId: value1
        })
      })
      const obj = JSON.stringify(this.temp)
      const obj2 = JSON.parse(obj)
      obj2.courseId = resultgradeArray

      addAbility(obj2).then(res => {
        this.$notify({
          title: this.$t('msg.success'),
          message: this.$t('msg.createSuccess'),
          type: 'success',
          duration: 1000
        })
        this.getList()
        this.dialogFormVisible = false
      })
    },
    updateData() {
      const resultgradeArray = []
      this.temp.courseId.forEach(function(value1, index1, array) {
        resultgradeArray.push({
          courseId: value1
        })
      })
      const obj = JSON.stringify(this.temp)
      const obj2 = JSON.parse(obj)
      obj2.courseId = resultgradeArray
      updateAbility(obj2).then(res => {
        this.$notify({
          title: this.$t('msg.success'),
          message: this.$t('msg.updateSuccess'),
          type: 'success',
          duration: 1000
        })
        this.getList()
        this.dialogFormVisible = false
      })
    },
    handleUpdate(row) {
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.resetTemp()
      this.configTemp(row)
    },
    // 删除能力记录
    handleDelete(index, row) {
      deleteAbility({ id: row.id }).then(res => {
        this.resetTemp()
        this.getList()

        this.$notify({
          title: this.$t('msg.success'),
          message: this.$t('msg.deleteSuccess'),
          type: 'success',
          duration: 1000
        })
      })
    },
    // 编辑的时候配置参数
    configTemp(item) {
      this.configAddOptions()
      this.temp.gradeId = item.gradeId + ''
      this.temp.categoryId = item.categoryId + ''

      this.temp.capabilityName = item.capabilityName
      this.temp.abilityCategoryId = item.abilityCategoryId + ''

      this.temp.id = item.id

      this.configCourse()

      var arr = JSON.parse(item.courseId)
      for (let i = 0; i < arr.length; i++) {
        const ele = arr[i]
        this.temp.courseId.push(ele.courseId + '')
      }

      this.abilityOptions = []
      var p = { categoryId: this.temp.categoryId }
      listAbilityCategoryAll(p).then(res => {
        const data = res
        for (var i = 0; i < data.length; i++) {
          this.abilityOptions.push({
            value: data[i].id + '',
            label: data[i].abilityCategoryName
          })
        }
      })
    }
  }
}
</script>
