import React, { useEffect, useRef } from 'react'
import { Modal, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Camera, useCameraDevices } from 'react-native-vision-camera'
import { Image } from 'react-native-compressor'
import { useScanBarcodes, BarcodeFormat } from 'vision-camera-code-scanner'

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

  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.ALL_FORMATS], {
    checkInverted: true,
  });

  useEffect(() => {
    requestPermission()
  }, [])

  const requestPermission = async () => {
    const cameraPermission = await Camera.getCameraPermissionStatus()

    if (cameraPermission !== 'authorized') {
      await Camera.requestCameraPermission()
    }
  }

  const capture = async () => {
    const photo = await camera.current.takePhoto()
    let compress = photo.path

    try {
      compress = await Image.compress(`file://${photo.path}`, {
        quality: 0.9,
        compressionMethod: 'auto',
      })
    } catch (e) {
      //
    }

    onCapture({
      ...photo,
      compressPath: compress,
      barcodes: barcodes.map(code => ({
        code: code.displayValue,
        type: code.format === 256 ? 'qr' : 'barcode'
      }))
    })
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
        frameProcessor={frameProcessor}
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
