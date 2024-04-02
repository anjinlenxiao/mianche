<template>
  <div style="padding: 20px">
    <el-tabs v-model="activeName">
      <el-tab-pane label="成员管理" name="first">
        <el-row>
          <!-- 左侧部门树 -->
          <el-col :span="6">
            <el-card shadow="never">
              <template #header>
                <div class="card-header">
                  <span>部门</span>
                  <el-icon
                    color="#000"
                    style="cursor: pointer"
                    @click="openAddOrg"
                    ><Plus
                  /></el-icon>
                </div>
              </template>

              <el-tree
                ref="treeRef"
                node-key="code"
                highlight-current
                :current-node-key="0"
                :data="orgData"
                :props="defaultProps"
                @node-click="handleNodeClick"
                default-expand-all
                :expand-on-click-node="false"
              />
            </el-card>
          </el-col>
          <!-- 人员列表 -->
          <el-col :span="18">
            <el-card shadow="never">
              <template #header>
                <el-breadcrumb separator="/" style="font-size: 20px">
                  <el-breadcrumb-item v-for="(item, index) in breadList">{{
                    item
                  }}</el-breadcrumb-item>
                </el-breadcrumb>
              </template>
              <el-form label-width="auto">
                <el-input
                  v-model="searchName"
                  style="max-width: 600px"
                  placeholder="请输入查询的人名"
                  class="input-with-select"
                >
                  <template #prepend>
                    <el-button :icon="Search" @click="searchNameFun" />
                  </template>
                </el-input>
              </el-form>

              <el-table :data="tableData" style="width: 100%">
                <el-table-column prop="label" label="部门名称">
                  <template #default="scope">
                    <el-tag type="primary">{{
                      tablScreenOrg(scope.row.code)
                    }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="姓名" />
              </el-table>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="团队管理" name="second"></el-tab-pane>
      <el-tab-pane label="职位维护" name="third"></el-tab-pane>
    </el-tabs>

    <el-dialog v-model="dialogVisible" title="添加部门" width="800">
      <el-form
        :model="addOrgData"
        label-width="auto"
        style="max-width: 600px; padding: 20px"
      >
        <el-form-item label="部门名称" required>
          <el-input v-model="addOrgData.label" />
        </el-form-item>
        <el-form-item label="部门编号" required>
          <el-input v-model="addOrgData.code" />
        </el-form-item>
        <el-form-item label="上级部门" required>
          <el-tree-select
            placeholder="请选择部门"
            v-model="addOrgData.parentCode"
            :data="orgData"
            :render-after-expand="false"
            check-strictly
            node-key="code"
            default-expand-all
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="SubmitEvent"> 添加 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { ElTree, ElMessage } from "element-plus";
import orgApi from "./api/org";
import userApi from "./api/user";
import { Search } from "@element-plus/icons-vue";
let searchName = ref("");

const treeRef = ref<InstanceType<typeof ElTree>>();
const activeName = ref("first") as any;

let orgData = ref([]);
let orgApiData = [];
let tableData = ref([]);
let tableData2 = ref([]);

let breadList = ref(["厦门嗨行旅游"]);

const defaultProps = {
  children: "children",
  label: "label",
};
let selectOrg = "0";
const handleNodeClick = (node, treeNode, event) => {
  console.log(node);
  selectOrg = node.code;
  searchNameFun();
  breadList.value = []; // 获取面包屑
  getTreeNode(treeRef.value?.getNode(node));
  console.log(treeRef.value?.getNode(node));
};

function searchNameFun() {
  //不影响源数据
  let tsTbleData = JSON.parse(JSON.stringify(tableData2.value));
  if (searchName.value) {
    tsTbleData = tsTbleData.filter((item) => {
      return item.name.indexOf(searchName.value) != -1;
    });
  }

  if (selectOrg != "") {
    tableData.value = tsTbleData.filter((item) => {
      if (selectOrg == "0") {
        return true;
      }
      if (item.code.indexOf(selectOrg) == 0) {
        return true;
      }
      return item.code == selectOrg;
    });
  }
}

function getTreeNode(node) {
  if (node && node.label) {
    breadList.value.unshift(node.label); // 在数组头部添加元素
    getTreeNode(node.parent);
  }
}

onMounted(() => {
  userApi.query({}).then((users) => {
    tableData.value = users;
    users.push(
      {
        code: "1201",
        name: "xxxx",
      },
      {
        code: "12",
        name: "ttttt",
      },
      {
        code: "14",
        name: "yyyyy",
      },
      {
        code: "1412",
        name: "zzzzzz",
      },
      {
        code: "1412",
        name: "xx",
      },
      {
        code: "14",
        name: "xxxxxxxxxxxxxx",
      }
    );
    tableData2.value = users;
  });
});

orgApi.query("0").then((orgApi) => {
  const treeMap = new Map(orgApi.map((item) => [item.code, item]));

  // 递归函数，用于构建树形结构
  function buildTree(parentCode) {
    const children = [];
    for (const [, item] of treeMap) {
      if (item.parentCode === parentCode) {
        const subTree = buildTree(item.code);
        if (subTree.length) {
          item.children = subTree;
        }
        children.push(item);
      }
    }
    return children;
  }

  // 开始构建树，parentCode设置为null表示从根节点开始构建
  const rootTree = buildTree(null);

  orgData.value = rootTree;
  orgApiData = orgApi;
});

const dialogVisible = ref(false) as boolean;
let addOrgData = ref({
  code: "",
  label: "",
  parentCode: "",
});
function openAddOrg() {
  dialogVisible.value = true;
  addOrgData.value = {
    code: "",
    label: "",
    parentCode: "",
  };
}

function SubmitEvent() {
  if (!addOrgData.value.code) {
    ElMessage.error("请输入部门编号");
    return false;
  }
  if (!addOrgData.value.label) {
    ElMessage.error("请输入部门名称");
    return false;
  }
  if (!addOrgData.value.parentCode) {
    ElMessage.error("请选择部门");
    return false;
  }

  getCurrentNode(orgData.value, addOrgData.value.parentCode);
  function getCurrentNode(data, key) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].code === key) {
        if (data[i].children) {
          data[i].children.push(addOrgData.value);
        } else {
          data[i].children = [addOrgData.value];
        }
        orgApiData.push(addOrgData.value);
        return false;
      } else if (data[i].children?.length) {
        const tsTree = getCurrentNode(data[i].children, key);
        if (tsTree) return tsTree;
      }
    }
  }

  dialogVisible.value = false;
}

function tablScreenOrg(val) {
  let array = orgApiData;
  for (let i = 0; i < array.length; i++) {
    const element = array[i];
    if (element.code == val) {
      return element.label;
    }
  }
}
</script>
<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
