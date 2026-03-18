<script setup>
  import { ref } from 'vue'
  import { useRouter } from "vue-router"
  import {
    signInWithGoogle,
    signUserOut,
    observeAuthState,
    auth,
    signInWithEmail,
    verifyUserPassword,
    registerWithEmail,
  } from '../workers/firebase.js';
  import {
    signInWithEmailAndPassword
  } from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js';
  import { db } from "../db/firebaseDB.js";


  const router = useRouter();

  // Состояние: true — форма логина, false — форма регистрации
  const isLogin = ref(false);

  const toggleForm = () => {
  isLogin.value = !isLogin.value;
  }

  const changePage = () => {

    if (!isLogin.value) {
      router.push('/verCode');

    } else {
      router.push('/');
    }
  }

  // копирование

  // Элементы DOM

  var accountStatus = "noAccount";

  // Обработчик кнопки входа через Google
  const onSubmitClick = async (e) => {
    e.preventDefault();
    try {
      const user = await signInWithGoogle();
      console.log('Google вход:', user);

      // Проверяем, есть ли документ пользователя в базе
      const existingUser = await db.getUserByEmail(user.email);
      if (!existingUser) {
        await db.addUser(
            user.displayName || "Без имени",
            user.email,
            "Не указан"
        );
      }

    } catch (e) {
      console.error('Ошибка входа через Google:', e);
    }
  };

  // Обработка нажатия кнопки регистрации/входа

  // Переключение вкладки регистрации/входа

</script>

<template>

    <section id="registration">

      <div class="registration-form" @submit.prevent>
        <h1 class="registration-form__title">{{ isLogin ? 'Log in' : 'Registration' }}</h1>

        <form class="registration-form__container">
          <div v-if="!isLogin" class="registration-form__field">
            <label class="registration-form__label">Username</label>
            <input type="text" class="registration-form__input" placeholder="Type username to find you...">
          </div>

          <div v-if="!isLogin" class="registration-form__row">
            <div class="registration-form__field">
              <label class="registration-form__label">Firstname</label>
              <input type="text" class="registration-form__input" placeholder="Type your firstname...">
            </div>
            <div class="registration-form__field">
              <label class="registration-form__label">Lastname</label>
              <input type="text" class="registration-form__input" placeholder="Type your lastname...">
            </div>
          </div>

          <div class="registration-form__field">
            <label class="registration-form__label">Email</label>
            <input type="email" class="registration-form__input" placeholder="Type email to identify you...">
          </div>

          <div class="registration-form__field">
            <label class="registration-form__label">Password</label>
            <input type="password" class="registration-form__input" placeholder="Type password...">
          </div>

          <div v-if="!isLogin" class="registration-form__captcha captcha">
            <label class="captcha__container">
              <input type="checkbox" class="captcha__checkbox">
              <span class="captcha__checkmark"></span>
              <span class="captcha__text">I'm not a robot</span>
            </label>
            <div class="captcha__logo">
              <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" alt="reCAPTCHA">
            </div>
          </div>

          <div class="registration-form__footer">
            <button class="registration-form__link" @click="toggleForm">
              {{ isLogin ? "Don't have an account" : "Already have an account" }}
            </button>
            <button @click="onSubmitClick" type="submit" class="registration-form__submit-btn" @submit.prevent>{{ isLogin ? 'Log in' : 'Create account' }}</button>
          </div>
        </form>
      </div>

    </section>


</template>

<style scoped lang="css">


#registration {
  width: 100vw;
  height: 100vh;
  background: var(--body-background);
  margin-top: 0;
  padding-top: 60px;
}

.registration-form {
  background-color: var(--main-background-color);
  padding: 40px;
  border-radius: 10px;
  max-width: 600px;
  margin: auto;
  /*height: 100%; */
}

.registration-form__title {
  text-align: center;
  font-size: 32px;
  margin-bottom: 40px;
  color: var(--main-text-color);
}

.registration-form__row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.registration-form__field {
  display: flex;
  flex-direction: column;
  margin-bottom: 25px;
  flex: 1;
}

.registration-form__label {
  font-weight: 500;
  font-size: 18px;
  margin-bottom: 10px;
  color: var(--main-text-color);
}

.registration-form__input {
  padding: 15px 20px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  background-color: var(--body-background);
}

/* Стилизация Капчи */
.captcha {
  background-color: #d9d9d9;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  border-radius: 4px; /* У капчи обычно углы острее */
}

.captcha__container {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.captcha__checkbox {
  width: 24px;
  height: 24px;
  margin-right: 15px;
}

.captcha__text {
  font-size: 16px;
  color: #000;
}

/* Стилизация Футера и Ссылок */
.registration-form__footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.registration-form__link {
  color: var(--main-text-color);
  text-decoration: underline;
  font-size: 14px;
  font-weight: 500;
  background: none;
  border: none;
}

.registration-form__submit-btn {
  width: 100%;
  padding: 15px;
  background-color: var(--online-sign-background);
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
}

.registration-form__submit-btn:hover {
  filter: brightness(1.05);
}

@media (max-width: 620px) {
  .registration-form {
    max-width: 400px;
  }
}

@media (max-width: 430px) {

  .registration-form {
    width: 100vw;
    padding: 15px;
    margin: 25px auto;
  }
}

</style>