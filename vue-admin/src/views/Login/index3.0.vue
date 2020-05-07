<template>
  <div id="login">
    <div class="login-wrap">
      <ul class="menu-tab">
        <li
          v-for="item in menuTab"
          :key="item.id"
          :class="{ current: item.current }"
          @click="toggleMneu(item)"
          v-text="item.text"
        ></li>
      </ul>
      <!-- 表单 -->
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        class="login-form"
        size="medium"
      >
        <el-form-item prop="username" class="item-form">
          <label for="username">邮箱</label>
          <el-input
            id="username"
            type="text"
            v-model="ruleForm.username"
            autocomplete="off"
            maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item prop="password" class="item-form">
          <label for="password">密码</label>
          <el-input
            id="password"
            type="password"
            v-model="ruleForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-show="register === 'register'"
          prop="passwords"
          class="item-form"
        >
          <label for="passwords">重复密码</label>
          <el-input
            id="passwords"
            type="password"
            v-model="ruleForm.passwords"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item prop="code" class="item-form">
          <label for="code">验证码</label>
          <el-row :gutter="11">
            <el-col :span="15">
              <el-input
                id="code"
                v-model="ruleForm.code"
                minlength="6"
                maxlength="6"
              ></el-input>
            </el-col>
            <el-col :span="9">
              <el-button
                type="success"
                class="block"
                :disabled="codeButtonStatus.status"
                @click="getSms()"
                >{{ codeButtonStatus.text }}</el-button
              >
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm('ruleForm')"
            :disabled="loginButtons"
            class="login-btn block"
            >{{ register === "login" ? "登录" : "注册" }}</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { reactive, ref } from "@vue/composition-api";
