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
                @click="getSms"
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
import {
  validateVCode,
  validatePass,
  validateEmail,
  stripscript
} from "@/utils/validate";
import sha1 from "js-sha1";
import { GetSms, Register, Login } from "@/api/login";
export default {
  name: "Login",
  data() {
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
      this.ruleForm.password = stripscript(value);
      value = this.ruleForm.password;
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
      if (this.register === "login") {
        callback();
      }
      this.ruleForm.passwords = stripscript(value);
      value = this.ruleForm.passwords;
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.password) {
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
    return {
      menuTab: [
        { text: "登录", current: true, type: "login" },
        { text: "注册", current: false, type: "register" }
      ],
      timer: null,
      register: "login",
      loginButtons: true,
      ruleForm: {
        username: "410293095@qq.com",
        password: "wo123456789",
        passwords: "",
        code: ""
      },
      codeButtonStatus: {
        status: false,
        text: "获取验证码"
      },
      rules: {
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
      }
    };
  },
  methods: {
    getSms() {
      if (this.ruleForm.username === "") {
        this.$message.error("邮箱不能为空!!");
        return false;
      }
      if (validateEmail(this.ruleForm.username)) {
        this.$message.error("邮箱格式不正确!!");
        return false;
      }
      //获取验证码
      let requestData = {
        username: this.ruleForm.username,
        module: this.register
      };
      //修改获取验证码
      this.updataButtonStatus({
        status: true,
        text: "发送中"
      });
      GetSms(requestData)
        .then(res => {
          // bug
          let data = res.data;
          if (data.resCode !== 0) {
            this.$message({
              message: data.message,
              type: "error"
            });
            this.updataButtonStatus({
              status: false,
              text: "再次获取"
            });
          } else {
            this.$message({
              message: data.message,
              type: "success",
              dangerouslyUseHTMLString: true
            });
            //启用登录注册
            this.loginButtons = false;
            //调用定时器进入倒计时
            this.countDown(60);
          }
        })
        .catch(error => {
          console.log(error);
          this.updataButtonStatus({
            status: false,
            text: "重新获取"
          });
        });
    },
    //切换模块
    toggleMneu(data) {
      this.menuTab.forEach(elem => {
        elem.current = false;
      });
      data.current = true;
      this.register = data.type;
      this.resetFields();
      this.clearCountDown();
    },
    //清除表单数据
    resetFields() {
      this.$refs.ruleForm.resetFields();
    },
    //提交表单
    submitForm(ruleForm) {
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          //判断模块调用不同的方法
          this.register === "login" ? this.login() : this.registers();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 更新按钮状态
    updataButtonStatus(params) {
      this.codeButtonStatus.status = params.status;
      this.codeButtonStatus.text = params.text;
    },
    /**
     * 登录
     *
     */
    login() {
      let data = {
        username: this.ruleForm.username,
        password: sha1(this.ruleForm.password),
        code: this.ruleForm.code,
        module: this.register
      };
      //调用登录接口
      Login(data).then(res => {
        this.$message.success(res.data.message);
        // this.toggleMneu(this.menuTab[0]);
        this.clearCountDown();
        //页面跳转
        this.$router.push({ path: "/console" });
      });
    },
    /**
     * 注册
     */
    registers() {
      let data = {
        username: this.ruleForm.username,
        password: sha1(this.ruleForm.password),
        code: this.ruleForm.code,
        module: this.register
      };
      /**
       * 调用注册接口
       */
      Register(data).then(res => {
        this.$message.success(res.data.message);
        this.toggleMneu(this.menuTab[0]);
        this.clearCountDown();
      });
    },
    //创建倒计时
    countDown(number) {
      if (this.timer) {
        this.clearCountDown(this.timer);
      }
      let time = number;
      this.timer = setInterval(() => {
        time--;
        if (time === 0) {
          //清除倒计时
          clearInterval(this.timer);
          this.updataButtonStatus({
            status: false,
            text: "再次获取"
          });
        } else {
          this.codeButtonStatus.text = `倒计时${time}秒`;
        }
      }, 1000);
    },
    //还原验证码按钮状态
    clearCountDown() {
      // 还原验证码按钮默认状态
      this.updataButtonStatus({
        status: false,
        text: "获取验证码"
      });
      // 清除倒计时
      clearInterval(this.timer);
    }
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
