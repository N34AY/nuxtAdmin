<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="4">
      <v-card>
        <v-card-title class="headline justify-center"> Login </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-text-field
                  v-model="login.email"
                  label="Email"
                ></v-text-field>
                <v-text-field
                  v-model="login.password"
                  :type="show1 ? 'text' : 'password'"
                  label="Password"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="userLogin"> Login </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data: () => ({
    login: {
      email: '',
      password: '',
    },
  }),
  methods: {
    async userLogin() {
      try {
        await this.$auth.loginWith('local', { data: this.login })
        this.$router.push('/')
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>
