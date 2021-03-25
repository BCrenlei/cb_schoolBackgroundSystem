<template>
  <div v-if="!addInterfaceVisible" class="app-container calendar-list-container">

    <div class="filter-container">
      <el-button v-if="g_hasPerm('student:add')" class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('operate.add')}}</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" :element-loading-text="$t('msg.loading')" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" :label="$t('list.id')" width="65">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" :label="$t('list.name')" :prop="renderlanguage(l_params.studentName)">
      </el-table-column>

      <el-table-column width="220px" align="center" :label="$t('list.phoneNumber')" prop="mobile">
      </el-table-column>

      <el-table-column width="220px" align="center" :label="$t('list.class')">
        <template slot-scope="scope">
          <span>{{scope.row[renderlanguage(l_params.nowGradeName)]+' '+ scope.row[renderlanguage(l_params.nowClassName)] }}</span>
        </template>
      </el-table-column>

      <el-table-column width="220px" align="center" :label="$t('list.registerTime')" prop="createTime">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('operate.actions')" width="320" class-name="small-padding fixed-width" v-if="g_hasPerm('profile:list')||g_hasPerm('student:update') ||g_hasPerm('student:delete') ">
        <template slot-scope="scope">

          <el-button v-if="g_hasPerm('profile:list')" type="primary" icon="edit" @click="handleShowProfile(scope.row)">查看
          </el-button>

          <el-button v-if="g_hasPerm('student:update')" type="primary" icon="edit" @click="handleUpdate(scope.row)">{{$t('operate.edit')}}
          </el-button>

          <el-button v-if="g_hasPerm('student:delete')" type="danger" icon="delete" @click="handleDelete(scope.$index,scope.row)">
            {{$t('operate.delete')}}
          </el-button>

        </template>
      </el-table-column>

    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageRow" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!-- 学生档案列表 -->
    <el-dialog :title="$t('operate.viewStudentFiles')" :visible.sync="dialogFilesVisible">

      <div class="filter-container">
        <el-button v-if="g_hasPerm('profile:add')" class="filter-item" style="margin-left: 10px;" @click="handleCreateProfile" type="primary" icon="el-icon-edit">{{$t('operate.add')}}</el-button>
      </div>

      <el-table :key='tableKey' :data="table" v-loading="tableLoading" :element-loading-text="$t('msg.loading')" border fit highlight-current-row style="width: 100%">

        <el-table-column align="center" :label="$t('list.id')" width="65">
          <template slot-scope="scope">
            <span v-text="getIndex(scope.$index)"> </span>
          </template>
        </el-table-column>

        <el-table-column width="150px" align="center" :label="$t('list.school')" :prop="renderlanguage(l_params.school)">
        </el-table-column>

        <el-table-column width="150px" align="center" :label="$t('list.entranceTime')" prop="entranceTime">
          <template slot-scope="scope">
            <span>{{scope.row.entranceTime | parseTime('{y}-{m}-{d}')}}</span>
          </template>
        </el-table-column>

        <el-table-column width="150px" align="center" :label="$t('list.graduationTime')" prop="graduationTime">
          <template slot-scope="scope">
            <span>{{scope.row.graduationTime | parseTime('{y}-{m}-{d}')}}</span>
          </template>
        </el-table-column>

        <el-table-column width="150px" align="center" :label="$t('list.registerTime')" prop="createTime">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('operate.actions')" width="220" class-name="small-padding fixed-width" v-if="g_hasPerm('profile:update') ||g_hasPerm('profile:delete') ">
          <template slot-scope="scope">

            <el-button v-if="g_hasPerm('profile:update')" type="primary" icon="edit" @click="handleUpdateProfile(scope.row)">{{$t('operate.edit')}}
            </el-button>

            <el-button v-if="g_hasPerm('profile:delete')" type="danger" icon="delete" @click="handleDeleteProfile(scope.$index,scope.row)">{{$t('operate.delete')}}
            </el-button>

          </template>
        </el-table-column>

      </el-table>

      <div class="pagination-container">
        <el-pagination background @size-change="handleTableSizeChange" @current-change="handleTableCurrentChange" :current-page="tableQuery.pageNum" :page-sizes="[10,20,30, 50]" :page-size="tableQuery.pageRow" layout="total, sizes, prev, pager, next, jumper" :total="total_files">
        </el-pagination>
      </div>
    </el-dialog>

    <el-dialog width='60%' :title="textMap[dialogTableStatus]" :visible.sync="dialogTableVisible">
      <el-form :rules="tableRules" ref="tableTemp" :model="tableTemp" label-position="right" label-width="130px" style='width: 80%; margin-left:50px;'>

        <el-form-item :label="$t('new.name')" prop="userName">
          <el-input v-model="tableTemp.userName"></el-input>
        </el-form-item>

        <el-form-item :label="$t('new.nameEn')" prop="userNameEn">
          <el-input v-model="tableTemp.userNameEn"></el-input>
        </el-form-item>

        <el-form-item :label="$t('new.birthday')" prop="birthday">
          <el-date-picker v-model="tableTemp.birthday" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy/MM/dd">
          </el-date-picker>
        </el-form-item>

        <el-form-item :label="$t('new.school')" prop="school">
          <el-input v-model="tableTemp.school"></el-input>
        </el-form-item>

        <el-form-item :label="$t('new.schoolEn')" prop="schoolEn">
          <el-input v-model="tableTemp.schoolEn"></el-input>
        </el-form-item>

        <el-form-item :label="$t('new.entranceTime')" prop="entranceTime">
          <el-date-picker v-model="tableTemp.entranceTime" @change="handleStartTime" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy/MM/dd">
          </el-date-picker>
        </el-form-item>

        <el-form-item :label="$t('new.graduationTime')" prop="graduationTime">
          <el-date-picker v-model="tableTemp.graduationTime" @change="handleEndTime" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy/MM/dd">
          </el-date-picker>
        </el-form-item>

        <el-form-item :label="$t('new.grade')" prop="nowGradeId">
          <el-select v-model="tableTemp.gradeId" @change="onTableGradeChange">
            <el-option v-for="item in gradeOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('new.class')" prop="nowClassId">
          <el-select v-model="tableTemp.classId" @change="onTableClassChange">
            <el-option v-for="item in classOptions" :key="item.value" :label="item.label" :value="item.value">
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('new.email')" prop="mailbox">
          <el-input v-model="tableTemp.mailbox"></el-input>
        </el-form-item>

        <el-form-item :label="$t('new.hobby')" prop="hobby">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6}" placeholder="Please input" v-model="tableTemp.hobby">
          </el-input>
        </el-form-item>

        <el-form-item :label="$t('new.hobbyEn')" prop="hobbyEn">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6}" placeholder="Please input" v-model="tableTemp.hobbyEn">
          </el-input>
        </el-form-item>

        <el-form-item :label="$t('new.intro')" prop="summary">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6}" placeholder="Please input" v-model="tableTemp.summary">
          </el-input>
        </el-form-item>

        <el-form-item :label="$t('new.introEn')" prop="summaryEn">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6}" placeholder="Please input" v-model="tableTemp.summaryEn">
          </el-input>
        </el-form-item>

        <el-form-item :label="$t('new.liEntranceScore')" prop="liEntranceScore">
          <el-input width="200" v-model="tableTemp.liEntranceScore"></el-input>
        </el-form-item>

        <el-form-item :label="$t('new.yueEntranceScore')" prop="yueEntranceScore">
          <el-input width="200" v-model="tableTemp.yueEntranceScore"></el-input>
        </el-form-item>

        <el-form-item :label="$t('new.sheEntranceScore')" prop="sheEntranceScore">
          <el-input width="200" v-model="tableTemp.sheEntranceScore"></el-input>
        </el-form-item>

        <el-form-item :label="$t('new.yuEntranceScore')" prop="yuEntranceScore">
          <el-input width="200" v-model="tableTemp.yuEntranceScore"></el-input>
        </el-form-item>

        <el-form-item :label="$t('new.shuEntranceScore')" prop="shuEntranceScore">
          <el-input width="200" v-model="tableTemp.shuEntranceScore"></el-input>
        </el-form-item>

        <el-form-item :label="$t('new.shu1EntranceScore')" prop="shu1EntranceScore">
          <el-input width="200" v-model="tableTemp.shu1EntranceScore"></el-input>
        </el-form-item>

        <el-form-item :label="$t('new.sixArtsSummary')" prop="sixArtsSummary">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6}" placeholder="Please input" v-model="tableTemp.sixArtsSummary">
          </el-input>
        </el-form-item>

        <el-form-item :label="$t('new.headPortrait')" prop="photo">
          <el-upload ref="upload" class="editor-slide-upload" action="http://upload.qiniup.com" :multiple="false" :file-list="fileList" :show-file-list="true" :limit="1" list-type="picture-card" :on-success="handleSuccess" :before-upload="beforeUpload" :data="form">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">{{$t('new.cancel')}}</el-button>
        <el-button v-if="dialogTableStatus=='create'" type="primary" @click="createProfileData">{{$t('new.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateProfileData">{{$t('new.confirm')}}</el-button>
      </div>
    </el-dialog>

  </div>

  <div v-else class="app-container calendar-list-container">
    <div class="filter-container">

      <el-tabs v-model="activeName">
        <el-tab-pane label="基本资料" name="first">
          <div style="padding-left:50px">
            <el-form :model="temp0" :rules="rules" ref="temp0" label-width="120px">
              <el-form-item :label="$t('new.headPortrait')" prop="icon">
                <el-upload ref="upload" class="editor-slide-upload" action="http://upload.qiniup.com" :multiple="false" :file-list="fileList0" :show-file-list="true" :limit="1" list-type="picture-card" :on-remove="handleRemove0" :on-success="handleSuccess0" :before-upload="beforeUpload0" :data="form">
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
              </el-form-item>
            </el-form>
          </div>

          <el-row>
            <el-col :span="10">
              <div style="padding-left:50px">
                <el-form :model="temp0" :rules="rules" ref="temp0" label-width="120px">
                  <el-form-item :label="$t('new.name')" prop="studentName">
                    <el-input v-model="temp0.studentName"></el-input>
                  </el-form-item>

                  <el-form-item :label="$t('new.nameEn')" prop="studentNameEn">
                    <el-input v-model="temp0.studentNameEn"></el-input>
                  </el-form-item>

                  <el-form-item :label="$t('new.email')" prop="email">
                    <el-input v-model="temp0.email"></el-input>
                  </el-form-item>

                  <el-form-item :label="$t('new.phoneNumber')" prop="mobile">
                    <el-input v-model="temp0.mobile"></el-input>
                  </el-form-item>

                  <el-form-item :label="$t('new.password')" prop="password">
                    <el-input v-model="temp0.password"></el-input>
                  </el-form-item>

                  <el-form-item :label="$t('new.nickName')" prop="nickName">
                    <el-input v-model="temp0.nickName"></el-input>
                  </el-form-item>

                  <el-form-item :label="$t('new.grade')" prop="nowGradeId">
                    <el-select v-model="temp0.nowGradeId" @change="onAddGradeChange">
                      <el-option v-for="item in gradeOptions" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item :label="$t('new.class')" prop="nowClassId">
                    <el-select v-model="temp0.nowClassId" @change="onAddClassChange">
                      <el-option v-for="item in classOptions" :key="item.value" :label="item.label" :value="item.value">
                        <span style="float: left">{{ item.label }}</span>
                      </el-option>
                    </el-select>
                  </el-form-item>

                  <!-- <el-form-item :label="$t('new.currentSchool')" prop="currentSchool">
                    <el-input v-model="temp0.currentSchool"></el-input>
                  </el-form-item>

                  <el-form-item :label="$t('new.currentGrade')" prop="currentGrade">
                    <el-input v-model="temp0.currentGrade"></el-input>
                  </el-form-item> -->

                </el-form>
              </div>
            </el-col>
            <el-col :span="4">&nbsp;</el-col>
            <el-col :span="10">
              <div style="padding-right:50px">

                <el-form :model="temp0" :rules="rules" ref="temp0" label-width="120px">

                  <el-form-item :label="$t('new.birthday')" prop="birthday">
                    <el-date-picker v-model="temp0.birthday" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy/MM/dd">
                    </el-date-picker>
                  </el-form-item>

                  <el-form-item :label="$t('new.sex')" prop="sex">
                    <el-select v-model="temp0.sex">
                      <el-option v-for="item in sexOptions" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item :label="$t('new.householRegister')" prop="householRegister">
                    <el-cascader size="large" :options="cityOptions" v-model="temp0.householRegister"></el-cascader>
                    <el-input v-model="temp0.householRegisterDetails"></el-input>
                  </el-form-item>

                  <el-form-item :label="$t('new.passport')" prop="passport">
                    <el-input v-model="temp0.passport"></el-input>
                  </el-form-item>

                  <el-form-item :label="$t('new.seniorEntranceScore')" prop="zhongkaoScore">
                    <el-input v-model="temp0.zhongkaoScore"></el-input>
                  </el-form-item>

                  <el-form-item :label="$t('new.collegeEntranceScore')" prop="collegeEntranceScore">
                    <el-input v-model="temp0.collegeEntranceScore"></el-input>
                  </el-form-item>

                  <!-- <el-form-item :label="$t('new.screScore')" prop="screScore">
                    <el-input v-model="temp0.screScore"></el-input>
                  </el-form-item> -->

                </el-form>
              </div>
            </el-col>
          </el-row>
          <div style="padding:0 50px">
            <el-form :model="temp0" :rules="rules" ref="temp0" label-width="120px">
              <el-form-item :label="$t('new.interest')" prop="interestOptions">
                <el-checkbox-group v-model="interestOptions">
                  <el-checkbox label="科学" name="type"></el-checkbox>
                  <el-checkbox label="人文" name="type"></el-checkbox>
                  <el-checkbox label="体育" name="type"></el-checkbox>
                  <el-checkbox label="音乐" name="type"></el-checkbox>
                  <el-checkbox label="艺术" name="type"></el-checkbox>
                  <el-checkbox label="阅读" name="type"></el-checkbox>
                  <el-checkbox label="户外活动" name="type"></el-checkbox>
                  <el-checkbox label="竞技活动" name="type"></el-checkbox>
                  <el-checkbox label="其他" name="type"></el-checkbox>
                  <!-- <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6}" v-model="temp0.interest"></el-input> -->

                </el-checkbox-group>
              </el-form-item>
              <el-form-item :label="$t('new.readme')" prop="readme">
                <el-input type="textarea" :maxlength="200" :autosize="{ minRows: 2, maxRows: 6}" v-model="temp0.readme"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="入学信息" name="second">
          <el-row>
            <el-col :span="10">
              <div style="padding:20px 50px 50px">
                <el-form :model="temp0" :rules="rules" ref="temp0" label-width="120px">
                  <el-form-item :label="$t('new.writtenExamScore')" prop="writtenExamScore">
                    <el-input v-model="temp0.writtenExamScore"></el-input>
                  </el-form-item>

                  <el-form-item :label="$t('new.admissionGrade')" prop="admissionGrade">
                    <el-input v-model="temp0.admissionGrade"></el-input>
                  </el-form-item>
                </el-form>
              </div>
            </el-col>
            <el-col :span="4">&nbsp;</el-col>
            <el-col :span="10">
              <div style="padding:20px 50px 50px 0">
                <el-form :model="temp0" :rules="rules" ref="temp0" label-width="120px">
                  <el-form-item :label="$t('new.examTime')" prop="examTime">
                    <el-date-picker v-model="temp0.examTime" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy/MM/dd">
                    </el-date-picker>
                  </el-form-item>

                  <el-form-item :label="$t('new.admissionTime')" prop="admissionTime">
                    <el-date-picker v-model="temp0.admissionTime" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy/MM/dd">
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
                <el-form :model="temp0" :rules="rules" ref="temp0" label-width="120px">
                  <el-form-item :label="$t('new.fatherName')" prop="fatherName">
                    <el-input v-model="temp0.fatherName"></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('new.fatherPhone')" prop="fatherPhone">
                    <el-input v-model="temp0.fatherPhone"></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('new.fatherOccupation')" prop="fatherOccupation">
                    <el-input v-model="temp0.fatherOccupation"></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('new.fatherMailbox')" prop="fatherMailbox">
                    <el-input v-model="temp0.fatherMailbox"></el-input>
                  </el-form-item>
                </el-form>
              </div>
            </el-col>
            <el-col :span="4">&nbsp;</el-col>
            <el-col :span="10">
              <div style="padding:20px 50px 50px 0">
                <el-form :model="temp0" :rules="rules" ref="temp0" label-width="120px">
                  <el-form-item :label="$t('new.motherName')" prop="motherName">
                    <el-input v-model="temp0.motherName"></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('new.motherPhone')" prop="motherPhone">
                    <el-input v-model="temp0.motherPhone"></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('new.motherOccupation')" prop="motherOccupation">
                    <el-input v-model="temp0.motherOccupation"></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('new.motherMailbox')" prop="motherMailbox">
                    <el-input v-model="temp0.motherMailbox"></el-input>
                  </el-form-item>
                </el-form>
              </div>
            </el-col>
          </el-row>

        </el-tab-pane>

        <el-tab-pane label="凭证上传" name="fourth">
          <div class="upload-icon">
            <div style="margin-top:20px; margin-left:5%; width:40%">
              <el-form :model="temp0" :rules="rules" ref="temp0" label-width="140px">
                <el-form-item :label="$t('new.accountPhotos')" prop="accountPhotos">
                  <el-upload ref="upload" class="editor-slide-upload" action="http://upload.qiniup.com" :multiple="false" :file-list="fileList1" :show-file-list="true" list-type="picture-card" :on-remove="handleRemove1" :on-success="handleSuccess1" :before-upload="beforeUpload" :data="form">
                    <el-button size="small" type="primary">点击上传</el-button>
                  </el-upload>
                </el-form-item>
              </el-form>

              <el-form :model="temp0" :rules="rules" ref="temp0" label-width="140px">
                <el-form-item :label="$t('new.oneInchPhoto')" prop="oneInchPhoto">
                  <el-upload ref="upload" class="editor-slide-upload" action="http://upload.qiniup.com" :multiple="false" :file-list="fileList2" :show-file-list="true" list-type="picture-card" :on-remove="handleRemove2" :on-success="handleSuccess2" :before-upload="beforeUpload" :data="form">
                    <el-button size="small" type="primary">点击上传</el-button>
                  </el-upload>
                </el-form-item>
              </el-form>

              <el-form :model="temp0" :rules="rules" ref="temp0" label-width="140px">
                <el-form-item :label="$t('new.idPhoto')" prop="idPhoto">
                  <el-upload ref="upload" class="editor-slide-upload" action="http://upload.qiniup.com" :multiple="false" :file-list="fileList3" :show-file-list="true" list-type="picture-card" :on-remove="handleRemove3" :on-success="handleSuccess3" :before-upload="beforeUpload" :data="form">
                    <el-button size="small" type="primary">点击上传</el-button>
                  </el-upload>
                </el-form-item>
              </el-form>

              <el-form :model="temp0" :rules="rules" ref="temp0" label-width="140px">
                <el-form-item :label="$t('new.vaccinationRecord')" prop="vaccinationRecord">
                  <el-upload ref="upload" class="editor-slide-upload" action="http://upload.qiniup.com" :multiple="false" :file-list="fileList4" :show-file-list="true" list-type="picture-card" :on-remove="handleRemove4" :on-success="handleSuccess4" :before-upload="beforeUpload" :data="form">
                    <el-button size="small" type="primary">点击上传</el-button>
                  </el-upload>
                </el-form-item>
              </el-form>

              <el-form :model="temp0" :rules="rules" ref="temp0" label-width="140px">
                <el-form-item :label="$t('new.medicalReport')" prop="medicalReport">
                  <el-upload ref="upload" class="editor-slide-upload" action="http://upload.qiniup.com" :multiple="false" :file-list="fileList5" :show-file-list="true" list-type="picture-card" :on-remove="handleRemove5" :on-success="handleSuccess5" :before-upload="beforeUpload" :data="form">
                    <el-button size="small" type="primary">点击上传</el-button>
                  </el-upload>
                </el-form-item>
              </el-form>

            </div>

            <div style="margin-top:20px; margin-left:5%; width:40%">
              <el-form :model="temp0" :rules="rules" ref="temp0" label-width="140px">
                <el-form-item :label="$t('new.parentHouseholRegister')" prop="parentHouseholRegister">
                  <el-upload ref="upload" class="editor-slide-upload" action="http://upload.qiniup.com" :multiple="false" :file-list="fileList6" :show-file-list="true" list-type="picture-card" :on-remove="handleRemove6" :on-success="handleSuccess6" :before-upload="beforeUpload" :data="form">
                    <el-button size="small" type="primary">点击上传</el-button>
                  </el-upload>
                </el-form-item>
              </el-form>
              <el-form :model="temp0" :rules="rules" ref="temp0" label-width="140px">
                <el-form-item :label="$t('new.parentIdPhoto')" prop="parentIdPhoto">
                  <el-upload ref="upload" class="editor-slide-upload" action="http://upload.qiniup.com" :multiple="false" :file-list="fileList7" :show-file-list="true" list-type="picture-card" :on-remove="handleRemove7" :on-success="handleSuccess7" :before-upload="beforeUpload" :data="form">
                    <el-button size="small" type="primary">点击上传</el-button>
                  </el-upload>
                </el-form-item>
              </el-form>
              <el-form :model="temp0" :rules="rules" ref="temp0" label-width="140px">
                <el-form-item :label="$t('new.parentPassport')" prop="parentPassport">
                  <el-upload ref="upload" class="editor-slide-upload" action="http://upload.qiniup.com" :multiple="false" :file-list="fileList8" :show-file-list="true" list-type="picture-card" :on-remove="handleRemove8" :on-success="handleSuccess8" :before-upload="beforeUpload" :data="form">
                    <el-button size="small" type="primary">点击上传</el-button>
                  </el-upload>
                </el-form-item>
              </el-form>
              <el-form :model="temp0" :rules="rules" ref="temp0" label-width="140px">
                <el-form-item :label="$t('new.otherPhotos')" prop="otherPhotos">
                  <el-upload ref="upload" class="editor-slide-upload" action="http://upload.qiniup.com" :multiple="false" :file-list="fileList9" :show-file-list="true" list-type="picture-card" :on-remove="handleRemove9" :on-success="handleSuccess9" :before-upload="beforeUpload" :data="form">
                    <el-button size="small" type="primary">点击上传</el-button>
                  </el-upload>
                </el-form-item>
              </el-form>
              
              <el-button style="margin-top:50px;margin-left:140px" type="primary" @click="createAddData">{{$t('new.confirm')}}</el-button>

            </div>
          </div>

        </el-tab-pane>
      </el-tabs>

    </div>
  </div>

</template>

<script>
import waves from '@/directive/waves' // 水波纹指令
import moment from 'moment'
import {
  listStudentUser,
  addStudentUser,
  updateStudentUser,
  deleteStudentUser,
  listStudentProfile,
  addStudentProfile,
  updateStudentProfile,
  deleteStudentProfile
} from '@/api/schoolMembersM'

import { listSysGrade } from '@/api/schoolSettingM'
import { selectClass, getToken } from '@/api/common'
import { parseTime, transformCity, removeSpace } from '@/utils'
import { regionData } from 'element-china-area-data'

export default {
  name: 'studentM',
  directives: {
    waves
  },
  data() {
    return {
      l_params: {
        // 中英文 属性
        studentName: 'p.studentName',
        nowGradeName: 'p.nowGradeName',
        nowClassName: 'p.nowClassName',
        school: 'p.school'
      },
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

      temp: {
        id: '',
        studentName: '',
        studentNameEn: '',
        mobile: '',
        password: '',
        nickName: '',
        age: '',
        sex: '',
        icon: '',
        nowGradeId: '',
        nowGradeName: '',
        nowGradeNameEn: '',
        nowClassId: '',
        nowClassName: '',
        nowClassNameEn: '',
        birthday: '',
        fatherName: '',
        fatherPhone: '',
        motherName: '',
        motherPhone: ''
      },

      addInterfaceVisible: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      // 学生档案列表
      userId: '',

      dialogFilesVisible: false,
      table: null,
      total_files: null,
      tableLoading: true,
      tableQuery: {
        pageNum: 1,
        pageRow: 20
      },

      dialogTableVisible: false, // 新增 编辑 学生档案
      dialogTableStatus: '',

      tableTemp: {
        id: '',
        userId: '',
        birthday: '',
        mailbox: '',

        entranceTime: '', // 开始时间
        graduationTime: '', // 毕业时间

        userName: '',
        userNameEn: '',
        school: '', // 学校
        schoolEn: '', // 学校

        summary: '',
        summaryEn: '',
        hobby: '',
        hobbyEn: '',

        gradeId: '',
        classId: '',

        photo: ''
      },

      tableRules: {
        // studentName: [{ required: true, message: '必填项', trigger: 'blur' }],
        // studentNameEn: [{ required: true, message: '必填项', trigger: 'blur' }],
        // nickName: [{ required: true, message: '必填项', trigger: 'blur' }],
        // sex: [{ required: true, message: '必填项', trigger: 'blur' }],
        // age: [{ required: true, message: '必填项', trigger: 'blur' }],
        // mobile: [{ required: true, message: '必填项', trigger: 'blur' }],
        // password: [{ required: true, message: '必填项', trigger: 'blur' }],
        // nowGradeId: [{ required: true, message: '必填项', trigger: 'change' }],
        // nowClassId: [{ required: true, message: '必填项', trigger: 'change' }],
        // birthday: [{ required: true, message: '必填项', trigger: 'blur' }],
        // fatherName: [{ required: true, message: '必填项', trigger: 'blur' }],
        // fatherPhone: [{ required: true, message: '必填项', trigger: 'blur' }],
        // motherName: [{ required: true, message: '必填项', trigger: 'blur' }],
        // motherPhone: [{ required: true, message: '必填项', trigger: 'blur' }],
        // icon: [{ required: true, message: '必填项', trigger: 'blur' }]
      },

      // update file
      token: '',
      address: '',
      updateIcon: '',
      form: {},

      listObj: {},
      fileList: [],

      // add
      activeName: 'first',
      cityOptions: regionData,
      interestOptions: [],
      temp0: {
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
        birthday: '',
        householRegister: [],
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
      isCreate: true, // 是否是创建

      sexOptions: [
        { value: '0', label: this.renderlanguage('new.male') },
        { value: '1', label: this.renderlanguage('new.female') }
      ],
      rules: {
        studentName: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        email: [{ required: true, message: '必填项', trigger: 'blur' }],
        nickName: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        sex: [{ required: true, message: '必填项', trigger: 'blur' }],
        age: [{ required: true, message: '必填项', trigger: 'blur' }],
        mobile: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        householRegister: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        nowGradeId: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        nowClassId: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        birthday: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        fatherName: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        fatherPhone: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        motherName: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        motherPhone: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        interestOptions: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        readme: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        icon: [{ required: true, message: '必填项', trigger: 'blur' }]
      },

      // file update
      fileList0: [],
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
    this.getList()
  },
  methods: {
    renderlanguage(string) {
      return this.$t(string)
    },
    getList() {
      this.listLoading = true
      listStudentUser(this.listQuery).then(response => {
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

    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
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
        studentName: '',
        studentNameEn: '',
        mobile: '',
        password: '',
        nickName: '',
        age: '',
        sex: '',
        icon: '',
        nowGradeId: '',
        nowGradeName: '',
        nowGradeNameEn: '',
        nowClassId: '',
        nowClassName: '',
        nowClassNameEn: '',
        birthday: '',
        fatherName: '',
        fatherPhone: '',
        motherName: '',
        motherPhone: ''
      }
    },
    // 编辑的时候配置参数
    configTemp(item) {
      this.temp = {
        id: item.id,
        studentName: item.studentName,
        studentNameEn: item.studentNameEn,
        nickName: item.nickName,
        mobile: item.mobile,
        password: item.password,
        age: item.age,
        sex: item.sex,

        nowGradeId: item.nowGradeId,
        nowGradeName: item.nowGradeName,
        nowGradeNameEn: item.nowGradeNameEn,
        nowClassId: item.nowClassId,
        nowClassName: item.nowClassName,
        nowClassNameEn: item.nowClassNameEn,

        birthday: item.birthday,
        fatherName: item.fatherName,
        fatherPhone: item.fatherPhone,
        motherName: item.motherName,
        motherPhone: item.motherPhone,
        icon: item.icon
      }
    },

    // 添加 的时候 下拉框 需要的参数
    configAddOptions() {
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
    // 编辑 的时候 下拉框 需要的参数
    configEditOptions() {
      // 配置角色 和 年级
      this.configAddOptions()
      // 配置 年级对应的班级
      this.classOptions = []
      const params = { gradeId: this.temp.nowGradeId }
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
    // 添加 界面出来
    handleCreate() {
      this.addInterfaceVisible = true
      this.isCreate = true
      this.config()
      this.$nextTick(() => {
        this.$refs['temp0'].clearValidate()
      })
    },
    createData() {
      this.$refs['temp'].validate(valid => {
        if (valid) {
          addStudentUser(this.temp).then(() => {
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
      this.addInterfaceVisible = true
      this.isCreate = false
      this.configAddEdit(row)
      this.$nextTick(() => {
        this.$refs['temp0'].clearValidate()
      })
    },
    updateData() {
      this.$refs['temp'].validate(valid => {
        if (valid) {
          updateStudentUser(this.temp).then(() => {
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
        deleteStudentUser(params)
          .then(() => {
            _vue.getList()
          })
          .catch(e => {})
      })
    },
    // 展示学生档案列表
    handleShowProfile(row) {
      this.dialogFilesVisible = true

      this.userId = row.id
      this.getProfileList()
    },
    getProfileList() {
      this.tableLoading = true
      var params = {
        pageNum: this.tableQuery.pageNum,
        pageRow: this.tableQuery.pageRow,
        userId: this.userId
      }
      listStudentProfile(params).then(response => {
        this.table = response.list
        this.total_files = response.totalCount
        this.tableLoading = false
      })
    },

    handleTableCurrentChange(val) {
      // 改变页码
      this.tableQuery.pageNum = val
      this.getProfileList()
    },
    handleTableSizeChange(val) {
      // 改变每页数量
      this.tableQuery.pageRow = val
      this.getProfileList()
    },

    resetTableTemp() {
      this.tableTemp = {
        userId: this.userId,

        mailbox: '',
        birthday: '',
        entranceTime: '', // 开始时间
        graduationTime: '', // 毕业时间

        userName: '',
        userNameEn: '',
        school: '', // 学校
        schoolEn: '', // 学校

        summary: '',
        summaryEn: '',
        hobby: '',
        hobbyEn: '',

        gradeId: '',
        classId: '',

        photo: '',

        liEntranceScore: '',
        yueEntranceScore: '',
        sheEntranceScore: '',
        yuEntranceScore: '',
        shuEntranceScore: '',
        shu1EntranceScore: '',

        sixArtsSummary: ''
      }

      this.fileList = []
    },
    // 编辑的时候配置参数
    configTableTemp(item) {
      this.tableTemp = {
        id: item.id,
        userId: this.userId,
        birthday: item.birthday,
        mailbox: item.mailbox,

        entranceTime: parseTime(item.entranceTime, '{y}/{m}/{d}'), // 开始时间
        graduationTime: parseTime(item.graduationTime, '{y}/{m}/{d}'), // 毕业时间

        userName: item.userName,
        userNameEn: item.userNameEn,
        school: item.school, // 学校
        schoolEn: item.schoolEn, // 学校

        summary: item.summary,
        summaryEn: item.summaryEn,
        hobby: item.hobby,
        hobbyEn: item.hobbyEn,

        gradeId: item.gradeId,
        classId: item.classId,

        photo: item.photo,

        liEntranceScore: item.liEntranceScore,
        yueEntranceScore: item.yueEntranceScore,
        sheEntranceScore: item.sheEntranceScore,
        yuEntranceScore: item.yuEntranceScore,
        shuEntranceScore: item.shuEntranceScore,
        shu1EntranceScore: item.shu1EntranceScore,

        sixArtsSummary: item.sixArtsSummary
      }

      // image
      this.fileList = []
      const e = {
        url: item.photo
      }
      this.fileList.push(e)
    },

    // 添加 的时候 下拉框 需要的参数
    configTableAddOptions() {
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
    // 编辑 的时候 下拉框 需要的参数
    configTableEditOptions() {
      // 配置角色 和 年级
      this.configTableAddOptions()
      // 配置 年级对应的班级
      this.classOptions = []
      const params = { gradeId: this.tableTemp.gradeId }
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
    // 改动年级
    onTableGradeChange(id) {
      // 清空班级
      this.classOptions = []
      this.tableTemp.classId = ''

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
    onTableClassChange(id) {
      // if (id !== '') {
      //   let obj = {}
      //   obj = this.classOptions.find(item => {
      //     if (item.value === id) {
      //       return true
      //     }
      //   })
      //   this.tableTemp.nowClassName = obj.label
      //   this.tableTemp.nowClassNameEn = obj.labelEn
      // }
    },

    handleStartTime(time) {
      const startTime = new Date(time).getTime()
      const endTime = new Date(this.tableTemp.graduationTime).getTime()
      if (this.tableTemp.graduationTime != '') {
        if (startTime >= endTime) {
          this.$message.error(this.$t('msg.startTimePrompt'))
          this.tableTemp.entranceTime = ''
          return
        }
      }

      this.tableTemp.entranceTime = time
    },
    handleEndTime(time) {
      const startTime = new Date(this.tableTemp.entranceTime).getTime()
      const endTime = new Date(time).getTime()
      if (this.tableTemp.entranceTime != '') {
        if (startTime >= endTime) {
          this.$message.error(this.$t('msg.endTimePrompt'))
          this.tableTemp.graduationTime = ''
          return
        }
      }

      this.tableTemp.graduationTime = time
    },

    // 添加 界面出来
    handleCreateProfile() {
      this.resetTableTemp()

      this.dialogTableStatus = 'create'
      this.dialogTableVisible = true
      this.$nextTick(() => {
        this.$refs['tableTemp'].clearValidate()
      })

      this.configTableAddOptions()
    },
    createProfileData() {
      var iconAddress = this.address + this.updateIcon
      if (iconAddress) {
        this.tableTemp.photo = iconAddress
      }

      this.$refs['tableTemp'].validate(valid => {
        if (valid) {
          addStudentProfile(this.tableTemp).then(() => {
            // 更新list
            this.getProfileList()
            this.dialogTableVisible = false
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
    handleUpdateProfile(row) {
      this.configTableTemp(row)

      this.dialogTableStatus = 'update'
      this.dialogTableVisible = true
      this.$nextTick(() => {
        this.$refs['tableTemp'].clearValidate()
      })

      this.configTableEditOptions()
    },
    updateProfileData() {
      var iconAddress = this.address + this.updateIcon
      if (iconAddress) {
        this.tableTemp.photo = iconAddress
      }
      this.$refs['tableTemp'].validate(valid => {
        if (valid) {
          updateStudentProfile(this.tableTemp).then(() => {
            this.getProfileList()
            this.dialogTableVisible = false
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
    handleDeleteProfile(row, val) {
      const _vue = this
      this.$confirm(this.$t('msg.delete'), this.$t('msg.prompt'), {
        confirmButtonText: this.$t('msg.confirm'),
        showCancelButton: false,
        type: 'warning'
      }).then(() => {
        const params = {
          id: val.id
        }
        deleteStudentProfile(params)
          .then(() => {
            _vue.getProfileList()
          })
          .catch(e => {})
      })
    },
    // update file
    handleSuccess(response, file) {
      this.updateIcon = response.key
    },
    handleError(err, response, file) {
      console.log('----handleError')
      if (err.status === 401) {
        this.$message.error('图片上传失败，请求中未附带Token')
      } else {
        this.$message.error(JSON.stringify(err))
      }
    },
    beforeUpload(file) {
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
    configSpace() {
      this.temp0 = {
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
        birthday: '',
        householRegister: [],
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

        accountPhotos: '',
        idPhoto: '',
        oneInchPhoto: '',
        vaccinationRecord: '',
        medicalReport: '',

        parentHouseholRegister: '',
        parentIdPhoto: '',
        parentPassport: '',
        otherPhotos: ''
      }
      this.activeName = 'first'
    },
    // 添加 界面
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

      this.configSpace()

      this.fileList0 = this.configFileList(this.temp0.icon)
      this.fileList1 = this.configFileList(this.temp0.accountPhotos)
      this.fileList2 = this.configFileList(this.temp0.idPhoto)
      this.fileList3 = this.configFileList(this.temp0.oneInchPhoto)
      this.fileList4 = this.configFileList(this.temp0.vaccinationRecord)
      this.fileList5 = this.configFileList(this.temp0.medicalReport)
      this.fileList6 = this.configFileList(
        this.temp0.parentHouseholRegister
      )
      this.fileList7 = this.configFileList(this.temp0.parentIdPhoto)
      this.fileList8 = this.configFileList(this.temp0.parentPassport)
      this.fileList9 = this.configFileList(this.temp0.otherPhotos)
    },
    // 编辑界面
    configAddEdit(item) {
      // 配置年级
      this.gradeOptions = []
      listSysGrade().then(res => {
        for (var i = 0; i < res.list.length; i++) {
          var element = res.list[i]
          const e = {
            value: element.id + '',
            label: element.gradeName
          }
          this.gradeOptions.push(e)
        }
      })
      // 根据年级找班级
      this.classOptions = []
      const params = { gradeId: item.nowGradeId }
      selectClass(params).then(res => {
        for (var i = 0; i < res.length; i++) {
          var element = res[i]
          const e = {
            value: element.id + '',
            label: element.className
          }
          this.classOptions.push(e)
        }
      })
      this.temp0 = {
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
        birthday: item.birthday,
        householRegister: item.householRegister,
        householRegisterDetails: item.householRegisterDetails,
        zhongkaoScore: item.zhongkaoScore,
        collegeEntranceScore: item.collegeEntranceScore,
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
      if (this.temp0.householRegister) {
        this.temp0.householRegister = transformCity(
          this.temp0.householRegister
        )
      }
      if (this.temp0.interestType) {
        this.interestOptions = this.temp0.interestType.split(';')
      }

      this.fileList0 = this.configFileList(this.temp0.icon)
      this.fileList1 = this.configFileList(this.temp0.accountPhotos)
      this.fileList2 = this.configFileList(this.temp0.idPhoto)
      this.fileList3 = this.configFileList(this.temp0.oneInchPhoto)
      this.fileList4 = this.configFileList(this.temp0.vaccinationRecord)
      this.fileList5 = this.configFileList(this.temp0.medicalReport)
      this.fileList6 = this.configFileList(
        this.temp0.parentHouseholRegister
      )
      this.fileList7 = this.configFileList(this.temp0.parentIdPhoto)
      this.fileList8 = this.configFileList(this.temp0.parentPassport)
      this.fileList9 = this.configFileList(this.temp0.otherPhotos)
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
    onAddGradeChange(id) {
      // 清空年级
      this.temp0.nowGradeName = ''
      this.temp0.nowGradeNameEn = ''

      // 清空班级
      this.classOptions = []
      this.temp0.nowClassId = ''
      this.temp0.nowClassName = ''
      this.temp0.nowClassNameEn = ''

      let obj = {}
      obj = this.gradeOptions.find(item => {
        if (item.value === id) {
          return true
        }
      })
      this.temp0.nowGradeName = obj.label
      this.temp0.nowGradeNameEn = obj.labelEn

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
    onAddClassChange(id) {
      if (id !== '') {
        let obj = {}
        obj = this.classOptions.find(item => {
          if (item.value === id) {
            return true
          }
        })
        this.temp0.nowClassName = obj.label
        this.temp0.nowClassNameEn = obj.labelEn
      }
    },
    createAddData() {
      if (this.temp0.householRegister) {
        this.temp0.householRegister = transformCity(
          this.temp0.householRegister
        )
      }
      if (this.interestOptions) {
        this.temp0.interestType = this.interestOptions.join(';')
      }

      this.temp0 = removeSpace(this.temp0)
      if (this.isCreate) {
        addStudentUser(this.temp0).then(res => {
          this.addInterfaceVisible = false
          this.getList()
          this.configSpace()
          this.$notify({
            title: this.$t('msg.success'),
            message: this.$t('msg.createSuccess'),
            type: 'success',
            duration: 2000
          })
        })
      } else {
        updateStudentUser(this.temp0).then(res => {
          this.addInterfaceVisible = false
          this.getList()
          this.configSpace()
          this.$notify({
            title: this.$t('msg.success'),
            message: this.$t('msg.updateSuccess'),
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
    beforeUpload0(file) {
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
    handleSuccess0(response, file, fileList) {
      this.temp0.icon = this.configFile(fileList)
    },
    handleRemove0(file, fileList) {
      this.temp0.icon = this.configFile(fileList)
    },
    handleSuccess1(response, file, fileList) {
      this.temp0.accountPhotos = this.configFile(fileList)
    },
    handleRemove1(file, fileList) {
      this.temp0.accountPhotos = this.configFile(fileList)
    },
    handleSuccess2(response, file, fileList) {
      this.temp0.oneInchPhoto = this.configFile(fileList)
    },
    handleRemove2(file, fileList) {
      this.temp0.oneInchPhoto = this.configFile(fileList)
    },
    handleSuccess3(response, file, fileList) {
      this.temp0.idPhoto = this.configFile(fileList)
    },
    handleRemove3(file, fileList) {
      this.temp0.idPhoto = this.configFile(fileList)
    },
    handleSuccess4(response, file, fileList) {
      this.temp0.vaccinationRecord = this.configFile(fileList)
    },
    handleRemove4(file, fileList) {
      this.temp0.vaccinationRecord = this.configFile(fileList)
    },
    handleSuccess5(response, file, fileList) {
      this.temp0.medicalReport = this.configFile(fileList)
    },
    handleRemove5(file, fileList) {
      this.temp0.medicalReport = this.configFile(fileList)
    },
    handleSuccess6(response, file, fileList) {
      this.temp0.parentHouseholRegister = this.configFile(fileList)
    },
    handleRemove6(file, fileList) {
      this.temp0.parentHouseholRegister = this.configFile(fileList)
    },
    handleSuccess7(response, file, fileList) {
      this.temp0.parentIdPhoto = this.configFile(fileList)
    },
    handleRemove7(file, fileList) {
      this.temp0.parentIdPhoto = this.configFile(fileList)
    },
    handleSuccess8(response, file, fileList) {
      this.temp0.parentPassport = this.configFile(fileList)
    },
    handleRemove8(file, fileList) {
      this.temp0.parentPassport = this.configFile(fileList)
    },
    handleSuccess9(response, file, fileList) {
      this.temp0.otherPhotos = this.configFile(fileList)
    },
    handleRemove9(file, fileList) {
      this.temp0.otherPhotos = this.configFile(fileList)
    }
  }
}
</script>

<style>
.el-form-item__label {
    padding: 0 30px 0 0;
}

.el-cascader {
    display: inline-block;
    position: relative;
    font-size: 14px;
    line-height: 40px;
    width: 250px;
}

.upload-icon {
    display: flex;
}
</style>

