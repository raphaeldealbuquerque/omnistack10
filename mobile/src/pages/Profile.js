import React from 'react';
import { WebView } from 'react-native-webview';

function Profile({navigation}){
    const github_username = navigation.getParam('github_username');
    return(
        <WebView style={{flx: 1}} source={{uri: `https://github.com/${github_username}`}}/>
    );
}

export default Profile;