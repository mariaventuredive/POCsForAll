
import React, { useState, useRef, useContext, useEffect } from 'react';
import WebView from 'react-native-webview';
import { RefreshControl, StatusBar, View, SafeAreaView, Text, ScrollView, Dimensions, StyleSheet } from 'react-native';

import { checkInternetConnectivity } from './utils/NetworksUtils';
import NetInfo from '@react-native-community/netinfo';
import SplashScreen from './Screens/SplashScreen';

// Set the Root View background color to black

const App = ({ isRefresh, onRefresh, ...webViewProps }) => {

  const [isConnected, setIsConnected] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  useEffect(() => {

    const fetchConnectivity = async () => {
      const isConnected = await checkInternetConnectivity();
      setIsConnected(isConnected);
    };

    fetchConnectivity();

    // Setup a subscription for network changes
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    const timeout = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => {
      // Cleanup subscription
      unsubscribe();
    };
  }, []);

  const [refreshing, setRefreshing] = useState(false);
  const [refresherEnabled, setEnableRefresher] = useState(true);

  const webViewRef = useRef(null);
  //Code to get scroll position
  const handleScroll = (event: { nativeEvent: { contentOffset: { y: any; }; }; }) => {
    const yOffset = Number(event.nativeEvent.contentOffset.y)
    if (yOffset === 0) {
      setEnableRefresher(true);

    }
    else if (refresherEnabled) setEnableRefresher(false);
  }


  const LoadingView = () => {
    return (

      <View style={{ backgroundColor: '#4b1a71', }}>
        <Text style={{ textAlign: 'center', color: '#ffff' }}>Loading...</Text>
      </View>
    )
  }

  const NetworkState = () => {
    return (
      <View style={{ backgroundColor: 'red' }}>

        <Text style={styles.title}>No Internet </Text>

      </View>
    )
  }





  return (

    <SafeAreaView style={styles.containerWebView}>
      <StatusBar backgroundColor="#4b1a71" barStyle="light-content" />
      <View style={{ flex: showSplash ? 1 : 0, backgroundColor: "#4b1a71" ,display: showSplash ? 'flex': 'none', }}>
        <SplashScreen />
      </View>

      <ScrollView
        style={{ flex: 1, display: showSplash ? 'none' : 'flex', backgroundColor: "#4b1a71" }}
        contentContainerStyle={{ flex: 1, display: showSplash ? 'none' : 'flex', backgroundColor: "#4b1a71" }}
        refreshControl={showSplash ? <></> :
          <RefreshControl
            refreshing={refreshing}
            enabled={refresherEnabled}
            onRefresh={() => {
              webViewRef.current.reload()
              setRefreshing(false);
            }}
          />
        }
      >

        <WebView
          source={{ uri: 'https://Newgold.show' }}
          ref={webViewRef}
          originWhitelist={['*']}
          allowsInlineMediaPlayback
          javaScriptEnabled
          scalesPageToFit
          mediaPlaybackRequiresUserAction={false}
          javaScriptEnabledAndroid
          useWebkit
          renderLoading={LoadingView}
          startInLoadingState={true}
          cacheEnabled
          onScroll={handleScroll}
          style={{ backgroundColor: '#4b1a71', flex: 1 }}
        // onLoadEnd={setRefreshing(false)}
        />
        {!isConnected && (<NetworkState />)}
      </ScrollView>

    </SafeAreaView>

  )
}
const styles = StyleSheet.create({
  title: {
    color: '#ffff',
    textAlign: 'center'
  },
  containerWebView: {
    flex: 1,
    backgroundColor: '#4b1a71'
  },
  scrollView: {
    flex: 1
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});
export default App;


//export { default } from './.storybook';
