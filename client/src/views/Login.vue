<template>
  <div class="login">
    <h4>Login</h4>
    <input v-model="username" type="text" placeholder="Username" />
    <input v-model="password" type="password" placeholder="Password" />
    <button @click="login">Login</button>
  </div>
</template>

<script>
import { reactive, defineComponent, toRefs } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import API from '@/lib/API';

export default defineComponent({
  setup() {
    const store = useStore();
    const router = useRouter();
    const user = reactive({
      username: '',
      password: '',
    });

    const login = async () => {
      try {
        const data = await API.login(user);
        store.commit('setUser', data.user);
        localStorage.setItem('token', data.token);
        router.push('/');
      } catch (error) {
        if (error.response) {
          console.error(error.response.data.message);
        } else {
          console.error(error);
        }
      }
    };
    return {
      ...toRefs(user),
      login,
    };
  },
});
</script>

<style></style>
