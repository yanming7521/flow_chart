<!-- @format -->

<template>
  <div style="width: 100%">
    <div class="title"><h2>流程设计管理</h2></div>
    <div class="edit">
      <div class="e-title">创建新节点 :</div>
      <div class="edit-type">
        <div class="card-container" @click="dialogFormVisible = true">
          <div class="card-column-header">
            <span class="column-drag-handle">&#x2630;</span>
            点击添加节点
          </div>
        </div>
      </div>
      <div class="e-title">创建新任务 :</div>
      <div class="edit-item">
        <div class="task-card" @click="taskVisible = true">
          <div class="task-title">点击添加新任务</div>
        </div>
      </div>
    </div>
    <el-dialog
      title="设置新节点"
      :visible.sync="dialogFormVisible"
      width="26%"
      custom-class="jd"
    >
      <el-form :model="jdform">
        <el-form-item label="节点名称:" :label-width="formLabelWidth">
          <el-input
            :style="{ width: '100%' }"
            v-model="jdform.name"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="
            addjd(jdform);
            dialogFormVisible = false;
          "
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      title="设置新任务"
      :visible.sync="taskVisible"
      width="26%"
      custom-class="jd"
    >
      <el-form :model="form">
        <el-form-item label="任务名称:" :label-width="formLabelWidth">
          <el-input
            :style="{ width: '100%' }"
            v-model="form.name"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="选择节点:" :label-width="formLabelWidth">
          <el-select
            v-model="form.id"
            placeholder="请选择"
            :style="{ width: '100%' }"
          >
            <el-option
              v-for="item in taskColumnList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="taskVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="
            addtask(form);
            taskVisible = false;
          "
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <div class="card-scene">
      <Container
        orientation="horizontal"
        @drop="onColumnDrop($event)"
        drag-handle-selector=".column-drag-handle"
      >
        <Draggable v-for="(column, index) in taskColumnList" :key="column.name">
          <div class="card-container">
            <div class="card-column-header">
              <span class="column-drag-handle">&#x2630;</span>
              {{ column.name }}
            </div>
            <div
              class="arrow el-icon-right"
              v-if="index < taskColumnList.length - 1"
            ></div>
            <Container
              group-name="col"
              @drop="(e) => onCardDrop(column.id, e)"
              :get-child-payload="getCardPayload(column.id)"
              drag-class="card-ghost"
              drop-class="card-ghost-drop"
              :drop-placeholder="dropPlaceholderOptions"
              class="draggable-container"
            >
              <Draggable v-for="task in column.list" :key="task.id">
                <div class="task-card">
                  <div class="task-title">{{ task.name }}</div>
                </div>
              </Draggable>
            </Container>
          </div>
        </Draggable>
      </Container>
    </div>
    <div class="foot">
      <div class="but">
        <el-button type="" style="margin-right: 40px">重 置</el-button>
        <el-button type="primary" @click="sive()">保 存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Container, Draggable } from "vue-smooth-dnd";
import FileSaver from "file-saver";

const applyDrag = (arr, dragResult) => {
  const { removedIndex, addedIndex, payload } = dragResult;
  if (removedIndex === null && addedIndex === null) return arr;

  const result = [...arr];
  let itemToAdd = payload;

  if (removedIndex !== null) {
    itemToAdd = result.splice(removedIndex, 1)[0];
  }

  if (addedIndex !== null) {
    result.splice(addedIndex, 0, itemToAdd);
  }

  return result;
};

