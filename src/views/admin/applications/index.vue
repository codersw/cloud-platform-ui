<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="名称" v-model="listQuery.title"> </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" v-if="applicationsManager_btn_add" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">添加</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="名称">
        <template slot-scope="scope">
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="连接">
        <template slot-scope="scope">
          <span>{{scope.row.href}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="添加时间">
        <template slot-scope="scope">
          <span>{{scope.row.addtime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="启停">
        <template slot-scope="scope">
          <span>{{scope.row.qyflagName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" >
        <template slot-scope="scope">
          <el-dropdown>
            <el-button type="danger">
              操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="applicationsManager_btn_edit" @click.native="handleUpdate(scope.row)">编辑</el-dropdown-item>
              <el-dropdown-item  v-if="applicationsManager_btn_del" @click.native="handleDelete(scope.row)">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="名称" prop="title">
          <el-input v-model="form.title" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="连接" prop="href">
          <el-input v-model="form.href" placeholder="请输入连接"></el-input>
        </el-form-item>
        <el-form-item label="应以唯一标识" prop="appid">
          <el-input v-model="form.appid" placeholder="请输入应以唯一标识"></el-input>
        </el-form-item>
        <el-form-item label="用户的密钥信息" prop="secret">
          <el-input v-model="form.secret" placeholder="请输入用户的密钥信息"></el-input>
        </el-form-item>
        <el-form-item label="数据库名称" prop="databasename">
          <el-input v-model="form.databasename" placeholder="请输入数据库名称"></el-input>
        </el-form-item>
        <el-form-item label="数据库密码" prop="databasepassword">
          <el-input v-model="form.databasepassword" placeholder="请输入数据库密码"></el-input>
        </el-form-item>
        <el-form-item label="数据库连接" prop="databasecon">
          <el-input v-model="form.databasecon" placeholder="请输入数据库连接"></el-input>
        </el-form-item>
        <el-form-item label="图标" prop="img">
          <el-input v-model="form.img" placeholder="请输入图标"></el-input>
        </el-form-item>
        <el-form-item label="启停用" prop="qyflag">
          <el-select class="filter-item" v-model="form.qyflag" placeholder="是否启用">
            <el-option v-for="item in qyflagOptions" :key="item.value" :label="item.name" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel('form')">取 消</el-button>
          <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
          <el-button v-else type="primary" @click="update('form')">确 定</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
  import { page, getObj, delObj, saveObj, baseInfo } from 'api/admin/applications/index';
  import { mapGetters } from 'vuex';
  export default {
    name: 'applications',
    data() {
      return {
        form: {
          title : "",
          img : "",
          href : "",
          addtime : "",
          tishi : "",
          appid : "",
          secret : "",
          databasename : "",
          databasepassword : "",
          databasecon : "",
          qyflag : ""
        },
        rules: {
          title: [
            {
              required: true,
              message: '请输入名称',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 200,
              message: '长度在 1 到 200 个字符',
              trigger: 'blur'
            }
          ]
        },
        list: [],
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          title: ''
        },
        dialogFormVisible: false,
        dialogStatus: '',
        applicationsManager_btn_edit: false,
        applicationsManager_btn_del: false,
        applicationsManager_btn_add: false,
        textMap: {
          update: '编辑',
          create: '创建'
        },
        tableKey: 0,
        qyflagOptions: [],
      }
    },
    created() {
      this.getList();
      baseInfo().then(res => {
        this.qyflagOptions = res.data;
      });
      this.applicationsManager_btn_edit = this.elements['applicationsManager:btn_edit'];
      this.applicationsManager_btn_del = this.elements['applicationsManager:btn_del'];
      this.applicationsManager_btn_add = this.elements['applicationsManager:btn_add'];
    },
    computed: {
      ...mapGetters([
        'elements'
      ])
    },
    methods: {
      getList() {
        this.listLoading = true;
        page(this.listQuery).then(response => {
          this.list = response.data.rows;
          this.total = response.data.total;
          this.listLoading = false;
      })
      },
      handleFilter() {
        this.getList();
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      handleCreate() {
        this.resetTemp();
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
      },
      handleUpdate(row) {
        getObj(row.id).then(response => {
          this.form = response.data;
          this.dialogFormVisible = true;
          this.dialogStatus = 'update';
      });
      },
      handleDelete(row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
            .then(() => {
          delObj(row.id)
      .then(() => {
          this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        });
        const index = this.list.indexOf(row);
        this.list.splice(index, 1);
      });
      });
      },
      create(formName) {
        const set = this.$refs;
        set[formName].validate(valid => {
          if (valid) {
            saveObj(this.form).then(() => {
              this.dialogFormVisible = false;
              this.getList();
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              });
            })
          } else {
            return false;
          }
        });
      },
      cancel(formName) {
        this.dialogFormVisible = false;
        const set = this.$refs;
        set[formName].resetFields();
      },
      update(formName) {
        const set = this.$refs;
        set[formName].validate(valid => {
          if (valid) {
            this.dialogFormVisible = false;
            this.form.password = undefined;
            saveObj(this.form).then(() => {
              this.dialogFormVisible = false;
              this.getList();
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              });
            });
          } else {
            return false;
          }
        });
      },
      resetTemp() {
        this.form =  {
          title : "",
          img : "",
          href : "",
          addtime : "",
          tishi : "",
          appid : "",
          secret : "",
          databasename : "",
          databasepassword : "",
          databasecon : "",
          qyflag : ""
        };
      }
    }
  }
</script>
