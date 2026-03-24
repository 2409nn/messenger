<script setup>
  import { ref } from 'vue'
  import { useRouter } from "vue-router"
  import alert from "../components/alert.vue"
  import { sendCodeToEmail } from "../workers/sendCode.js"
  import { userDataStore } from "@/stores/userData.js"
  import {initLocalUserDB, putUserProfile, saveDataPouchDB} from "@/db/pouchDB.js"

  import {
    signInWithGoogle,
    signUserOut,
    observeAuthState,
    auth,
    signInWithEmail,
    verifyUserPassword,
    registerWithEmail,
    // sendVerification,
  } from '../workers/firebase.js';
  import {
    signInWithEmailAndPassword
  } from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js';
  import { db } from "../db/firebaseDB.js";

  const userData = userDataStore().userData;
  const router = useRouter();

  // Состояние: true — форма логина, false — форма регистрации
  const isLogin = ref(false);
  const alertTitle = ref('Error');
  const alertText = ref('Registration error');
  const isAlertActive = ref(false);

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

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // базовая проверка email
    return regex.test(email);
  }

  const email = ref('');
  const password = ref('');
  const firstname = ref('');
  const lastname = ref('');
  const username = ref('');

  // Обработчик кнопки входа
  const onSubmitClick = async (e) => {
    e.preventDefault();

    // Проверяем корректность email
    if (!validateEmail(email.value)) {
      alertText.value = 'Invalid email';
      isAlertActive.value = true;
      return;
    }

    if (!isLogin.value) {
      // Регистрация нового пользователя
      try {

        // Проверяем пароль
        if (password.value.length < 6) {
          alertText.value = "Password must be at least 6 characters";
          isAlertActive.value = true;
          return;
        }

        // Проверяем пустые ли поля
        if (firstname.value.length === 0) {
          alertText.value = "Please enter firstname";
          isAlertActive.value = true;
          return;
        }

        const user = await registerWithEmail(email.value, password.value);

        // отправка запроса к серверу, который синхронизируется с CouchDB
        const token = await user.getIdToken(); // JWT токен
        const res = fetch('http://localhost:5005/auth-sync', {
          method: 'POST',
          body: JSON.stringify({ idToken: token }),
          headers: { 'Content-Type': 'application/json' },
        })

        const data = await res;
        try {
          if (data.status == "200") {

            const db = await initLocalUserDB(user.uid, `db_${user.uid.toLowerCase()}`, "12345"); // засекретить пароль
            await putUserProfile(
                {_id: user.uid, username: username.value, firstname: firstname.value, lastname: lastname.value},
            );
          }

        } catch (e) {
          console.log("Ошибка от data.json()")
          console.error(e);
        }

        if (user) {

          userData.email = email.value;
          userData.firstname = firstname.value;
          userData.lastname = lastname.value;
          userData.username = username.value;
          userData.uid = user.uid;

          await sendCodeToEmail(email.value, user.uid); // Отправляем письмо с кодом на почту пользователя

          await db.addUser(
              username.value,
              email.value,
              firstname.value,
              lastname.value,
              user.uid).then(() => { changePage() })
        }
      }
      catch (error) {

        console.group("%cОшибка регистрации", "color: red; font-weight: bold;");
        console.log("Код:", error.code);
        console.log("Сообщение:", error.message);
        console.groupEnd();

        if (error.code === "auth/email-already-in-use") {
          alertText.value = "Such email is already in use";
          isAlertActive.value = true;
        }

        else if (error.code === "not-every-input-filled") {
          alertText.value = "Please fill out all fields";
          isAlertActive.value = true;
        }

        else {
          alertText.value = "Could not register new account";
          isAlertActive.value = true;
        }

      }
    }
    else {
      try {
        const loginResult = await verifyUserPassword(email.value, password.value);
        if (loginResult.success) {
          userData.email = email.value;
          userData.uid = loginResult.uid;

          // получение токена
          const token = loginResult.token; // JWT токен
          const res = fetch('http://localhost:5005/auth-sync', {
            method: 'POST',
            body: JSON.stringify({ idToken: token }),
            headers: { 'Content-Type': 'application/json' },
          })

          const data = await res;

          try {
            if (data.status == "200") {
              changePage();
            }

          } catch (e) {
            console.log("Ошибка от data.json()")
            console.error(e);
          }

        } else {
          const error = new Error("Invalid email or password");
          error.code = "auth/invalid-credential";

          throw error;
        }
      }
      catch (error) {
        console.error(error);
        if (error.code === "auth/invalid-credential") {
          alertText.value = error.message;
          isAlertActive.value = true;
        }

        console.group("%cОшибка регистрации", "color: red; font-weight: bold;");
        console.log("Код:", error.code);
        console.log("Сообщение:", error.message);
        console.groupEnd();
      }

    }
    // else if (accountStatus === "haveAccount") {
    //   // === Вход существующего пользователя ===
    //   try {
    //     const loginResult = await verifyUserPassword(email, password);
    //     if (loginResult.success) {
    //       localStorage.setItem("email", email);
    //       let userId = await db.getUserByEmail(email);
    //       userId = userId.id;
    //
    //       localStorage.setItem("email", email);
    //       localStorage.setItem("userId", userId);
    //
    //       window.location.href = './catalog.html';
    //     }
    //
    //     else if (!loginResult.success) {
    //       const error = new Error("Неверная почта или пароль");
    //       error.code = "auth/invalid-credential";
    //       throw error;
    //     }
    //
    //   } catch (error) {
    //
    //     if (error.code === "auth/invalid-credential") {
    //       alert(error.message);
    //     }
    //
    //     console.group("%cОшибка регистрации", "color: red; font-weight: bold;");
    //     console.log("Код:", error.code);
    //     console.log("Сообщение:", error.message);
    //     console.groupEnd();
    //   }
    // }
  };

  // Обработка нажатия кнопки регистрации/входа

  // Переключение вкладки регистрации/входа

</script>

<template>

    <alert :title="alertTitle" :text="alertText" :is-active="isAlertActive" :on-ok="() => {}" v-model:is-active="isAlertActive" />

    <section id="registration">

      <div class="registration-form" @submit.prevent>
        <h1 class="registration-form__title">{{ isLogin ? 'Log in' : 'Registration' }}</h1>

        <form class="registration-form__container">
          <div v-if="!isLogin" class="registration-form__field">
            <label class="registration-form__label">Username</label>
            <input type="text" v-model="username" class="registration-form__input" placeholder="Type username to find you...">
          </div>

          <div v-if="!isLogin" class="registration-form__row">
            <div class="registration-form__field">
              <label class="registration-form__label">Firstname</label>
              <input type="text" v-model="firstname" class="registration-form__input" placeholder="Type your firstname...">
            </div>
            <div class="registration-form__field">
              <label class="registration-form__label">Lastname</label>
              <input type="text" v-model="lastname" class="registration-form__input" placeholder="Type your lastname...">
            </div>
          </div>

          <div class="registration-form__field">
            <label class="registration-form__label">Email</label>
            <input v-model="email" type="email" class="registration-form__input" placeholder="Type email to identify you...">
          </div>

          <div class="registration-form__field">
            <label class="registration-form__label">Password</label>
            <input v-model="password" type="password" class="registration-form__input" placeholder="Type password...">
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