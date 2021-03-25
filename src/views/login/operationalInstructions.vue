<template>
    <div class="bg">
        <div class="container">
            <div class="top">
                <div class="title">
                    <img class="title-img" src="../../assets/images/czsm/czsm_logo.png" alt="">
                    <span class="title-word">CB测评系统操作说明</span>
                </div>
                <div class="back" @click="handlePush">
                    返回登录
                </div>
            </div>

            <div class="sign">
                <img class="sign-img-close" :src="img_close" alt="">
                <span class="sign-word-close">可展开</span>
                <img class="sign-img-open" :src="img_open" alt="">
                <span class="sign-word-open">已展开</span>
            </div>

            <div class="main">

                <!-- 首页 -->
                <div class="main-modular">
                    <div class="main-title">
                        <div class="main-point"></div>
                        <div class="color-title">登录页</div>
                    </div>
                    <div class="main-dotted">
                        <div class="main-content">
                            <span class="color-content">登录cb测评系统之前，您将需要学校的分配的用户名和密码。如果您没有此信息或有任何疑问，请联系您的学校。 (注：请勿使用其他人的密码，或将密码告诉其他人。)
                            </span>
                            <img class="main-img" src="../../assets/images/czsm/czsm_login.jpg" alt="">

                            <div class="main-small-modular">
                                <div class="mian-small-title" @click="handleOpen">
                                    <img class="main-small-img" :src="img_close" alt="">
                                    <span class="main-small-word">首页介绍</span>
                                </div>

                                <div class="inactive">
                                    <span class="color-content">
                                        登录进入后会看到首页，首页由左边的导航菜单、顶部的面包屑导航和主页面组成。<br> 导航菜单包含以下五大模块，权限管理、信息管理、学校管理、课程管理和成绩管理。
                                        <br> 面包屑导航方便回到首页和标示定位。
                                        <br> 主页面展示系统主要功能。
                                    </span>
                                    <img class="main-img" src="../../assets/images/czsm/czsm_sy.jpg" alt="">
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <!-- 权限管理 -->
                <div class="main-modular">
                    <div class="main-title">
                        <div class="main-point"></div>
                        <div class="color-title">权限管理</div>
                    </div>
                    <div class="main-dotted">
                        <div class="main-content">
                            <!-- <span class="color-content">
                                权限管理中有用户组管理，主要用于分配用户于不同用户组中
                            </span> -->
                            <!-- <img class="main-img" src="../../assets/images/czsm/czsm_qxgl.jpg" alt=""> -->

                            <div class="main-small-modular">
                                <div class="mian-small-title" @click="handleOpen">
                                    <img class="main-small-img" :src="img_close" alt="">
                                    <span class="main-small-word">身份权限</span>
                                </div>

                                <div class="inactive">
                                    <span class="color-content">
                                        1.用户组管理 用于创建拥有权限的用户组,具体权限有（用户组管理、角色管理、老师管理、学生管理、学生档案管理、分类管理、年级管理、班级管理、学期管理、教师管理、课程管理、成绩管理、学习详情管理、能力管理、能力分类管理）15种权限。
                                    </span>
                                    <img class="main-img" src="../../assets/images/czsm/czsm_qxgl.jpg" alt="">
                                    <span class="color-content">
                                        2.创建用户组之后可以在老师管理中分配用户到用户组里，该用户组中用户凭借手机号和密码可以登录系统，然后拥有该用户组的所有权限。<br> （注：选择某些权限时必须有其他权限支持，比如选择学生管理的新增权限则必须勾选年级管理的列表权限，才能正确的在新增或编辑学生时选择年级。系统会在您选择到这些需要关联其他权限的权限时自动勾选必须权限。）
                                    </span>
                                    <img class="main-img" src="../../assets/images/czsm/czsm_qxgl.jpg" alt="">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 信息管理 -->
                <div class="main-modular">
                    <div class="main-title">
                        <div class="main-point"></div>
                        <div class="color-title">信息管理</div>
                    </div>
                    <div class="main-dotted">
                        <div class="main-content">
                            <span class="color-content">
                                主要功能是创建和管理用户（包括老师和学生）。
                            </span>
                            <img class="main-img" src="../../assets/images/czsm/czsm_xinxigl.jpg" alt="">

                            <div class="main-small-modular">
                                <div class="mian-small-title" @click="handleOpen">
                                    <img class="main-small-img" :src="img_close" alt="">
                                    <span class="main-small-word">1.角色管理</span>
                                </div>

                                <div class="inactive">
                                    <span class="color-content">
                                        页面显示针对创建老师时所需的角色列表。角色用于新增老师时供选择标示身份。<br> 查看所有角色并进行添加、编辑和删除操作,新增角色需要填角色名称。
                                    </span>
                                    <img class="main-img" src="../../assets/images/czsm/czsm_jsgl.jpg" alt="">
                                </div>
                            </div>

                            <div class="main-small-modular">
                                <div class="mian-small-title" @click="handleOpen">
                                    <img class="main-small-img" :src="img_close" alt="">
                                    <span class="main-small-word">2.老师管理</span>
                                </div>

                                <div class="inactive">
                                    <span class="color-content">
                                        页面显示创建的所有老师以及基本信息。查看所有老师并进行添加、编辑和删除操作。新增老师需要先创建角色（角色管理中添加）和用户组（用户组管理中添加），年级和教授课程为非必填项。创建的老师可以用手机号和密码登录本系统并进行相应权限管理。
                                    </span>
                                    <img class="main-img" src="../../assets/images/czsm/czsm_lsgl.jpg" alt="">
                                </div>
                            </div>

                            <div class="main-small-modular">
                                <div class="mian-small-title" @click="handleOpen">
                                    <img class="main-small-img" :src="img_close" alt="">
                                    <span class="main-small-word">3.学生管理</span>
                                </div>

                                <div class="inactive">
                                    <span class="color-content">
                                        页面显示创建的所有学生以及基本信息。 查看所有学生并进行添加、编辑和删除操作。新增学生需要先创建年级（年级管理中添加）和班级（班级管理中添加）。新增和编辑学生因为要填写的东西很多会转到新增学生模块。
                                    </span>
                                    <img class="main-img" src="../../assets/images/czsm/czsm_xsgl.jpg" alt="">

                                    <span class="color-content">
                                        页面显示创建的该学生的所有档案。 查看学生档案并进行添加、编辑和删除操作。新增学生档案需要先创建年级（年级管理中添加）和班级（班级管理中添加）。
                                    </span>
                                    <img class="main-img" src="../../assets/images/czsm/czsm_xsda.jpg" alt="">

                                </div>
                            </div>

                            <div class="main-small-modular">
                                <div class="mian-small-title" @click="handleOpen">
                                    <img class="main-small-img" :src="img_close" alt="">
                                    <span class="main-small-word">4.新增学生</span>
                                </div>

                                <div class="inactive">
                                    <span class="color-content">
                                        页面显示创建的学生所需要输入的各项数据。 新增和编辑学生时在本模块进行，分为五个小模块分别为基本资料、入学信息、家长信息、学生凭证和家长凭证，输入完成后在家长凭证最后点击确认完成输入新增或者编辑操作。
                                    </span>
                                    <span class="color-content">
                                        ①基本资料
                                    </span>
                                    <img class="main-img" src="../../assets/images/czsm/czsm_xzxs1.jpg" alt="">
                                    <span class="color-content">
                                        ②入学信息
                                    </span>
                                    <img class="main-img" src="../../assets/images/czsm/czsm_xzxs2.jpg" alt="">
                                    <span class="color-content">
                                        ③家长信息
                                    </span>
                                    <img class="main-img" src="../../assets/images/czsm/czsm_xzxs3.jpg" alt="">
                                    <span class="color-content">
                                        ④学生凭证
                                    </span>
                                    <img class="main-img" src="../../assets/images/czsm/czsm_xzxs4.jpg" alt="">
                                    <span class="color-content">
                                        ⑤家长凭证
                                    </span>
                                    <img class="main-img" src="../../assets/images/czsm/czsm_xzxs5.jpg" alt="">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 学校管理 -->
                <div class="main-modular">
                    <div class="main-title">
                        <div class="main-point"></div>
                        <div class="color-title">学校管理</div>
                    </div>
                    <div class="main-dotted">
                        <div class="main-content">
                            <span class="color-content">
                                主要功能是创建和管理学校基本设置和学期安排。
                            </span>
                            <img class="main-img" src="../../assets/images/czsm/czsm_xxgl.jpg" alt="">

                            <div class="main-small-modular">
                                <div class="mian-small-title" @click="handleOpen">
                                    <img class="main-small-img" :src="img_close" alt="">
                                    <span class="main-small-word">1.学期管理</span>
                                </div>

                                <div class="inactive">
                                    <span class="color-content">
                                        页面显示所有创建的学期以及基本信息。 查看所有学期并进行添加、编辑和删除操作。添加或编辑学期需要输入时间段。
                                    </span>
                                    <img class="main-img" src="../../assets/images/czsm/czsm_xqgl.jpg" alt="">
                                </div>
                            </div>

                            <div class="main-small-modular">
                                <div class="mian-small-title" @click="handleOpen">
                                    <img class="main-small-img" :src="img_close" alt="">
                                    <span class="main-small-word">2.教室管理</span>
                                </div>

                                <div class="inactive">
                                    <span class="color-content">
                                        页面显示所有创建的教室以及基本信息。 查看所有教室并进行添加、编辑和删除操作。添加或编辑教室需要选择教室类型和输入座位数和容纳班级数。
                                    </span>
                                    <img class="main-img" src="../../assets/images/czsm/czsm_jshigl.jpg" alt="">
                                </div>
                            </div>

                            <div class="main-small-modular">
                                <div class="mian-small-title" @click="handleOpen">
                                    <img class="main-small-img" :src="img_close" alt="">
                                    <span class="main-small-word">3.年级管理</span>
                                </div>

                                <div class="inactive">
                                    <span class="color-content">
                                        页面显示所有创建的年级以及基本信息。 查看所有年级并进行添加、编辑和删除操作。添加或编辑年级需要输入年级名称。
                                    </span>
                                    <img class="main-img" src="../../assets/images/czsm/czsm_njgl.jpg" alt="">
                                </div>
                            </div>

                            <div class="main-small-modular">
                                <div class="mian-small-title" @click="handleOpen">
                                    <img class="main-small-img" :src="img_close" alt="">
                                    <span class="main-small-word">4.班级管理</span>
                                </div>

                                <div class="inactive">
                                    <span class="color-content">
                                        班级管理分为班级类型管理和班级列表
                                    </span>
                                    <span class="color-content">
                                        ①班级类型管理<br>页面显示针对创建班级时所需的班级类型列表。 查看所有班级类型并进行添加、编辑和删除操作。添加或编辑班级类型需要输入班级类型名称和选择是否是固定班级。
                                    </span>
                                    <img class="main-img" src="../../assets/images/czsm/czsm_bjlxgl.jpg" alt="">
                                    <span class="color-content">
                                        ②班级列表<br>页面显示所有创建的班级以及基本信息。<br> 查看所有班级并进行添加、编辑和删除操作。新增班级需要先创建年级（年级管理中添加）、班级类型（班级类型管理中添加）和教室（教室管理中添加）。在班级列表中可以查看到报了本班级的学生并进行分班处理。还可以添加、删除和查看任课老师。
                                    </span>
                                    <img class="main-img" src="../../assets/images/czsm/czsm_bjlb.jpg" alt="">
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <!-- 课程管理 -->
                <div class="main-modular">
                    <div class="main-title">
                        <div class="main-point"></div>
                        <div class="color-title">课程管理</div>
                    </div>
                    <div class="main-dotted">
                        <div class="main-content">
                            <span class="color-content">
                                主要功能是创建和管理课程以及课程相关模块。
                            </span>
                            <img class="main-img" src="../../assets/images/czsm/czsm_kcgl.jpg" alt="">

                            <div class="main-small-modular">
                                <div class="mian-small-title" @click="handleOpen">
                                    <img class="main-small-img" :src="img_close" alt="">
                                    <span class="main-small-word">1.课程列表</span>
                                </div>

                                <div class="inactive">
                                    <span class="color-content">
                                        页面显示所有创建的课程以及基本信息。 查看所有课程和课时并进行添加、编辑和删除操作。新增课程需要先创建年级（年级管理中添加）、课程分类（课程分类管理中添加）、课程类型（课程类型管理中添加）和老师（老师管理中添加）。创建课程时填写的课时数对应着每门课程可以添加的课时数，添加课时时可以增加课件和作业。之后可以下载课件和作业。
                                    </span>
                                    <img class="main-img" src="../../assets/images/czsm/czsm_kclb.jpg" alt="">
                                </div>
                            </div>

                            <div class="main-small-modular">
                                <div class="mian-small-title" @click="handleOpen">
                                    <img class="main-small-img" :src="img_close" alt="">
                                    <span class="main-small-word">2.课程分类管理</span>
                                </div>

                                <div class="inactive">
                                    <span class="color-content">
                                        页面显示针对创建课程时所需的课程分类列表。 查看所有课程分类并进行添加、编辑和删除操作。课程分类需要输入中英文版。
                                    </span>
                                    <img class="main-img" src="../../assets/images/czsm/czsm_kcflgl.jpg" alt="">
                                </div>
                            </div>

                            <div class="main-small-modular">
                                <div class="mian-small-title" @click="handleOpen">
                                    <img class="main-small-img" :src="img_close" alt="">
                                    <span class="main-small-word">3.课程类型管理</span>
                                </div>

                                <div class="inactive">
                                    <span class="color-content">
                                        页面显示针对创建班级时所需的课程类型列表。 查看所有课程类型并进行添加、编辑和删除操作。课程类型需要输入中英文版
                                    </span>
                                    <img class="main-img" src="../../assets/images/czsm/czsm_kclxgl.jpg" alt="">
                                </div>
                            </div>

                            <div class="main-small-modular">
                                <div class="mian-small-title" @click="handleOpen">
                                    <img class="main-small-img" :src="img_close" alt="">
                                    <span class="main-small-word">4.课程报名管理</span>
                                </div>

                                <div class="inactive">
                                    <span class="color-content">
                                        页面显示所有创建的课程报名以及基本信息 查看所有课程报名。默认展示所有的课程报名情况，有权限的用户（即有年纪和教授课程的老师）可以点击左上角查看自己按钮可以查看自己教的课程报名情况。
                                    </span>
                                    <img class="main-img" src="../../assets/images/czsm/czsm_kcbmgl.jpg" alt="">
                                </div>
                            </div>

                            <div class="main-small-modular">
                                <div class="mian-small-title" @click="handleOpen">
                                    <img class="main-small-img" :src="img_close" alt="">
                                    <span class="main-small-word">5.课堂表现管理</span>
                                </div>

                                <div class="inactive">
                                    <span class="color-content">
                                        页面显示所有创建的课程表现以及基本信息 查看所有课堂表现并对自己添加的课堂表现进行编辑和删除操作。默认展示所有的课堂表现情况，有权限的用户（即有年纪和教授课程的老师）可以点击左上角查看自己按钮可以查看自己添加的课堂表现情况。
                                    </span>
                                    <img class="main-img" src="../../assets/images/czsm/czsm_kcbxgl.jpg" alt="">
                                </div>
                            </div>

                            <div class="main-small-modular">
                                <div class="mian-small-title" @click="handleOpen">
                                    <img class="main-small-img" :src="img_close" alt="">
                                    <span class="main-small-word">6.学习详情管理</span>
                                </div>

                                <div class="inactive">
                                    <span class="color-content">
                                        页面显示所有创建的学习详情以及基本信息 查看所有学习详情并对自己添加的学习详情进行编辑和删除操作。默认展示所有的学习详情，有权限的用户（即有年纪和教授课程的老师）点击左上角查看自己按钮可以查看自己添加的学习详情情况。新增学习详情需要先创建年级（年级管理中添加）、课程分类（课程分类管理中添加）。
                                    </span>
                                    <img class="main-img" src="../../assets/images/czsm/czsm_xxxqgl.jpg" alt="">
                                </div>
                            </div>

                            <div class="main-small-modular">
                                <div class="mian-small-title" @click="handleOpen">
                                    <img class="main-small-img" :src="img_close" alt="">
                                    <span class="main-small-word">7.老师评语管理</span>
                                </div>

                                <div class="inactive">
                                    <span class="color-content">
                                        页面显示老师针对学生的某节课时的成绩或表现所给予的评语。 查看所有老师评语并对自己添加的老师评语进行编辑和删除操作。默认展示所有的老师评语，有权限的用户（即有年纪和教授课程的老师）点击左上角查看自己按钮可以查看自己添加的老师评语。新增老师评语只能选择自己的学生加以评语，编辑时只能调整评语内容。
                                    </span>
                                    <img class="main-img" src="../../assets/images/czsm/czsm_lspygl.jpg" alt="">
                                </div>
                            </div>

                            <div class="main-small-modular">
                                <div class="mian-small-title" @click="handleOpen">
                                    <img class="main-small-img" :src="img_close" alt="">
                                    <span class="main-small-word">8.学生感悟管理</span>
                                </div>

                                <div class="inactive">
                                    <span class="color-content">
                                        页面显示学生对某节课时的教授情况所得到的感悟。 查看所有学生感悟并对自己添加的学生感悟进行编辑和删除操作。默认展示所有的学生感悟，有权限的用户（即有年纪和教授课程的老师）点击左上角查看自己按钮可以查看自己添加的学生感悟。新增学生感悟只能选择自己的学生添加，编辑时只能调整感悟内容。
                                    </span>
                                    <img class="main-img" src="../../assets/images/czsm/czsm_xsgwgl.jpg" alt="">
                                </div>
                            </div>

                            <div class="main-small-modular">
                                <div class="mian-small-title" @click="handleOpen">
                                    <img class="main-small-img" :src="img_close" alt="">
                                    <span class="main-small-word">9.能力分类列表</span>
                                </div>

                                <div class="inactive">
                                    <span class="color-content">
                                        页面显示针对创建能力时所需的能力分类列表 查看所有能力分类并进行添加、编辑和删除操作。新增能力分类需要先创建课程分类（课程分类管理中添加）。
                                    </span>
                                    <img class="main-img" src="../../assets/images/czsm/czsm_nlfllb.jpg" alt="">
                                </div>
                            </div>

                            <div class="main-small-modular">
                                <div class="mian-small-title" @click="handleOpen">
                                    <img class="main-small-img" :src="img_close" alt="">
                                    <span class="main-small-word">10.能力列表</span>
                                </div>

                                <div class="inactive">
                                    <span class="color-content">
                                        页面显示所有创建的能力以及基本信息。 查看所有能力并进行添加、编辑和删除操作。新增能力需要先创建年级（年级管理中添加）、能力分类（能力分类列表中添加）。一个能力分类可以有多个能力，一项能力可以对应多门课程，一门课程也可以有多项能力。能力分类对应能力是一对多，能力对应课程是多对多。

                                    </span>
                                    <img class="main-img" src="../../assets/images/czsm/czsm_nllb.jpg" alt="">
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <!-- 成绩管理 -->
                <div class="main-modular">
                    <div class="main-title">
                        <div class="main-point"></div>
                        <div class="color-title">成绩管理</div>
                    </div>
                    <div class="main-dotted">
                        <div class="main-content">
                            <span class="color-content">
                                主要功能是创建和管理考试和成绩。
                            </span>
                            <img class="main-img" src="../../assets/images/czsm/czsm_cjgl.jpg" alt="">

                            <div class="main-small-modular">
                                <div class="mian-small-title" @click="handleOpen">
                                    <img class="main-small-img" :src="img_close" alt="">
                                    <span class="main-small-word">1.考试管理</span>
                                </div>

                                <div class="inactive">
                                    <span class="color-content">
                                        页面显示所有创建的考试以及基本信息 查看所有考试并对自己添加的考试进行编辑和删除操作。默认展示所有的考试，有权限的用户（即有年纪和教授课程的老师）点击左上角查看自己按钮可以查看自己添加的考试。新增考试需要先创建年级（年级管理中添加）、课程分类（课程分类管理中添加）。
                                    </span>
                                    <img class="main-img" src="../../assets/images/czsm/czsm_ksgl.jpg" alt="">
                                </div>
                            </div>

                            <div class="main-small-modular">
                                <div class="mian-small-title" @click="handleOpen">
                                    <img class="main-small-img" :src="img_close" alt="">
                                    <span class="main-small-word">2.成绩管理</span>
                                </div>

                                <div class="inactive">
                                    <span class="color-content">
                                        页面显示所有创建的成绩以及基本信息 查看所有成绩并对自己添加的成绩进行编辑和删除操作。默认展示所有的成绩，有权限的用户（即有年纪和教授课程的老师）点击左上角查看自己按钮可以查看自己添加的成绩。新增成绩需要先创建年级（年级管理中添加）、课程分类（课程分类管理中添加）和考试（考试管理中添加）。新增成绩只能选择自己的学生添加。
                                    </span>
                                    <img class="main-img" src="../../assets/images/czsm/czsm_cjlb.jpg" alt="">
                                </div>
                            </div>

                            <div class="main-small-modular">
                                <div class="mian-small-title" @click="handleOpen">
                                    <img class="main-small-img" :src="img_close" alt="">
                                    <span class="main-small-word">3.EPQ列表</span>
                                </div>

                                <div class="inactive">
                                    <span class="color-content">
                                        页面显示所有创建的EPQ以及基本信息 查看所有EPQ并对自己添加的EPQ进行编辑和删除操作。默认展示所有的EPQ，有权限的用户（即有年纪和教授课程的老师）点击左上角查看自己按钮可以查看自己添加的EPQ。新增EPQ需要先创建年级（年级管理中添加）、课程分类（课程分类管理中添加）。新增EPQ只能选择自己的学生添加。
                                    </span>
                                    <img class="main-img" src="../../assets/images/czsm/czsm_epqlb.jpg" alt="">
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <!-- 登出系统 -->
                <div class="main-modular">
                    <div class="main-title">
                        <div class="main-point"></div>
                        <div class="color-title">登出系统</div>
                    </div>
                    <div class="main-dotted">
                        <div class="main-content">
                            <span class="color-content">
                                登录进入后，点击界面右上角用户名出现下拉框，再点击退出登录即可登出系统回到登录界面。
                            </span>
                            <img class="main-img" src="../../assets/images/czsm/czsm_dcxt.jpg" alt="">
                        </div>
                    </div>
                </div>

                <!-- </li>
                    <li>首页</li>
                    <li>权限管理</li>
                    <li>信息管理</li>
                    <li>学校管理</li>
                    <li>课程管理</li>
                    <li>成绩管理</li>
                    <li>登出系统</li>
                </!-->
            </div>

            <div class="bottom">
                <div class="bottom-back" @click="handlePush">
                    返回登录
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import img_close from '@/assets/images/czsm/czsm_close.png'
import img_open from '@/assets/images/czsm/czsm_open.png'

