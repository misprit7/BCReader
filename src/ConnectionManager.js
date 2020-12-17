import React, { useState, useContext } from 'react';
import { Pressable, Platform, StyleSheet, Button, View, Image, Text, PermissionsAndroid } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import { BleManager, Device } from 'react-native-ble-plx';

import { AppContext } from '../App'


const theme = {
colors: {
    primary: '#03f0fc', 
    secondary: '#47c1d1'
}
}

export default function ConnectionManager({ navigation }) {

    // Connection method taken from here: 
    // https://github.com/Polidea/react-native-ble-plx/issues/603
    const bleManager = new BleManager()
    
    const [deviceScan, setDeviceScan] = useState(false)
    const [devices, setDevices] = useState([])
    const {state, dispatch} = useContext(AppContext);
  
    const stopDeviceScan = () => {
      console.trace('stopDeviceScan')
      bleManager.stopDeviceScan()
      setDeviceScan(false)
    }
  
    const addDevice = (device) => {
      console.trace('addDevice')
      console.log(device.id, device.name, device.localName)
      if (device.localName &&
        devices.findIndex((x) => x.id == device.id) === -1) {
  
        setDevices([...devices, device])
      }
    }
  
    const startDeviceScan = () => {
      if (Platform.OS === "android" && Platform.Version >= 23) {
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
      }
      console.trace('startDeviceScan')
      bleManager.startDeviceScan(null, { allowDuplicates: false }, (error, device) => {
          if (error) {
              console.error(error)
          } else {
              addDevice(device)
          }
      })
    }
  
    // startDeviceScan()
  
    return (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'white' }}>
        <FlatList style={{margin: 20, borderColor: 'gray', borderWidth: 2}}
          data={devices}
          renderItem={({item}) => 
          <Pressable onPress={() => {
            stopDeviceScan()
            item.connect().then(dispatch({ type: 'UPDATE_DEVICE', data: item }))
          }}>
            <View style={{flex: 1, flexWrap: 'wrap', paddingTop: 10, paddingBottom: 10, paddingLeft: 20, paddingRight: 20, backgroundColor: item.id == state.device.id ? '#dbdbdb' : '#FFFFFF'}}
              flexDirection='row' justifyContent='space-between'>
              <Text style={{flex: 1, flexWrap: 'wrap', fontSize: 15}}>{item.localName}</Text>
              <Text style={{fontSize: 15}}>{item.id}</Text>
            </View>
          </Pressable>} keyExtractor={(item, index) => item.id} />
        <Button
            color={theme.colors.secondary}
            onPress={ startDeviceScan }
            title="Reload"
          />
      </View>
    );
  }