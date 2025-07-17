<template>
  <div>
    <div class="card">
      <div class="card-header" id="cardHeader">
        <DataStructureContentBarElement :id="this.$route.params.id" :active="1"/>
      </div>
      <div class="d-flex flex-row">
        <t-layout style="flex: none"><Memu/></t-layout>
        <!-- 公共元素组件 -->
        <common-element id="common" ref="common" style="width: 100%" class="container mid ">
          <div slot="input" id="input" style="width: 100%; display: flex; flex-direction: column; align-items: center">
            <div style="font-size: 1rem; margin-bottom: 8px">请输入由整数和运算符(+、-、*、/、(、))组成的算术表达式</div>
            <div class="input-group mb-3 input-min-size" style="width: 50%">
              <input id="val" type="text" class="form-control" placeholder="请输入表达式" value="3 + 5 * (10 - 4)">
            </div>
          </div>
          <!--          <div slot="input" id="input1" style="width: 100%; display: flex; flex-direction: column; align-items: center">-->
          <!--            <div style="font-size: 1rem; margin-bottom: 8px">请输入创建的单链表元素，均为整数，以空格分开</div>-->
          <!--            <div class="input-group mb-3 input-min-size" style="width: 50%">-->
          <!--              <input id="rules" type="text" class="form-control" placeholder="请输入文法规则" value="10 30 15 40">-->
          <!--            </div>-->
          <!--            <button @click="getParseTree">解析</button>-->
          <!--          </div>-->
          <div slot="cartoonMain" id="cartoonMain">
            <!--            <div style="height: 80px"></div>-->
            <tree-component id="tree-component1"></tree-component>
          </div>
        </common-element>
        <!-- 分隔器组件 -->
        <resizer/>
        <!-- 代码编辑器组件 -->
        <MirrorEditor  @language-changed="handleLanguageChange" id="editor" ref="editor" style="width: 55%"/>
      </div>
    </div>
  </div>
</template>

<script>
import DataStructureContentBarElement from "@/components/element/SelectBarElement";
import MirrorEditor from '@/components/element/Mirror_backup2.vue';
import resizer from '@/components/element/resizer.vue';
import Memu from "@/components/element/cpMenu.vue";
import { toRaw } from 'vue';
import {parse} from "@/parseTree";
import {Lexer} from "@/Lexer";
import {commonUtil} from "../../../../public/js/util";
import axios from "axios";
import http from "@/api/http";

