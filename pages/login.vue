<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="4">
      <v-card>
        <v-card-title class="headline justify-center">
          {{ $t('auth.login') }}
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-text-field
                  v-model="login.email"
                  :label="$t('auth.email')"
                ></v-text-field>
                <v-text-field
                  v-model="login.password"
                  :type="show1 ? 'text' : 'password'"
                  :label="$t('auth.password')"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="userLogin">
            {{ $t('auth.login') }}
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data: function data() {
    return {
      login: {
        email: '',
        password: '',
      },
    }
  },
  methods: {
    async userLogin() {
      try {
        const response = await this.$auth.loginWith('local', {
          data: this.login,
        })
        this.$notify({
          group: 'auth',
          type: 'success',
          title: this.$t('auth.successTitle'),
          text: response.data.message
            ? response.data.message[`${this.$i18n.locale}`]
            : null,
        })
        this.$router.push('/')
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

<style lang="sass">
.vue-notification
  padding: 10px
  margin: 0 5px 5px

  font-size: 12px

  color: #ffffff
  background: #44a4fc
  border-left: 5px solid #187fe7

  &.warn
    background: #ffb648
    border-left-color: #f48a06

  &.error
    background: #e54d42
    border-left-color: #b82e24

  &.success
    background: #68cd86
    border-left-color: #42a85f
</style>
