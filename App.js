/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import {Button, View} from 'react-native';

import {NativeModules} from 'react-native';

const {LPAPIModule} = NativeModules;

function App() {
  useEffect(() => {
    LPAPIModule.initSDK();
    LPAPIModule.openPrinter('DP23S-11049828', obj => {
      console.log(obj);
    });
    LPAPIModule.getAllPrinterAddressesPaired(obj => {
      console.log(obj);
    });
  });

  const print = () => {
    //width, height, orientation
    LPAPIModule.startJob(40, 30, 0);
    LPAPIModule.setItemOrientation(0);
    // text, x, y, width, height,fontHeight
    LPAPIModule.drawText('test', 10, 5, 20, 10, 4);
    // text, x, y, width, height
    LPAPIModule.draw1DBarcode('999999', 10, 10, 20, 10, 3);
    LPAPIModule.commitJob();
  };

  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      <Button onPress={() => print()} title="Print" color="#841584" />
    </View>
  );
}

export default App;
