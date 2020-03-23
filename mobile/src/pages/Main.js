import React, { useEffect, useState } from 'react';
import MapView, { Marker,Callout } from 'react-native-maps';
import { StyleSheet, Image, View, Text, TextInput,TouchableOpacity, Keyboard } from 'react-native';
import {requestPermissionsAsync, getCurrentPositionAsync} from 'expo-location'
import { MaterialIcons } from '@expo/vector-icons';
import api from '../services/api';
import {connect, disconnect} from '../services/socket';


function Main( {navigation} ){
    const [ devs, setDevs ] = useState([]);
    const [ techs, setTechs ] = useState('');
    const [ currentRegion, setCurrentRegion ] = useState(null);

    useEffect( () => {
        async function loadInitialPosition(){
           const {granted} = await requestPermissionsAsync();

           if(granted){
                const { coords } = await getCurrentPositionAsync({
                    enableHighAccuracy: true,
                });
                const { latitude, longitude } = coords ; 

                setCurrentRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.04,
                    longitudeDelta: 0.04,
                });
           }
        }

        loadInitialPosition();
    }, []);

    function setupWebsocket(){
        connect();
    }

    async function loadDevs(){
        const { latitude, longitude  } = currentRegion;

        const response = await api.get('/search',{
            params:{
                latitude,
                longitude,
                techs
            }
        });

        setDevs(response.data.devs);
        setupWebsocket();
    }

    async function handleRegionChanged(region){
        setCurrentRegion(region);
    }

    if(!currentRegion){
        return null;
    }

    return(
        <>
            <MapView 
                onRegionChangeComplete={handleRegionChanged}
                initialRegion={currentRegion} 
                style={styles.map}
            >
                {devs.map(dev => (
                     <Marker 
                        key={dev._id}
                        coordinate={
                        { 
                            latitude: dev.location.coordinates[1], 
                            longitude: dev.location.coordinates[0]
                        }}>
                        
                     <Image 
                         style ={styles.avatar}
                         source={{
                             uri: dev.avatar_url
                             }}
                         />
                     <Callout onPress={() => {
                         //navegção 
                         navigation.navigate('Profile',{github_username: dev.github_username});
                     }}>
                         <View style={styles.callout}>
                            <Text style={styles.devName}>{dev.name}</Text>
                            <Text style={styles.devBio}>{dev.bio}</Text>
                    <Text style={styles.devTechs}>{dev.techs.join(', ')}</Text>
                         </View>
                     </Callout>
                 </Marker>
             
                ))}
            </MapView>
            <View style={styles.searchForm}>
                <TextInput
                    style={styles.searchInput}
                    placeHolder="Buscar devs por techs..."
                    placeholderTextColor="#999"
                    autoCapitalize="words"
                    autoCorrect={false}
                    value={techs}
                    onChangeText={ setTechs }
                />

                <TouchableOpacity onPress={loadDevs} style={styles.loadButton}>
                    <MaterialIcons name='my-location' size={20} color='#fff'/>
                </TouchableOpacity>

            </View>
        </>
    );
}

const styles = StyleSheet.create({
    map: {
        flex: 1
    },
    avatar:{
        width: 54,
        height: 54,
        borderRadius: 4,
        borderWidth: 4,
        borderColor: '#fff'
    },
    callout: {
        width: 260,
    },
    devName: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    devBio: {
        color: "#666",
        marginTop: 5,
    },
    devTechs: {
        marginTop: 5,

    },
    searchForm:{
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        zIndex: 5,
        flexDirection: 'row'
    },
    searchInput:{
        flex:1,
        height: 50,
        backgroundColor: '#fff',
        color: '#333',
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 16,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 4,
            height: 4,
        },
        elevation: 4,

    },
    loadButton:{
        width: 50,
        height: 50,
        backgroundColor: '#8E4DFF',
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 15,
    }
});

export default Main;