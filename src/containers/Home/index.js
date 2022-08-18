import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native'

const dimensions = Dimensions.get('screen')

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#de475a',
    width: dimensions.width - 40,
    padding: 20,
    marginBottom: 20,
    borderRadius: 20
  },
  text: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  }
})

const Home = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/logo.png')} style={styles.logo} />

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Forwarding')}>
        <Text style={styles.text}>Forwarding</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('BangkokTracking')}>
        <Text style={styles.text}>Bangkok Tracking</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Home
