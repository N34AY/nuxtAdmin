<template>
  <v-row>
    <v-col class="text-center">
      <div v-if="users">
        <v-data-table
          :headers="headers"
          :items="users"
          item-key="firstName"
          class="elevation-1"
          :search="search"
        >
          <template v-slot:top>
            <v-text-field
              v-model="search"
              label="Search"
              class="mx-4"
            ></v-text-field>
          </template>
          <template v-slot:body.append></template>
        </v-data-table>
      </div>
      <h2 v-else>Users not found</h2>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      search: '',
      headers: [
        {
          text: 'Name',
          align: 'center',
          sortable: false,
          value: 'firstName',
        },
        {
          text: 'Email',
          align: 'center',
          sortable: false,
          value: 'email',
        },
        {
          text: 'Role',
          align: 'center',
          value: 'role',
        },
        {
          text: 'Last login',
          align: 'center',
          value: 'lastLogin',
        },
      ],
      users: null,
    }
  },
  mounted: function mountedFunction() {
    this.getAllUsers()
  },
  methods: {
    getAllUsers: async function getAllUsersRequest() {
      try {
        const token =
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MDc1NTc5NTcsIm5iZiI6MTYwNzU1Nzk1NywianRpIjoiNDM2OTE2NTgtNjkxYy00YWQ0LTkwOGUtNTQ5MDgyZGMwZDMxIiwiZXhwIjoxNjA3NTY4NzU3LCJpZGVudGl0eSI6eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInJvbGUiOiJhZG1pbiJ9LCJmcmVzaCI6ZmFsc2UsInR5cGUiOiJhY2Nlc3MiLCJ1c2VyX2NsYWltcyI6eyJyb2xlIjoiYWRtaW4iLCJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSJ9fQ.SGPcG0e4Va8_3wI7Ta7IQt9Es5-x34joM6OTelYQFMQ'
        const options = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
        const response = await this.$axios.$get('/users/get/all', options)
        this.users = response.users
      } catch (error) {
        console.error(error)
      }
    },
  },
}
</script>