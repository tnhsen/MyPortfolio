import 'react-native-gesture-handler';
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Kanit_400Regular, Kanit_700Bold } from '@expo-google-fonts/kanit';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PROJECTS } from './data';
import HomeScreen from './screens/HomeScreen';
import DetailScreen from './screens/DetailScreen';

const Stack = createStackNavigator();
const navigationRef = createNavigationContainerRef();
SplashScreen.preventAutoHideAsync();

const NavHoverButton = ({ children, onPress, isActive, style }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.8)).current;

  const handleHoverIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1.1, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 200, useNativeDriver: true })
    ]).start();
  };

  const handleHoverOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 0.8, duration: 200, useNativeDriver: true })
    ]).start();
  };

  return (
    <Animated.View 
      style={[{ transform: [{ scale: scaleAnim }], opacity: isActive ? 1 : opacityAnim }, style]}
      onMouseEnter={handleHoverIn} 
      onMouseLeave={handleHoverOut}
    >
      <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={style?.flexDirection === 'row' ? {flexDirection: 'row', alignItems: 'center'} : {}}>
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};

const DropdownHoverItem = ({ item, onPress }) => {
  const bgAnim = useRef(new Animated.Value(0)).current;
  const handleHoverIn = () => Animated.timing(bgAnim, { toValue: 1, duration: 200, useNativeDriver: false }).start();
  const handleHoverOut = () => Animated.timing(bgAnim, { toValue: 0, duration: 200, useNativeDriver: false }).start();
  const backgroundColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#1E293B', '#334155'] 
  });

  return (
    <TouchableOpacity onPress={onPress} onMouseEnter={handleHoverIn} onMouseLeave={handleHoverOut}>
      <Animated.View style={[styles.dropdownItem, { backgroundColor }]}>
        <Text style={styles.dropdownItemText}>{item.title}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default function App() {
  const [isShrunk, setIsShrunk] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentRoute, setCurrentRoute] = useState('Home');
  const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);
  const isMobile = windowWidth < 768;

  let [fontsLoaded] = useFonts({ 'Kanit-Regular': Kanit_400Regular, 'Kanit-Bold': Kanit_700Bold });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
    const sub = Dimensions.addEventListener('change', ({ window }) => setWindowWidth(window.width));
    return () => sub?.remove();
  }, [fontsLoaded]);

  useEffect(() => {
    setIsShrunk(false);
    setShowDropdown(false);
  }, [currentRoute]);

  if (!fontsLoaded) return null;

  return (
    <View style={styles.appContainer}>
      <NavigationContainer ref={navigationRef} onStateChange={() => setCurrentRoute(navigationRef.getCurrentRoute()?.name)}>
        <View style={[styles.navbar, isShrunk && styles.navbarShrunk, { paddingHorizontal: isMobile ? 20 : 60 }]}>
          <View style={styles.navLeft}>
            {currentRoute === 'Detail' ? (
              <NavHoverButton onPress={() => navigationRef.goBack()} style={styles.backBtnNav}>
                <MaterialCommunityIcons name="arrow-left" size={24} color="#38BDF8" />
                <Text style={styles.backTextNav}>Back</Text>
              </NavHoverButton>
            ) : (
              <Text style={[styles.logo, isShrunk && styles.logoShrunk]}>{isMobile ? '<TP />' : '<TECHPORTFOLIO />'}</Text>
            )}
          </View>
          
          <View style={styles.navLinks}>
            <NavHoverButton onPress={() => navigationRef.navigate('Home')} isActive={currentRoute === 'Home'} style={{ marginLeft: isMobile ? 15 : 35 }}>
              <Text style={currentRoute === 'Home' ? styles.navTextActive : styles.navText}>Home</Text>
            </NavHoverButton>

            <View>
              <NavHoverButton onPress={() => setShowDropdown(!showDropdown)} style={{ marginLeft: isMobile ? 15 : 35 }}>
                <Text style={styles.navText}>Projects {isMobile ? '' : '▾'}</Text>
              </NavHoverButton>
              {showDropdown && (
                <View style={[styles.dropdown, { right: isMobile ? -20 : 0 }]}>
                  {PROJECTS.map((item) => (
                    <DropdownHoverItem key={item.id} item={item} onPress={() => { navigationRef.navigate('Detail', { project: item }); }} />
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>

        <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { flex: 1, backgroundColor: '#0F172A' } }}>
          <Stack.Screen name="Home">
            {(props) => <HomeScreen {...props} onScroll={(e) => setIsShrunk(e.nativeEvent.contentOffset.y > 50)} />}
          </Stack.Screen>
          <Stack.Screen name="Detail">
            {(props) => <DetailScreen {...props} onScroll={(e) => setIsShrunk(e.nativeEvent.contentOffset.y > 50)} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: { flex: 1, backgroundColor: '#0F172A' },
  navbar: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 35, alignItems: 'center', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999, transition: '0.4s' },
  navbarShrunk: { paddingVertical: 15, backgroundColor: 'rgba(15, 23, 42, 0.95)', borderBottomWidth: 1, borderBottomColor: '#1E293B' },
  navLeft: { flexDirection: 'row', alignItems: 'center' },
  logo: { color: '#fff', fontWeight: 'bold', fontSize: 22, fontFamily: 'Kanit-Bold' },
  logoShrunk: { fontSize: 18 },
  backBtnNav: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  backTextNav: { color: '#38BDF8', marginLeft: 8, fontFamily: 'Kanit-Bold', fontSize: 16 },
  navLinks: { flexDirection: 'row', alignItems: 'center' },
  navText: { color: '#94A3B8', fontFamily: 'Kanit-Regular', fontSize: 16 },
  navTextActive: { color: '#38BDF8', fontFamily: 'Kanit-Bold', fontSize: 16 },
  dropdown: { position: 'absolute', top: 40, backgroundColor: '#1E293B', borderRadius: 10, minWidth: 200, paddingVertical: 5, borderWidth: 1, borderColor: '#334155', overflow: 'hidden' },
  dropdownItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#0F172A' },
  dropdownItemText: { color: '#CBD5E1', fontFamily: 'Kanit-Regular', fontSize: 14 }
});