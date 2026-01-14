import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  FlatList,
  Linking,
  Animated,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { PROFILE, SKILL_GROUPS, PROJECTS, SOFT_SKILLS } from "../data";

const ProjectCard = ({ item, CARD_W, GAP, navigation }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const handleHoverIn = () => {
    Animated.spring(scaleAnim, { toValue: 1.05, useNativeDriver: true }).start();
  };
  const handleHoverOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <Animated.View
      style={{ transform: [{ scale: scaleAnim }], width: CARD_W, marginRight: GAP }}
      onMouseEnter={handleHoverIn}
      onMouseLeave={handleHoverOut}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.pCard}
        onPress={() => navigation.navigate("Detail", { project: item })}
      >
        <View style={styles.pImgWrap}><Image source={item.images[0]} style={styles.pImg} /></View>
        <View style={{ padding: 15 }}>
          <Text style={styles.pTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.pStack}>{item.stack}</Text>
          <Text style={styles.pDescShort} numberOfLines={2}>{item.desc}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function HomeScreen({ navigation, onScroll }) {
  const [win, setWin] = useState(Dimensions.get("window"));
  const isMobile = win.width < 768;
  const flatRef = useRef(null);
  const [idx, setIdx] = useState(0);

  const resumeScale = useRef(new Animated.Value(1)).current;
  const handleResumeHoverIn = () => {
    Animated.spring(resumeScale, { toValue: 1.08, useNativeDriver: true }).start();
  };
  const handleResumeHoverOut = () => {
    Animated.spring(resumeScale, { toValue: 1, useNativeDriver: true }).start();
  };

  useEffect(() => {
    const sub = Dimensions.addEventListener("change", ({ window }) => setWin(window));
    return () => sub?.remove();
  }, []);

  const GAP = 15;
  const CARD_W = isMobile ? win.width * 0.75 : (win.width - 240) / 3;

  useEffect(() => {
    if (PROJECTS && PROJECTS.length > 1) {
      const interval = setInterval(() => {
        let next = idx + 1 >= PROJECTS.length ? 0 : idx + 1;
        flatRef.current?.scrollToOffset({ offset: next * (CARD_W + GAP), animated: true });
        setIdx(next);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [idx, CARD_W]);

  const handleProjectScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / (CARD_W + GAP));
    if (index !== idx && index >= 0 && index < PROJECTS.length) {
      setIdx(index);
    }
  };

  const handleDotPress = (index) => {
    setIdx(index);
    flatRef.current?.scrollToOffset({
      offset: index * (CARD_W + GAP),
      animated: true,
    });
  };

  const downloadResume = () => { Linking.openURL(PROFILE.resume_url); };

  if (!PROFILE || !PROJECTS) return null;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.scrollContent, { paddingTop: isMobile ? 100 : 140 }]}
      onScroll={onScroll}
      scrollEventThrottle={16}
    >
      <View style={[styles.hero, !isMobile && styles.heroWeb]}>
        <View style={[styles.heroText, isMobile && { alignItems: "center" }]}>
          <Text style={styles.greeting}>{PROFILE.greeting}</Text>
          <Text style={[styles.name, { fontSize: isMobile ? 38 : 72 }]}>{PROFILE.name}</Text>
          <Text style={styles.role}>{PROFILE.role}</Text>
          <Text style={[styles.desc, { textAlign: isMobile ? "center" : "left" }]}>{PROFILE.description}</Text>
          
          <Animated.View
            style={{ transform: [{ scale: resumeScale }], alignSelf: isMobile ? "center" : "flex-start" }}
            onMouseEnter={handleResumeHoverIn}
            onMouseLeave={handleResumeHoverOut}
          >
            <TouchableOpacity style={styles.resumeBtn} onPress={downloadResume} activeOpacity={0.8}>
              <MaterialCommunityIcons name="file-pdf-box" size={24} color="#fff" />
              <Text style={styles.resumeBtnText}>Get Resume</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <Image
          source={PROFILE.image}
          style={{
            width: isMobile ? 200 : 350,
            height: isMobile ? 200 : 350,
            borderRadius: isMobile ? 100 : 175,
            resizeMode: "cover",
            borderWidth: 3,
            borderColor: "#38BDF8",
            marginTop: isMobile ? 20 : 0,
          }}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Technical Skills</Text>
        <View style={{ flexDirection: isMobile ? "column" : "row", gap: 15 }}>
          {SKILL_GROUPS?.map((g, i) => (
            <View key={i} style={styles.skillCard}>
              <Text style={styles.skillT}>{g.title}</Text>
              <View style={styles.tagWrap}>
                {g.skills.map((s) => (
                  <View key={s.name} style={styles.tag}>
                    <MaterialCommunityIcons name={s.icon === "microsoft-dot-net" ? "dot-net" : s.icon} size={14} color="#38BDF8" />
                    <Text style={styles.tagT}>{s.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Soft Skills</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 15 }}>
          {SOFT_SKILLS?.map((item) => (
            <View key={item.id} style={[styles.softCard, { width: isMobile ? "100%" : "calc(50% - 8px)" }]}>
              <MaterialCommunityIcons name={item.icon} size={28} color="#38BDF8" />
              <View style={{ flex: 1, marginLeft: 15 }}>
                <Text style={styles.softT}>{item.title}</Text>
                <Text style={styles.softD}>{item.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.projectHeader}>
          <Text style={styles.sectionTitle}>Projects</Text>
          <View style={styles.dotRow}>
            {PROJECTS.map((_, i) => (
              <TouchableOpacity 
                key={i} 
                onPress={() => handleDotPress(i)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <View style={[styles.dot, idx === i && styles.dotActive]} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <FlatList
          ref={flatRef} 
          data={PROJECTS} 
          horizontal 
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_W + GAP} 
          decelerationRate="fast" 
          onScroll={handleProjectScroll} 
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingHorizontal: isMobile ? 25 : 100 }}
          renderItem={({ item }) => (<ProjectCard item={item} CARD_W={CARD_W} GAP={GAP} navigation={navigation} />)}
        />
      </View>
      <View style={{ height: 120 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A" },
  scrollContent: { flexGrow: 1, paddingBottom: 50 },
  hero: { padding: 25, alignItems: "center" },
  heroWeb: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 100 },
  heroText: { flex: 1.2 },
  greeting: { color: "#38BDF8", fontSize: 20, fontFamily: "Kanit-Bold" },
  name: { color: "#fff", fontFamily: "Kanit-Bold", marginVertical: 8 },
  role: { fontSize: 18, color: "#94A3B8", fontFamily: "Kanit-Regular" },
  desc: { color: "#CBD5E1", fontSize: 16, marginTop: 15, maxWidth: 600, fontFamily: "Kanit-Regular", lineHeight: 24 },
  section: { marginTop: 60, paddingHorizontal: 25 },
  sectionTitle: { fontSize: 28, color: "#fff", fontFamily: "Kanit-Bold", marginBottom: 20 },
  skillCard: { flex: 1, backgroundColor: "#1E293B", padding: 20, borderRadius: 15, borderTopWidth: 3, borderTopColor: "#38BDF8" },
  skillT: { color: "#fff", fontSize: 18, marginBottom: 15, fontFamily: "Kanit-Bold" },
  tagWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: { backgroundColor: "#334155", padding: 8, borderRadius: 8, flexDirection: "row", alignItems: "center" },
  tagT: { color: "#fff", fontSize: 13, marginLeft: 6 },
  softCard: { flexDirection: "row", backgroundColor: "#1E293B", padding: 20, borderRadius: 15, alignItems: "center", borderWidth: 1, borderColor: "#334155" },
  softT: { color: "#fff", fontSize: 18, fontFamily: "Kanit-Bold" },
  softD: { color: "#94A3B8", fontSize: 14, fontFamily: "Kanit-Regular" },
  projectHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  dotRow: { flexDirection: "row", alignItems: "center" },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#334155", marginLeft: 8 },
  dotActive: { backgroundColor: "#38BDF8", width: 22 },
  pCard: { backgroundColor: "#1E293B", borderRadius: 16, overflow: "hidden", borderWidth: 1, borderColor: "#334155" },
  pImgWrap: { width: "100%", aspectRatio: 16 / 9 },
  pImg: { width: "100%", height: "100%", resizeMode: "cover" },
  pTitle: { color: "#fff", fontFamily: "Kanit-Bold", fontSize: 18, marginBottom: 2 },
  pStack: { color: "#38BDF8", fontSize: 12, fontFamily: "Kanit-Regular", marginBottom: 8 },
  pDescShort: { color: "#94A3B8", fontSize: 13, fontFamily: "Kanit-Regular", lineHeight: 18 },
  resumeBtn: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#38BDF8",
    paddingHorizontal: 20, paddingVertical: 10, borderRadius: 30, marginTop: 25,
    width: "fit-content",
    shadowColor: "#38BDF8", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
  },
  resumeBtnText: { color: "#fff", fontFamily: "Kanit-Bold", fontSize: 15, marginLeft: 10 },
});