export default {
  name: 'LinerList',
  components: {
    Memu,
    DataStructureContentBarElement,
    MirrorEditor,
    resizer,
  },
  data() {
    return {
      totalStep: 0,  // 总步数
      stepMap: [],    // 步数映射
      code: ``, // 默认的代码（C++）
      language: 'Cpp',  // 当前语言（C++）
      tree: null, // 树组件
      inputArr: [],
      flag: 1, //在重复执行的step函数中判断当前步骤
      currentNode: 1,
      step: 0,
      lastDom: [],
      history: [],  // 新增历史记录
      currentStep: -1,  // 当前步骤索引
      fakeStep: -1, //记录history数组物理存在元素的指针
      pos:0,//当前分析的字符下标
      expr:-1,//当前expr节点id
      term:-1,
      factor:-1,
      exprNum:-1,//已有expr节点数量
      termNum:-1,
      factorNum:-1,
      parseStack:[],//模拟递归站
      lexArr:[],//token数组
      exprArr:[],//expr栈
      termArr:[],
      factorArr:[],
      // arrStr:"",//输入的表达式
    }
  },
  async mounted() {
    this.initComponentData(); //初始化数据
    this.initializeAlgorithmSettings(); //初始化算法相关设置
  },
  methods: {
    // 初始化数据
    initComponentData() {
      this.tree = document.getElementById('tree-component1');
      console.log("初始化")
      // console.log(this.$route.name);
    },
    // 初始化算法相关设置
    async initializeAlgorithmSettings() {
      const common = document.getElementById('common');  // 获取公共元素组件
      let val = await this.loadTitleAndInfoFromDB(this.$route.name);
      common.setTitleAndDesc(val[0], val[1]); // 设置标题和描述
      // common.setTitleAndDesc("递归下降语法分析", "该算法是通过递归调用函数来匹配输入字符串");  // 设置标题和描述
      common.zoom();  // 唤醒缩放等功能
      common.shrink();  // 为缩放按钮添加事件监听
      common.buttonAddListener();  // 为播放等按钮添加事件监听
      common.setIsContinuous(false);  // 设置是否为连续模式
      const functionArray = [this.step1, this.step2];  // 设置各步函数
      common.setFunctionArray(functionArray);  // 设置函数数组
      common.setInputRuleFunc(this.InputRuleFunc); //设置输入规则函数
      common.setTotalStepAndMapFunc(this.setTotalStep) //设置获得总步数和步数映射的函数
      common.setLastStepFunction(this.lastStepBase);  // 设置最后一步函数
      // common.setIsReplaceDom(false);
      common.setCodeMirror(this.$refs.editor);
      this.handleLanguageChange("cpp");  // 设置语言为 C++
      this.getParseTree();
    },

    async loadTitleAndInfoFromDB(id){
      console.log(id);
      const response = await http.get(`/myapp/get_compiler_ai_data/${id}/`);
      if (Array.isArray(response.data.data) && response.data.data.length > 0) {
        const info = response.data.data[0].info
        const title = response.data.data[0].name
        return [title, info]
      } else {
        console.error('未获取到有效的 info 数据');
      }
      return '';
    },

    // 切换代码语言
    handleLanguageChange(newLanguage) {
      if (newLanguage === "cpp") {
        this.$refs.editor.loadCodeFile("./code/Compilers/RecursiveAnalysis.cpp");
      } else if (newLanguage === "cangjie") {
        this.$refs.editor.loadCodeFile("");
      }
    },

    // 高亮代码行并暂停
    async highLight(lineNumber, time = null) {
      if (time === null) {
        time = this.$refs.common.getPauseTime();  // 获取默认的暂停时间
      }
      this.$refs.editor.highlightLine(lineNumber);  // 高亮代码行
      await this.$refs.common.pauseExecution(time);  // 暂停执行
    },


    // 获取并高亮最后一步的代码行
    async lastStepBase() {
      this.currentStep--;
      const prevEntry = structuredClone(this.history[this.currentStep]);
      const prevState2 = toRaw(prevEntry.state2); //树历史记录
      await this.tree.restoreState(prevState2); //恢复树

      // 从历史记录中恢复变量状态(当前撤回的步)
      this.flag = prevEntry.variables.flag;
      this.pos=prevEntry.variables.pos;
      this.expr = prevEntry.variables.expr;
      this.term = prevEntry.variables.term;
      this.factor = prevEntry.variables.factor;
      this.exprArr=prevEntry.variables.exprArr;
      this.termArr=prevEntry.variables.termArr;
      this.factorArr=prevEntry.variables.factorArr;
      this.currentNode = prevEntry.variables.currentNode;
      //待添加判定若该步入栈 则将元素手动弹出
      console.log(this.flag);
      console.log("termarr"+this.termArr.length);
      console.log("exprarr"+this.exprArr.length);
      const pauseTime = this.$refs.common.getPauseTime() / 1.5;
      await this.$refs.common.pauseExecution(pauseTime);
    },

    // 进行下一步并更新步骤
    async nextStepBase() {
      if (this.fakeStep === this.currentStep + 1) {
        const currentState2 = await this.tree.getCurrentState();
        // 保存当前变量状态
        const variables = {
          flag: this.flag,
          pos:this.pos,
          expr:this.expr,
          term:this.term,
          factor:this.factor,
          exprArr:this.exprArr,
          termArr:this.termArr,
          factorArr:this.factorArr,
          currentNode: this.currentNode,
        };
        this.history.push({ state2: currentState2, variables: variables }); // 存入对象格式
        this.fakeStep++;
      }
      this.currentStep++;
      const pauseTime = this.$refs.common.getPauseTime() / 1.5;  // 获得暂停倍率
      await this.$refs.common.pauseExecution(pauseTime);
    },
    //实现思路，使用parseStack模拟递归过程，以此确定绘制树时的父节点

    //第一步 初始化
    // (expr (term (factor 3)) + (term (factor 5) * (factor ( (expr (term (factor 10)) - (term (factor 4))) ))))
    async step1() {
      const initialState = await this.tree.getCurrentState();
      const variables = {
        flag: this.flag,
        currentNode: this.currentNode,
      };
      this.history.push({state: initialState, variables}); // 存入对象格式
      this.currentStep = 0;
      this.fakeStep = 1;
      this.$refs.common.updateAlgorithmText("语法树初始化");  // 更新算法步骤文本
      await this.nextStepBase();
    },

    //第二步 递归
    async step2() {
      let currentChar=this.lexArr[this.pos];//当前字符
      if(currentChar.type===6){//为右括号时直接进入type
        // this.exprArr.pop();
        this.flag=4;
      }
      //初始状态 创建expr节点
      if(this.flag === 1 ){
        if(await this.tree.getTreeData() === null){//树为空 创建根节点
          const treeData = { id: 1, name: '' , children: []};
          await this.tree.setTreeData(treeData);//绘制根节点
          this.$refs.common.updateAlgorithmText(`创建expression节点`);  // 更新算法步骤文本
          await this.tree.changeNodeValue(1,'expr');//(id，value)
          this.expr=1;
          this.exprArr.push(this.expr);//推入expr栈
          await this.highLight(1,500) //代码高亮
          // this.flag=2;//进入term
        }
        else if(currentChar.type===7 && this.lexArr[this.pos-1].type===5){//（整数 ——内含expr  在factor节点下
          this.currentNode++;//创建前增加
          this.factor=this.factorArr[this.factorArr.length - 1];
          let parent=this.factor;//非根节点的expr的父节点是factor
          const treeData = { id: this.currentNode, name: '' , children: []};
          this.$refs.common.updateAlgorithmText(`创建expression节点`);  // 更新算法步骤文本
          await this.tree.addLeafNode(parent, treeData);//绘制根节点
          await this.tree.changeNodeValue(this.currentNode,'expr');//(id，value)
          this.expr=this.currentNode;
          this.exprArr.push(this.expr);//推入expr栈
          await this.highLight(1,500) //代码高亮
        }
        else{
          // if(currentChar.type===7 || currentChar.type===1 ||currentChar.type===2|| currentChar.type===3 || currentChar.type===4){//整数 + - * /
          // if(currentChar.type===7){//为右括号时先弹出expr
          //   this.exprArr.pop();
          //   this.flag=4;
          // }
          await this.tree.changeNodeColor(this.expr, "#ccffcc");
          this.$refs.common.updateAlgorithmText(`解析expression`);  // 更新算法步骤文本
          await this.highLight(1,500) //代码高亮
          await this.tree.changeNodeColor(this.expr, "#98ca98");
          // await this.tree.changeNodeColor(this.expr, "#e93f34");//红色

        }

        //根据当前字符类型判断下一步动作
        if(currentChar.type===7 || currentChar.type===5 || currentChar.type===6 || currentChar.type===3 || currentChar.type===4){//整数（) * /
          this.flag=2;//进入term
        }
        else if(currentChar.type===1 || currentChar.type===2){
          this.flag=4;//进入type
        }
      }
      //term
      else if(this.flag === 2 ){
        if(this.termArr.length < this.exprArr.length){//一个expr下的时时term个数为1
          this.currentNode++;//每次创建节点时++；
          const treeData = { id: this.currentNode, name: '' , children: []};
          await this.highLight(2,300) //代码高亮
          this.$refs.common.updateAlgorithmText(`创建term节点`);  // 更新算法步骤文本
          await this.tree.addLeafNode(this.expr, treeData);//(parent,treedata)绘制term节点
          await this.highLight(14,300) //代码高亮
          await this.tree.changeNodeValue(this.currentNode,'term');//(id，value)
          this.term=this.currentNode;
          this.termArr.push(this.term);//推入term栈
        }
        else{
          await this.tree.changeNodeColor(this.term, "#ccffcc");
          this.$refs.common.updateAlgorithmText(`解析term`);  // 更新算法步骤文本
          await this.highLight(2,500) //代码高亮
          await this.tree.changeNodeColor(this.term, "#98ca98");
        }


        //根据当前字符类型判断下一步动作
        if(currentChar.type===7 || currentChar.type===5 || currentChar.type===6){//整数 （ ）
          this.flag=3;//进入factor
        }
        else if(currentChar.type===3 || currentChar.type===4){// * /
          this.flag=4;//进入type
        }
      }
      //factor
      else if(this.flag === 3 ){
        // let a=this.lexArr[this.pos-1];
        // if(currentChar.type===7 && this.pos!==0 && this.lexArr[this.pos-1].type===5 ){//(整数  ）
        //   await this.tree.changeNodeColor(this.factor, "#ccffcc");
        //   this.$refs.common.updateAlgorithmText(`解析factor`);  // 更新算法步骤文本
        //   await this.highLight(20,500) //代码高亮
        //   await this.tree.changeNodeColor(this.factor, "#98ca98");
        // }
        // else {
        this.currentNode++;//每次创建节点时++；
        const treeData = { id: this.currentNode, name: '' , children: []};
        await this.highLight(15,300) //代码高亮
        this.$refs.common.updateAlgorithmText(`创建factor节点`);  // 更新算法步骤文本
        await this.tree.addLeafNode(this.term, treeData);//(parent,treedata)绘制factor节点
        await this.tree.changeNodeValue(this.currentNode,'factor');//(id，value)
        await this.highLight(30,300) //代码高亮
        this.factor=this.currentNode;
        this.factorArr.push(this.factor);

        // }
        this.flag=4;//进入type
      }
      //type
      else if(this.flag === 4 ){
        // let currentChar=this.lexArr[this.pos];//当前字符
        this.currentNode++;//每次创建节点时++；
        const treeData = { id: this.currentNode, name: '' , children: []};

        if(currentChar.type===7){//整数
          await this.tree.addLeafNode(this.factor, treeData);//(parent,treedata)绘制类型节点
          this.$refs.common.updateAlgorithmText(`当前字符为整数 ${currentChar.text}`);  // 更新算法步骤文本
          await this.tree.changeNodeValue(this.currentNode,`int:${currentChar.text}`);//(id，value)
          await this.highLight(31,500) //代码高亮
          // this.termArr.pop();
          this.factorArr.pop();//解析完整数当前factor出栈
          this.term=this.termArr[this.termArr.length - 1];
          this.factor=this.factorArr[this.factorArr.length - 1];

        }
        else if(currentChar.type===1){
          this.expr=this.exprArr[this.exprArr.length - 1];//获取栈顶
          await this.tree.addLeafNode(this.expr, treeData);//(parent,treedata)绘制类型节点
          this.$refs.common.updateAlgorithmText(`当前字符为运算符 ${currentChar.text}`);  // 更新算法步骤文本
          await this.tree.changeNodeValue(this.currentNode,`plus:${currentChar.text}`);//(id，value)
          await this.highLight(6,300) //代码高亮
          this.termArr.pop();//+-分割项
          this.term=this.termArr[this.termArr.length - 1];
          // console.log(this.termArr.length);
        }
        else if(currentChar.type===2){
          this.expr=this.exprArr[this.exprArr.length - 1];//获取栈顶
          await this.tree.addLeafNode(this.expr, treeData);//(parent,treedata)绘制类型节点
          this.$refs.common.updateAlgorithmText(`当前字符为运算符${currentChar.text}`);  // 更新算法步骤文本
          await this.tree.changeNodeValue(this.currentNode,`minus:${currentChar.text}`);//(id，value)
          await this.highLight(10,300) //代码高亮
          this.termArr.pop();
          this.term=this.termArr[this.termArr.length - 1];

        }
        else if(currentChar.type===3){
          this.term=this.termArr[this.termArr.length - 1];//获取栈顶
          await this.tree.addLeafNode(this.term, treeData);//(parent,treedata)绘制类型节点
          this.$refs.common.updateAlgorithmText(`当前字符为运算符${currentChar.text}`);  // 更新算法步骤文本
          await this.tree.changeNodeValue(this.currentNode,`mul:${currentChar.text}`);//(id，value)
          await this.highLight(18,500) //代码高亮
          // this.factorArr.pop();
        }
        else if(currentChar.type===4){
          this.term=this.termArr[this.termArr.length - 1];//获取栈顶
          await this.tree.addLeafNode(this.term, treeData);//(parent,treedata)绘制类型节点
          this.$refs.common.updateAlgorithmText(`当前字符为运算符${currentChar.text}`);  // 更新算法步骤文本
          await this.tree.changeNodeValue(this.currentNode,`dis:${currentChar.text}`);//(id，value)
          await this.highLight(22,300) //代码高亮
          await this.highLight(23,300) //代码高亮
          // this.factorArr.pop();
        }
        else if(currentChar.type===5){
          this.factor=this.factorArr[this.factorArr.length - 1];//获取栈顶
          // this.expr=this.exprArr[this.exprArr.length - 1];
          await this.tree.addLeafNode(this.factor, treeData);//(parent,treedata)绘制类型节点
          this.$refs.common.updateAlgorithmText(`当前字符为左括号${currentChar.text}`);  // 更新算法步骤文本
          await this.tree.changeNodeValue(this.currentNode,`lp:${currentChar.text}`);//(id，value)
          await this.highLight(35,300) //代码高亮
          await this.highLight(37,300) //代码高亮

        }
        else if(currentChar.type===6){
          this.factor=this.factorArr[this.factorArr.length - 1];//获取栈顶
          this.exprArr.pop();//expr出栈 当前表达式结束
          this.termArr.pop();//右括号前为数字 其term未弹出
          this.expr=this.exprArr[this.exprArr.length - 1];
          this.term=this.termArr[this.termArr.length - 1];
          await this.tree.addLeafNode(this.factor, treeData);//(parent,treedata)绘制类型节点
          this.$refs.common.updateAlgorithmText(`当前字符为右括号${currentChar.text}`);  // 更新算法步骤文本
          await this.tree.changeNodeValue(this.currentNode,`rp:${currentChar.text}`);//(id，value)
          await this.highLight(38,300) //代码高亮

        }
        this.pos++;//获取下一个字符
        this.flag=1;//返回expr
      }
      await this.nextStepBase();
    },


    // 根据用户的输入，计算 totalStep 和 stepMap
    setTotalStep() {
      // 初始化
      this.totalStep = 0;
      this.stepMap = [];

      // 第一步初始化
      this.totalStep++;
      this.stepMap.push(this.totalStep);

      //解析获得token
      this.getParseTree();

      // 计算后续步骤
      let tempStepMap = []; //临时数组，存储stepMap内嵌套的映射
      this.lexArr.forEach((token) => {
        // console.log("step"+token.type);
        if(token.type === 7 || token.type === 5) {//数字 ）
          for (let i = 0; i < 4; i++) {//四步
            this.totalStep++;
            tempStepMap.push(this.totalStep);
          }
        }
        else if (token.type === 3 || token.type === 4) {// * /
          for (let i = 0; i < 3; i++) {//三步
            this.totalStep++;
            tempStepMap.push(this.totalStep);
          }
        }
        else if (token.type === 1 || token.type === 2) {// * /
          for (let i = 0; i < 2; i++) {//二步
            this.totalStep++;
            tempStepMap.push(this.totalStep);
          }
        }
        else if (token.type === 6){//) 一步
          this.totalStep++;
          tempStepMap.push(this.totalStep);
        }
      });
      this.stepMap.push(tempStepMap);

      // 更新 stepMap
      const common = document.getElementById('common');
      common.setTotalSteps(this.totalStep, this.stepMap);
    },

    //输入规则（作为要传入Common的函数）
    InputRuleFunc() {
      let arr = this.getInputArray();
      const regex = /[^0-9.+\-*/（）]/;
      const str=String($("#val").val());
      if (str.includes('.') && regex.test(str)) {
        commonUtil.message("请按要求输入表达式", "warning");
        return false;
      }
      if (String($("#val").val()) === '') {
        commonUtil.message("请输入表达式", "warning");
        return false;
      }
      return true;
    },

    // 获取输入数组
    getInputArray() {
      let arrStr = String($("#val").val());

      return arrStr.split(' ');//返回字符数组
    },

    getParseTree(){//获取语法解析树 和 token序列
      try {
        // const regex = /[^0-9.+\-*/（）]/;
        // const str=String($("#val").val());
        // if (str.includes('.') && regex.test(str)) {
        //   commonUtil.message("请按要求输入表达式", "warning");
        //   errorMessages.value = result.errors;
        // }
        let antlrTree = parse(String($("#val").val()));
        this.lexArr=Lexer(String($("#val").val()));
        // console.log(this.tree);
        this.lexArr.forEach((token, index) => {
          console.log(`Token ${index + 1}: Type - ${token.type}, Text - ${token.text}`);
        });

        if (antlrTree.success) {
          // 解析成功，处理语法树
          console.log('语法树:', result.tree);
          errorMessages.value = [];
        } else {
          // 解析失败，显示错误信息
          commonUtil.message("表达式错误", "warning");
          errorMessages.value = result.errors;
        }
        /*
        number:type=7
        +:1
        -:2
        *:3
        (:5
        ):6
        */
      } catch (error) {
        // commonUtil.message("表达式错误", "warning");
        // parseResult.value = `解析出错: ${error.message}`;

      }

    }
  }
}
</script>