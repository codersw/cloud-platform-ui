<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <template v-if="showFilter">
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="部门名字" v-model="listQuery.name"> </el-input>
        <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button class="filter-item" v-if="deptManager_btn_add" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">添加</el-button>
        <el-button class="filter-item" v-if="deptManager_btn_add" style="margin-left: 10px;"  type="primary" icon="el-icon-edit" @click="handleWechatDept">同步微信部门</el-button>
      </template>
      <template  v-if="!showFilter">
        <el-button type="success" icon="el-icon-edit" @click="handleUpdateStatus(1)">启用</el-button>
        <el-button type="danger" icon="el-icon-edit" @click="handleUpdateStatus(0)">停用</el-button>
      </template>
    </div>
    <el-table lazy :data="list" row-key="id" border @selection-change="handleSelectionChange" ref="tableData"
              :tree-props="{children: 'children', hasChildren: 'hasChildren'}" v-loading.body="listLoading" :load="getNodeData">
      <el-table-column type="selection" width="55px" align="center">
      </el-table-column>
      <el-table-column align="center" label="名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="下属部门数量">
        <template slot-scope="scope">
          <span>{{scope.row.num}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="启停">
        <template slot-scope="scope">
          <span>{{scope.row.statusName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="微信同步">
        <template slot-scope="scope">
          <span>{{scope.row.synchronousName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" >
        <template slot-scope="scope">
          <el-dropdown>
            <el-button type="danger">
              操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="deptManager_btn_edit" @click.native="handleUpdate(scope.row)">编辑</el-dropdown-item>
              <el-dropdown-item  v-if="deptManager_btn_del" @click.native="handleDelete(scope.row)">删除</el-dropdown-item>
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
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入部门名称"></el-input>
        </el-form-item>
        <el-form-item label="父级部门" prop="pid">
            <el-cascader :options="deptTree" :show-all-levels="false" :props="defaultProps" v-model="checkedDept" :size="'medium'" clearable placeholder="请选择父级部门" ref="deptTree"></el-cascader>
        </el-form-item>
        <el-form-item label="是否启用" prop="status">
          <el-select class="filter-item" v-model="form.status" placeholder="是否启用">
            <el-option v-for="item in yesNoOptions" :key="item.codelistid" :label="item.codename" :value="item.codevalue"> </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus === 'create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { page, getObj, delObj, saveObj, codeList, deptList, wechatDept, updateStatus } from 'api/admin/dept/index';
  import { mapGetters } from 'vuex';
  export default {
    name: 'dept',
    data() {
      return {
        form: {
          id: '',
          name : '',
          pid : '',
          status : '',
        },
        rules: { },
        list: [],
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          name: ''
        },
        dialogFormVisible: false,
        dialogStatus: '',
        deptManager_btn_edit: false,
        deptManager_btn_del: false,
        deptManager_btn_add: false,
        textMap: {
          update: '编辑',
          create: '创建'
        },
        tableKey: 0,
        yesNoOptions: [],
        deptList: [],
        showFilter: true,
        checkedDept: [],
        multipleSelection: [],
        defaultProps: {
          children: 'children',
          label: 'name',
          multiple: false,
          checkStrictly: true,
          value: 'id'
        },
        deptTree: [],
      }
    },
    created() {
      this.getList();
      codeList('YES_NO').then(res => {
        this.yesNoOptions = res;
      });
      deptList('').then(res => {
        if (res && res.length > 0) {
          this.deptTree = this.toTree(res);
        }
      });
      this.deptManager_btn_edit = this.elements['deptManager:btn_edit'];
      this.deptManager_btn_del = this.elements['deptManager:btn_del'];
      this.deptManager_btn_add = this.elements['deptManager:btn_add'];
    },
    computed: {
      ...mapGetters([
        'elements'
      ])
    },
    methods: {
      getList() {
        this.listLoading = true;
        if (this.listQuery.name === '') {
          this.listQuery.pid = '1';
        } else {
          this.listQuery.pid = '';
        }
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
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
          delObj(row.id).then(() => {
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
      handleWechatDept() {
        this.listLoading = true;
        wechatDept().then(() => {
          this.getList();
          this.$notify({
            title: '成功',
            message: '同步成功',
            type: 'success',
            duration: 2000
          });
        });
      },
      getNodeData(row, treeNode, resolve) {
        deptList(row.id).then(res => {
          if(res && res.length > 0) {
            setTimeout(() => {
              resolve(res);
            }, 1000);
          }
        });
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
        this.showFilter = !(val && val.length > 0);
      },
      handleUpdateStatus(status) {
        const nodes = this.multipleSelection;
        if (nodes && nodes.length > 0) {
          this.listLoading = true;
          updateStatus(nodes.map(e => e.id).join(','), status).then( () => {
            this.getList();
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            });
          });
        }
      },
      create(formName) {
        const set = this.$refs;
        set[formName].validate(valid => {
          if (valid) {
            const deptNodes = set.deptTree.getCheckedNodes();
            console.log(deptNodes);
            if (deptNodes && deptNodes.length > 0) {
              this.form.pid = deptNodes[0].value;
            }
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
            saveObj(this.form.id, this.form).then(() => {
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
          id: '',
          name : '',
          pid : '',
          status : '',
        }
      },
      toTree(data) {
        let dataList = [];
        data.forEach(function (item) {
          if (item.id !== 1) {
            delete item.children;
            dataList.push(item);
          }
        });
        let map = {};
        dataList.forEach(function (item) {
          map[item.id] = item;
        });
        this.deptMap = map;
        let result = [];
        dataList.forEach(function (item) {
          const parent = map[item.pid];
          if (parent) {
            (parent.children || ( parent.children = [] )).push(item);
          } else {
            result.push(item);
          }
        });
        return result;
      }
    }
  }
</script>
