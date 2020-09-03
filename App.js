import React, { Component } from 'react';
import { StyleSheet, Button, View, Text, Image } from 'react-native';

//인트로 슬라이드
import AppIntroSlider from 'react-native-app-intro-slider';

//네비게이션
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

//웹뷰
import { BackHandler} from 'react-native';
import { WebView } from 'react-native-webview';

//웹뷰 컴포넌트 선언
class MyWebComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 0,
      count: 0,
    };
  }

  webView = {
    canGoBack: false,
    ref: null,
    rName: '',
  }

  onWebviewMessage = (e) => {
    //console.log(e.nativeEvent.data);
    if(e.nativeEvent.data == 'complete!') {
      console.log('end');
      this.setState({ type: 0 }); //원상복구
    } else {
      console.log('start');
      this.webView.rName = e.nativeEvent.data;
      console.log(this.webView.rName);
      this.setState({ type: 1 });
    }
  };

  onAndroidBackPress = () => {
    if (this.webView.canGoBack && this.webView.ref) {
      this.webView.ref.goBack();
      return true;
    }
    return false;
  }

  componentDidMount() {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
    }
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress');
    }
  }

  render() {
    if (this.state.type == 0) {
      return (
        <WebView
          source={{ uri: "https://bluetoothcounter.allsilver921.repl.co" }}
          onMessage={this.onWebviewMessage}
          javaScriptEnabled={true}
          ref={(webView) => { this.webView.ref = webView; }}
          onNavigationStateChange={(navState) => { this.webView.canGoBack = navState.canGoBack; }}
        />
      );
    } else if (this.state.type == 1) {
      return (
        //일단 여기서는 뒤로 가기 막아놓고, 인증하기 취소 버튼 추가해서... 아 개 복잡하누
        //일단 이 페이지는 블루투스 연결하고... 인증하는 페이지임.
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>여기가 바로 낙원이여</Text>
          <Button
            title="낙원으로 가기"
            onPress={() => this.setState({ type: 2 })}
          />
        </View>
      );
    } else if (this.state.type == 2) {
      return (
        <WebView
          source={{ uri: "https://bluetoothcounter.allsilver921.repl.co/validate.html?roomName=" + this.webView.rName }}
          onMessage={this.onWebviewMessage}
          javaScriptEnabled={true}
          ref={(webView) => { this.webView.ref = webView; }}
          onNavigationStateChange={(navState) => { this.webView.canGoBack = navState.canGoBack; }} 
        />
      );
    }
  }
}


function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title="웹뷰로 가기"
        onPress={() => navigation.navigate('Webview')}
      />
    </View>
  );
}

function WebviewScreen({}) {
  return (
    <MyWebComponent></MyWebComponent>
  );
}

const Stack = createStackNavigator();

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showRealApp: false,
      //To show the main page of the app
    };
  }
  _onDone = () => {
    this.setState({ showRealApp: true });
  };
  _onSkip = () => {
    this.setState({ showRealApp: true });
  };
  _renderItem = ({ item }) => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: item.backgroundColor,
          alignItems: 'center',
          justifyContent: 'space-around',
          paddingBottom: 100
        }}>
        <Text style={styles.title}>{item.title}</Text>
        <Image style={styles.image} source={item.image} />
        <Text style={styles.text}>{item.text}</Text>
      </View>
    );
  };
  render() {
    //If false show the Intro Slides
    if (this.state.showRealApp) {
      //Real Application
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Webview" component={WebviewScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      );
    } else {
      //Intro slides
      return (
        <AppIntroSlider
          data={slides}
          renderItem={this._renderItem}
          onDone={this._onDone}
          showSkipButton={true}
          onSkip={this._onSkip}
        />
      );
    }
  }
}
const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
  },
  text: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    paddingVertical: 30,
  },
  title: {
    fontSize: 25,
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
  },
});

const slides = [
  {
    key: 's1',
    text: '당신의 삶을 바꿀\n긍정적인 습관 한 가지를 만들어 봅시다.',
    title: '핏투게더와 함께',
    image: {
      uri:
        'introimage/1.png',
    },
    backgroundColor: '#3d8dd3',
  },
  {
    key: 's2',
    title: '',
    text: '친구들과 함께 운동 목표와 내기를 설정하고\n서로를 감시하며 하루하루 열심히 운동합시다.',
    image: {
      uri:
        'introimage/2.png',
    },
    backgroundColor: '#3d8dd3',
  },
  {
    key: 's3',
    title: '',
    text: '내기에서 이기기 위해 꾸준히 노력하다 보면\n어느새 규칙적으로 운동하는 자신을 발견할 수 있을 거예요.',
    image: {
      uri: 'introimage/3.png',
    },
    backgroundColor: '#3d8dd3',
  },
  {
    key: 's4',
    title: '하지만 기억하세요.',
    text: '핏투게더는 당신을 도울 뿐\n이 멋진 습관을 실현하는 것은 여러분이라는 것을!',
    image: {
      uri: 'introimage/4.png',
    },
    backgroundColor: '#3d8dd3',
  },
  {
    key: 's5',
    title: '',
    text: '핏투게더를 본격적으로 시작하기 전에\n[이용 가이드] 를 반드시 확인해 주세요!',
    image: {
      uri:
        'introimage/5.png',
    },
    backgroundColor: '#3d8dd3',
  },
  {
    key: 's6',
    title: '',
    text: '그럼 이제,\n당신의 삶을 바꾸러 가볼까요?',
    image: {
      uri:
        '',
    },
    backgroundColor: '#3d8dd3',
  },
];

