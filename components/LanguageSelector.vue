<template>
  <v-menu offset-y open-on-hover>
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="primary" dark v-bind="attrs" v-on="on">
        <country-flag :country="$i18n.locale" size="normal" />
      </v-btn>
    </template>
    <v-list>
      <v-list-item
        v-for="locale in availableLocales"
        :key="locale.code"
        :to="switchLocalePath(locale.code)"
      >
        <v-row>
          <v-col cols="12" sm="12" md="12">
            <country-flag :country="locale.code" size="normal" />
          </v-col>
        </v-row>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import CountryFlag from 'vue-country-flag'

export default {
  name: 'LanguageSelector',

  components: {
    CountryFlag,
  },

  computed: {
    availableLocales() {
      return this.$i18n.locales.filter((i) => i.code !== this.$i18n.locale)
    },
  },
}
</script>
