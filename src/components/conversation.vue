<script setup>
  import userAvatar1 from '@/assets/imgs/avatars/user_1.jpg'
  import userAvatar2 from '@/assets/imgs/avatars/user_2.jpg'
  import { computed } from "vue"
  import emptyState from "@/components/emptyState.vue"

  const emit = defineEmits(['burgerClicked', 'audioCallClicked', 'videoCallClicked']);
  const props = defineProps({
    activeChat: {
      type: Object,
      default: () => ({})
    },
    chatData: Object,
    isChatOpen: {
      type: Boolean,
      default: false,
    }
  });

  const currentMessages = computed(() => {
    // Проверяем, есть ли в объекте нужное свойство
    const index = props.activeChat?.index;
    return (index && chatData[index]) ? chatData[index].messages : [];
  });

  const onBurgerClicked = () => {
    emit('burgerClicked', true)
  }

  let chatData = {
    user_1: {
      messages: [
        { time: '09:15', avatar: userAvatar1, title: 'Ope', text: 'Good morning! I finally met that person I was telling you about. She is absolutely incredible.' },
        { time: '09:42', avatar: userAvatar2, title: 'Me', text: 'That’s great news! I’ve been waiting for this update. Give me the details.' },
        { time: '10:05', avatar: userAvatar1, title: 'Ope', text: 'Let’s grab a drink after work, and I’ll tell you everything. She might even join us later.' },
        { time: '12:30', avatar: userAvatar2, title: 'Me', text: 'Sounds like a plan. Just text me the location when you’re heading out.' }
      ]
    },
    user_2: {
      messages: [
        { time: '11:20', avatar: userAvatar1, title: 'Ope', text: 'Did you see the latest project feedback? The client wants us to redesign the entire footer by tomorrow.' },
        { time: '11:45', avatar: userAvatar2, title: 'Me', text: 'Again? We just finalized everything yesterday. I’ll take a look at the Jira ticket now.' },
        { time: '14:10', avatar: userAvatar1, title: 'Ope', text: 'I managed to hop on a quick call with them. Good news: we have until Friday to submit the changes.' },
        { time: '14:15', avatar: userAvatar2, title: 'Me', text: 'Huge relief. In that case, I’ll finish the chat logic first before touching the CSS.' }
      ]
    },
    user_3: {
      messages: [
        { time: '15:00', avatar: userAvatar1, title: 'Ope', text: 'Hey, do you still have that link to the Vue 3 documentation you shared last week?' },
        { time: '15:05', avatar: userAvatar2, title: 'Me', text: 'Sure thing: vuejs.org. They just updated the section on Composition API and provide/inject.' },
        { time: '15:10', avatar: userAvatar1, title: 'Ope', text: 'Perfect, thanks! I was getting stuck with some nested event emits.' },
        { time: '16:00', avatar: userAvatar1, title: 'Ope', text: 'By the way, using the bracket notation for dynamic keys worked like a charm. Cheers!' }
      ]
    },
    user_4: {
      messages: [
        { time: '18:20', avatar: userAvatar1, title: 'Ope', text: 'I’m already at the bar. Where are you? It’s getting crowded, so I grabbed a table in the corner.' },
        { time: '18:35', avatar: userAvatar2, title: 'Me', text: 'Be there in 5 minutes, just looking for parking. Order me a cold one, please!' },
        { time: '18:36', avatar: userAvatar1, title: 'Ope', text: 'Done. Also, that special person I mentioned this morning? She just walked in.' },
        { time: '18:40', avatar: userAvatar2, title: 'Me', text: 'No way! That was fast. Okay, I’m coming inside now.' }
      ]
    }
  };

  const onAudioCallClick = () => {
    emit('audioCallClicked', true);
  }

  const onVideoCallClick = () => {
    emit('videoCallClicked', true);
  }

</script>