/*
import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  View,
  TouchableHighlight,
  NativeAppEventEmitter,
  Platform,
  PermissionsAndroid
} from 'react-native';
import BleManager from 'react-native-ble-connect';

export default class BleExample extends Component {

    constructor(){
        super()

        this.state = {
            ble:null,
            scanning:false,
        }
    }

    componentDidMount() {
        BleManager.start({showAlert: false});
        this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);

        NativeAppEventEmitter
            .addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral );
            
        if (Platform.OS === 'android' && Platform.Version >= 23) {
            PermissionsAndroid.checkPermission(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                if (result) {
                  console.log("Permission is OK");
                } else {
                  PermissionsAndroid.requestPermission(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                    if (result) {
                      console.log("User accept");
                    } else {
                      console.log("User refuse");
                    }
                  });
                }
          });
        }
    }

    handleScan() {
        BleManager.scan([], 30, true)
            .then((results) => {console.log('Scanning...'); });
    }

    toggleScanning(bool){
        if (bool) {
            this.setState({scanning:true})
            this.scanning = setInterval( ()=> this.handleScan(), 3000);
        } else{
            this.setState({scanning:false, ble: null})
            clearInterval(this.scanning);
        }
    }

    handleDiscoverPeripheral(data){
        console.log('Got ble data', data);
        this.setState({ ble: data })
    }

    render() {

        const container = {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#F5FCFF',
        }

        const bleList = this.state.ble
            ? <Text> Device found: {this.state.ble.name} </Text>
            : <Text>no devices nearby</Text>

        return (
            <View style={container}>
                <TouchableHighlight style={{padding:20, backgroundColor:'#ccc'}} onPress={() => this.toggleScanning(!this.state.scanning) }>
                    <Text>Scan Bluetooth ({this.state.scanning ? 'on' : 'off'})</Text>
                </TouchableHighlight>

                {bleList}
            </View>
        );
    }
}

AppRegistry.registerComponent('BleExample', () => BleExample);

//여기 그게 없네 특정 클레스 런치시키는거!
*/
/*
import React, { Component } from 'react';
import { Platform, View, Text } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

export default class SensorsComponent extends Component {

  constructor() {
    super()
    this.manager = new BleManager()
    this.state = {info: "", values: {}}
    this.prefixUUID = "f000aa"
    this.suffixUUID = "-0451-4000-b000-000000000000"
    this.sensors = {
      0: "Temperature",
      1: "Accelerometer",
      2: "Humidity",
      3: "Magnetometer",
      4: "Barometer",
      5: "Gyroscope"
    }
  }

  serviceUUID(num) {
    return this.prefixUUID + num + "0" + this.suffixUUID
  }

  notifyUUID(num) {
    return this.prefixUUID + num + "1" + this.suffixUUID
  }

  writeUUID(num) {
    return this.prefixUUID + num + "2" + this.suffixUUID
  }

  info(message) {
    this.setState({info: message})
  }

  error(message) {
    this.setState({info: "ERROR: " + message})
  }

  updateValue(key, value) {
    this.setState({values: {...this.state.values, [key]: value}})
  }

  componentWillMount() {
    if (Platform.OS === 'ios') {
      this.manager.onStateChange((state) => {
        if (state === 'PoweredOn') this.scanAndConnect()
      })
    } else {
      this.scanAndConnect()
    }
  }

  scanAndConnect() {
    this.manager.startDeviceScan(null,
                                 null, (error, device) => {
      this.info("Scanning...")
      console.log(device)

      if (error) {
        this.error(error.message)
        return
      }

      if (device.name === 'TI BLE Sensor Tag' || device.name === 'SensorTag') {
        this.info("Connecting to TI Sensor")
        this.manager.stopDeviceScan()
        device.connect()
          .then((device) => {
            this.info("Discovering services and characteristics")
            return device.discoverAllServicesAndCharacteristics()
          })
          .then((device) => {
            this.info("Setting notifications")
            return this.setupNotifications(device)
          })
          .then(() => {
            this.info("Listening...")
          }, (error) => {
            this.error(error.message)
          })
      }
    });
  }

  async setupNotifications(device) {
    for (const id in this.sensors) {
      const service = this.serviceUUID(id)
      const characteristicW = this.writeUUID(id)
      const characteristicN = this.notifyUUID(id)

      const characteristic = await device.writeCharacteristicWithResponseForService(
        service, characteristicW, "AQ==" 
      )
      device.monitorCharacteristicForService(service, characteristicN, (error, characteristic) => {
        if (error) {
          this.error(error.message)
          return
        }
        this.updateValue(characteristic.uuid, characteristic.value)
      })
    }
  }

  render() {
    return (
      <View>
        <Text>{this.state.info}</Text>
        {Object.keys(this.sensors).map((key) => {
          return <Text key={key}>
                   {this.sensors[key] + ": " + (this.state.values[this.notifyUUID(key)] || "-")}
                 </Text>
        })}
      </View>
    )
  }
}
*/