export default {
  components: {},
  name: 'operationalInstructions',
  data() {
    return {
      img_close,
      img_open
    }
  },
  methods: {
    handlePush() {
      this.$router.push({ path: '/' })
    },
    handleOpen(val) {
      var img = val.currentTarget.getElementsByClassName(
        'main-small-img'
      )[0]
      var ele = val.currentTarget.nextElementSibling // 下一个兄弟节点
      if (ele.className === 'inactive') {
        var arr = document.querySelectorAll('div.active')
        for (let i = 0; i < arr.length; i++) {
          const e = arr[i]
          e.className = 'inactive'
        }
        ele.className = 'active'

        var arr_img = document.querySelectorAll('img.main-small-img')
        for (let i = 0; i < arr_img.length; i++) {
          const e = arr_img[i]
          e.src = img_close
        }
        img.src = img_open
      } else {
        var arr1 = document.querySelectorAll('div.active')
        for (let i = 0; i < arr1.length; i++) {
          const e = arr1[i]
          e.className = 'inactive'
        }

        var arr_img1 = document.querySelectorAll('img.main-small-img')
        for (let i = 0; i < arr_img1.length; i++) {
          const e = arr_img1[i]
          e.src = img_close
        }
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.bg {
    width: 100%;
    background-color: #f5f6f7;
    display: flex;
    justify-content: center;
}
.container {
    // height: 100%;
    width: 1200px;
    background: rgba(255, 255, 255, 1);
    margin: 20px 0 20px 0;
}
.top {
    display: flex;
    justify-content: center;
}

.back {
    margin-top: 30px;
    float: right;
    cursor: pointer;
    width: 80px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    border: 1px solid rgba(247, 197, 46, 1);
    border-radius: 4px;
    font-size: 14px;
    font-family: "PingFangSC-Regular";
    font-weight: 400;
    color: rgba(247, 197, 46, 1);
}
.back:hover {
    color: rgba(247, 183, 46, 1);
}

.bottom {
    display: flex;
    justify-content: center;
}
.bottom-back {
    margin-top: 100px;
    margin-bottom: 100px;
    float: right;
    cursor: pointer;
    width: 220px;
    height: 46px;
    line-height: 46px;
    text-align: center;
    border: 1px solid rgba(247, 197, 46, 1);
    border-radius: 6px;
    font-size: 16px;
    font-family: "PingFangSC-Regular";
    font-weight: 400;
    color: rgba(247, 197, 46, 1);
}
.bottom-back:hover {
    color: rgba(247, 183, 46, 1);
}

.title {
    display: flex;
    justify-content: center;
    width: 80%;
    .title-img {
        margin-top: 40px;
    }
    .title-word {
        margin-top: 40px;
        margin-left: 10px;
        font-size: 30px;
        font-family: "PingFangSC-Medium";
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
    }
}

.sign {
    display: flex;
    justify-content: flex-end;
    margin-top: 70px;
    .sign-img-close {
        margin-right: 10px;
    }
    .sign-word-close {
        margin-right: 50px;
        font-size: 16px;
        font-family: "PingFangSC-Regular";
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
    }
    .sign-img-open {
        margin-right: 10px;
    }
    .sign-word-open {
        margin-right: 50px;
        font-size: 16px;
        font-family: "PingFangSC-Regular";
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
    }
}

.main {
    font-size: 16px;
    font-family: "PingFangSC-Regular";
    font-weight: 400;
    margin-left: 100px;
    .main-img {
        width: 800px;
    }
    span {
        width: 800px;
    }
    .main-modular {
        display: flex;
        flex-direction: column;
        .main-title {
            display: flex;
            align-items: center;
            .main-point {
                width: 8px;
                height: 8px;
                background: rgba(102, 102, 102, 1);
                border-radius: 4px;
                margin-right: 15px;
            }
            .color-title {
                color: rgba(51, 51, 51, 1);
            }
        }

        .main-dotted {
            display: flex;
            border-left: 1px dotted rgba(214, 214, 214, 1);
            margin: 5px 0 5px 3px;
        }
        .main-content {
            display: flex;
            flex-direction: column;
            margin: 10px 0 10px 50px;
            .color-content {
                color: rgba(102, 102, 102, 1);
                margin-top: 10px;
                margin-bottom: 20px;
            }
        }
    }
}

.main-small-modular {
    margin-top: 20px;
    .mian-small-title {
        display: flex;
        align-items: center;
        cursor: pointer;
        .main-samll-img {
            width: 20px;
            height: 20px;
        }
        .main-small-word {
            margin-left: 20px;
        }
    }
}

.inactive {
    display: none !important;
}
.active {
    display: flex !important;
    flex-direction: column;
    margin: 20px 0 10px 50px;
}
</style>
