<template>
  <v-data-table
    :headers="headers"
    :items="users"
    sort-by="calories"
    class="elevation-1"
  >
    <template v-slot:top>
      <notifications group="users" position="top right" />
      <v-toolbar flat>
        <v-toolbar-title>{{ $t('usersPage.title') }}</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="40%">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              {{ $t('usersPage.newUserBtn') }}
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
                      :label="$t('usersPage.usersTable.name')"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="editedItem.lastName"
                      :label="$t('usersPage.usersTable.surname')"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="editedItem.email"
                      :label="$t('usersPage.usersTable.email')"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-select
                      v-model="editedItem.role"
                      :items="roles"
                      :label="$t('usersPage.usersTable.role')"
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="editedItem.password"
                      :type="show1 ? 'text' : 'password'"
                      :label="$t('usersPage.usersTable.password')"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-checkbox
                      v-model="editedItem.active"
                      :label="$t('usersPage.usersTable.active')"
                    ></v-checkbox>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">
                {{ $t('usersPage.form.cancelBtn') }}
              </v-btn>
              <v-btn color="blue darken-1" text @click="save">
                {{ $t('usersPage.form.saveBtn') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline"
              >{{ $t('usersPage.form.deleteText') }}
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">
                {{ $t('usersPage.form.cancelBtn') }}
              </v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">
                {{ $t('usersPage.form.confirmBtn') }}
              </v-btn>
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
      <h2>{{ $t('usersPage.usersNotFound') }}</h2>
    </template>
  </v-data-table>
</template>

<script>
export default {
  data: function data() {
    return {
      roles: ['admin', 'user'],
      error: null,
      dialog: false,
      dialogDelete: false,
      headers: [
        {
          text: this.$t('usersPage.usersTable.name'),
          align: 'center',
          sortable: false,
          value: 'firstName',
        },
        {
          text: this.$t('usersPage.usersTable.surname'),
          align: 'center',
          sortable: false,
          value: 'lastName',
        },
        {
          text: this.$t('usersPage.usersTable.email'),
          align: 'center',
          sortable: false,
          value: 'email',
        },
        {
          text: this.$t('usersPage.usersTable.role'),
          align: 'center',
          value: 'role',
        },
        {
          text: this.$t('usersPage.usersTable.lastLogin'),
          align: 'center',
          value: 'lastLogin',
        },
        {
          text: this.$t('usersPage.usersTable.active'),
          align: 'center',
          value: 'active',
        },
        {
          text: this.$t('usersPage.usersTable.actions'),
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
        active: '',
      },
      defaultItem: {
        firstName: '',
        lastName: '',
        email: '',
        role: '',
        active: '',
      },
    }
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? this.$t('usersPage.form.newUser')
        : this.$t('usersPage.form.editUser')
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
    async getAllUsers() {
      try {
        const response = await this.$axios.$get('/users/get/all')
        this.users = response.users
      } catch (error) {
        this.$notify({
          group: 'users',
          type: 'error',
          title: this.$t('usersPage.errorTitle'),
          text: error.response.data.message
            ? error.response.data.message[`${this.$i18n.locale}`]
            : null,
        })
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

    async deleteItemConfirm() {
      this.editedItem = Object.assign(
        this.users[this.editedIndex],
        this.editedItem
      )
      this.users.splice(this.editedIndex, 1)
      try {
        await this.$axios.$delete(`/users/delete/${this.editedItem.id}`)
      } catch (error) {
        this.$notify({
          group: 'users',
          type: 'error',
          title: this.$t('usersPage.errorTitle'),
          text: error.response.data.message
            ? error.response.data.message[`${this.$i18n.locale}`]
            : null,
        })
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

    async save() {
      if (this.editedIndex > -1) {
        Object.assign(this.users[this.editedIndex], this.editedItem)
        try {
          const data = {
            email: this.editedItem.email,
            password: this.editedItem.password,
            firstName: this.editedItem.firstName,
            lastName: this.editedItem.lastName,
            role: this.editedItem.role,
            active: this.editedItem.active,
          }
          await this.$axios.$put(`/users/update/${this.editedItem.id}`, data)
        } catch (error) {
          this.$notify({
            group: 'users',
            type: 'error',
            title: this.$t('usersPage.errorTitle'),
            text: error.response.data.message
              ? error.response.data.message[`${this.$i18n.locale}`]
              : null,
          })
        }
      } else {
        const data = {
          email: this.editedItem.email,
          password: this.editedItem.password,
          firstName: this.editedItem.firstName,
          lastName: this.editedItem.lastName,
          role: this.editedItem.role,
          active: this.editedItem.active,
        }
        try {
          await this.$axios.$post('/users/create', data)
          this.users.push(this.editedItem)
        } catch (error) {
          this.$notify({
            group: 'users',
            type: 'error',
            title: this.$t('usersPage.errorTitle'),
            text: error.response.data.message
              ? error.response.data.message[`${this.$i18n.locale}`]
              : null,
          })
        }
        this.close()
      }
      this.close()
    },
  },
}
</script>