<template>
  <section class="conv" :class="{'active': isChatOpen}" >
    <div class="conv__heading heading" v-if="activeChat">
      <div class="conv__userinfo">
        <div class="conv__userinfo-avatar">
          <img :src="activeChat.avatar" alt="avatar" class="conv__userinfo-image">
        </div>
        <div class="conv__userinfo-online online-tag"></div>
        <div class="conv__userinfo-title">
          <h2 class="conv__userinfo-username">{{ activeChat.firstname }} {{ activeChat.lastname }}</h2>
          <h4 class="conv__userinfo-status">Active</h4>
        </div>
      </div>
      <div class="conv__buttons">
        <button class="conv__buttons-button" @click="onAudioCallClick">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M0 2.57143C0 1.15127 1.15127 0 2.57143 0H3.74711C4.48457 0 5.1274 0.501906 5.30627 1.21735L6.25409 5.00865C6.41092 5.63597 6.17652 6.29618 5.65922 6.68416L4.5504 7.51577C4.43526 7.60213 4.41023 7.72858 4.44257 7.81687C5.41587 10.4738 7.52615 12.5841 10.1831 13.5574C10.2714 13.5898 10.3979 13.5647 10.4842 13.4496L11.3158 12.3408C11.7038 11.8235 12.364 11.5891 12.9913 11.7459L16.7826 12.6937C17.4981 12.8726 18 13.5154 18 14.2529V15.4286C18 16.8487 16.8487 18 15.4286 18H13.5C6.04416 18 0 11.9558 0 4.5V2.57143Z" fill="currentColor"/>
          </svg>
        </button>
        <button class="conv__buttons-button" @click="onVideoCallClick">
          <svg width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.57143 0C1.15127 0 0 1.16406 0 2.6V10.4C0 11.8359 1.15127 13 2.57143 13H9.64286C11.063 13 12.2143 11.8359 12.2143 10.4V2.6C12.2143 1.16406 11.063 0 9.64286 0H2.57143Z" fill="currentColor"/>
            <path d="M15.8052 12.35L13.5 10.0192V2.98073L15.8052 0.649969C16.6151 -0.168988 18 0.411036 18 1.56921V11.4307C18 12.5889 16.6151 13.1689 15.8052 12.35Z" fill="currentColor"/>
          </svg>
        </button>
        <button class="conv__buttons-button" style="background: none" @click="onBurgerClicked">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M10.5 6.1C10.5 5.21634 11.3954 4.5 12.5 4.5C13.6046 4.5 14.5 5.21634 14.5 6.1C14.5 6.98366 13.6046 7.7 12.5 7.7C11.3954 7.7 10.5 6.98366 10.5 6.1ZM10.5 12.5C10.5 11.6163 11.3954 10.9 12.5 10.9C13.6046 10.9 14.5 11.6163 14.5 12.5C14.5 13.3837 13.6046 14.1 12.5 14.1C11.3954 14.1 10.5 13.3837 10.5 12.5ZM10.5 18.9C10.5 18.0163 11.3954 17.3 12.5 17.3C13.6046 17.3 14.5 18.0163 14.5 18.9C14.5 19.7837 13.6046 20.5 12.5 20.5C11.3954 20.5 10.5 19.7837 10.5 18.9Z" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </div>
    <div class="conv__chat" v-if="activeChat">
      <div class="conv__messages">

        <div class="conv__message" v-for="message in currentMessages">
          <img :src="message.avatar" alt="avatar" class="conv__message-avatar">

          <div class="conv__message__info">
            <div class="conv__message__info-top">
              <span class="conv__message__info-top__title">{{ message.title }}</span>
              <span class="conv__message__info-top__time">{{ message.time }}</span>
            </div>

            <p class="conv__message__info__text">{{ message.text }}</p>
          </div>
        </div>

      </div>
    </div>
    <div class="conv__send" v-if="activeChat">
      <form class="conv__send__form">
        <input type="text" class="conv__send__form-text" placeholder="Type something...">
        <div class="conv__send__form-buttons">
          <button class="conv__send__form-buttons-button emoji-btn">
            <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.6257 9.77578C10.3048 10.1605 9.90331 10.4701 9.44958 10.6825C8.99585 10.8949 8.50099 11.005 8 11.005C7.49902 11.005 7.00415 10.8949 6.55042 10.6825C6.0967 10.4701 5.6952 10.1605 5.37433 9.77578C5.31145 9.70019 5.2343 9.63773 5.14728 9.59197C5.06026 9.5462 4.96507 9.51802 4.86716 9.50904C4.76925 9.50005 4.67053 9.51044 4.57663 9.53961C4.48274 9.56878 4.3955 9.61616 4.31992 9.67904C4.24433 9.74193 4.18187 9.81908 4.13611 9.9061C4.09034 9.99312 4.06216 10.0883 4.05318 10.1862C4.03503 10.384 4.09619 10.5808 4.22318 10.7335C4.68449 11.2875 5.26202 11.7333 5.91483 12.0392C6.56764 12.3451 7.27975 12.5037 8.00069 12.5037C8.72163 12.5037 9.43374 12.3451 10.0866 12.0392C10.7394 11.7333 11.3169 11.2875 11.7782 10.7335C11.8458 10.6584 11.8975 10.5705 11.9303 10.475C11.963 10.3795 11.9761 10.2783 11.9688 10.1776C11.9614 10.0769 11.9338 9.97875 11.8875 9.88899C11.8413 9.79923 11.7774 9.71975 11.6996 9.65533C11.6219 9.59091 11.5319 9.54287 11.4351 9.51411C11.3383 9.48535 11.2367 9.47646 11.1364 9.48797C11.0361 9.49948 10.9391 9.53115 10.8513 9.58109C10.7636 9.63102 10.6868 9.69819 10.6257 9.77854V9.77578ZM5.47245 7.49974C5.67022 7.50001 5.86363 7.44167 6.02825 7.33208C6.19287 7.22249 6.32133 7.06657 6.39739 6.88401C6.47345 6.70146 6.4937 6.50046 6.45558 6.3064C6.41747 6.11234 6.3227 5.93393 6.18325 5.7937C6.04379 5.65348 5.86591 5.55772 5.67206 5.51854C5.47822 5.47936 5.27711 5.4985 5.09413 5.57355C4.91116 5.6486 4.75454 5.77619 4.64404 5.94021C4.53354 6.10423 4.47413 6.29731 4.47331 6.49508C4.47616 6.75969 4.58217 7.01275 4.76877 7.20039C4.95538 7.38803 5.20785 7.49543 5.47245 7.49974ZM10.5027 5.6286C10.0894 5.61094 9.68181 5.73056 9.3436 5.96878C9.00538 6.20701 8.7555 6.55046 8.63293 6.94558C8.62128 7.02143 8.6333 7.09902 8.66735 7.16779C8.7014 7.23655 8.75583 7.29315 8.82321 7.32986C8.89059 7.36657 8.96765 7.38162 9.0439 7.37294C9.12014 7.36427 9.19185 7.3323 9.24927 7.28139L9.54776 7.01606C9.82551 6.81612 10.1591 6.70854 10.5013 6.70854C10.8435 6.70854 11.1771 6.81612 11.4548 7.01606L11.7478 7.27863C11.8053 7.33045 11.8774 7.3633 11.9543 7.37273C12.0312 7.38216 12.1091 7.36771 12.1774 7.33134C12.2458 7.29496 12.3013 7.23844 12.3365 7.16943C12.3716 7.10041 12.3846 7.02226 12.3738 6.94558C12.2559 6.54739 12.0069 6.20069 11.6673 5.96166C11.3277 5.72263 10.9173 5.60527 10.5027 5.6286ZM8 0C6.41775 0 4.87103 0.469192 3.55544 1.34824C2.23985 2.22729 1.21447 3.47672 0.608967 4.93853C0.00346627 6.40034 -0.15496 8.00887 0.153721 9.56072C0.462403 11.1126 1.22433 12.538 2.34315 13.6569C3.46197 14.7757 4.88743 15.5376 6.43928 15.8463C7.99113 16.155 9.59966 15.9965 11.0615 15.391C12.5233 14.7855 13.7727 13.7602 14.6518 12.4446C15.5308 11.129 16 9.58225 16 8C16 5.87827 15.1571 3.84344 13.6569 2.34315C12.1566 0.842854 10.1217 0 8 0ZM8 14.5006C6.7154 14.5006 5.45964 14.1197 4.39153 13.406C3.32342 12.6923 2.49093 11.6779 1.99933 10.4911C1.50774 9.30426 1.37911 7.99832 1.62973 6.7384C1.88034 5.47848 2.49894 4.32117 3.40729 3.41281C4.31564 2.50446 5.47295 1.88587 6.73288 1.63525C7.9928 1.38464 9.29874 1.51326 10.4856 2.00486C11.6724 2.49646 12.6868 3.32895 13.4005 4.39706C14.1141 5.46517 14.4951 6.72092 14.4951 8.00553C14.4918 9.72712 13.8064 11.3773 12.5891 12.5946C11.3717 13.812 9.72159 14.4973 8 14.5006Z" fill="currentColor"/>
          </svg>
          </button>
          <button class="conv__send__form-buttons-buttons-button microphone-btn">
            <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 2.66667C5 1.19391 6.34315 0 8 0C9.65685 0 11 1.19391 11 2.66667V8C11 9.47276 9.65685 10.6667 8 10.6667C6.34315 10.6667 5 9.47276 5 8V2.66667Z" fill="currentColor"/>
              <path d="M3.5 7.68251C3.5 7.31432 3.16421 7.01584 2.75 7.01584C2.33579 7.01584 2 7.31432 2 7.68251V7.99997C2 10.7197 4.29027 12.964 7.25 13.292V14.6667H5.75C5.33579 14.6667 5 14.9651 5 15.3333C5 15.7015 5.33579 16 5.75 16H10.25C10.6642 16 11 15.7015 11 15.3333C11 14.9651 10.6642 14.6667 10.25 14.6667H8.75V13.292C11.7097 12.964 14 10.7197 14 7.99997V7.68251C14 7.31432 13.6642 7.01584 13.25 7.01584C12.8358 7.01584 12.5 7.31432 12.5 7.68251V7.99997C12.5 10.2091 10.4853 12 8 12C5.51472 12 3.5 10.2091 3.5 7.99997V7.68251Z" fill="currentColor"/>
            </svg>
          </button>
          <button class="conv__send__form-buttons-buttons-button clip-btn">
            <svg width="24" height="24" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.4409 8.17301L11.1589 14.0691C10.5786 15.1117 9.54947 15.8285 8.29794 16.0619C7.04642 16.2954 5.675 16.0263 4.48539 15.3139C3.29577 14.6016 2.38541 13.5042 1.95457 12.2633C1.52372 11.0224 1.60769 9.73954 2.188 8.69701L4.15748 5.15882C4.22045 5.06384 4.32282 5.00078 4.44385 4.98241C4.56489 4.96404 4.69554 4.99174 4.80934 5.05989C4.92315 5.12804 5.0116 5.23156 5.05678 5.34946C5.10196 5.46736 5.1005 5.59085 5.05268 5.6949L3.0832 9.23309C2.84296 9.6457 2.69914 10.1123 2.66015 10.6058C2.62116 11.0993 2.68777 11.6097 2.8561 12.1073C3.02443 12.6049 3.29111 13.0798 3.64059 13.5042C3.99007 13.9286 4.41536 14.2941 4.89167 14.5793C5.36798 14.8645 5.88578 15.0638 6.41488 15.1655C6.94398 15.2672 7.47379 15.2694 7.97344 15.1718C8.47308 15.0742 8.93256 14.8788 9.32508 14.597C9.71761 14.3153 10.0353 13.9528 10.2597 13.5307L13.5417 7.63455C13.6936 7.37675 13.785 7.08477 13.8105 6.77572C13.836 6.46667 13.7952 6.14677 13.6904 5.83477C13.5856 5.52277 13.4189 5.22495 13.2001 4.95877C12.9814 4.69258 12.7149 4.46338 12.4164 4.28462C12.1179 4.10585 11.7933 3.9811 11.4617 3.91769C11.13 3.85428 10.798 3.85348 10.4851 3.91534C10.1722 3.9772 9.88469 4.10047 9.63942 4.27793C9.39414 4.45539 9.19605 4.68347 9.05674 4.94879L6.21243 10.0586C6.09661 10.2667 6.07985 10.5227 6.16584 10.7704C6.25183 11.018 6.43352 11.2371 6.67094 11.3792C6.90836 11.5214 7.18206 11.5751 7.43184 11.5285C7.68162 11.4819 7.88701 11.3389 8.00283 11.1308L10.41 6.80634C10.4358 6.75018 10.4743 6.70142 10.5232 6.66308C10.572 6.62474 10.6302 6.59765 10.694 6.58347C10.7579 6.56928 10.8261 6.56832 10.8943 6.58064C10.9626 6.59296 11.0295 6.6183 11.091 6.65508C11.1524 6.69187 11.207 6.73931 11.2514 6.79448C11.2958 6.84965 11.3291 6.91137 11.3492 6.97581C11.3693 7.04025 11.3758 7.10604 11.3682 7.1691C11.3606 7.23217 11.3391 7.29116 11.3052 7.34242L8.89851 11.666C8.66636 12.0831 8.25467 12.3698 7.754 12.4632C7.25334 12.5566 6.70471 12.449 6.22881 12.164C5.75291 11.879 5.38873 11.44 5.21637 10.9436C5.04402 10.4472 5.07761 9.93398 5.30976 9.51692L8.15358 4.40795C8.34958 4.03805 8.62741 3.72031 8.97086 3.47328C9.3143 3.22624 9.71646 3.05487 10.1539 2.96915C10.5913 2.88344 11.0552 2.8851 11.5185 2.97404C11.9818 3.06299 12.4352 3.23743 12.8523 3.48719C13.2694 3.73695 13.6418 4.05702 13.9477 4.42872C14.2536 4.80042 14.4869 5.21629 14.6341 5.65206C14.7812 6.08784 14.8392 6.53477 14.8047 6.96679C14.7701 7.3988 14.6438 7.80724 14.4329 8.16824L14.4409 8.17301Z" fill="currentColor"/>
            </svg>
          </button>
        </div>

        <button class="conv__send__form-submit">
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_151_161)">
              <path d="M15.9883 1.15569L13.9891 14.1262C13.9666 14.2771 13.9097 14.4209 13.823 14.5465C13.7362 14.6721 13.6218 14.7761 13.4886 14.8505C13.3554 14.925 13.2069 14.968 13.0545 14.9761C12.9021 14.9843 12.7499 14.9574 12.6095 14.8975L8.78639 13.2996L7.19701 15.6826C7.14301 15.7793 7.06411 15.8597 6.96852 15.9155C6.87292 15.9713 6.76411 16.0005 6.65341 16C6.48107 16 6.31578 15.9315 6.19392 15.8096C6.07205 15.6878 6.00359 15.5225 6.00359 15.3501V12.3462C6.00284 12.124 6.07614 11.908 6.21192 11.7322L12.9999 3.00329L3.82508 11.2616L0.620102 9.9287C0.442529 9.85471 0.289977 9.73121 0.180632 9.57292C0.0712864 9.41463 0.0097602 9.22823 0.00338772 9.03595C-0.0123181 8.84889 0.0268162 8.66131 0.116006 8.49615C0.205195 8.33098 0.340574 8.19538 0.505589 8.10594L14.5051 0.131851C14.6683 0.0384918 14.8545 -0.00691445 15.0424 0.000853036C15.2302 0.00862052 15.4121 0.0692464 15.567 0.17576C15.7219 0.282275 15.8436 0.430352 15.9182 0.602969C15.9927 0.775586 16.017 0.965734 15.9883 1.15155V1.15569Z" fill="currentColor"/>
            </g>
            <defs>
              <clipPath id="clip0_151_161">
                <rect width="24" height="24" fill="currentColor"/>
              </clipPath>
            </defs>
          </svg>

        </button>
      </form>
    </div>

    <emptyState class="conv__emptyState" v-if="!activeChat" title="Chat is not selected" />
  </section>
