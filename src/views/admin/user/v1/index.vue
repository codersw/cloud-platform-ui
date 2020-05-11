<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <template v-if="showFilter">
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="用户名" v-model="listQuery.username"> </el-input>
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="工号" v-model="listQuery.account"> </el-input>
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="手机" v-model="listQuery.phoneNumber"> </el-input>
        <el-select style="width: 200px;" class="filter-item" placeholder="中心" v-model="listQuery.centerId" @change="changeChildDept" >
          <el-option v-for="dept in deptList" :key="dept.id" :label="dept.name" :value="dept.id" > </el-option>
        </el-select>
        <el-select class="filter-item" style="width: 200px;" placeholder="部门" v-model="listQuery.deptId">
          <el-option v-for="dept in deptChildList" :key="dept.id" :label="dept.name" :value="dept.id"> </el-option>
        </el-select>
        <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button class="filter-item" v-if="userManager_v1_btn_add" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">添加</el-button>
        <el-button class="filter-item" v-if="userManager_v1_btn_add" style="margin-left: 10px;" @click="handleWechatUser" type="primary" icon="el-icon-edit">同步微信人员</el-button>
      </template>
      <template  v-if="!showFilter">
        <el-button type="success" icon="el-icon-edit" @click="handleUpdateStatus(1)">启用</el-button>
        <el-button type="danger" icon="el-icon-edit" @click="handleUpdateStatus(0)">停用</el-button>
      </template>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%" @selection-change="handleSelectionChange" ref="tableData">
        <el-table-column type="selection" width="55px" align="center">
        </el-table-column>
        <el-table-column align="center" label="工号">
          <template slot-scope="scope">
            <span>{{scope.row.account}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="用户">
          <template slot-scope="scope">
            <span>{{scope.row.username}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="手机">
          <template slot-scope="scope">
            <span>{{scope.row.phoneNumber}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="所属部门">
          <template slot-scope="scope">
            <span>{{scope.row.departmentname}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="座机">
          <template slot-scope="scope">
            <span>{{scope.row.telNumber}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="岗位">
          <template slot-scope="scope">
            <span>{{scope.row.position}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="启用状态">
          <template slot-scope="scope">
            <span>{{scope.row.statusName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-dropdown>
              <el-button type="danger">
                操作<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="userManager_v1_btn_edit" @click.native="handleUpdate(scope.row)">编辑</el-dropdown-item>
                <el-dropdown-item v-if="userManager_v1_btn_edit" @click.native="handleWechatUserByUserId(scope.row)">获取微信信息</el-dropdown-item>
                <el-dropdown-item v-if="userManager_v1_btn_edit" @click.native="handleResetPassword(scope.row)">重置密码</el-dropdown-item>
                <el-dropdown-item v-if="userManager_v1_btn_del" @click.native="handleDelete(scope.row)">删除</el-dropdown-item>
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
        <el-form-item label="工号" prop="account">
          <el-input v-model="form.account" :readonly="dialogStatus !== 'create'" placeholder="请输入工号"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="dialogStatus === 'create'">
          <el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phoneNumber">
          <el-input v-model="form.phoneNumber" placeholder="请输入手机"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select class="filter-item" v-model="form.sex" placeholder="请选择性别">
            <el-option v-for="item in sexOptions" :key="item.codelistid" :label="item.codename" :value="item.codevalue"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生日" prop="birthday">
          <el-date-picker v-model="form.birthday" @change="changeBirthday" :editable=false type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="请输入生日"></el-date-picker>
        </el-form-item>
        <el-form-item label="座机号码" prop="telNumber">
          <el-input v-model="form.telNumber" placeholder="请输入座机号码"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入地址"></el-input>
        </el-form-item>
        <el-form-item label="移动小号" prop="mobile">
          <el-input v-model="form.mobile" placeholder="请输入移动小号"></el-input>
        </el-form-item>
        <el-form-item label="电信小号" prop="telecom">
          <el-input v-model="form.telecom" placeholder="请输入电信小号"></el-input>
        </el-form-item>
        <el-form-item label="办公地点" prop="office">
          <el-input v-model="form.office" placeholder="请输入办公地点"></el-input>
        </el-form-item>
        <el-form-item label="职务" prop="position">
          <el-input v-model="form.position" placeholder="请输入职务"></el-input>
        </el-form-item>
        <el-form-item label="身份" prop="identity">
          <el-input v-model="form.identity" placeholder="请输入身份"></el-input>
        </el-form-item>
        <el-form-item label="所属部门" prop="departmentname">
          <el-cascader :options="deptTree" :props="defaultProps" v-model="checkedDept" :size="'medium'" clearable placeholder="请选择所属部门" ref="deptTree"></el-cascader>
        </el-form-item>
        <el-form-item label="负责部门" prop="fuzename">
          <el-cascader :options="fuzeDeptTree" :props="defaultProps" v-model="checkedFuzeDept" :size="'medium'" clearable placeholder="请选择负责部门" ref="fuzeDeptTree"></el-cascader>
        </el-form-item>
        <el-form-item label="信用分" prop="credit">
          <el-input v-model="form.credit" placeholder="请输入信用分"></el-input>
        </el-form-item>
        <el-form-item label="政治面貌" prop="political">
          <el-input v-model="form.political" placeholder="请输入政治面貌"></el-input>
        </el-form-item>
        <el-form-item label="派驻" prop="paizhu">
          <el-select class="filter-item" v-model="form.paizhu" placeholder="请选择派驻">
            <el-option v-for="item in yesNoOptions" :key="item.codelistid" :label="item.codename" :value="item.codevalue"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="启用" prop="status">
          <el-select class="filter-item" v-model="form.status" placeholder="请选择启用">
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
  import { page, saveObj, getObj, delObj, codeList, deptList, wechatUser, updateStatus, resetPassword, wechatUserByUserId } from 'api/admin/user/v1/index';
  import { mapGetters } from 'vuex';
  export default {
    name: 'userV1',
    data() {
      return {
        form: {
          username : '',
          sex : '',
          birthday : '',
          account : '',
          password : '',
          phoneNumber : '',
          telNumber : '',
          email : '',
          nickname : '',
          address : '',
          mobile : '',
          telecom : '',
          office : '',
          department : '',
          departmentname : '',
          position : '',
          identity : '',
          role : '',
          addtime : '',
          credit : '',
          political : '',
          paizhu : '',
          status : ''
        },
        rules: {
          username: [
            {
              required: true,
              message: '请输入姓名',
              trigger: 'blur'
            },
            {
              min: 2,
              max: 20,
              message: '长度在 2 到 20 个字符',
              trigger: 'blur'
            }
          ],
          sex: [
            {
              required: true,
              message: '请选择性别',
              trigger: 'blur'
            }
          ],
          account: [
            {
              required: true,
              message: '请输入工号',
              trigger: 'blur'
            }
          ],
          password: [
            {
              required: true,
              message: '请输入密码',
              trigger: 'blur'
            }
          ],
          phoneNumber: [
            {
              required: true,
              message: '请输入手机号码',
              trigger: 'blur'
            }
          ],
          telNumber: [
            {
              required: true,
              message: '请输入座机号码',
              trigger: 'blur'
            }
          ],
          email: [
            {
              required: true,
              message: '请输入邮箱地址',
              trigger: 'blur'
            }
          ],
          address: [
            {
              required: true,
              message: '请输入地址',
              trigger: 'blur'
            }
          ],
          mobile: [
            {
              required: true,
              message: '请输入移动小号',
              trigger: 'blur'
            }
          ],
          telecom: [
            {
              required: true,
              message: '请输入电信小号',
              trigger: 'blur'
            }
          ],
          office: [
            {
              required: true,
              message: '请输入办公地点',
              trigger: 'blur'
            }
          ],
          position: [
            {
              required: true,
              message: '请输入职务',
              trigger: 'blur'
            }
          ],
          identity: [
            {
              required: true,
              message: '请输入身份',
              trigger: 'blur'
            }
          ],
          credit: [
            {
              required: true,
              message: '请输入信用分',
              trigger: 'blur'
            }
          ],
          political: [
            {
              required: true,
              message: '请输入政治面貌',
              trigger: 'blur'
            }
          ],
          paizhu: [
            {
              required: true,
              message: '请输入',
              trigger: 'blur'
            }
          ],
          status: [
            {
              required: true,
              message: '请输入启用状态0未启用1启用',
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
          name: '',
          account: '',
          phoneNumber: '',
          deptId: '',
          centerId: ''
        },
        dialogFormVisible: false,
        dialogStatus: '',
        userManager_v1_btn_add: false,
        userManager_v1_btn_del: false,
        userManager_v1_btn_edit: false,
        textMap: {
          update: '编辑',
          create: '创建'
        },
        tableKey: 0,
        sexOptions: [],
        yesNoOptions: [],
        deptList: [],
        deptChildList: [],
        deptTree: [],
        fuzeDeptTree: [],
        defaultProps: {
          children: 'children',
          label: 'name',
          multiple: true,
          value: 'id'
        },
        checkedDept: [],
        checkedFuzeDept: [],
        deptMap: {},
        showFilter: true,
        multipleSelection: []
      }
    },
    created() {
      this.getList();
      codeList('SEX_TYPE').then(res => {
        this.sexOptions = res;
      });
      codeList('YES_NO').then(res => {
        this.yesNoOptions = res;
      });
      deptList('1').then(res => {
        if (res && res.length > 0) {
          this.deptList = res;
        }
      });
      deptList('').then(res => {
        if (res && res.length > 0) {
          this.deptTree = this.toTree(res);
          this.fuzeDeptTree = this.deptTree;
        }
      });
      this.userManager_v1_btn_add = this.elements['userManager_v1:btn_edit'];
      this.userManager_v1_btn_del = this.elements['userManager_v1:btn_del'];
      this.userManager_v1_btn_edit = this.elements['userManager_v1:btn_add'];
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
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
        this.resetTemp();
      },
      handleUpdate(row) {
        console.log(row)
        getObj(row.id).then(response => {
          this.form = response.data;
          this.form.sex = String(this.form.sex);
          this.dialogFormVisible = true;
          this.fomatDept();
          this.fomatFuzeDept();
          this.dialogStatus = 'update';
        });
      },
      handleDelete(row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
          this.listLoading = true;
          delObj(row.id).then(() => {
            this.listLoading = false;
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
      handleResetPassword(row) {
        this.listLoading = true;
        resetPassword(row.id).then( () => {
          this.listLoading = false;
          this.$notify({
            title: '成功',
            message: '同步成功',
            type: 'success',
            duration: 2000
          });
        });
      },
      handleWechatUserByUserId(row) {
        this.listLoading = true;
        wechatUserByUserId(row.id).then( () => {
          this.listLoading = false;
          this.$notify({
            title: '成功',
            message: '同步成功',
            type: 'success',
            duration: 2000
          });
        });
      },
      handleWechatUser() {
        this.listLoading = true;
        wechatUser().then( () => {
          this.getList();
          this.$notify({
            title: '成功',
            message: '同步成功',
            type: 'success',
            duration: 2000
          });
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
              this.form.department = deptNodes.map(e => e.value).join(',');
              this.form.departmentname = deptNodes.map(e => e.label).join(',');
            }
            const fuzeDeptNodes = set.fuzeDeptTree.getCheckedNodes();
            console.log(fuzeDeptNodes);
            if (fuzeDeptNodes && fuzeDeptNodes.length > 0) {
              this.form.fuze = fuzeDeptNodes.map(e => e.value).join(',');
              this.form.fuzename = fuzeDeptNodes.map(e => e.label).join(',');
            }
            this.listLoading = true;
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
            const deptNodes = set.deptTree.getCheckedNodes();
            console.log(deptNodes);
            if (deptNodes && deptNodes.length > 0) {
              this.form.department = deptNodes.map(e => e.value).join(',');
              this.form.departmentname = deptNodes.map(e => e.label).join(',');
            }
            const fuzeDeptNodes = set.fuzeDeptTree.getCheckedNodes();
            console.log(fuzeDeptNodes);
            if (fuzeDeptNodes && fuzeDeptNodes.length > 0) {
              this.form.fuze = fuzeDeptNodes.map(e => e.value).join(',');
              this.form.fuzename = fuzeDeptNodes.map(e => e.label).join(',');
            }
            this.dialogFormVisible = false;
            this.form.password = '';
            this.listLoading = true;
            saveObj(this.form).then(() => {
              this.dialogFormVisible = false;
              this.getList();
              this.$notify({
                title: '成功',
                message: '修改成功',
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
        this.form = {
          username : '',
          sex : '',
          birthday : '',
          account : '',
          password : '',
          phoneNumber : '',
          telNumber : '',
          email : '',
          nickname : '',
          address : '',
          mobile : '',
          telecom : '',
          office : '',
          department : '',
          departmentname : '',
          position : '',
          identity : '',
          role : '',
          addtime : '',
          credit : '',
          political : '',
          paizhu : '',
          status : ''
        };
        this.checkedDept = [];
        this.checkedFuzeDept = [];
      },
      changeBirthday(val) {
        this.form.birthday = val;
      },
      changeChildDept() {
        deptList(this.listQuery.centerId).then(res => {
          this.listQuery.deptId = '';
          this.deptChildList = res;
        });
      },
      fomatDept() {
        if (this.form.department !== '') {
          const deptIds = this.form.department.split(',');
          deptIds.forEach(deptId => {
            let arr = [];
            this.getDeptIds(deptId, arr);
            this.checkedDept.push(arr.reverse());
          });
        }
      },
      fomatFuzeDept() {
        if (this.form.department !== '') {
          const deptIds = this.form.fuze.split(',');
          deptIds.forEach(deptId => {
            let arr = [];
            this.getDeptIds(deptId, arr);
            this.checkedFuzeDept.push(arr.reverse());
          });
        }
      },
      getDeptIds(id, arr) {
        const dept = this.deptMap[id];
        arr.push(dept.id);
        if (dept.pid !== '1') {
          this.getDeptIds(dept.pid, arr)
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
