<script setup>
import { ref, reactive, watch } from 'vue';
import { db } from "../db/firebaseDB.js"
import Timer from './timer.vue';
import { useRouter } from "vue-router"
import { sendCodeToEmail } from "@/workers/sendCode.js";
import { userDataStore } from "@/stores/userData.js"

const props = defineProps({
  isStarted: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["correctCode"]);

const codeLength = 4;
const code = reactive(new Array(codeLength).fill(""));
const inputs = ref([]);
const codeBorderClass = ref(null);
const router = useRouter();
const userData = userDataStore().userData;

const handleInput = (index, event) => {
  const val = event.data;
  if (!val) return;

  // Если ввели не цифру — очищаем
  if (!/^\d$/.test(val)) {
    code[index] = "";
    return;
  }

  code[index] = val;

  // Переход на следующий инпут
  if (index < codeLength - 1) {
    inputs.value[index + 1].focus();
  }
};

const handleKeyDown = (index, event) => {
  // Если нажат Backspace и поле пустое — идем назад
  if (event.key === 'Backspace' && !code[index] && index > 0) {
    inputs.value[index - 1].focus();
  }
};

const handlePaste = (event) => {
  const pasteData = event.clipboardData.getData('text').slice(0, codeLength);
  if (!/^\d+$/.test(pasteData)) return;

  pasteData.split('').forEach((char, i) => {
    code[i] = char;
  });

  // Фокус на последнее заполненное поле или кнопку
  inputs.value[Math.min(pasteData.length, codeLength - 1)].focus();
};

const checkCode = async (code) => {
  const email = userData.email;

  db.getCode(email).then((res) => {
    if (res.code === code) {
      codeBorderClass.value = "correct";
      emit("correctCode");
      router.push('/');
    }
    else {
      codeBorderClass.value = "incorrect";
    }
    return res.code === code;
  });
}

// сравнивание кода только тогда, когда введен полный код
watch(code, () => {
  let codeLength = code.join('').length;
  if (codeLength === 4) {
    checkCode(code.join(''));
  }
})

const endTime = ref(0);

if (props.isStarted) {
  endTime.value = Date.now() + 1000 * 60;
}

async function resendCode() {
  endTime.value = Date.now() + 1000 * 60;
  await sendCodeToEmail(userData.email, userData.uid)
}

</script>

<template>

  <section id="verification">

    <div class="verification-container">
      <div class="code-card" :class="{'correct': codeBorderClass === 'correct', 'incorrect': codeBorderClass === 'incorrect'}">
        <h3 class="title">Verification code</h3>

        <div class="inputs-group" @paste="handlePaste">
          <input
              v-for="(digit, index) in codeLength"
              :key="index"
              ref="inputs"
              v-model="code[index]"
              type="text"
              maxlength="1"
              inputmode="numeric"
              @input="handleInput(index, $event)"
              @keydown="handleKeyDown(index, $event)"
          />
        </div>
      </div>

      <Timer :end-time="endTime" @resend-clicked="resendCode" />
    </div>

  </section>

</template>

<style lang="scss" scoped>

#verification {
  width: 100vw;
  height: 100vh;
  background-color: var(--body-background);
}

.verification-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.code-card {
  background: var(--body-background);
  border: 1px solid #dcdcdc;
  border-radius: 12px;
  padding: 0;
  overflow: hidden;
  width: 320px;

  &.correct {
    border: 1px solid var(--green-border);
  }

  &.incorrect {
    border: 1px solid var(--danger-color);
  }
}

.title {
  text-align: center;
  margin: 15px 0;
  font-weight: 500;
  color: var(--main-text-color);
}

.inputs-group {
  display: flex;
  border-top: 1px solid #dcdcdc;

  input {
    font-family: "Fira Code" !important;
    background: var(--main-background-color);
    width: 25%;
    height: 80px;
    border: none;
    border-right: 1px solid #dcdcdc;
    text-align: center;
    font-size: 32px;
    color: var(--main-text-color);
    outline: none;
    transition: background 0.2s;

    &:last-child {
      border-right: none;
    }

    &:focus {
      background: var(--hover-background-color);
    }
  }
}
</style>