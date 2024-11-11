import { View, Text, TouchableOpacity, TextInput, Modal, Alert, ToastAndroid } from 'react-native'
import React, { useEffect, useState, } from 'react'

const App = () => {
  const [data, setData] = useState([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const getApiData = async () => {
    const url = "http://10.0.2.2:3000/users"
    let response = await fetch(url);
    response = await response.json();
    console.log('Fetched Data:', response);
    if (response) {
      setData(response);
    }
  }
  useEffect(() => {
    getApiData();
  }, [])

  const postApiData = async () => {
    const url = "http://10.0.2.2:3000/users"
    let response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name, age: age })
    });
    response = await response.json();
    getApiData();
  }

  const deleteApiData = async (id) => {
    const url = "http://10.0.2.2:3000/users"
    let response = await fetch(`${url}/${id}`, {
      method: 'DELETE'
    })
    response = await response.json();
    if (response) {
      getApiData();
    }
  }

  const putApiData = async () =>{
    console.log('New', name+ ' '+age+' '+selectedItem.id);
    const url = "http://10.0.2.2:3000/users"
    const id =  selectedItem.id;
    let response = await fetch(`${url}/${id}`, {
      method:'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name, age: age })
    });
    response = await response.json();
    if (response) {
      getApiData();
      setModalVisible(false);
      ToastAndroid.show('Data Successfully Updated', ToastAndroid.LONG);
      }
  }

  const openModal = (item) => {
    setSelectedItem(item);
    console.log(item.name+' '+item.age)
    setName(item.name);
    setAge(item.age.toString());
    setModalVisible(true);
  }

  console.log('Rendered Data:', data);
  return (
    <View style={{ flex: 1, backgroundColor: 'pink' }}>
      <View style={{ flex: 1 }}>
        <Text>POST API Data</Text>
        <TextInput value={name} onChangeText={(text) => setName(text)} style={{ borderWidth: 1, margin: 5, color: 'black' }} placeholder='Enter name' />
        <TextInput value={age} onChangeText={(text) => setAge(text)} style={{ borderWidth: 1, margin: 5, color: 'black' }} placeholder='Enter Age' />

        <TouchableOpacity onPress={postApiData} style={{ backgroundColor: 'red', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 30, textAlign: 'center' }}>Click me</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, marginTop: 40, marginHorizontal: 20 }}>
        <Text>Fetch API Data</Text>
        {
          data.length ? (
            data.map((item) => (
              <View key={item.id} style={{ backgroundColor: 'grey', flexDirection: 'row', lignItems: 'center' }}>
                <View style={{ flex: 1, backgroundColor: 'yellow', justifyContent:'space-between', flexDirection: 'row' }}>

                  <Text style={{ color: 'black' }}>Name :  {item.name}</Text>
                  <Text style={{ color: 'black' }}>Age :  {item.age}</Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent:'space-between', marginLeft: 20 }}>
                  <TouchableOpacity onPress={() => deleteApiData(item.id)} style={{ padding: 2, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, textAlign: 'center' }}>Delete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => openModal(item)} style={{ padding: 2, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, textAlign: 'center' }}>Update</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) :
            (
              <Text style={{ color: 'black' }}>No data available</Text>
            )
        }
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }}>
          <View style={{ width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
            <Text>Update User Data</Text>
            <TextInput
              value={name}
              onChangeText={(text) => setName(text)}
              style={{ borderWidth: 1, marginBottom: 10, padding: 5, color: 'black' }}
              placeholder='Enter name'
            />
            <TextInput
              value={age}
              onChangeText={(text) => setAge(text)}
              style={{ borderWidth: 1, marginBottom: 10, padding: 5, color: 'black' }}
              placeholder='Enter Age'
              keyboardType="numeric"
            />
            <TouchableOpacity onPress={putApiData}  style={{ backgroundColor: 'green', padding: 10, alignItems: 'center' }}>
              <Text style={{ color: 'white' }}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={{ backgroundColor: 'gray', padding: 10, marginTop: 10, alignItems: 'center' }}>
              <Text style={{ color: 'white' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default App