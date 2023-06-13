const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  code: state => state.user.code,
  name: state => state.user.name,
  digestSecret: state => state.user.digestSecret
}
export default getters
