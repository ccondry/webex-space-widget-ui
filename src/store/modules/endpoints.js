const getters = {
  endpoints: (state, getters) => {
    const urlBase = getters.isProduction ? '/api/v1' : 'http://localhost:4010/api/v1'
    return {
      oauth2: `${urlBase}/oauth2`,
      user: `${urlBase}/user`,
      demo: `${urlBase}/demo`,
      validLogin: `${urlBase}/valid`,
      rooms: `${urlBase}/room`,
      version: `${urlBase}/version`,
      join: `${urlBase}/join`
    }
  },
  defaultRestOptions: (state, getters) => {
    return {
      headers: {
        Authorization: 'Bearer ' + getters.jwt
      }
    }
  }
}

export default {
  getters
}