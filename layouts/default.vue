<template>
  <v-app dark>
    <notifications group="auth" position="top right" />
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in menuItems"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-btn icon @click.stop="clipped = !clipped">
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <v-btn icon @click.stop="fixed = !fixed">
        <v-icon>mdi-minus</v-icon>
      </v-btn>
      <v-toolbar-title v-text="appTitle" />
      <v-spacer />
      <LanguageSelector></LanguageSelector>
      <v-btn v-if="this.$auth.loggedIn" icon @click.stop="userLogout">
        <v-icon>mdi-logout-variant</v-icon>
      </v-btn>
      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light> mdi-repeat </v-icon>
          </v-list-item-action>
          <v-list-item-title>{{ $t('header.switcher') }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import LanguageSelector from '../components/LanguageSelector.vue'

export default {
  components: {
    LanguageSelector,
  },

  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      miniVariant: false,
      right: true,
      rightDrawer: false,
      loggedIn: null,
    }
  },

  computed: {
    menuItems() {
      return [
        {
          icon: 'mdi-apps',
          title: this.$t('header.menu.list.home'),
          to: '/',
        },
        {
          icon: 'mdi-account-multiple',
          title: this.$t('header.menu.list.users'),
          to: '/users',
        },
      ]
    },
    appTitle() {
      return this.$t('app.title')
    },
  },

  methods: {
    async userLogout() {
      try {
        await this.$auth.logout()
        this.$router.push('/login')
      } catch (error) {
        this.$notify({
          group: 'auth',
          type: 'error',
          title: this.$t('auth.errorTitle'),
          text: error.response.data.message
            ? error.response.data.message[`${this.$i18n.locale}`]
            : null,
        })
      }
    },
  },
}
</script>
