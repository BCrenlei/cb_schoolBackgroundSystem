<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('operate.add')}}</el-button>
    </div>
    <div class="tables">
      <div class="table-area">
        <el-table ref="multipleTable" row-key="id" :expand-row-keys="expands" class="table" :highlightCurrentRow="true" :data="tableData.dataSource" border :empty-text='renderlanguage(tableData.transformLang.empty)' tooltip-effect="dark" show-overflow-tooltip="true" style="width: 100%;">
          <!-- 编辑 -->
          <el-table-column type="expand">
            <template slot-scope="props">

              <el-form v-if="tableData.dataSource[props.$index].id==undefined " :model="ruleForm" label-position="right" inline :rules="rules" ref="ruleForm" status-icon>

                <el-form-item :prop="renderlanguage(tableData.propArr[index])" v-if="showflag(renderlanguage(tableData.propArr[index]),index,true)" v-for="(label,index) in tableData.labelArr" :key="label" label-width="100px" :label="renderlanguage(label)" style="width:350px;">

                  <area-cascader v-bind:class="{borderColor:tableData.dataSource[props.$index].isborderColor}" v-if="tableData.propArr[index].indexOf('schoolAddress')!=-1" :data="areaData" @change="changeStyle($event, props.$index)" :level="1" type="text" placeholder="请选择地区" v-model="ruleForm[renderlanguage([tableData.propArr[index]])]"></area-cascader>

                  <div v-else-if="tableData.propArr[index].indexOf('logo')!=-1 || tableData.propArr[index].indexOf('qrCodeLink')!=-1">
                    <img v-if="tableData.dataSource[props.$index].id!=undefined" :src="tableData.dataSource[props.$index][[tableData.propArr[index]]]" alt="" height="100">
                    <span v-else @click="tempUpload($event,props.$index)">
                      <el-upload class="avatar-uploader" :show-file-list="false" action="http://upload.qiniup.com" :on-success="handleAvatarSuccess" :before-upload="beforeUpload" :data="form">
                        <img v-if="tableData.dataSource[props.$index].logo" :src="tableData.dataSource[props.$index].logo" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                      </el-upload>
                    </span>
                  </div>

                  <el-select v-else-if="tableData.propArr[index].indexOf('status')!=-1" v-model="ruleForm[renderlanguage([tableData.propArr[index]])]" placeholder="请选择" size="mini" style="width:120px;">
                    <el-option v-for="item in statusOptions" :key="item.status" :label="item.label" :value="item.status">
                    </el-option>
                  </el-select>

                  <el-select v-else-if="tableData.propArr[index]=='classification'" v-model="ruleForm[renderlanguage([tableData.propArr[index]])]" placeholder="请选择" size="mini" style="width:120px;">
                    <el-option v-for="item in schoolTypeOption" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>

                  <el-input v-else v-model="ruleForm[renderlanguage([tableData.propArr[index]])]" type="text"></el-input>
                </el-form-item>

                <el-form-item label=" " label-width="100px" style="width:90%;">
                  <el-button type="primary" @click="submitForm('ruleForm',tableData.dataSource[props.$index],props.$index)">保存</el-button>
                </el-form-item>
              </el-form>

              <el-form v-else :model="tableData.dataSource[props.$index].form" label-position="right" inline :rules="rules2" ref="ruleForm2" status-icon>
                <el-form-item :prop="renderlanguage(tableData.propArr[index])" v-if="showflag(renderlanguage(tableData.propArr[index]),index)" v-for="(label,index) in tableData.labelArr" :key="label" label-width="100px" :label="renderlanguage(label)" style="width:350px;">
                  <div v-if="tableData.propArr[index].indexOf('schoolAddress')!=-1">

                    <area-cascader v-bind:class="{borderColor:tableData.dataSource[props.$index].isborderColor}" :data="areaData" @change="changeStyle($event, props.$index)" :level="1" type="text" placeholder="请选择地区" v-model="tableData.dataSource[props.$index].form[tableData.propArr[index]].split('/')"></area-cascader>
                  </div>
                  <div v-else-if="tableData.propArr[index].indexOf('logo')!=-1 || tableData.propArr[index].indexOf('qrCodeLink')!=-1">
                    <span @click="tempUpload($event,props.$index)">
                      <el-upload class="avatar-uploader" :show-file-list="false" action="http://upload.qiniup.com" :on-success="handleAvatarSuccess" :before-upload="beforeUpload" :data="form">
                        <img v-if="tableData.dataSource[props.$index][tableData.propArr[index]]" :src="tableData.dataSource[props.$index][tableData.propArr[index]]" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                      </el-upload>
                    </span>
                  </div>
                  <el-select v-else-if="tableData.propArr[index]=='classification'" v-model="tableData.dataSource[props.$index].form[tableData.propArr[index]]" placeholder="请选择" size="mini" style="width:120px;">
                    <el-option v-for="item in schoolTypeOption" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                  <div v-else>
                    <!-- <span>{{tableData.dataSource[props.$index].form[tableData.propArr[index]]}}</span> -->
                    <div v-if="tableData.propArr[index]=='password'">
                      <el-input v-if="tableData.propArr[index]=='password'" @change="changePassword($event,tableData.dataSource[props.$index].form)" type="text"></el-input>
                      <input style="display:none;" type="text" v-model="tableData.dataSource[props.$index].form[tableData.propArr[index]]">
                    </div>

                    <el-input v-else v-model="tableData.dataSource[props.$index].form[tableData.propArr[index]]" type="text"></el-input>
                  </div>

                </el-form-item>
                <el-form-item label=" " label-width="100px" style="width:90%;">
                  <el-button type="primary" @click="submitForm('ruleForm2',tableData.dataSource[props.$index],props.$index)">保存</el-button>
                </el-form-item>
              </el-form>

            </template>
          </el-table-column>

          <!-- 列表 -->
          <el-table-column v-for="(label,index) in tableData.labelArr" v-if="showflag(renderlanguage(tableData.propArr[index]),index,false)" :prop="renderlanguage(tableData.propArr[index])" :label="renderlanguage(label)"  align="center" :key="index" headerAlign="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ handleValue(index,scope) }}</span>
            </template>
          </el-table-column>

          <!-- 按钮 -->
          <el-table-column :label="renderlanguage(tableData.transformLang.actions)" headerAlign="center" width="160">
            <template slot-scope="scope">
              <el-button v-for="(operate,index) in tableData.operateArr" :class="tableData.operateHandleClassArr[index]" :key="index" size="small" @click="getMsgFromTable({operateName: operate,rowData: scope.row, index:scope.$index })">
                {{renderlanguage(operate)}}
              </el-button>
            </template>
          </el-table-column>

        </el-table>
        <!-- <input v-model="testLang"> -->
      </div>
    </div>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.currentPage" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :page-count="listQuery.totalPage">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { getToken } from '@/api/common'
