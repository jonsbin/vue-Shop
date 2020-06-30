<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-row>
              <el-col>
                <el-button type="primary">添加角色</el-button>
              </el-col>
            </el-row>
            <el-table :data="rolelist" border>
            <!--展开列-->
              <el-table-column type="expand">
                <!--展开列插槽方式渲染-->
                <template slot-scope="scope">
                    <el-row v-for="(item1,i1) in scope.row.children" :key="item1.id" :class="['bdbottom',i1 ===0 ? 'bdtop' : '','vcenter']">
                        <el-col :span="5" >
                            <el-tag closable
                                @close="removeRightById(scope.row,item1.id)">
                                {{item1.authName}}
                            </el-tag>
                            <i class="el-icon-caret-right"></i>
                        </el-col>
                        <el-col :span="19">
                            <el-row v-for="(item2,i2) in item1.children" :key="item2.id" 
                            :class="[i2===0?'':'bdtop','vcenter']">
                              <el-col :span="6">
                                <el-tag type="success" closable
                                @close="removeRightById(scope.row,item2.id)"
                                >{{item2.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                              </el-col>
                              <el-col :span="18">
                                <el-tag closable
                                @close="removeRightById(scope.row,item3.id)" type="warning" v-for="(item3,i3) in item2.children" :key="item3.id">
                                  {{item3.authName}}
                                </el-tag>
                              </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </template>
              </el-table-column>
              <el-table-column type="index"></el-table-column>
              <el-table-column label="角色名称" prop="roleName"></el-table-column>
              <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                    <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                    <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
                </template>
              </el-table-column>
            </el-table>
        </el-card>

        <!---分配权限对话框-->
         <el-dialog
            title="分配权限"
            :visible.sync="setRightDialogVisible"
            width="50%"
            @click="setRightDialogClose"
            >
           <el-tree :data="rightslist" 
           :props="treeProps" 
           show-checkbox 
           node-key="id"
           default-expand-all
           :default-checked-keys="defKeys"
           ref="treeRef"
           >
            
           </el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisible=false">取 消</el-button>
                <el-button type="primary" @click="allotRights">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return {
            //所有角色列表数据
            rolelist:[],
            //分配隐藏分配权限对话框
            setRightDialogVisible:false,
            //所有权限的数据
            rightslist:[],
            //树形绑定树形
            treeProps:{
              label:'authName',
              children:'children'
            },
            //默认选中节点默认值
            defKeys:[],
            //当前即将分配权限的id
            roleId:''
        }
    },
    created(){
        this.getRolesList()
    },
    methods:{
       async getRolesList(){
            const {data:res} = await this.$http.get('roles')
            if(res.meta.status!==200){
                return this.$message.error('获取数据失败')
            }
            this.rolelist = res.data
        },
        //根据id删除对应的权限
        async removeRightById(role,rightId){
          const configrmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).catch(err=>err)  

                if(configrmResult !=='confirm'){
                      return this.$message.info('取消了删除')
                 }
                const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)

                if(res.meta.status !==200){
                  return this.$message.error('获取数据失败')
                }
                //防止删除关闭选项
                role.children = res.data
        },
        //展示分配权限的对话框
        async showSetRightDialog(role){
          this.roleId = role.id
          const {data:res} = await this.$http.get('rights/tree')
          if(res.meta.status !== 200){
            return this.$message.error('获取权限数据失败')
          }
          //获取到权限数据保存到data中
          this.rightslist = res.data
          //调用递归函数
          this.getLeafKeys(role,this.defKeys)
          this.setRightDialogVisible = true
        },
        //使用递归函数获取第三级权限
        getLeafKeys(node,arr){
          if(!node.children){
            return arr.push(node.id)
          }
          node.children.forEach(item => this.getLeafKeys(item,arr));
        },
        setRightDialogClose(){
          this.defKeys =[]
        },
        async allotRights(){
          const keys =[
            ...this.$refs.treeRef.getCheckedKeys(),
            ...this.$refs.treeRef.getHalfCheckedNodes()
          ]

          const idStr = keys.join(',')
          const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
          console.log(res)
          if(res.meta.status!==200){
            return this.$message.error('分配权限失败')
          }
          this.$message.success('分配权限成功')
          this.getRolesList()
          this.setRightDialogVisible = false
        }
    }
}
</script>

<style scoped>
.bdbottom{border-bottom: 1px solid #eee;}
.bdtop{border-top: 1px solid #e2e2;}
.vcenter{display: flex; align-content: center;}
.el-tag{margin: 7px;}
.vcenter{display: flex; align-items: center;}
</style>