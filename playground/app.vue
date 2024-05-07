<template>
  <div>
    <h1>Nuxt auth</h1>

    <form>
      <input v-model="form.name" />
      <input v-model="form.pass" />

      <button @click.prevent="loginHandler">sign in</button>
    </form>
    <form>
      <button @click.prevent="logoutHandler">sign out</button>
    </form>

    <pre>{{ data }}</pre>
    <pre>{{ token }}</pre>

    <pre>login: name, password: pass</pre>
  </div>
</template>

<script setup>
const { data, login, logout, token } = useAuth();

const form = reactive({
  name: '',
  pass: '',
});

const loginHandler = () => {
  login(form).then((r) => {
    form.name = '';
    form.pass = '';
  });
};
const logoutHandler = () => {
  logout();
};
</script>

<style lang="scss" scoped>
form {
  margin-top: 20px;
  display: grid;
  max-width: 600px;
  row-gap: 10px;

  input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
    outline: none;
    font-size: 16px;
    font-family: inherit;
    font-weight: 400;
    line-height: 1.5;
    color: #495057;
    background-color: #fff;
    background-clip: padding-box;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    &:focus {
      border-color: #80bdff;
      box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }
  }
}

pre {
  margin-top: 10px;
  font-size: 24px;
  padding: 10px;
  border: 1px solid black;
  background: #eee;
  box-sizing: border-box;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: break-all;
}

button {
  font-size: 24px;
  padding: 10px;
  border: 1px solid black;
  background: #eee;
}
</style>