Array.prototype.remove = function(val) {
  const index = this.indexOf(val)
  if (index > -1) {
    this.splice(index, 1)
  }
}
import { pcaa } from 'area-data'
import {
  schoolList,
  addSchool,
  deleteSchool,
  updateSchool
} from '@/api/school'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'

import Tables from '@/components/Tables'
// import  GithubCorner  from '@/components/GithubCorner'

export default {
  name: 'schoolM',
  directives: {
    waves
  },
  components: {
    Tables
  },
  data() {
    var checkLogo = (rule, value, callback) => {
      callback()
    }
    return {
      /** *******************图片上传*****************/
      // 点击的是哪个upload
      tempUploadObj: '',
      // 上传成功，需要把得到的图片赋值给列表里面的某一条的logo,但是我的需要知道index
      tempIndex: '',
      // 图片上传成功的图片存储
      imageUrl: '',
      /** *******************表单 数据验证*****************/
      // 新增一条记录。这个记录里面默认数据，跟下面的ruleForm数据相仿，后期后处理掉
      temp: {
        schoolName: '',
        type: '',
        Address: '',
        detailedAddress: '',
        Profiles: '',
        hostline: '',
        logo: '',
        qrCodeLink: '',
        administrators: '',
        password: '',
        adminPhone: '',
        nickname: ''
      },
      // form 对应的表单默认取值； 新增记录的时候需要用到他，但是编辑的话 就应该默认设置成 编辑的那条记录里面的数据
      ruleForm: {
        schoolName: '', // 学校名称
        classification: '', // 分类
        schoolAddress: '', // 学校地址
        detailedAddress: '', // 渎职详情
        schoolProfile: '', // 学校介绍
        administrators: '', // 管理员 帐号
        password: '', // 管理员密码
        logo: '', // 学校logo
        hotline: '', // 客服电话
        adminPhone: ''
      },

      // form 对应的表单默认取值； 新增记录的时候需要用到他，但是编辑的话 就应该默认设置成 编辑的那条记录里面的数据 ,这里是编辑的时候临时转变
      ruleForm2: {
        schoolName: '', // 学校名称
        classification: '', // 分类
        schoolAddress: '', // 学校地址
        detailedAddress: '', // 渎职详情
        schoolProfile: '', // 学校介绍
        administrators: '', // 管理员 帐号
        password: '', // 管理员密码
        logo: '', // 学校logo
        hotline: '', // 客服电话
        adminPhone: ''
      },
      // 表单验证规则
      rules: {
        id: [
          {
            required: true,
            message: '必填项',
            trigger: 'blur'
          }
        ],
        classification: [
          {
            required: true,
            message: '必填项',
            trigger: 'blur'
          }
        ],
        schoolName: [
          {
            required: true,
            message: '必填项',
            trigger: 'blur'
          }
        ],
        schoolNameEn: [
          {
            required: true,
            message: '必填项',
            trigger: 'blur'
          }
        ],
        detailedAddressEn: [
          {
            required: true,
            message: '必填项',
            trigger: 'blur'
          }
        ],
        schoolAddress: [
          {
            required: true,
            message: '必填项',
            trigger: 'change'
          }
        ],
        detailedAddress: [
          {
            required: true,
            message: '必填项',
            trigger: 'blur'
          }
        ],
        administrators: [
          {
            required: true,
            message: '必填项',
            trigger: 'blur'
          }
        ],
        logo: [
          {
            validator: checkLogo,
            message: '必填项',
            required: true,
            trigger: 'click'
          }
        ],
        status: [
          {
            required: true,
            message: '必填项',
            trigger: 'change'
          }
        ],
        schoolProfiles: [
          {
            required: true,
            message: '必填项',
            trigger: 'blur'
          }
        ],
        hotline: [
          {
            required: true,
            message: '必填项',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '必填项',
            trigger: 'blur'
          }
        ],
        adminPhone: [
          {
            required: true,
            message: '必填项',
            trigger: 'blur'
          }
        ]
      },
      rules2: {
        id: [
          {
            required: true,
            message: '必填项',
            trigger: 'blur'
          }
        ],
        classification: [
          {
            required: true,
            message: '必填项',
            trigger: 'blur'
          }
        ],
        schoolName: [
          {
            required: true,
            message: '必填项',
            trigger: 'blur'
          }
        ],
        schoolNameEn: [
          {
            required: true,
            message: '必填项',
            trigger: 'blur'
          }
        ],
        detailedAddressEn: [
          {
            required: true,
            message: '必填项',
            trigger: 'blur'
          }
        ],
        schoolAddress: [
          {
            required: true,
            message: '必填项',
            trigger: 'change'
          }
        ],
        detailedAddress: [
          {
            required: true,
            message: '必填项',
            trigger: 'blur'
          }
        ],
        administrators: [
          {
            required: true,
            message: '必填项',
            trigger: 'blur'
          }
        ],
        logo: [
          {
            validator: checkLogo,
            required: true,
            message: '必填项',
            trigger: 'click'
          }
        ],
        status: [
          {
            required: true,
            message: '必填项',
            trigger: 'change'
          }
        ],
        schoolProfiles: [
          {
            required: true,
            message: '必填项',
            trigger: 'blur'
          }
        ],
        hotline: [
          {
            required: true,
            message: '必填项',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '必填项',
            trigger: 'blur'
          }
        ]
      },
      /** *******************cascader相关*****************/
      // 地区选择数据
      areaData: pcaa,

      /** *******************表格处理*****************/
      // 展开列表临时数组
      expands: [],
      // 学校状态选择
      statusOptions: [
        {
          status: '禁用',
          label: '禁用'
        },
        {
          status: '启用',
          label: '启用'
        }
      ],
      schoolTypeOption: [
        {
          label: '书院',
          value: '1'
        },
        {
          label: '社区',
          value: '2'
        },
        {
          label: '企业',
          value: '3'
        },
        {
          label: '学校',
          value: '4'
        }
      ],
      tableData: {
        labelArr: [
          'list.id',
          'list.school',
          'list.type',
          'list.intro',
          'list.hotline',
          'list.address',
          'list.detailedAddress',
          'list.admin',
          'list.password',
          'list.adminPhone',
          'list.adminNickName',
          'list.logo'
        ],
        propArr: [
          'id',
          'schoolName',
          'classification',
          'schoolProfiles',
          'hotline',
          'schoolAddress',
          'detailedAddress',
          'administrators',
          'password',
          'adminPhone',
          'nickname',
          'logo'
        ],
        transformLang: {
          actions: 'operate.actions', // 操作
          empty: 'msg.empty' // 空数据时显示
        },
        operateArr: [
          'operate.edit',
          // 'operate.forbidden',
          'operate.delete'
        ],
        operateHandleClassArr: ['edit', 'disabled', 'delete'],
        listLoading: true,
        dataSource: []
      },
      // 翻页
      listQuery: {
        limit: 20, // 每页显示多少条数据
        currentPage: 1, // 当前第几页
        totalPage: 10, // 总页数
        total: 10 // 总共有多少条
      },

      typeOptions: {
        '1': '书院',
        '2': '社区',
        '3': '企业',
        '4': '学校'
      },

      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: this.$t('operate.edit'),
        create: this.$t('operate.add')
      },
      dialogPvVisible: false,
      pvData: [],
      downloadLoading: false,
      form: {},
      key: '',
      token: '',
      address: '',
      updateIcon: ''
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '1': '书院',
        '2': '社区',
        '3': '企业',
        '4': '学校'
      }
      return statusMap[status]
    }
  },
  created() {
    this.getList(this.listQuery.currentPage, this.listQuery.limit)
  },
  methods: {
    // 表哥行点击
    rowClick(row, event, column) {
      if (this.expands.indexOf(row.id) < 0) {
        this.expands.push(row.id)
      } else {
        this.expands.remove(row.id)
      }
    },
    // 显示条件，因为因为版本需要显示英文api中文显示中文api
    showflag(obj, index, flag) {
      if (flag) {
        if (
          obj.indexOf('createTime') == -1 &&
                    this.tableData.propArr[index] != 'id'
        ) {
          return true
        } else {
          return false
        }
      } else {
        if (
          obj.indexOf('createTime') == -1 &&
                    this.tableData.propArr[index] != 'id' &&
                    this.tableData.propArr[index] != 'password'
        ) {
          return true
        } else {
          return false
        }
      }
    },
    getMsgFromTable(args) {
      if (!this.tableData.dataSource[0].id) {
        this.tableData.dataSource.splice(0, 1)
        return
      }
      const operate = args.operateName
      const rowData = args.rowData
      const index = args.index
      if (operate.indexOf('edit') != -1) {
        this.rowClick(rowData)
      } else {
        const _vue = this
        this.$confirm('确定删除此学校?', '提示', {
          confirmButtonText: '确定',
          showCancelButton: false,
          type: 'warning'
        }).then(() => {
          deleteSchool({
            institutionId: args.rowData.id
          })
            .then(response => {
              this.$message('删除成功')
              _vue.getList(
                _vue.listQuery.currentPage,
                _vue.listQuery.limit
              )
            })
            .catch(e => {})
        })
      }
    },
    getList(currentPage, pageRow) {
      this.tableData.listLoading = true
      schoolList({
        pageNum: currentPage,
        pageRow: pageRow
      }).then(response => {
        // 设置总条数
        this.listQuery.total = response.totalCount
        // 总页数
        this.listQuery.totalPage = response.totalPage
        this.tableData.dataSource = []
        var tempArray = []
        for (var i = 0; i < response.list.length; i++) {
          const ele = response.list[i]
          ele.isborderColor = false
          ele.form = JSON.parse(JSON.stringify(ele))
          ele.status = ele.status
            ? this.$t('operate.normal')
            : this.$t('operate.forbidden')
          tempArray.push(ele)
        }
        this.tableData.dataSource = tempArray
        this.listLoading = true
        console.log(this.tableData.dataSource)
      })
    },
    handleFilter() {
      this.listQuery.currentPage = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList(1, val)
    },
    handleCurrentChange(val) {
      this.listQuery.currentPage = val
      this.getList(val, this.listQuery.limit)
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    handleCreate() {
      if (this.tableData.dataSource.length == 0) {
        this.tableData.dataSource.unshift(this.temp)
        this.expands.push(this.temp.id)
      } else {
        if (this.tableData.dataSource[0].id == undefined) {
          this.$message('已经有一个新建学校，但是没有保存')
        } else {
          this.temp.schoolName = ''
          this.temp.type = ''
          this.temp.Address = ''
          this.temp.detailedAddress = ''
          this.temp.Profiles = ''
          this.temp.hostline = ''
          this.temp.logo = ''
          this.temp.qrCodeLink = ''
          this.temp.administrators = ''
          this.temp.password = ''
          this.temp.adminPhone = ''
          this.temp.nickname = ''

          this.tableData.dataSource.unshift(this.temp)
          this.expands.push(this.temp.id)
        }
      }
    },
    // cascaderChange 数据初始化从后来拿的时候 是一个字符串，*/*/* ， 因此可以直接用.split('/') 编程插件所需要的取值模式；
    // 但是cascader取值在变化的时候，取值是一个数组，并非后台的字符串类型，因此需e.toString()。
    // 这样 :value 娶到的值就一直是字符春类型
    // 为什么不用 v-model 而用:value + change 就是发现v-model 不能绑定函数。
    cascaderChange(index1, index2, e) {
      this.tableData.dataSource[index1][
        this.renderlanguage([this.tableData.propArr[index2]])
      ] = e.toString()
    },
    // 表单验证
    submitForm(formName, obj, index) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!obj.id) {
            this.ruleForm.logo = this.tableData.dataSource[
              this.tempIndex
            ].logo
            this.ruleForm.schoolAddress = this.ruleForm.schoolAddress
              .toString()
              .replace(/\,/g, '/')
            addSchool(this.ruleForm).then(response => {
              this.$message('新增成功')
              this.getList()
            })
          } else {
            obj.form.logo = this.tableData.dataSource[index].logo
            obj.form.schoolAddress = this.tableData.dataSource[
              index
            ].form.schoolAddress
              .toString()
              .replace(/\,/g, '/')

            delete obj.form.createTime
            delete obj.form.updateTime

            updateSchool(obj.form).then(response => {
              this.$message('修改成功')
              this.expands = []
              this.getList()
            })
          }
        } else {
          this.$message('表单木有填写完整~')
          return false
        }
      })
    },
    renderlanguage(string) {
      return this.$t(string)
    },
    // 图片上传
    handleAvatarSuccess(res, file, obj) {
      this.tableData.dataSource[this.tempIndex].logo =
                this.address + encodeURIComponent(res.key)

      this.tempUploadObj.parentNode.style = 'border:1px solid #67c23a;'
      // $('.el-form-item__error')
      const querySelectorAll = document.querySelectorAll(
        '.el-form-item__error'
      )
      const len = document.querySelectorAll('.el-form-item__error')
        .length
      for (var i = 0; i < len; i++) {
        if (querySelectorAll[i].innerText.indexOf('logo') != -1) {
          querySelectorAll[i].remove()
        }
      }
    },
    // tempUpload 图片上传也需要验证，这个函数用来临时存储 当我点击上传文件之后，就要把点击的这个uopoad对象存一下，用来将来给这个元素加样式
    tempUpload(event, index) {
      this.tempUploadObj = event.target
      this.tempIndex = index
    },
    // chanegStyle
    changeStyle(e, index) {
      if (!this.tableData.dataSource[index].id) {
        this.tableData.dataSource[index].isborderColor = true
        const querySelectorAll = document.querySelectorAll(
          '.el-form-item__error'
        )
        const len = document.querySelectorAll('.el-form-item__error')
          .length
        for (var i = 0; i < len; i++) {
          if (
            querySelectorAll[i].innerText.indexOf(
              'schoolAddress is required'
            ) != -1
          ) {
            querySelectorAll[i].remove()
          }
        }
      }
    },
    beforeUpload(file) {
      const isJPG =
                file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG、png 格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        return false
      }
      const curr = moment()
        .format('YYYYMMDD')
        .toString()
      const prefix = moment(file.lastModified)
        .format('HHmmss')
        .toString()
      const suffix = file.name
      // const key = `${curr}${prefix}_${suffix}`
      const key = encodeURI(`${curr}${prefix}`)

      return getToken().then(response => {
        this.address = response.address
        this.token = response.token
        this.form = {
          key,
          token: this.token
        }
      })
    },
    changePassword(value, noneInput) {
      noneInput.password = value
    },

    handleValue(index, scope) {
      var key = this.tableData.propArr[index]

      if (key == 'classification') {
        return this.typeOptions[scope.row[key]]
      } else {
        return scope.row[key]
      }
    }
  }
}
</script>
<style>
.tables {
    width: 100%;
}

.table-area {
    padding-left: 0.3rem;
    margin-top: 0.2rem;
}

.area-select .area-selected-trigger {
    line-height: 30px;
    padding: 0px 20px 0px 12px;
}

.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409eff;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 96px;
    height: 96px;
    line-height: 96px;
    text-align: center;
}

.avatar {
    width: 96px;
    height: 96px;
    display: block;
}

.borderColor .area-select {
    border: 1px solid #67c23a;
}
</style>