</template>

<style scoped lang="scss">

  .conv {
    background-color: var(--main-background-color);
    flex-direction: column;
    grid-column: 6/17;
    grid-template-rows: 87px auto 87px;
    display: grid;
    max-height: 100vh;
    z-index: 20;

    @media (max-width: 740px) {
      grid-template-rows: auto 87px;
    }

    &__emptyState {
      height: 100vh;
      grid-column: 1/17;
      align-content: center;
      margin: 0;
      background-color: var(--main-background-color);
    }

    &__chat {
      overflow-y: scroll;
      scrollbar-width: none;
      -ms-overflow-style: none;

      &::-webkit-scrollbar {
        display: none;
      }
    }

    &__message {
      margin: 20px;
      padding-bottom: 20px;
      display: flex;
      gap: 30px;

      &-avatar {
        width: 70px;
        height: 70px;
        border-radius: 25px;
      }

      &__info-top {
        gap: 20px;
        display: flex;
        align-items: center;
        padding-bottom: 10px;

        &__title {
          font-weight: 500;
        }

        &__time {
          font-weight: 200;
          color: var(--secondary-text-color);
          font-size: 12px;
        }
      }

    }

    &__heading {
      display: flex;
      align-items: center;
      background-color: var(--body-background);
      justify-content: space-between;
      padding: 10px 20px;

      @media (max-width: 740px) {
        display: none;
      }
    }

    &__userinfo {
      display: flex;
      align-items: center;

      &-online {
        position: relative;
        right: 17px;
        top: 20px;
      }

      &-username {
        font-size: 24px;
        font-weight: 500;
      }

      &-status {
        color: var(--secondary-text-color);
        font-weight: 400;
      }

      &-image {
        width: 60px;
        border-radius: 50%;
      }
    }

    &__buttons {
      display: flex;
      align-items: center;
      gap: 20px;

      &-button {
        width: 45px;
        height: 45px;
        border: none;
        border-radius: 50%;
        background-color: var(--main-background-color);
        color: var(--main-text-color);
      }
    }

    &__send {
      background-color: var(--body-background);
      padding: 10px 0;
      display: flex;
      margin-top: auto;

      &__form {
        display: flex;
        background-color: var(--main-background-color);
        width: 100%;
        border-radius: 10px;
        margin: auto;
        padding: 10px;

        &-buttons {
          border-right: 2px solid var(--divider-border-color);
          display: flex;
          gap: 15px;
          padding: 10px;

          button {
            background: none;
            border: none;
            color: var(--main-text-color);
          }
        }

        &-text {
          background-color: var(--main-background-color);
          border-radius: 10px;
          border: none;
          padding: 10px;
          width: 78%;
          margin: auto;
          outline: none;
          font-size: 16px;
        }

        &-submit {
          border: none;
          margin-left: 15px;
          background-color: var(--submit-background-color);
          border-radius: 50%;
          padding: 13px;
          color: var(--main-text-color);

          &::placeholder {
            color: var(--secondary-text-color);
          }
        }
      }
    }
  }
</style>