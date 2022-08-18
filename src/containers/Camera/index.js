import React, { useRef } from 'react'
import { Modal, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Camera, useCameraDevices } from 'react-native-vision-camera'

const styles = StyleSheet.create({
  camera: {
    flex: 1
  },
  capture: {
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    padding: 20,
    elevation: 5,
    borderRadius: 10,

  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black'
  },
  close: {
    position: 'absolute',
    top: 10,
    right: 20,
    padding: 10,
    borderRadius: 10,
  },
  closeText: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  }
})

const Home = ({ visible, onCapture, onClose, loading }) => {
  const devices = useCameraDevices()
  const device = devices.back
  const camera = useRef(null)

  const capture = async () => {
    const photo = await camera.current.takePhoto()
    onCapture(photo)
  }

  if (!device) return null

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Camera
        photo
        isActive={!loading}
        ref={camera}
        device={devices.back}
        style={styles.camera}
      />

      <TouchableOpacity style={styles.close} activeOpacity={0.7} onPress={onClose}>
        <Text style={styles.closeText}>X បិទ</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.capture} activeOpacity={0.7} onPress={capture}>
        <Text style={styles.buttonText}>{loading ? 'កំពុងបញ្ចូន...' : 'ថតរូប'}</Text>
      </TouchableOpacity>
    </Modal>
  )
}

export default Home
