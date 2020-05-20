<template>
    <div id="main">
        <header id="header">
             <h1>
                <router-link :to="{name: 'home'}">
                    Mini Market
                </router-link>
            </h1>
            <navigationMenu></navigationMenu>
        </header>
        <router-view></router-view>
    </div>
</template>
<script>
  import navigationMenu from './components/Menu.vue'
  export default {
    data() {
      return {
        //
      }
    },
    components: {
        navigationMenu
    }
  }
</script>
