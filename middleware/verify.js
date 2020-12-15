export default async function setAuthToken({ $axios, store }) {
  const token = localStorage.getItem('token')

  if (!token) return {}
  $axios.setToken(token, 'bearer')

  try {
    const response = await $axios.get('/auth/verify')
    store.dispatch('Auth/signin', response.data.user)
  } catch (error) {
    console.log(error)
  }
}