export default {
  components: { Container, Draggable },
  data() {
    return {
      taskColumnList: [
        {
          name: "入院登记",
          list: [
            {
              name: "入院登记",
              priority: "P1",
              status: "入院登记",
              display: true,
              id: 1,
            },
          ],
          id: 0,
        },
        {
          name: "手术评估",
          list: [
            {
              name: "麻醉评估",
              priority: "P3",
              status: "手术评估",
              display: true,
              id: 2,
            },
            {
              name: "中心评估",
              priority: "P3",
              status: "手术评估",
              display: true,
              id: 3,
            },
            {
              name: "专科评估",
              priority: "P3",
              status: "手术评估",
              display: true,
              id: 4,
            },
            {
              name: "麻醉复苏评估",
              priority: "P1",
              status: "手术评估",
              display: true,
              id: 12,
            },
          ],
          id: 1,
        },
        {
          name: "手术预约",
          list: [
            {
              name: "手术预约",
              priority: "P1",
              status: "手术预约",
              display: true,
              id: 5,
            },
          ],
          id: 2,
        },
        {
          name: "手术排程",
          list: [
            {
              name: "手术排程",
              priority: "P3",
              status: "手术排程",
              display: true,
              id: 6,
            },
          ],
          id: 3,
        },
        {
          name: "入科",
          list: [
            {
              name: "入科",
              priority: "P0",
              status: "入科",
              display: true,
              id: 7,
            },
          ],
          id: 4,
        },
        {
          name: "出科",
          list: [
            {
              name: "出科",
              priority: "P1",
              status: "出科",
              display: true,
              id: 8,
            },
          ],
          id: 5,
        },
        {
          name: "办理出院",
          list: [
            {
              name: "出院",
              priority: "P1",
              status: "办理出院",
              display: true,
              id: 9,
            },
          ],
          id: 6,
        },
        {
          name: "随访",
          list: [
            {
              name: "中心随访",
              priority: "P1",
              status: "随访",
              display: true,
              id: 10,
            },
            {
              name: "专科随访",
              priority: "P1",
              status: "随访",
              display: true,
              id: 11,
            },
          ],
          id: 7,
        },
      ],
      dropPlaceholderOptions: {
        className: "drop-preview",
        animationDuration: "150",
        showOnTop: true,
      },
      dialogFormVisible: false,
      taskVisible: false,
      formLabelWidth: "80px",
      jdform: {
        name: "",
      },
      form: {
        name: "",
        id: "",
      },
    };
  },
  mounted() {
    console.log("mounted", this.taskColumnList);
    // this.taskColumnList = require("@/jsons/flowPath.json")
    //   ? require("@/jsons/flowPath.json")
    //   : this.taskColumnList;
  },
  methods: {
    addtask(form) {
      let temp = {
        name: form.name,
        priority: "P1",
        status: this.taskColumnList.find((p) => p.id === form.id).name,
        display: true,
        id: form.id,
      };
      this.taskColumnList.find((p) => p.id === form.id).list.push(temp);
      // this.taskColumnList[form.id].list.push(temp);
      console.log("addtask--添加任务", this.taskColumnList);
    },
    addjd(form) {
      let id = this.taskColumnList.length + 1;
      this.taskColumnList.push({ name: form.name, list: [], id: id });
      console.log("addjd--添加节点");
    },
    onColumnDrop(dropResult) {
      this.taskColumnList = applyDrag(this.taskColumnList, dropResult);
      console.log("onColumnDrop--更新节点", this.taskColumnList);
    },
    onCardDrop(columnId, dropResult) {
      let { removedIndex, addedIndex, payload } = dropResult;
      if (removedIndex !== null || addedIndex !== null) {
        const column = this.taskColumnList.find((p) => p.id === columnId);
        if (addedIndex !== null && payload) {
          // 更新任务状态
          dropResult.payload = {
            ...payload,
            status: column.name,
          };
        }
        column.list = applyDrag(column.list, dropResult);
        console.log("onCardDrop--更新任务", this.taskColumnList);
      }
    },
    getCardPayload(columnId) {
      let index = (index) =>
        this.taskColumnList.find((p) => p.id === columnId).list[index];
      // console.log("getCardPayload--初始化检查", index);
      return index;
    },
    sive() {
      let taskColumnListFile = JSON.stringify(this.taskColumnList);
      console.log("taskColumnListFile", taskColumnListFile);

      const blob = new Blob([taskColumnListFile], { type: "application/json" });
      FileSaver.saveAs(blob, `flowPath.json`);
    },
  },
};
</script>

<style>
.title {
  /* width: 100%; */
  /* text-align: left; */
  padding: 15px;
  background: #409eff;
  color: #edeff2;
}
.title h2 {
  color: #edeff2;
}
* {
  margin: 0;
  padding: 0;
  font-family: "Microsoft YaHei", "PingFang SC", "Helvetica Neue", Helvetica,
    sans-serif;
  line-height: 1.45;
  /* color: rgba(0, 0, 0, 0.65); */
}
.card-scene {
  user-select: none;
  height: 100%;
  margin: 20px;
  margin-top: 40px;
  overflow-x: auto;
  padding-bottom: 40px;
}
.element::-webkit-scrollbar {
  width: 0 !important;
}

.card-container {
  display: flex;
  flex-direction: column;
  min-width: 140px;
  border-radius: 12px;
  background-color: #edeff2;
  margin-right: 50px;
  min-height: 50px;
  position: relative;
}
.display {
  display: none !important;
}
.arrow {
  position: absolute;
  /* border: #333333 2px solid; */
  width: 40px;
  top: 25px;
  font-size: 20px;

  right: -45px;
}
.card-column-header {
  display: flex;
  height: 50px;
  margin: 0 16px;
  align-items: center;
  flex-shrink: 0;
  font-weight: 500;
  font-size: 16px;
}
.draggable-container {
  flex-grow: 1;
  overflow: auto;
}
.column-drag-handle {
  cursor: move;
  padding: 5px;
}
.task-card {
  margin: 10px;
  background-color: white;
  padding: 15px 10px;
  border-radius: 8px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.12);
  cursor: pointer;
  display: flex;
  justify-content: center;
  min-width: 60px;
}
.task-title {
  color: #333333;
  font-size: 14px;
  margin-right: 10px;
}
.task-priority {
  width: 60px;
  line-height: 20px;
  border-radius: 12px;
  text-align: center;
  color: #fff;
  font-size: 12px;
}

.drop-preview {
  background-color: rgba(150, 150, 200, 0.1);
  border: 1px dashed #abc;
  margin: 5px;
}
.edit {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 20px;
  /* margin-right: 20px; */
  border-bottom: #edeff2 solid 1px;
}
.e-title {
  padding: 20px 0;
  margin-right: 20px;
  font-weight: bolder;
  font-size: 18px;
}
.jd {
  padding: 15px;
}
.dialog-footer {
  margin: auto;
}
.foot {
  width: 100%;
  border-bottom: #edeff2 solid 1px;
  border-top: #edeff2 solid 1px;
  position: absolute;
  bottom: 100px;
  display: flex;
  justify-content: center;
}
.but {
  margin: 20px;
  width: 40%;
  display: flex;
  justify-content: flex-end;
}
</style>
