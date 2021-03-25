<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">

      <el-tabs v-model="activeName">
        <el-tab-pane label="基本资料" name="first">
          <div style="padding-left:50px">
            <el-form :model="temp" :rules="rules" ref="temp" label-width="120px">
              <el-form-item :label="$t('new.headPortrait')" prop="icon">
                <el-upload ref="upload" class="editor-slide-upload" action="http://upload.qiniup.com" :multiple="false" :file-list="fileList" :show-file-list="true" :limit="1" list-type="picture-card" :on-remove="handleRemove" :on-success="handleSuccess" :before-upload="beforeUpload" :data="form">
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
              </el-form-item>
            </el-form>
          </div>

          <el-row>
            <el-col :span="10">
              <div style="padding-left:50px">
                <el-form :model="temp" :rules="rules" ref="temp" label-width="120px">
                  <el-form-item :label="$t('new.name')" prop="studentName">
                    <el-input v-model="temp.studentName"></el-input>
                  </el-form-item>

                  <el-form-item :label="$t('new.phoneNumber')" prop="mobile">
                    <el-input v-model="temp.mobile"></el-input>
                  </el-form-item>

                  <el-form-item :label="$t('new.password')" prop="password">
                    <el-input v-model="temp.password"></el-input>
                  </el-form-item>

                  <el-form-item :label="$t('new.nickName')" prop="nickName">
                    <el-input v-model="temp.nickName"></el-input>
                  </el-form-item>

                  <el-form-item :label="$t('new.grade')" prop="nowGradeId">
                    <el-select v-model="temp.nowGradeId" @change="onGradeChange">
                      <el-option v-for="item in gradeOptions" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item :label="$t('new.class')" prop="nowClassId">
                    <el-select v-model="temp.nowClassId" @change="onClassChange">
                      <el-option v-for="item in classOptions" :key="item.value" :label="item.label" :value="item.value">
                        <span style="float: left">{{ item.label }}</span>
                      </el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item :label="$t('new.passport')" prop="passport">
                    <el-input v-model="temp.passport"></el-input>
                  </el-form-item>

                  <el-form-item :label="$t('new.currentSchool')" prop="currentSchool">
                    <el-input v-model="temp.currentSchool"></el-input>
                  </el-form-item>

                  <el-form-item :label="$t('new.currentGrade')" prop="currentGrade">
                    <el-input v-model="temp.currentGrade"></el-input>
                  </el-form-item>

                </el-form>
              </div>
            </el-col>
            <el-col :span="4">&nbsp;</el-col>
            <el-col :span="10">
              <div style="padding-right:50px">

                <el-form :model="temp" :rules="rules" ref="temp" label-width="120px">

                  <el-form-item :label="$t('new.nameEn')" prop="studentNameEn">
                    <el-input v-model="temp.studentNameEn"></el-input>
                  </el-form-item>

                  <el-form-item :label="$t('new.birthday')" prop="birthday">
                    <el-date-picker v-model="temp.birthday" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy/MM/dd">
                    </el-date-picker>
                  </el-form-item>

                  <el-form-item :label="$t('new.sex')" prop="sex">
                    <el-select v-model="temp.sex">
                      <el-option v-for="item in sexOptions" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item :label="$t('new.householRegister')" prop="icon">
                    <area-cascader :data="areaData" v-model="temp.householRegister" :level="1" type="text"></area-cascader>
                    <el-input v-model="temp.householRegisterDetails"></el-input>
                  </el-form-item>

                  <el-form-item :label="$t('new.seniorEntranceScore')" prop="zhongkaoScore">
                    <el-input v-model="temp.zhongkaoScore"></el-input>
                  </el-form-item>

                  <el-form-item :label="$t('new.collegeEntranceScore')" prop="collegeEntranceScore">
                    <el-input v-model="temp.collegeEntranceScore"></el-input>
                  </el-form-item>

                  <el-form-item :label="$t('new.screScore')" prop="screScore">
                    <el-input v-model="temp.screScore"></el-input>
                  </el-form-item>

                  <el-form-item :label="$t('new.email')" prop="email">
                    <el-input v-model="temp.email"></el-input>
                  </el-form-item>

                </el-form>
              </div>
            </el-col>
          </el-row>
          <div style="padding:0 50px">
            <el-form :model="temp" :rules="rules" ref="temp" label-width="120px">
              <el-form-item :label="$t('new.interest')">
                <el-checkbox-group v-model="interestOptions">
                  <el-checkbox label="自然学科" name="type"></el-checkbox>
                  <el-checkbox label="人文科学" name="type"></el-checkbox>
                  <el-checkbox label="商科" name="type"></el-checkbox>
                  <el-checkbox label="艺术" name="type"></el-checkbox>
                  <el-checkbox label="其他" name="type"></el-checkbox>
                  <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6}" v-model="temp.interest"></el-input>

                </el-checkbox-group>
              </el-form-item>
              <el-form-item :label="$t('new.readme')" prop="readme">
                <el-input type="textarea" :maxlength="200" :autosize="{ minRows: 2, maxRows: 6}" v-model="temp.readme"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="入学信息" name="second">
          <el-row>
            <el-col :span="10">
              <div style="padding:20px 50px 50px">
                <el-form :model="temp" :rules="rules" ref="temp" label-width="120px">
                  <el-form-item :label="$t('new.writtenExamScore')" prop="writtenExamScore">
                    <el-input v-model="temp.writtenExamScore"></el-input>
                  </el-form-item>

                  <el-form-item :label="$t('new.admissionGrade')" prop="admissionGrade">
                    <el-input v-model="temp.admissionGrade"></el-input>
                  </el-form-item>
                </el-form>
              </div>
            </el-col>
            <el-col :span="4">&nbsp;</el-col>
            <el-col :span="10">
              <div style="padding:20px 50px 50px 0">
                <el-form :model="temp" :rules="rules" ref="temp" label-width="120px">
                  <el-form-item :label="$t('new.examTime')" prop="examTime">
                    <el-date-picker v-model="temp.examTime" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy/MM/dd">
                    </el-date-picker>
                  </el-form-item>

                  <el-form-item :label="$t('new.admissionTime')" prop="admissionTime">
                    <el-date-picker v-model="temp.admissionTime" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy/MM/dd">
                    </el-date-picker>
                  </el-form-item>
                </el-form>
              </div>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="家长信息" name="third">
          <el-row>
            <el-col :span="10">
              <div style="padding:20px 50px 50px">
                <el-form :model="temp" :rules="rules" ref="temp" label-width="120px">
                  <el-form-item :label="$t('new.fatherName')" prop="fatherName">
                    <el-input v-model="temp.fatherName"></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('new.fatherPhone')" prop="fatherPhone">
                    <el-input v-model="temp.fatherPhone"></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('new.fatherOccupation')" prop="fatherOccupation">
                    <el-input v-model="temp.fatherOccupation"></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('new.fatherMailbox')" prop="fatherMailbox">
                    <el-input v-model="temp.fatherMailbox"></el-input>
                  </el-form-item>
                </el-form>
              </div>
            </el-col>
            <el-col :span="4">&nbsp;</el-col>
            <el-col :span="10">
              <div style="padding:20px 50px 50px 0">
                <el-form :model="temp" :rules="rules" ref="temp" label-width="120px">
                  <el-form-item :label="$t('new.motherName')" prop="motherName">
                    <el-input v-model="temp.motherName"></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('new.motherPhone')" prop="motherPhone">
                    <el-input v-model="temp.motherPhone"></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('new.motherOccupation')" prop="motherOccupation">
                    <el-input v-model="temp.motherOccupation"></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('new.motherMailbox')" prop="motherMailbox">
                    <el-input v-model="temp.motherMailbox"></el-input>
                  </el-form-item>
                </el-form>
              </div>
            </el-col>
          </el-row>

          <div style="padding:0 70px">
            <el-form :model="temp" :rules="rules" ref="temp" label-width="120px">
              <div style="padding-bottom:10px">{{$t('new.precautions')}}</div>
              <!-- <el-form-item :label="$t('new.precautions')" prop="precautions"> -->
                <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6}" v-model="temp.precautions"></el-input>
              <!-- </el-form-item> -->
            </el-form>
          </div>

        </el-tab-pane>

        <el-tab-pane label="学生凭证" name="fourth">

          <div style="padding:20px 50px 50px">
            <el-form :model="temp" :rules="rules" ref="temp" label-width="120px">
              <el-form-item :label="$t('new.accountPhotos')" prop="icon">
                <el-upload ref="upload" class="editor-slide-upload" action="http://upload.qiniup.com" :multiple="false" :file-list="fileList1" :show-file-list="true"  list-type="picture-card" :on-remove="handleRemove1" :on-success="handleSuccess1" :before-upload="beforeUpload" :data="form">
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
              </el-form-item>
            </el-form>

            <el-form :model="temp" :rules="rules" ref="temp" label-width="120px">
              <el-form-item :label="$t('new.oneInchPhoto')" prop="icon">
                <el-upload ref="upload" class="editor-slide-upload" action="http://upload.qiniup.com" :multiple="false" :file-list="fileList2" :show-file-list="true"  list-type="picture-card" :on-remove="handleRemove2" :on-success="handleSuccess2" :before-upload="beforeUpload" :data="form">
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
              </el-form-item>
            </el-form>

            <el-form :model="temp" :rules="rules" ref="temp" label-width="120px">
              <el-form-item :label="$t('new.idPhoto')" prop="icon">
                <el-upload ref="upload" class="editor-slide-upload" action="http://upload.qiniup.com" :multiple="false" :file-list="fileList3" :show-file-list="true"  list-type="picture-card" :on-remove="handleRemove3" :on-success="handleSuccess3" :before-upload="beforeUpload" :data="form">
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
              </el-form-item>
            </el-form>

            <el-form :model="temp" :rules="rules" ref="temp" label-width="120px">
              <el-form-item :label="$t('new.vaccinationRecord')" prop="icon">
                <el-upload ref="upload" class="editor-slide-upload" action="http://upload.qiniup.com" :multiple="false" :file-list="fileList4" :show-file-list="true"  list-type="picture-card" :on-remove="handleRemove4" :on-success="handleSuccess4" :before-upload="beforeUpload" :data="form">
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
              </el-form-item>
            </el-form>

            <el-form :model="temp" :rules="rules" ref="temp" label-width="120px">
              <el-form-item :label="$t('new.medicalReport')" prop="icon">
                <el-upload ref="upload" class="editor-slide-upload" action="http://upload.qiniup.com" :multiple="false" :file-list="fileList5" :show-file-list="true"  list-type="picture-card" :on-remove="handleRemove5" :on-success="handleSuccess5" :before-upload="beforeUpload" :data="form">
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
              </el-form-item>
            </el-form>

          </div>
        </el-tab-pane>

        <el-tab-pane label="家长凭证" name="Fifth">
          <div style="padding:20px 50px 50px">
            <el-form :model="temp" :rules="rules" ref="temp" label-width="130px">
              <el-form-item :label="$t('new.parentHouseholRegister')" prop="icon">
                <el-upload ref="upload" class="editor-slide-upload" action="http://upload.qiniup.com" :multiple="false" :file-list="fileList6" :show-file-list="true"  list-type="picture-card" :on-remove="handleRemove6" :on-success="handleSuccess6" :before-upload="beforeUpload" :data="form">
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
              </el-form-item>
            </el-form>
            <el-form :model="temp" :rules="rules" ref="temp" label-width="130px">
              <el-form-item :label="$t('new.parentIdPhoto')" prop="icon">
                <el-upload ref="upload" class="editor-slide-upload" action="http://upload.qiniup.com" :multiple="false" :file-list="fileList7" :show-file-list="true"  list-type="picture-card" :on-remove="handleRemove7" :on-success="handleSuccess7" :before-upload="beforeUpload" :data="form">
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
              </el-form-item>
            </el-form>
            <el-form :model="temp" :rules="rules" ref="temp" label-width="130px">
              <el-form-item :label="$t('new.parentPassport')" prop="icon">
                <el-upload ref="upload" class="editor-slide-upload" action="http://upload.qiniup.com" :multiple="false" :file-list="fileList8" :show-file-list="true"  list-type="picture-card" :on-remove="handleRemove8" :on-success="handleSuccess8" :before-upload="beforeUpload" :data="form">
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
              </el-form-item>
            </el-form>
            <el-form :model="temp" :rules="rules" ref="temp" label-width="130px">
              <el-form-item :label="$t('new.otherPhotos')" prop="icon">
                <el-upload ref="upload" class="editor-slide-upload" action="http://upload.qiniup.com" :multiple="false" :file-list="fileList9" :show-file-list="true"  list-type="picture-card" :on-remove="handleRemove9" :on-success="handleSuccess9" :before-upload="beforeUpload" :data="form">
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
              </el-form-item>
            </el-form>
          </div>

        <el-button style="margin-left:150px"  type="primary" @click="createData">{{$t('new.confirm')}}</el-button>

        </el-tab-pane>
      </el-tabs>

    </div>
  </div>
