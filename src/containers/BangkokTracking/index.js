import React, { useState } from 'react'
import { View, StyleSheet, Dimensions, Alert } from 'react-native'
import axios from 'axios'

import Camera from '../Camera'

const dimensions = Dimensions.get('screen')

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff'
  },
})

const BangkokTracking = ({ navigation }) => {
  const [loading, setLoading] = useState(false)

  const onCapture = async photo => {
    try {
      setLoading(true)

      const endpoint = 'https://hasunode.thailandoutlets.com/api/v2/requests'
      const headers = { authorization: 'Bearer 503b70b6-550c-417c-964e-a7f159108fd0' }

      const body = {
        resource: 'bangkok_tracking',
        payload: {
          image_url: await uploadImage(photo),
          barcodes: photo.barcodes,
        }
      }

      await axios.post(endpoint, body, { headers })
      setLoading(false)

      return Alert.alert('ជោគជ័យ', 'ការបញ្ជូនបានជោគជ័យ', [{ onPress: () => { }, text: 'យល់ព្រម' }])
    } catch (error) {
      // console.log(error.response)
    }
  }

  const uploadImage = async image => {
    const endpoint = 'https://hasunode.thailandoutlets.com/api/v2/file'
    const body = new FormData()

    const ext = image.compressPath.split('.').pop()
    const name = `${Date.now()}.${ext}`

    body.append('resource', 'bangkok_tracking')
    body.append('file', {
      name,
      type: `image/${ext}`,
      uri: `file://${image.compressPath}`,
    })

    const headers = { 'content-type': 'multipart/form-data', authorization: 'Bearer 3c10c0ad-aa7a-4acf-8c5f-2fa00d404c2e' }

    const response = await axios.post(endpoint, body, { headers })

    return response.data.url
  }

  return (
    <View contentContainerStyle={styles.container}>
      <Camera visible onClose={() => navigation.goBack()} onCapture={onCapture} loading={loading} />
    </View>
  )
}

export default BangkokTracking
