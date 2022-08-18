import { NativeModules } from 'react-native'
const { LPAPIModule } = NativeModules

const openPrinter = () => new Promise(resolve => {
  LPAPIModule.openPrinter(null, obj => {
    resolve(obj)
  })
})

const getPrinterState = () => new Promise(resolve => {
  LPAPIModule.getPrinterState(state => {
    resolve(state)
  })
})

const getConnectedPrinter = () => new Promise(resolve => {
  LPAPIModule.getAllPrinterAddressesPaired(obj => {
    const printer = Object.entries(obj)[0]

    resolve({ name: printer[0], address: printer[1] })
  });
})

const connect = async () => {
  LPAPIModule.initSDK();

  await openPrinter()
  return getConnectedPrinter()
}

export default {
  connect,
  getPrinterState,
  ...LPAPIModule
}
