import React, { useState, useReducer } from 'react';
import { Pressable, Platform, StyleSheet, Button, View, Image, Text, PermissionsAndroid } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import { BleManager, Device } from 'react-native-ble-plx';

import ConnectionManager from './src/ConnectionManager'


const theme = {
  colors: {
    primary: '#03f0fc', 
    secondary: '#47c1d1'
  }
}


export const AppContext = React.createContext();

const initialState = {
  device: new Device(), 
}

function reducer(state, action) {
  switch (action.type) {
      case 'UPDATE_DEVICE':
          return {
              device: action.data
          }
      default:
          return initialState
  }
}

const styles = StyleSheet.create({

})

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.primary }}>
      <Image  style={{ flex: 3, width: 300, height: 300, resizeMode: 'contain' }}
        source={require('BCReader/resources/logo-white.png')} />
      <View style={{ flex: 2, justifyContent: 'space-evenly' }}>
        <Button
          color={theme.colors.secondary}
          onPress={() => navigation.navigate('ConnectionManager')}
          title="Connection Manager"
        />
        <Button
          color={theme.colors.secondary}
          onPress={() => navigation.navigate('UART')}
          title="UART Analyzer"
        />
        <Button
          color={theme.colors.secondary}
          onPress={() => navigation.navigate('UART')}
          title="I2C Analyzer"
        />
        <Button
          color={theme.colors.secondary}
          onPress={() => navigation.navigate('UART')}
          title="Analog Input"
        />
        <Button
          color={theme.colors.secondary}
          onPress={() => navigation.navigate('UART')}
          title="Digital I/O"
        />
      </View>
      <View style={{flex: 0.5}} />
    </View>
  );
}

function UARTScreen({ navigation }) {
  const [transactions, setTransactions] = useState([])
  return (
    <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'white' }}>
      <Icon name="menu" size={30} color="black" />
      <FlatList style={{margin: 20, borderColor: 'gray', borderWidth: 2}} data={transactions} renderItem={({item}) => 
        <View style={{flex: 1, flexWrap: 'wrap'}} flexDirection='row' justifyContent='space-between'>
          <Text style={{paddingLeft: 10, paddingBottom: 5, flex: 1, flexWrap: 'wrap'}}>{item.message}</Text>
          <Text style={{paddingRight: 10, paddingBottom: 5}}>{new Date(item.time.getTime()).toLocaleTimeString()}</Text>
        </View>} keyExtractor={(item, index) => String(item.time.getTime())} />
        <Button color={theme.colors.secondary} onPress={() => setTransactions([...transactions, {message: "abcdefghijklmnopqrstuvwxyz", time: new Date()}])} title="Add entry" />
    </View>
  );
}

const Drawer = createDrawerNavigator();

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);


  return (
    <NavigationContainer>
      <AppContext.Provider value={{ state, dispatch }}>
        <Drawer.Navigator initialRouteName="Home">
          <Drawer.Screen name="Home" component={HomeScreen} />
          <Drawer.Screen name="ConnectionManager" component={ConnectionManager} />
          <Drawer.Screen name="UART" component={UARTScreen} />
        </Drawer.Navigator>
      </AppContext.Provider>
    </NavigationContainer>
  );
}