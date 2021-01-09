<template>
  <div class="text-center">
    <v-menu offset-y open-on-hover>
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" dark v-bind="attrs" v-on="on">
          <country-flag :country="$i18n.locale" size="normal" />
        </v-btn>
      </template>
      <v-list>
        <v-list-item v-for="(item, index) in availableLocales" :key="index">
          <v-list-item-title @click="switchLocalePath(item.code)">
            <v-row>
              <v-col cols="6" sm="6" md="6">
                <country-flag :country="item.code" size="normal" />
              </v-col>
              <v-col cols="6" sm="6" md="6">
                {{ item.name }}
              </v-col>
            </v-row>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import CountryFlag from 'vue-country-flag'

export default {
  name: 'LanguageSelector',

  components: {
    CountryFlag,
  },

  data() {
    return {}
  },

  methods: {
    switchLocale(locale) {
      if (this.$i18n.locale !== locale) {
        this.$i18n.locale = locale
      }
    },
  },

  computed: {
    availableLocales() {
      return this.$i18n.locales.filter((i) => i.code !== this.$i18n.locale)
    },
  },
}
</script>
