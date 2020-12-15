<template>
  <v-data-table
    :headers="headers"
    :items="users"
    sort-by="calories"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Website Users</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="40%">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              New User
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="editedItem.firstName"
                      label="First name"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="editedItem.lastName"
                      label="Last name"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="editedItem.email"
                      label="Email"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-select
                      v-model="editedItem.role"
                      :items="roles"
                      label="Role"
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="editedItem.password"
                      :type="show1 ? 'text' : 'password'"
                      label="Password"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-checkbox
                      v-model="editedItem.active"
                      label="Active"
                    ></v-checkbox>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
              <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline"
              >Are you sure you want to delete {{ editedItem.firstName }}
              {{ editedItem.lastName }}?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete"
                >Cancel</v-btn
              >
              <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                >Confirm</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
      <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
    </template>
    <template v-slot:item.active="{ item }">
      <v-simple-checkbox v-model="item.active" disabled></v-simple-checkbox>
    </template>
    <template v-slot:no-data>
      <h2>Users not found</h2>
      <p>{{ error }}</p>
    </template>
  </v-data-table>
</template>

<script>
export default {
  data: () => ({
    roles: ['admin', 'user'],
    error: null,
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: 'Name',
        align: 'center',
        sortable: false,
        value: 'firstName',
      },
      {
        text: 'Surname',
        align: 'center',
        sortable: false,
        value: 'lastName',
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
      {
        text: 'Active',
        align: 'center',
        value: 'active',
      },
      {
        text: 'Actions',
        align: 'center',
        value: 'actions',
        sortable: false,
      },
    ],
    users: [],
    editedIndex: -1,
    editedItem: {
      firstName: '',
      lastName: '',
      email: '',
      role: '',
    },
    defaultItem: {
      firstName: '',
      lastName: '',
      email: '',
      role: '',
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New User' : 'Edit User'
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
  },

  created() {
    this.getAllUsers()
  },

  methods: {
    getAllUsers: async function getAllUsersRequest() {
      try {
        const token =
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MDgwNjkyMTIsIm5iZiI6MTYwODA2OTIxMiwianRpIjoiZWI0YWNhMjQtNWZhNi00N2E0LTllM2EtZTE3MGRiYzQzZWZjIiwiZXhwIjoxNjA4MDgwMDEyLCJpZGVudGl0eSI6eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInJvbGUiOiJhZG1pbiJ9LCJmcmVzaCI6ZmFsc2UsInR5cGUiOiJhY2Nlc3MiLCJ1c2VyX2NsYWltcyI6eyJyb2xlIjoiYWRtaW4iLCJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSJ9fQ.IKehWBkoNtLx9RpsWgcK9MpasrHTgG8xmRu1FCNTSjk'
        const options = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
        const response = await this.$axios.$get('/users/get/all', options)
        this.users = response.users
      } catch (error) {
        this.error = error
      }
    },

    editItem(item) {
      this.editedIndex = this.users.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.users.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm: async function deleteUser() {
      this.editedItem = Object.assign(
        this.users[this.editedIndex],
        this.editedItem
      )
      this.users.splice(this.editedIndex, 1)
      console.log(this.editedItem)
      try {
        const token =
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MDgwNjkyMTIsIm5iZiI6MTYwODA2OTIxMiwianRpIjoiZWI0YWNhMjQtNWZhNi00N2E0LTllM2EtZTE3MGRiYzQzZWZjIiwiZXhwIjoxNjA4MDgwMDEyLCJpZGVudGl0eSI6eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInJvbGUiOiJhZG1pbiJ9LCJmcmVzaCI6ZmFsc2UsInR5cGUiOiJhY2Nlc3MiLCJ1c2VyX2NsYWltcyI6eyJyb2xlIjoiYWRtaW4iLCJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSJ9fQ.IKehWBkoNtLx9RpsWgcK9MpasrHTgG8xmRu1FCNTSjk'
        const options = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
        const response = await this.$axios.$delete(
          `/users/delete/${this.editedItem.id}`,
          options
        )
        console.log(response)
      } catch (error) {
        this.eror = error
      }
      this.closeDelete()
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save: async function saveItem() {
      if (this.editedIndex > -1) {
        Object.assign(this.users[this.editedIndex], this.editedItem)
        try {
          const token =
            'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MDgwNjkyMTIsIm5iZiI6MTYwODA2OTIxMiwianRpIjoiZWI0YWNhMjQtNWZhNi00N2E0LTllM2EtZTE3MGRiYzQzZWZjIiwiZXhwIjoxNjA4MDgwMDEyLCJpZGVudGl0eSI6eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInJvbGUiOiJhZG1pbiJ9LCJmcmVzaCI6ZmFsc2UsInR5cGUiOiJhY2Nlc3MiLCJ1c2VyX2NsYWltcyI6eyJyb2xlIjoiYWRtaW4iLCJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSJ9fQ.IKehWBkoNtLx9RpsWgcK9MpasrHTgG8xmRu1FCNTSjk'
          const data = {
            email: this.editedItem.email,
            password: this.editedItem.password,
            firstName: this.editedItem.firstName,
            lastName: this.editedItem.lastName,
          }
          const options = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
          const response = await this.$axios.$put(
            `/users/update/${this.editedItem.id}`,
            data,
            options
          )
          console.log(response)
        } catch (error) {
          this.error = error
        }
      } else {
        this.users.push(this.editedItem)
      }
      this.close()
    },
  },
}
</script>