</template>
<script>
import moment from 'moment'
import {
  addStudentUser,
  updateStudentUser
} from '@/api/schoolMembersM'
import { listSysGrade } from '@/api/schoolSettingM'
import { selectClass, getToken } from '@/api/common'
import { pcaa } from 'area-data'

export default {
  name: 'stuAdd',
  data() {
    return {
      activeName: 'first',
      temp: {
        studentName: '',
        studentNameEn: '',
        mobile: '',
        password: '',
        nickName: '',
        email: '',
        sex: '',
        icon: '',
        nowGradeId: '',
        nowGradeName: '',
        nowGradeNameEn: '',
        nowClassId: '',
        nowClassName: '',
        nowClassNameEn: '',
        currentSchool: '',
        currentGrade: '',
        birthday: '',
        householRegister: '',
        householRegisterDetails: '',
        zhongkaoScore: '',
        collegeEntranceScore: '',
        screScore: '',
        passport: '',
        interest: '',
        interestType: '',
        readme: '',

        writtenExamScore: '',
        examTime: '',
        admissionGrade: '',
        admissionTime: '',

        fatherName: '',
        fatherPhone: '',
        fatherOccupation: '',
        fatherMailbox: '',
        motherName: '',
        motherPhone: '',
        motherOccupation: '',
        motherMailbox: '',
        precautions: '',

        accountPhotos: '',
        idPhoto: '',
        oneInchPhoto: '',
        vaccinationRecord: '',
        medicalReport: '',

        parentHouseholRegister: '',
        parentIdPhoto: '',
        parentPassport: '',
        otherPhotos: ''
      },

      interestOptions: [],

      sexOptions: [
        { value: '0', label: this.renderlanguage('new.male') },
        { value: '1', label: this.renderlanguage('new.female') }
      ],
      gradeOptions: [], // 年级
      classOptions: [], // 班级

      rules: {},

      // 地区选择数据
      areaData: pcaa,

      // file update
      token: '',
      form: {},
      address: '',

      fileList: [],
      fileList1: [],
      fileList2: [],
      fileList3: [],
      fileList4: [],
      fileList5: [],
      fileList6: [],
      fileList7: [],
      fileList8: [],
      fileList9: []

    }
  },

  created() {
    this.config()
  },
  methods: {
    // 翻译
    renderlanguage(string) {
      return this.$t(string)
    },
    config() {
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

      var item = this.$route.query.item
      if (item != null) {
        this.temp = {
          id: item.id,
          studentName: item.studentName,
          studentNameEn: item.studentNameEn,
          mobile: item.mobile,
          password: item.password,
          nickName: item.nickName,
          email: item.email,
          sex: item.sex,
          icon: item.icon,
          nowGradeId: item.nowGradeId,
          nowGradeName: item.nowGradeName,
          nowGradeNameEn: item.nowGradeNameEn,
          nowClassId: item.nowClassId,
          nowClassName: item.nowClassName,
          nowClassNameEn: item.classNameEn,
          currentSchool: item.currentSchool,
          currentGrade: item.currentGrade,
          birthday: item.birthday,
          householRegister: item.householRegister,
          householRegisterDetails: item.householRegisterDetails,
          zhongkaoScore: item.zhongkaoScore,
          collegeEntranceScore: item.collegeEntranceScore,
          screScore: item.screScore,
          passport: item.passport,
          interest: item.interest,
          interestType: item.interestType,
          readme: item.readme,

          writtenExamScore: item.writtenExamScore,
          examTime: item.examTime,
          admissionGrade: item.admissionGrade,
          admissionTime: item.admissionTime,

          fatherName: item.fatherName,
          fatherPhone: item.fatherPhone,
          fatherOccupation: item.fatherOccupation,
          fatherMailbox: item.fatherMailbox,
          motherName: item.motherName,
          motherPhone: item.motherPhone,
          motherOccupation: item.motherOccupation,
          motherMailbox: item.motherMailbox,
          precautions: item.precautions,

          accountPhotos: item.accountPhotos,
          idPhoto: item.idPhoto,
          oneInchPhoto: item.oneInchPhoto,
          vaccinationRecord: item.vaccinationRecord,
          medicalReport: item.medicalReport,

          parentHouseholRegister: item.parentHouseholRegister,
          parentIdPhoto: item.parentIdPhoto,
          parentPassport: item.parentPassport,
          otherPhotos: item.otherPhotos
        }
        if (this.temp.householRegister) {
          this.temp.householRegister = this.temp.householRegister.split(';')
        }
        if (this.temp.interestType) {
          this.interestOptions = this.temp.interestType.split(';')
        }

        this.fileList = this.configFileList(this.temp.icon)
        this.fileList1 = this.configFileList(this.temp.accountPhotos)
        this.fileList2 = this.configFileList(this.temp.idPhoto)
        this.fileList3 = this.configFileList(this.temp.oneInchPhoto)
        this.fileList4 = this.configFileList(this.temp.vaccinationRecord)
        this.fileList5 = this.configFileList(this.temp.medicalReport)
        this.fileList6 = this.configFileList(this.temp.parentHouseholRegister)
        this.fileList7 = this.configFileList(this.temp.parentIdPhoto)
        this.fileList8 = this.configFileList(this.temp.parentPassport)
        this.fileList9 = this.configFileList(this.temp.otherPhotos)

        // 根据年级找班级
        this.classOptions = []
        const params = { gradeId: item.nowGradeId }
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
      }
    },
    configFileList(str) {
      var arr = []
      if (str) {
        console.log('3')
        var array = str.split(';')
        for (let i = 0; i < array.length; i++) {
          const ele = array[i]
          arr.push({ url: ele })
        }
      }
      return arr
    },
    // 改动年级
    onGradeChange(id) {
      // 清空年级
      this.temp.nowGradeName = ''
      this.temp.nowGradeNameEn = ''

      // 清空班级
      this.classOptions = []
      this.temp.nowClassId = ''
      this.temp.nowClassName = ''
      this.temp.nowClassNameEn = ''

      let obj = {}
      obj = this.gradeOptions.find(item => {
        if (item.value === id) {
          return true
        }
      })
      this.temp.nowGradeName = obj.label
      this.temp.nowGradeNameEn = obj.labelEn

      // 根据年级找班级
      const params = { gradeId: id }
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
    // 改动班级
    onClassChange(id) {
      if (id !== '') {
        let obj = {}
        obj = this.classOptions.find(item => {
          if (item.value === id) {
            return true
          }
        })
        this.temp.nowClassName = obj.label
        this.temp.nowClassNameEn = obj.labelEn
      }
    },

    createData() {
      if (this.temp.householRegister) {
        this.temp.householRegister = this.temp.householRegister.join(';')
      }
      if (this.interestOptions) {
        this.temp.interestType = this.interestOptions.join(';')
      }

      var item = this.$route.query.item
      if (item != null) {
        var query = this.$route.query.item
        if (query.mobile == this.temp.mobile) {
          delete this.temp.mobile
        }
        updateStudentUser(this.temp).then(res => {
          this.$router.push({ path: 'studentM' })
          this.$notify({
            title: this.$t('msg.success'),
            message: this.$t('msg.updateSuccess'),
            type: 'success',
            duration: 2000
          })
        })
      } else {
        addStudentUser(this.temp).then(res => {
          this.$router.push({ path: 'studentM' })
          this.$notify({
            title: this.$t('msg.success'),
            message: this.$t('msg.createSuccess'),
            type: 'success',
            duration: 2000
          })
        })
      }
    },

    // file update
    // update file
    configFile(arr) {
      var str = ''
      for (var i = 0; i < arr.length; i++) {
        const ele = arr[i]
        if (i === arr.length - 1) {
          if (ele.hasOwnProperty('name')) {
            str += this.address + ele.response.key
          } else {
            str += ele.url
          }
        } else {
          if (ele.hasOwnProperty('name')) {
            str += this.address + ele.response.key + ';'
          } else {
            str += ele.url + ';'
          }
        }
      }
      return str
    },
    beforeUpload(file) {
      const curr = moment()
        .format('YYYYMMDD')
        .toString()
      const prefix = moment(file.lastModified)
        .format('HHmmss')
        .toString()
      // const suffix = file.name
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
    handleSuccess(response, file, fileList) {
      this.temp.icon = this.configFile(fileList)
    },
    handleRemove(file, fileList) {
      this.temp.icon = this.configFile(fileList)
    },
    handleSuccess1(response, file, fileList) {
      this.temp.accountPhotos = this.configFile(fileList)
    },
    handleRemove1(file, fileList) {
      this.temp.accountPhotos = this.configFile(fileList)
    },
    handleSuccess2(response, file, fileList) {
      this.temp.oneInchPhoto = this.configFile(fileList)
    },
    handleRemove2(file, fileList) {
      this.temp.oneInchPhoto = this.configFile(fileList)
    },
    handleSuccess3(response, file, fileList) {
      this.temp.idPhoto = this.configFile(fileList)
    },
    handleRemove3(file, fileList) {
      this.temp.idPhoto = this.configFile(fileList)
    },
    handleSuccess4(response, file, fileList) {
      this.temp.vaccinationRecord = this.configFile(fileList)
    },
    handleRemove4(file, fileList) {
      this.temp.vaccinationRecord = this.configFile(fileList)
    },
    handleSuccess5(response, file, fileList) {
      this.temp.medicalReport = this.configFile(fileList)
    },
    handleRemove5(file, fileList) {
      this.temp.medicalReport = this.configFile(fileList)
    },
    handleSuccess6(response, file, fileList) {
      this.temp.parentHouseholRegister = this.configFile(fileList)
    },
    handleRemove6(file, fileList) {
      this.temp.parentHouseholRegister = this.configFile(fileList)
    },
    handleSuccess7(response, file, fileList) {
      this.temp.parentIdPhoto = this.configFile(fileList)
    },
    handleRemove7(file, fileList) {
      this.temp.parentIdPhoto = this.configFile(fileList)
    },
    handleSuccess8(response, file, fileList) {
      this.temp.parentPassport = this.configFile(fileList)
    },
    handleRemove8(file, fileList) {
      this.temp.parentPassport = this.configFile(fileList)
    },
    handleSuccess9(response, file, fileList) {
      this.temp.otherPhotos = this.configFile(fileList)
    },
    handleRemove9(file, fileList) {
      this.temp.otherPhotos = this.configFile(fileList)
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

.el-tag + .el-tag {
    margin-left: 10px;
}

.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}

.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}
</style>
