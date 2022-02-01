<!-- @format -->

<template>
  <div style="width: 100%">
    <div class="title"><h2>流程设计管理</h2></div>
    <div class="edit">
      <div class="e-title">创建新节点 :</div>
      <div class="edit-type">
        <div
          id="Create-node"
          class="card-container"
          @click="dialogFormVisible = true"
        >
          <div class="card-column-header mouth">
            <span class="column-drag-handle mouth">&#x2630;</span>
            点击添加节点
          </div>
        </div>
      </div>
      <div class="e-title">创建新任务 :</div>
      <div class="edit-item">
        <div id="Create-task" class="task-card" @click="taskVisible = true">
          <div class="task-title" style="padding: 0 10px">点击添加新任务</div>
        </div>
      </div>
      <div class="explain">
        <el-button
          type="warning"
          plain
          size="mini"
          icon="el-icon-search"
          @click="shepher($event)"
          >使用说明</el-button
        >
      </div>
    </div>

    <el-dialog
      title="设置新节点"
      :visible.sync="dialogFormVisible"
      width="400px"
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
      width="400px"
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
        <!-- <el-form-item label="选择节点:" :label-width="formLabelWidth">
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
        </el-form-item> -->
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
        @drag-start="startD($event)"
        @drop="onColumnDrop($event)"
        @drop-ready="ready($event)"
        drag-handle-selector=".column-drag-handle"
      >
        <Draggable v-for="(column, index) in taskColumnList" :key="column.name">
          <div
            class="card-container"
            :class="{ columnSh: index === 0 }"
            :style="{
              backgroundColor: column.backgroundColor,
              color: column.color,
            }"
          >
            <div class="card-column-header">
              <span class="column-drag-handle">&#x2630;</span>
              {{ column.name }}
              <span
                class="el-icon-error delete"
                @click="deleteJD(column)"
              ></span>
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
                <div class="task-card" :class="{ taskSh: index === 0 }">
                  <div class="task-title">
                    {{ task.name
                    }}<span
                      class="el-icon-close delete pos"
                      @click="deletetask(column, task)"
                    ></span>
                  </div>
                </div>
              </Draggable>
            </Container>
          </div>
        </Draggable>
      </Container>
    </div>
    <div
      class="e-title"
      style="width: calc(100% - 40px); text-align: left; padding: 10px 20px"
    >
      待分配节点&任务
    </div>
    <div class="temp">
      <div
        v-for="column in tempList"
        :key="column.id"
        style="margin: 15px 5px 15px 0"
      >
        <div
          v-if="column.type == 'jd'"
          class="card-container"
          :class="{ columnSh: index === 0 }"
          :style="{
            backgroundColor: column.backgroundColor,
            color: column.color,
            marginRight: '20px',
          }"
        >
          <div class="card-column-header">
            <span class="column-drag-handle">&#x2630;</span>
            {{ column.name }}
            <span class="el-icon-error delete" @click="deleteJD(column)"></span>
          </div>
        </div>
        <div
          class="task-card"
          :class="{ taskSh: index === 0 }"
          style="margin: 0 10px"
          v-if="column.type == 'task'"
        >
          <Container
            group-name="col"
            @drop="(e) => onCardDrop(column.id, e)"
            :get-child-payload="getCardPayload(column.id)"
            drag-class="card-ghost"
            drop-class="card-ghost-drop"
            :drop-placeholder="dropPlaceholderOptions"
            class="draggable-container"
          >
            <Draggable>
              <div class="task-title" style="padding: 0 10px">
                {{ column.name
                }}<span
                  class="el-icon-close delete pos"
                  @click="deletetask(column, column)"
                ></span></div
            ></Draggable>
          </Container>
        </div>
      </div>
    </div>
    <div class="foot">
      <div class="but">
        <el-button
          type=""
          id="cz"
          style="margin-right: 40px"
          @click="initialization($event)"
          >重 置</el-button
        >
        <el-button id="save" type="primary" @click="sive($event)"
          >保 存</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
// 拖拽插件
import { Container, Draggable } from "vue-smooth-dnd";
// 下载文件
import FileSaver from "file-saver";
// 引导
import { shepherd } from "@wytxer/shepherd-vue";

