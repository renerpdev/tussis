import { getRemoteConfig } from 'firebase/remote-config'
import firebaseApp from './firebase'

const remoteConfig = getRemoteConfig(firebaseApp)
const mode = import.meta.env.MODE

if (mode === 'development') {
  remoteConfig.settings.minimumFetchIntervalMillis = 1000
} else {
  remoteConfig.settings.minimumFetchIntervalMillis = 3600000
}

export default remoteConfig
