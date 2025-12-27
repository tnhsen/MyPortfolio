import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Dimensions, FlatList, TouchableOpacity, Linking, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// --- จุดที่แก้ไข: รับ onScroll เข้ามาใน Props ---
export default function DetailScreen({ route, onScroll }) {
  const { project } = route.params;
  const [win, setWin] = useState(Dimensions.get('window'));
  const [idx, setIdx] = useState(0);
  const isMobile = win.width < 768;
  const flatRef = useRef(null);

  const isLive = project.isDeployed;
  const visitScale = useRef(new Animated.Value(1)).current;
  const githubScale = useRef(new Animated.Value(1)).current;

  const handleVisitHover = (toValue) => {
    Animated.spring(visitScale, { toValue, useNativeDriver: true, bounciness: 10 }).start();
  };

  const handleGithubHover = (toValue) => {
    Animated.spring(githubScale, { toValue, useNativeDriver: true, bounciness: 10 }).start();
  };

  useEffect(() => {
    const sub = Dimensions.addEventListener('change', ({ window }) => setWin(window));
    const interval = setInterval(() => {
      if (project.images && project.images.length > 1) {
        let next = (idx + 1) >= project.images.length ? 0 : idx + 1;
        flatRef.current?.scrollToOffset({ offset: next * (isMobile ? win.width - 40 : 800), animated: true });
        setIdx(next);
      }
    }, 3500);
    return () => { sub?.remove(); clearInterval(interval); };
  }, [idx, win.width]);

  const imgW = isMobile ? win.width - 40 : 800;

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={{ paddingTop: 130, paddingBottom: 80 }}
      // --- จุดที่แก้ไข: เชื่อมต่อ scroll event ---
      onScroll={onScroll}
      scrollEventThrottle={16}
    >
      <View style={{ alignItems: 'center' }}>
        <View style={[styles.imgContainer, { width: imgW }]}>
          <FlatList 
            ref={flatRef} 
            data={project.images} 
            horizontal 
            pagingEnabled 
            showsHorizontalScrollIndicator={false} 
            snapToInterval={imgW} 
            decelerationRate="fast" 
            renderItem={({ item }) => <Image source={item} style={{ width: imgW, height: isMobile ? 220 : 450, resizeMode: 'cover' }} />}
          />
        </View>
        <View style={styles.dotRow}>{project.images.map((_, i) => <View key={i} style={[styles.dot, idx === i && styles.dotA]} />)}</View>
      </View>

      <View style={[styles.body, { maxWidth: imgW, alignSelf: 'center' }]}>
        <View style={styles.statusRow}>
          <View style={styles.statusBadge}>
            <View style={[styles.statusDot, { backgroundColor: isLive ? '#22C55E' : '#64748B' }]} />
            <Text style={[styles.statusText, { color: isLive ? '#22C55E' : '#64748B' }]}>{isLive ? 'Live Project' : 'Offline / Local'}</Text>
          </View>
          <Animated.View style={{ transform: [{ scale: visitScale }] }} onMouseEnter={() => isLive && handleVisitHover(1.08)} onMouseLeave={() => isLive && handleVisitHover(1)}>
            <TouchableOpacity style={[styles.visitBtn, !isLive && styles.visitBtnDisabled]} onPress={() => isLive && Linking.openURL(project.visitLink)} disabled={!isLive} activeOpacity={0.8}>
              <MaterialCommunityIcons name="earth" size={18} color="#fff" />
              <Text style={styles.visitBtnText}>Visit Site</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <View style={styles.headerRow}>
          <Text style={[styles.title, { fontSize: isMobile ? 28 : 36, flex: 1 }]}>{project.title}</Text>
          <Animated.View style={{ transform: [{ scale: githubScale }] }} onMouseEnter={() => handleGithubHover(1.08)} onMouseLeave={() => handleGithubHover(1)}>
            <TouchableOpacity style={styles.githubBtn} onPress={() => Linking.openURL(project.link)} activeOpacity={0.8}>
              <MaterialCommunityIcons name="github" size={20} color="#fff" />
              {!isMobile && <Text style={styles.githubBtnText}>View Code</Text>}
            </TouchableOpacity>
          </Animated.View>
        </View>

        <View style={styles.roleBox}>
          <MaterialCommunityIcons name="account-circle" size={24} color="#38BDF8" />
          <View style={{marginLeft:15}}>
            <Text style={{color:'#94A3B8', fontSize:12}}>ROLE</Text>
            <Text style={styles.roleT}>{project.role}</Text>
          </View>
        </View>
        
        <Text style={styles.subT}>Technologies</Text>
        <View style={styles.techRow}>{project.technologies.map(t => <View key={t} style={styles.badge}><Text style={styles.badgeT}>{t}</Text></View>)}</View>

        <Text style={styles.subT}>Description</Text>
        <Text style={styles.desc}>{project.desc}</Text>

        <View style={styles.learnBox}>
          <Text style={styles.learnT}>Key Learnings</Text>
          {project.learnings.map((l, i) => <Text key={i} style={styles.lItem}>• {l}</Text>)}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#0F172A' },
  imgContainer: { aspectRatio: 16/9, borderRadius: 20, overflow: 'hidden', backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#334155' },
  dotRow: { flexDirection: 'row', marginTop: 15 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#334155', marginHorizontal: 5 },
  dotA: { backgroundColor: '#38BDF8', width: 20 },
  body: { padding: 25, width: '100%' },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  statusText: { fontSize: 12, fontFamily: 'Kanit-Bold', textTransform: 'uppercase' },
  visitBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#38BDF8', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, gap: 8 },
  visitBtnDisabled: { backgroundColor: '#334155', opacity: 0.5 },
  visitBtnText: { color: '#fff', fontFamily: 'Kanit-Bold', fontSize: 14 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  title: { color: '#fff', fontFamily: 'Kanit-Bold' },
  githubBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#334155', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: '#475569' },
  githubBtnText: { color: '#fff', fontFamily: 'Kanit-Bold', marginLeft: 8, fontSize: 14 },
  roleBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', padding: 20, borderRadius: 15, marginVertical: 20 },
  roleT: { color: '#fff', fontFamily: 'Kanit-Bold', fontSize: 16 },
  subT: { color: '#38BDF8', fontSize: 20, fontFamily: 'Kanit-Bold', marginBottom: 15 },
  techRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 30 },
  badge: { backgroundColor: 'rgba(56,189,248,0.1)', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: '#38BDF8' },
  badgeT: { color: '#38BDF8', fontSize: 14, fontFamily: 'Kanit-Bold' },
  desc: { color: '#94A3B8', fontSize: 18, lineHeight: 28, marginBottom: 35, fontFamily: 'Kanit-Regular' },
  learnBox: { backgroundColor: '#1E293B', padding: 25, borderRadius: 20, borderLeftWidth: 5, borderLeftColor: '#38BDF8' },
  learnT: { color: '#fff', fontSize: 22, marginBottom: 15, fontFamily: 'Kanit-Bold' },
  lItem: { color: '#CBD5E1', fontSize: 16, marginBottom: 8, fontFamily: 'Kanit-Regular' }
});