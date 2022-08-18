import React, { useEffect, useState, useRef } from 'react'
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Dimensions, Alert, ScrollView } from 'react-native'
import axios from 'axios'
import moment from 'moment'

import Printer from '../../modules/Printer'
import Camera from '../Camera'

const dimensions = Dimensions.get('screen')

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff'
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 20,
    color: '#de475a'
  },
  formInput: {
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    color: '#000',
    fontSize: 16,
    marginBottom: 10,
    width: 100
  },
  measurement: {
    color: '#000',
    fontSize: 16,
    width: 40,
  },
  input: {
    flex: 1,
    paddingTop: 0,
    paddingBottom: 0,
    fontSize: 16,
    color: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  image: {
    width: dimensions.width - 140,
    height: dimensions.width - 140,
    backgroundColor: '#f7f7f7',
  },
  optionWrapper: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
  },
  option: {
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 10,
    marginRight: 10,
  },
  active: {
    backgroundColor: '#de475a',
    color: '#fff'
  },
  actions: {
    flexDirection: 'row',
  },
  submitBtn: {
    flex: 3,
    backgroundColor: '#de475a',
    elevation: 3,
    padding: 10,
    marginTop: 10,
    borderRadius: 10,
  },
  clearBtn: {
    flex: 1,
    backgroundColor: '#000',
    elevation: 3,
    padding: 10,
    marginTop: 10,
    marginRight: 10,
    borderRadius: 10,
  },
  btnText: {
    color: '#fff',
    textAlign: 'center',
  },
  printBtn: {
    backgroundColor: '#4b0082'
  }
})

