import React, { useState } from 'react'
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
  inlineFormInput: {
    marginBottom: 10,
    flexDirection: 'row',
  },
  formInput: {
    marginBottom: 10,
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
    width: (dimensions.width - 60) / 4,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 5,
    marginRight: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  optionImage: {
    width: 40,
    height: 40
  },
  optionLabel: {
    color: '#000',
  },
  activeLabel: {
    color: '#fff'
  },
  active: {
    backgroundColor: '#de475a',
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

const PRODUCT_TYPES = [
  {
    value: 'Clothes',
    text: 'ខោអាវ',
    image: require(`../../assets/clothes.png`)
  },
  {
    value: 'Accessories',
    text: 'អេឡិចត្រូនិច',
    image: require(`../../assets/accessories.png`)
  },
  {
    value: 'Furniture',
    text: 'គ្រឿងសង្ហារឹម',
    image: require(`../../assets/furniture.png`)
  },
  {
    value: 'Cosmetics',
    text: 'គ្រៀងសំអាង',
    image: require(`../../assets/cosmetics.png`)
  },
  {
    value: 'Food',
    text: 'អាហារ',
    image: require(`../../assets/food.png`)
  },
  {
    value: 'Jewelry',
    text: 'គ្រឿងអលង្ការ',
    image: require(`../../assets/jewelry.png`)
  },
  {
    value: 'Plant',
    text: 'រុក្ខជាតិ',
    image: require(`../../assets/plant.png`)
  },
  {
    value: 'Other',
    text: 'ផ្សេងៗ',
    image: require(`../../assets/other.png`)
  }
]

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

    const ext = image.compressPath.split('.').pop()
    const name = `${Date.now()}.${ext}`

    body.append('resource', 'forwarding_parcels')
    body.append('file', {
      name,
      type: `image/${ext}`,
      uri: `file://${image.compressPath}`,
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
          barcodes: image.barcodes,
        }
      }

      await axios.post(endpoint, body, { headers })

      onPrint(newTracking)
      setLoading(false)
      setSubmitted(true)
      return Alert.alert('ជោគជ័យ', 'ការបញ្ជូនបានជោគជ័យ', [{ onPress: () => { }, text: 'យល់ព្រម' }])
    } catch (error) {
      // console.log(error.response)
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

      <View style={styles.inlineFormInput}>
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

      <View style={styles.inlineFormInput}>
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

      <View style={styles.inlineFormInput}>
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

      <View style={styles.inlineFormInput}>
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
          {PRODUCT_TYPES.map(({ value, text, image }) => (
            <TouchableOpacity
              key={value}
              activeOpacity={0.7}
              onPress={() => setProductType(value)}
              style={[styles.option, productType === value ? styles.active : null]}
            >
              <Image source={image} style={styles.optionImage} />
              <Text style={[styles.optionLabel, productType === value ? styles.activeLabel : null]}>
                {text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inlineFormInput}>
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
