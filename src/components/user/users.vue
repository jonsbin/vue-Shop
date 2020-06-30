<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域-->
        <el-card>
        <!-- 搜索区域-->
            
            <el-row :gutter="15">
              <el-col :span="7">
                    <el-input placeholder="请输入内容" class="input-with-select" 
                    v-model="queryInfo.query"
                    clearable
                    @clear="getUserList"
                    >
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
              <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
              </el-col>
            </el-row>
        <!-- 用户列表区域-->
            <el-table :data="userlist" border>
              <el-table-column type="index"></el-table-column>
              <el-table-column label="姓名" prop="username"></el-table-column>
              <el-table-column label="邮箱" prop="email"></el-table-column>
              <el-table-column label="电话" prop="mobile"></el-table-column>
              <el-table-column label="角色" prop="role_name"></el-table-column>
              <el-table-column label="状态">
                    <!-- 状态使用作用域插槽-->
                    <template slot-scope="scope">
                       <!--{{scope.row}}-->
                        <el-switch
                            v-model="scope.row.mg_state"
                            @change="userStateChanged(scope.row)"
                            active-color="#13ce66"
                            inactive-color="#ff4949">
                         </el-switch>
                    </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                    <el-button type="primary" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
                    <el-tooltip content="分配角色" effect="danger" placement="top" :enterable="false"></el-tooltip>
                    <el-button type="waening" icon="el-icon-setting" size="mini" @click="setjuese(scope.row)"></el-button>
                </template>
                     
              </el-table-column>
            </el-table>
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[1, 2, 5, 10]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
        </el-card>
        <!--添加用户弹框--->
        <el-dialog
            title="提示"
            :visible.sync="addDialogVisible"
            width="50%"
            @close="addDialogClose">
           <!---主体-->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px" class="demo-ruleForm">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="addForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="addForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
                <el-input v-model="addForm.mobile"></el-input>
            </el-form-item>
        </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
         </el-dialog>
        <!---修改信息对话框-->
         <el-dialog
            title="修改用户"
            :visible.sync="editDialogVisible"
            width="50%"
            >
            <el-form ref="editFromRef" :model="editForm" :rules="editFormRules" label-width="80px">
            <el-form-item label="用户名">
                <el-input v-model="editForm.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="email" prop="email">
                <el-input v-model="editForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop="mobile">
                <el-input v-model="editForm.mobile"></el-input>
            </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisibleClose">取 消</el-button>
                <el-button type="primary" @click="editUserInfo">确 定</el-button>
            </span>
        </el-dialog>
         <!---分配角色对话框-->
         <el-dialog
            title="分配角色"
            :visible.sync="setDialogVisible"
            width="50%"
            @close="setRoleDialogClosed"
            >
            <p>当前的用户：{{userinfo.username}}</p>
            <p>当前的角色：{{userinfo.role_name}}</p>
            <p>分配新角色：<el-select v-model="selectedRoleId" placeholder="请选择">
                            <el-option
                            v-for="item in rolesList"
                            :key="item.id"
                            :label="item.roleName"
                            :value="item.id">
                            </el-option>
                        </el-select></p>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        //验证邮箱规则
        var checkEmail = (rule,value,cb)=>{
            const regEmai = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
            if(regEmai.test(value)){
                return cb()
            }
            cb(new Error('请输入正确的email格式'))
        }
        //验证手机号码的规则
        var checkMobile = (rule,value,cb)=>{
            const regMobile = /^[1][3,4,5,7,8][0-9]{9}$/
            if(regMobile.test(value)){
                return cb()
            }
            cb(new Error('请输入正确的手机号码'))
        }

        return {
            //
            queryInfo:{
                queryInfo:'',
                //当前的页数
                pagenum:1,
                //当前显示多少条数据
                pagesize:2
            },
            userlist:[],
            total:0,
            //控制对话框的显示和隐藏
            addDialogVisible:false,
            addForm:{
                username:'',
                password:'',
                email:'',
                mobile:''
            },
            //弹框验证提示
            addFormRules:{
                username:[
                    {
                        required:true,
                        message:'请输入用户名',trigger:'blur'
                    },
                    {min:3,max:10,maessage:'用户名必须在3-10之间',trigger:'blur'}
                ],
                password:[ {
                        required:true,
                        message:'请输入用密码',trigger:'blur'
                    },
                    {min:3,max:10,maessage:'密码必须在3-10之间',trigger:'blur'}
                    ],
                email:[
                    {
                        required:true,
                        message:'请输入email',trigger:'blur'
                    },
                    {validator:checkEmail,trigger:'blur'}
                ],
                mobile:[
                    {
                        required:true,
                        message:'请输入手机号',trigger:'blur'
                    },
                     {validator:checkMobile,trigger:'blur'}
                ]
            },
            //修改对话框
            editDialogVisible:false,
            //查询的数据
            editForm:{},
            editFormRules:{
                email:[
                    {required: true, message:'请输入邮箱', trigger: 'blur'},
                    {validator:checkEmail,trigger:' '}
                ],
                mobile:[
                    {required: true, message:'请输入手机号码', trigger: 'blur'},
                    {validator:checkMobile,trigger:'blur'}
                ]
            },
            //分配角色关闭
            setDialogVisible:false,
            //需要被分配角色的用户信息
            userinfo:{},
            //下拉框的数据
            rolesList:[],
            //已选中的角色显示
            selectedRoleId:''

        }
    },
    created() {
            this.getUserList()
        },
    methods: {
        async getUserList(){
          const {data:res} = await this.$http.get('users',{params:this.queryInfo})
          if(res.meta.status !==200){
              return this.$message.error('获取数据失败')
          }
          this.userlist = res.data.users
          this.total = res.data.total
        },
        //监听pagesize改变的事件
        handleSizeChange(newSize){
            // console.log(newSize)
            this.queryInfo.pagesize = newSize
            this.getUserList()
        },
        //监听页码值改变的事件
        handleCurrentChange(newPage){
            //console.log(newSize)
            this.queryInfo.pagenum = newPage
            this.getUserList()
        },
        //监听开关状态
        async userStateChanged(userinfo){
            const {data:rs}  = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
            //console.log(rs)
            if(rs.meta.status!==200){
                userinfo.mg_state = !userinfo.mg_state
                return this.$message.error('更新用户状态失败')
            }
            this.$message.success('更新状态成功')
        },
        //监听对话框关闭
        addDialogClose(){
            this.$refs.addFormRef.resetFields()
        },
        //添加数据
        addUser(){
            this.$refs.addFormRef.validate(async valid =>{
                if(!valid) return
                //可以添加网络请求
                const {data:res} = await this.$http.post('users',this.addForm)
                if(res.meta.status!==201){
                    this.$message.error('添加用户失败')
                }
                this.$message.success('添加用户成功')
                //关闭弹窗
                this.addDialogVisible = false
                //重新刷新用户列表
                this.getUserList()
            })
        },
        async showEditDialog(id){
            const {data:res} = await this.$http.get('users/'+id)
            if(res.meta.status!==200){
                return this.$message.error('查询数据失败')
            }
            this.editForm = res.data
            this.editDialogVisible = true;
        },
        //修改弹窗取消重置和关闭
        editDialogVisibleClose(){
            this.$refs.editFromRef.resetFields()
        },
        //修改弹框提交
        editUserInfo(){
           this.$refs.editFromRef.validate(async valid=>{
               console.log(valid)
                 if(!valid) return
                 //发送请求
                const {data:res} = await this.$http.put('users/' + this.editForm.id,
                {email:this.editForm.email
                 ,mobile:this.editForm.mobile})
                 console.log(res)
                if(res.meta.status!==200){
                    return this.$message.error('获取数据失败');
                } 
                   
                
                this.editDialogVisible = false
                this.getUserList()
                this.$message.success('数据修改成功') 
            })
        },
        //删除
        async removeUserById(id){
            //弹框询问用户是否删除
           const confrmResult = await this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).catch(err=>{
                    return err
                })
            //console.log(confrmResult)
            if(confrmResult!=='confirm'){
                return this.$message.info('已取消删除')
            }
           const {data:res} = await this.$http.delete('users/'+id)
           if(res.meta.status!==200){
               return this.$message.error('删除数据失败')
           }
            this.$message.info('删除成功')
            this.getUserList()
        },
        //分配角色按钮
        async setjuese(userinfo){
            this.userinfo = userinfo
            const {data:res} = await this.$http.get('roles') 
            if(res.meta.status !== 200){
                return $message.error('分配失败')
            }
            this.rolesList = res.data
            this.setDialogVisible = true
        },
        //更新切换权限
        async saveRoleInfo(){
            if(!this.selectedRoleId){
                return this.$message.error('请选中角色')
            }

            const {data:res} = await this.$http.put(`users/${this.userinfo.id}/role`,{rid:this.selectedRoleId})    
            if(res.meta.status!==200){
                return this.$message.error('更新角色失败')
            }
            this.$message.success('更新角色成功')
            this.getUserList()
            this.setDialogVisible = false
        },
        //关闭对话框清空数据
        setRoleDialogClosed(){
            this.selectedRoleId=''
            this.userinfo={}
        }

    }
}
</script>

<style scoped>

</style>