const Home = () => {
  const [cus, setCus] = useState('')
  const [qty, setQty] = useState(0)
  const [price, setPrice] = useState(0)
  const [weight, setWeight] = useState(0)
  const [image, setImage] = useState(null)
  const [tracking, setTracking] = useState('')
  const [productType, setProductType] = useState('')

  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [showCamera, setShowCamera] = useState(false)

  const onCapture = photo => {
    setImage(photo)
    setShowCamera(false)
  }

  const uploadImage = async () => {
    const endpoint = 'https://hasunode.thailandoutlets.com/api/v2/file'
    const body = new FormData()

    const ext = image.path.split('.').pop()
    const name = `${Date.now()}.${ext}`

    body.append('resource', 'forwarding_parcels')
    body.append('file', {
      name,
      type: `image/${ext}`,
      uri: `file://${image.path}`,
    })

    const headers = { 'content-type': 'multipart/form-data', authorization: 'Bearer 3c10c0ad-aa7a-4acf-8c5f-2fa00d404c2e' }

    const response = await axios.post(endpoint, body, { headers })

    return response.data.url
  }

  const onSubmit = async () => {
    try {
      if (!cus || !qty || !price || !weight || !image || !productType) {
        return Alert.alert('ពត៌មានមិនទាន់គ្រប់គ្រាន់', 'សូមបញ្ជូលពត៌មានទាំងអស់', [{ onPress: () => {}, text: 'យល់ព្រម' }])
      }

      const newTracking = moment().format('YYYYMMDDHHmmss')
      setTracking(newTracking)

      setLoading(true)

      const endpoint = 'https://hasunode.thailandoutlets.com/api/v2/requests'
      const headers = { authorization: 'Bearer 503b70b6-550c-417c-964e-a7f159108fd0' }

      const body = {
        resource: 'thailand_forwarding',
        payload: {
          customer: `CUS${cus}`,
          qty,
          price,
          weight,
          tracking: newTracking,
          image_url: await uploadImage(),
          product_type: productType,
        }
      }

      await axios.post(endpoint, body, { headers })

      onPrint(newTracking)
      setLoading(false)
      setSubmitted(true)
      return Alert.alert('ជោគជ័យ', 'ការបញ្ជូនបានជោគជ័យ', [{ onPress: () => { }, text: 'យល់ព្រម' }])
    } catch (error) {
      console.log(error.response)
    }
  }

  const onClear = () => {
    setCus('')
    setQty(0)
    setPrice(0)
    setWeight(0)
    setImage(null)
    setTracking('')
    setProductType('')
    setSubmitted(false)
  }

  const onPrint = async (trackingNumber) => {
    await Printer.connect()

    Printer.startJob(40, 30, 0)
    Printer.drawText('TH Forwarding', 2, 2, 0, 0, 3)
    Printer.drawText(`CUS${cus}`, 2, 7, 0, 0, 3)
    Printer.draw1DBarcode(trackingNumber || tracking, 2, 13, 36, 10, 3)

    Printer.commitJob()
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Camera visible={showCamera} onClose={() => setShowCamera(false)} onCapture={onCapture} />

      <Text style={styles.title}>Forwading</Text>

      <View style={styles.formInput}>
        <Text style={styles.label}>អតិថិជន :</Text>
        <View style={styles.inputWrapper}>
          <Text style={styles.measurement}>CUS</Text>
          <TextInput
            value={cus}
            onChangeText={setCus}
            style={styles.input}
            keyboardType="number-pad"
          />
        </View>
      </View>

      <View style={styles.formInput}>
        <Text style={styles.label}>ទម្ងន់ :</Text>
        <View style={styles.inputWrapper}>
          <Text style={styles.measurement}>(g)</Text>
          <TextInput
            value={weight}
            onChangeText={setWeight}
            style={styles.input}
            keyboardType="number-pad"
          />
        </View>
      </View>

      <View style={styles.formInput}>
        <Text style={styles.label}>តម្លៃ :</Text>
        <View style={styles.inputWrapper}>
          <Text style={styles.measurement}>฿</Text>
          <TextInput
            value={price}
            onChangeText={setPrice}
            style={styles.input}
            keyboardType="number-pad"
          />
        </View>
      </View>

      <View style={styles.formInput}>
        <Text style={styles.label}>ចំនួន :</Text>
        <View style={styles.inputWrapper}>
          <Text style={styles.measurement}>X</Text>
          <TextInput
            value={qty}
            onChangeText={setQty}
            style={styles.input}
            keyboardType="number-pad"
          />
        </View>
      </View>

      <View style={styles.formInput}>
        <Text style={styles.label}>ប្រភេទទំនិញ :</Text>
        <View style={styles.optionWrapper}>
          <Text
            onPress={() => setProductType('Clothes')}
            style={[styles.option, productType === 'Clothes' ? styles.active : null]}
          >
            ខោអាវ
          </Text>
          <Text
            onPress={() => setProductType('Accessories')}
            style={[styles.option, productType === 'Accessories' ? styles.active : null]}
          >
            គ្រឿងអេឡិចត្រូនិច
          </Text>
          <Text
            onPress={() => setProductType('Furniture')}
            style={[styles.option, productType === 'Furniture' ? styles.active : null]}
          >
            គ្រឿងសង្ហារឹម
          </Text>
          <Text
            onPress={() => setProductType('Cosmetics')}
            style={[styles.option, productType === 'Cosmetics' ? styles.active : null]}
          >
            គ្រៀងសំអាង
          </Text>
          <Text
            onPress={() => setProductType('Food')}
            style={[styles.option, productType === 'Food' ? styles.active : null]}
          >
            អាហារ
          </Text>
          <Text
            onPress={() => setProductType('Jewelry')}
            style={[styles.option, productType === 'Jewelry' ? styles.active : null]}
          >
            គ្រឿងអលង្ការ
          </Text>
          <Text
            onPress={() => setProductType('Plant')}
            style={[styles.option, productType === 'Plant' ? styles.active : null]}
          >
            រុក្ខជាតិ
          </Text>
          <Text
            onPress={() => setProductType('Other')}
            style={[styles.option, productType === 'Other' ? styles.active : null]}
          >
            ផ្សេងៗ
          </Text>
        </View>
      </View>

      <View style={styles.formInput}>
        <Text style={styles.label}>រូបភាព :</Text>

        <TouchableOpacity onPress={() => setShowCamera(true)}>
          <Image
            style={styles.image}
            resizeMode="center"
            source={image ? { uri: `file://${image.path}` } : require('../../assets/placeholder.jpg')}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={onClear} style={styles.clearBtn}>
          <Text style={styles.btnText}>លុបចោល</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => submitted ? onPrint() : onSubmit()} style={[styles.submitBtn, submitted ? styles.printBtn : null]}>
          {
            loading
              ? <Text style={styles.btnText}>កំពុងបញ្ជូន...</Text>
              : <Text style={styles.btnText}>{submitted ? 'បោះពុម្ភម្តងទៀត' : 'បញ្ជូន'}</Text>
          }
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

export default Home
