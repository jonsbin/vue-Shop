<template>
        
    <el-container class="home-container">
        
        <el-header>
            <div>
                <span>电商管理后台系统</span>
            </div> 
            <el-button type="info" @click="loginout">退出</el-button>
        </el-header>
        <el-container>
            <el-aside :width="isCollaps?'64px':'200px'">
                <div class="toggle-button" @click="toggle_btn">|||</div>
                <el-menu
                :collapse-transition="false"
                :collapse="isCollaps"
                unique-opened
                background-color="#333744"
                text-color="#fff"
                :router="true"
                :default-active="activePath"
                active-text-color="#ffd04b">
                <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
                    <template slot="title">
                    <i :class="iconslist[item.id]"></i>
                    <span>{{item.authName}}</span>
                    </template>
                    <el-menu-item 
                    :index="'/'+subItem.path" 
                    v-for="subItem in item.children" :key="subItem.id" 
                    @click="saveNavState('/'+subItem.path)">
                        <i class="el-icon-menu"></i>
                        <span>{{subItem.authName}}</span>
                    </el-menu-item>
                </el-submenu>
               
                </el-menu>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
   
</template>
<script>
export default {
    data(){
        return {
            //左侧菜单数据
            menulist:[],
            //图标数据
            iconslist:{
                '125':'el-icon-location',
                '103':'el-icon-unlock',
                '101':'el-icon-shopping-bag-1',
                '102':'el-icon-tickets',
                '145':'el-icon-s-data'
            },
            isCollaps:false,
            //激活链接地址
            activePath:''
        }
    },
    created(){
        this.getMenuList();
        this.activePath = window.sessionStorage.getItem('activePath');
    },
    methods:{
        loginout(){
            window.sessionStorage.clear()
            this.$router.push('/login')
        },
        async getMenuList(){
            const {data:res} = await this.$http.get('menus')
            if(res.meta.status !=200) return this.$message.error(res.meta.msg)
            this.menulist = res.data
        },
        //点击折叠收起菜单
        toggle_btn(){
            this.isCollaps = !this.isCollaps
        },
        //点击当前高亮状态保存到sessionStorage
        saveNavState(activePath){
            window.sessionStorage.setItem('activePath',activePath)
            this.activePath = activePath;
        }
    }
}
</script>

<style  scoped>
.home-container{height: 100%;}
.el-header{
    background: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    font-size: 20px;
    }
.el-aside{background: #333744;}
.el-main{background:#}
.el-menu{border: 0px;}
.toggle-button{
    background: #4A5064;
    font-size: 10px;
    line-height: 10px;
    text-align: center;
    letter-spacing: 0.2em;
    
}
</style>