//import sha1 from "js-sha1";
import { GetSms, Register, Login } from "@/api/login";
import {
  validateVCode,
  validatePass,
  validateEmail,
  stripscript
} from "@/utils/validate";
export default {
  name: "Login",
  setup(porps, { refs, root }) {
    //用户名
    let validateUsername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else if (validateEmail(value)) {
        callback(new Error("邮箱格式不正确"));
      } else {
        callback();
      }
    };
    //密码
    let validatePassword = (rule, value, callback) => {
      ruleForm.password = stripscript(value);
      value = ruleForm.password;
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (validatePass(value)) {
        callback(new Error("密码为6至20位数字+字母"));
      } else {
        callback();
      }
    };
    //重复密码
    let validatePasswords = (rule, value, callback) => {
      if (register === "login") {
        callback();
      }
      ruleForm.passwords = stripscript(value);
      value = ruleForm.passwords;
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== ruleForm.password) {
        callback(new Error("两次密码不一致"));
      } else {
        callback();
      }
    };
    //验证码
    let validateCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("验证码不能为空！"));
      } else if (validateVCode(value)) {
        return callback(new Error("验证码格式不正确！"));
      } else {
        return callback();
      }
    };
    //对象数组
    const menuTab = reactive([
      { text: "登录", current: true, type: "login" },
      { text: "注册", current: false, type: "register" }
    ]);
    const ruleForm = reactive({
      username: "",
      password: "",
      passwords: "",
      code: ""
    });
    const rules = reactive({
      username: [{ validator: validateUsername, trigger: "blur" }],
      password: [
        { validator: validatePassword, max: 20, min: 6, trigger: "blur" },
        { max: 20, min: 6, message: "密码长度在6到20位数字+字母" }
      ],
      passwords: [
        { validator: validatePasswords, max: 20, min: 6, trigger: "blur" },
        { max: 20, min: 6, message: "密码长度在6到20位数字+字母" }
      ],
      code: [{ validator: validateCode, trigger: "blur" }]
    });
    //单个值
    const register = ref("login");
    //登录按钮状态
    const loginButtons = ref(true);
    // //  验证码按钮状态
    //  const codeButtons = ref(false)
    //  //验证码按钮文字
    //  const codeButtonsText = ref('获取验证码')
    const codeButtonStatus = reactive({
      status: false,
      text: "获取验证码"
    });
    //倒计时
    const timer = ref(null);
    //函数
    const toggleMneu = data => {
      menuTab.forEach(elem => {
        elem.current = false;
      });
      //高光
      data.current = true;
      //切换
      register.value = data.type;
      //重置
      refs["ruleForm"].resetFields();
      clearCountDown();
    };
    // 更新按钮状态
    const updataButtonStatus = params => {
      codeButtonStatus.status = params.status;
      codeButtonStatus.text = params.text;
    };
    //请求接口
    const getSms = () => {
      if (ruleForm.username === "") {
        root.$message.error("邮箱不能为空!!");
        return false;
      }
      if (validateEmail(ruleForm.username)) {
        root.$message.error("邮箱格式不正确!!");
        return false;
      }
      //获取验证码
      let requestData = {
        username: ruleForm.username,
        module: register.value
      };
      //修改获取验证码
      updataButtonStatus({
        status: true,
        text: "发送中"
      });
      GetSms(requestData).then(res => {
        let data = res.data;
        if (data.resCode !== 0) {
          root.$message({
            message: data.message,
            type: "error"
          });
        } else {
          root.$message({
            message: data.message,
            type: "success"
          });
        }
      });
      //启用登录注册
      loginButtons.value = false;
      //调用定时器进入倒计时
      countDown(60);
    };
    //提交表单
    const submitForm = formName => {
      refs[formName].validate(valid => {
        //表单验证通过
        if (valid) {
          register === "login" ? login() : registers();
          // if() {
          //     login()
          // }else {
          //    register()
          // }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    };
    /**
     * 登录
     *
     */
    const login = () => {
      let data = {
        username: ruleForm.username,
        password: ruleForm.password,
        code: ruleForm.code,
        module: register.value
      };
      Login(data).then(res => {
        root.$message.success(res.data.message);
        root.$router.push({ path: "/console" });
      });
    };

    /**
     * 注册
     */
    const registers = () => {
      let data = {
        username: ruleForm.username,
        password: ruleForm.password,
        code: ruleForm.code,
        module: register.value
      };
      Register(data).then(res => {
        root.$message.success(res.data.message);
        toggleMneu(menuTab[0]);
        clearCountDown();
      });
    };
    //倒计时
    const countDown = number => {
      let time = number;
      timer.value = setInterval(() => {
        time--;
        if (time === 0) {
          clearInterval(timer.value);
          updataButtonStatus({
            status: false,
            text: "再次获取"
          });
        } else {
          codeButtonStatus.text = `倒计时${time}秒`;
        }
      }, 1000);
    };
    /**
     * 清除倒计时
     */
    const clearCountDown = () => {
      // 还原验证码按钮默认状态
      updataButtonStatus({
        status: false,
        text: "获取验证码"
      });
      // 清除倒计时
      clearInterval(timer.value);
    };
    return {
      register,
      loginButtons,
      // codeButtons,
      // codeButtonsText,
      codeButtonStatus,
      menuTab,
      ruleForm,
      rules,
      toggleMneu,
      submitForm,
      getSms
    };
  }
};
</script>
<style lang="scss" scoped>
#login {
  height: 100vh;
  background-color: #344a5f;
}
.login-wrap {
  width: 330px;
  margin: auto;
  padding: 5px;
}
.menu-tab {
  text-align: center;
  li {
    display: inline-block;
    width: 88px;
    line-height: 36px;
    font-size: 14px;
    color: #fff;
    border-radius: 2px;
    cursor: pointer;
  }
  .current {
    background-color: rgba(0, 0, 0, 0.1);
  }
}
.login-form {
  margin-top: 29px;
  label {
    display: block;
    font-size: 14px;
    margin-bottom: 3px;
    color: #fff;
  }
  .item-form {
    margin-bottom: 13px;
  }
  .block {
    display: block;
    width: 100%;
  }
  .login-btn {
    margin-top: 19px;
  }
}
</style>