// 拖拽重构
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
const colorList = [
  { backgroundColor: "#ecf5ff", color: "#409EFF" },
  { backgroundColor: "#f0f9eb", color: "#67C23A" },
  { backgroundColor: "#f4f4f5", color: "#909399" },
  { backgroundColor: "#f5dab1", color: "#E6A23C" },
  { backgroundColor: "#fef0f0", color: "#F56C6C" },
];
export default {
  components: { Container, Draggable },
  data() {
    return {
      tempList: [],
      taskColumnList: [
        {
          name: "日间申请",
          backgroundColor: colorList[0].backgroundColor,
          color: colorList[0].color,
          list: [
            {
              name: "入院信息登记",
              parent: "日间申请",
              id: "1677201449285-0",
            },
          ],
          id: 1677201449285,
        },
        {
          name: "日间登记",
          backgroundColor: colorList[0].backgroundColor,
          color: colorList[0].color,
          list: [
            {
              name: "办理预住院",
              parent: "日间登记",
              id: "1677201467821-0",
            },
            {
              name: "拟定手术",
              parent: "日间登记",
              id: "1677201467821-1",
            },
            {
              name: "确认麻醉方式",
              parent: "日间登记",
              id: "1677201467821-2",
            },
            {
              name: "补充登记信息",
              parent: "日间登记",
              id: "1677201467821-3",
            },
          ],
          id: 1677201467821,
        },
        {
          name: "院前检查",
          backgroundColor: colorList[0].backgroundColor,
          color: colorList[0].color,
          list: [
            {
              name: "检验检查",
              parent: "院前检查",
              id: "1677201537277-0",
            },
          ],
          id: 1677201537277,
        },
        {
          name: "院前评估",
          backgroundColor: colorList[0].backgroundColor,
          color: colorList[0].color,
          list: [
            {
              name: "麻醉评估",
              parent: "院前评估",
              id: "1677201553589-0",
            },
            {
              name: "专科评估",
              parent: "院前评估",
              id: "1677201553589-1",
            },
            {
              name: "中心评估",
              parent: "院前评估",
              id: "1677201553589-2",
            },
          ],
          id: 1677201553589,
        },
        {
          name: "术前宣教",
          backgroundColor: colorList[0].backgroundColor,
          color: colorList[0].color,
          list: [
            {
              name: "用户宣教",
              parent: "术前宣教",
              id: "1677201594797-0",
            },
          ],
          id: 1677201594797,
        },
        {
          name: "手术安排",
          backgroundColor: colorList[0].backgroundColor,
          color: colorList[0].color,
          list: [
            {
              name: "手术预约",
              parent: "手术安排",
              id: "1677201614341-0",
            },
            {
              name: "手术排程",
              parent: "手术安排",
              id: "1677201614341-1",
            },
            {
              name: "排程通知",
              parent: "手术安排",
              id: "1677201614341-2",
            },
          ],
          id: 1677201614341,
        },
        {
          name: "出入科",
          backgroundColor: colorList[0].backgroundColor,
          color: colorList[0].color,
          list: [
            {
              name: "麻醉复苏评估",
              parent: "出入科",
              id: "1677201648021-2",
            },
            {
              name: "入科",
              parent: "出入科",
              id: "1677201648021-1",
            },
            {
              name: "出科",
              parent: "出入科",
              id: "1677201648021-0",
            },
          ],
          id: 1677201648021,
        },
        {
          name: "出院评估",
          backgroundColor: colorList[0].backgroundColor,
          color: colorList[0].color,
          list: [
            {
              name: "出院评估",
              parent: "出院评估",
              id: "1677201654933-0",
            },
          ],
          id: 1677201654933,
        },
        {
          name: "随访",
          backgroundColor: colorList[0].backgroundColor,
          color: colorList[0].color,
          list: [
            {
              name: "专科随访",
              parent: "随访",
              id: "1677201670733-0",
            },
            {
              name: "中心随访",
              parent: "随访",
              id: "1677201670733-1",
            },
          ],
          id: 1677201670733,
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
    // console.log("mounted", this.taskColumnList);
  },
  methods: {
    // 引导
    shepher(e) {
      let target = e.target;
      if (target.nodeName == "I" || target.nodeName == "SPAN") {
        target = e.target.parentNode;
      }
      target.blur();
      const driver = shepherd();
      driver.addSteps([
        {
          attachTo: {
            element: document.querySelector("#Create-node"),
            on: "auto",
          },
          title: "创建新的任务节点",
          text: "创建新的任务节点到零时节点区域",
          buttons: [
            {
              action() {
                return this.next();
              },
              text: "下一步",
            },
          ],
        },
        {
          attachTo: {
            element: document.querySelector("#Create-task"),
            on: "auto",
          },
          title: "创建新的任务",
          text: "创建新的任务到零时任务区域",
        },

        {
          attachTo: {
            element: document.querySelector(".temp"),
            on: "auto",
          },
          title: "临时任务区",
          text: "此处是已创建的临时节点和零时任务",
        },
        {
          attachTo: {
            element: document.querySelector(".columnSh"),
            on: "auto",
          },
          title: "设计的流程节点",
          text: "通过拖动 &#x2630; 来改变节点位置，也可以删除节点（将存放到零时节点区域）",
        },
        {
          attachTo: {
            element: document.querySelector(".taskSh"),
            on: "auto",
          },
          title: "设计的节点任务",
          text: "通过拖动改变任务顺序和所在节点，也可以删除任务（将存放到零时任务区域）",
        },
        {
          attachTo: {
            element: document.querySelector("#cz"),
            on: "left",
          },
          title: "重置流程",
          text: "初始化设计图到上次保存的状态",
        },
        {
          attachTo: {
            element: document.querySelector("#save"),
            on: "right",
          },
          title: "保存流程",
          text: "保存完整的任务流程",
        },
        {
          attachTo: {
            element: document.querySelector("#main-btn2"),
            on: "auto",
          },
          title: "完成引导",
          text: "恭喜您已经掌握全部技能！",
          buttons: [
            {
              action() {
                return this.cancel();
              },
              text: "完成",
            },
          ],
        },
      ]);

      driver.start();
    },
    // 删除任务
    deletetask(node, item) {
      let cList = node.list;
      let newCList = [];
      cList.map((it) => {
        if (it.id !== item.id) {
          newCList.push(it);
        }
      });
      this.$message({
        showClose: true,
        message: "删除成功",
        offset: 80,
        type: "success",
      });
      setTimeout(() => {
        this.taskColumnList.find((p) => p.id === node.id).list = newCList;
      }, 300);
    },
    // 删除节点
    deleteJD(item) {
      let oldList = this.taskColumnList;
      let newList = [];
      oldList.map((it) => {
        if (it.id !== item.id) {
          newList.push(it);
        }
      });
      this.$message({
        showClose: true,
        message: "删除成功",
        offset: 80,
        type: "success",
      });
      setTimeout(() => {
        this.taskColumnList = newList;
      }, 300);
    },
    // 添加任务
    addtask(form) {
      let temp = {
        name: form.name,
        id: Date.now(),
        type: "task",
        // parent: this.taskColumnList.find((p) => p.id === form.id).name,
        // id: this.taskColumnList.find((p) => p.id === form.id).list.length
        //   ? form.id +
        //     "-" +
        //     this.taskColumnList.find((p) => p.id === form.id).list.length
        //   : form.id + "-" + 0,
      };
      // this.taskColumnList.find((p) => p.id === form.id).list.push(temp);
      this.tempList.push(temp);
      console.log("addtask--添加任务", this.taskColumnList);
      this.$message({
        showClose: true,
        message: "添加成功",
        offset: 80,
        type: "success",
      });
      this.form = {};
    },
    // 添加节点
    addjd(form) {
      let id = Date.now();
      // this.taskColumnList.push({ name: form.name, list: [], id: id });
      this.tempList.push({
        type: "jd",
        name: form.name,
        list: [],
        id: id,
        backgroundColor: colorList[0].backgroundColor,
        color: colorList[0].color,
      });
      console.log("addjd--添加节点", this.taskColumnList);
      this.$message({
        showClose: true,
        message: "添加成功",
        offset: 80,
        type: "success",
      });
      this.jdform = {};
    },
    // 监听移动
    startD(dragResult) {
      console.log("startD--监听移动", dragResult);
    },
    ready(dragResult) {
      // let it = dragResult.addedIndex;
      // let newList = [];
      // this.taskColumnList.forEach((item, index) => {
      //   item.display = index == it + 1 ? false : true;
      //   newList.push(item);
      //   console.log(item, index, it);
      // });
      // this.taskColumnList = newList;
      console.log("ready--监听移动", dragResult);
    },
    // 更新节点
    onColumnDrop(dropResult) {
      this.taskColumnList = applyDrag(this.taskColumnList, dropResult);
      this.taskColumnList.forEach((item) => {
        item.display = true;
      });
      console.log("onColumnDrop--更新节点", this.taskColumnList);
    },
    // 更新任务
    onCardDrop(columnId, dropResult) {
      let { removedIndex, addedIndex, payload } = dropResult;
      if (removedIndex !== null || addedIndex !== null) {
        const column = this.taskColumnList.find((p) => p.id === columnId);
        if (addedIndex !== null && payload) {
          dropResult.payload = {
            ...payload,
            parent: column.name,
          };
        }
        column.list = applyDrag(column.list, dropResult);
        console.log("onCardDrop--更新任务", this.taskColumnList);
      }
    },
    // 校验
    getCardPayload(columnId) {
      let index = (index) =>
        this.taskColumnList.find((p) => p.id === columnId).list[index];
      return index;
    },
    // 保存
    sive(e) {
      let target = e.target;
      if (target.nodeName == "I" || target.nodeName == "SPAN") {
        target = e.target.parentNode;
      }
      target.blur();
      let taskColumnListFile = JSON.stringify(this.taskColumnList);
      console.log("taskColumnListFile", taskColumnListFile);
      const blob = new Blob([taskColumnListFile], { type: "application/json" });
      this.$message({
        showClose: true,
        message: "开始下载",
        offset: 80,
        type: "success",
      });
      FileSaver.saveAs(blob, `flowPath.json`);
    },
    // 重置&初始化
    initialization(e) {
      let target = e.target;
      if (target.nodeName == "I" || target.nodeName == "SPAN") {
        target = e.target.parentNode;
      }
      target.blur();
      this.$message({
        showClose: true,
        message: "重置成功",
        offset: 80,
        type: "success",
      });
      setTimeout(() => {
        this.taskColumnList = [
          {
            name: "日间申请",
            list: [
              {
                name: "入院信息登记",
                parent: "日间申请",
                id: "1677201449285-0",
              },
            ],
            id: 1677201449285,
          },
          {
            name: "日间登记",
            list: [
              {
                name: "办理预住院",
                parent: "日间登记",
                id: "1677201467821-0",
              },
              {
                name: "拟定手术",
                parent: "日间登记",
                id: "1677201467821-1",
              },
              {
                name: "确认麻醉方式",
                parent: "日间登记",
                id: "1677201467821-2",
              },
              {
                name: "补充登记信息",
                parent: "日间登记",
                id: "1677201467821-3",
              },
            ],
            id: 1677201467821,
          },
          {
            name: "院前检查",
            list: [
              {
                name: "检验检查",
                parent: "院前检查",
                id: "1677201537277-0",
              },
            ],
            id: 1677201537277,
          },
          {
            name: "院前评估",
            list: [
              {
                name: "麻醉评估",
                parent: "院前评估",
                id: "1677201553589-0",
              },
              {
                name: "专科评估",
                parent: "院前评估",
                id: "1677201553589-1",
              },
              {
                name: "中心评估",
                parent: "院前评估",
                id: "1677201553589-2",
              },
            ],
            id: 1677201553589,
          },
          {
            name: "术前宣教",
            list: [
              {
                name: "用户宣教",
                parent: "术前宣教",
                id: "1677201594797-0",
              },
            ],
            id: 1677201594797,
          },
          {
            name: "手术安排",
            list: [
              {
                name: "手术预约",
                parent: "手术安排",
                id: "1677201614341-0",
              },
              {
                name: "手术排程",
                parent: "手术安排",
                id: "1677201614341-1",
              },
              {
                name: "排程通知",
                parent: "手术安排",
                id: "1677201614341-2",
              },
            ],
            id: 1677201614341,
          },
          {
            name: "出入科",
            list: [
              {
                name: "麻醉复苏评估",
                parent: "出入科",
                id: "1677201648021-2",
              },
              {
                name: "入科",
                parent: "出入科",
                id: "1677201648021-1",
              },
              {
                name: "出科",
                parent: "出入科",
                id: "1677201648021-0",
              },
            ],
            id: 1677201648021,
          },
          {
            name: "出院评估",
            list: [
              {
                name: "出院评估",
                parent: "出院评估",
                id: "1677201654933-0",
              },
            ],
            id: 1677201654933,
          },
          {
            name: "随访",
            list: [
              {
                name: "专科随访",
                parent: "随访",
                id: "1677201670733-0",
              },
              {
                name: "中心随访",
                parent: "随访",
                id: "1677201670733-1",
              },
            ],
            id: 1677201670733,
          },
        ];
      }, 300);
    },
  },
};
</script>

<style>
.title {
  /* width: 100%; */
  /* text-align: left; */
  padding: 15px;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(6px);
  color: #edeff2;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.title h2 {
  color: #555;
}
* {
  margin: 0;
  padding: 0;
  font-family: "Microsoft YaHei", "PingFang SC", "Helvetica Neue", Helvetica,
    sans-serif;
  line-height: 1.45;
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
  min-width: 150px;
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
  justify-content: space-between;
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
  padding: 15px 0;
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
  /* margin-right: 10px; */
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
  justify-content: center;
  height: 100%;
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
  width: 90%;
  border-bottom: #edeff2 solid 1px;
  border-top: #edeff2 solid 1px;
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
.but {
  margin: 20px;
  width: 60%;
  display: flex;
  justify-content: flex-end;
}
.delete {
  margin-left: 10px;
}
.mouth {
  cursor: pointer !important;
}
.temp {
  /* background: #edeff2; */
  min-height: 140px;
  width: calc(100% - 40px);
  display: flex;
  padding: 0 20px;
  border-top: #edeff2 solid 1px;
  flex-wrap: wrap;
}
.explain {
  position: absolute;
  right: 20px;
}
</style>
