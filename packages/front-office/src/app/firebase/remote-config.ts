import { getRemoteConfig } from 'firebase/remote-config'
import firebaseApp from './firebase'

const remoteConfig = getRemoteConfig(firebaseApp)

const defaultConfig = {
  create_non_verified_users: false,
  login_with_google: true,
  login_with_password: true,
  display_reset_password: true,
}

remoteConfig.defaultConfig = defaultConfig

const mode = import.meta.env.MODE
if (mode === 'development') {
  remoteConfig.settings.minimumFetchIntervalMillis = 1000
}

export default remoteConfig
