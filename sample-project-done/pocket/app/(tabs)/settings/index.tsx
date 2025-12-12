import { COLORS } from '@/utils/Colors';
import { useAuth, useUser } from '@clerk/clerk-expo';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

// Stub implementations to avoid build errors – replace with real paywall utils when available
const isUsePremium = async () => false;
const presentPaywall = () => console.warn('presentPaywall not implemented');
// react-native-legal is not installed; stubbing the import to avoid build errors
const ReactNativeLegal = {
  launchLicenseListScreen: (title: string) => {
    console.warn('react-native-legal not available – license list screen not shown');
  },
};

export default function SettingsScreen() {
  const [alwaysOpenOriginal, setAlwaysOpenOriginal] = useState(false);
  const { isSignedIn, signOut } = useAuth();
  const [isPro, setIsPro] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    isUsePremium().then(setIsPro);
  }, []);

  const openLink = () => {
    WebBrowser.openBrowserAsync('https://galaxies.dev');
  };

  const launchNotice = () => {
    console.log('launchNotice');
    ReactNativeLegal.launchLicenseListScreen('OSS Notice');
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic">
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your account</Text>
        {user && <Text style={styles.subTitle}>email: {user.emailAddresses[0].emailAddress}</Text>}
        <View style={styles.listContainer}>
          {!isSignedIn && (
            <Link href="/" replace asChild>
              <TouchableOpacity style={styles.listItem}>
                <Text style={[styles.itemText, { fontWeight: '600' }]}>Sign up or sign in</Text>
                <Ionicons name="person-outline" size={22} color={COLORS.textDark} />
              </TouchableOpacity>
            </Link>
          )}
          {isSignedIn && (
            <>
              {!isPro && (
                <>
                  <TouchableOpacity style={styles.listItem} onPress={presentPaywall}>
                    <Ionicons name="diamond-outline" size={22} color={COLORS.textDark} />
                    <Text style={[styles.itemText, { flex: 1, marginLeft: 16 }]}>Go premium</Text>
                    <Ionicons name="chevron-forward" size={22} color={COLORS.textDark} />
                  </TouchableOpacity>
                  <View style={styles.divider} />
                </>
              )}
              <TouchableOpacity style={styles.listItem} onPress={() => signOut()}>
                <Text style={[styles.itemText, { fontWeight: '600', color: COLORS.red }]}>
                  Log out
                </Text>
                <Ionicons name="log-out-outline" size={22} color={COLORS.red} />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App customization</Text>
        <View style={styles.listContainer}>
          <View style={styles.listItem}>
            <Text style={styles.itemText}>Always open original view</Text>
            <Switch value={alwaysOpenOriginal} onValueChange={setAlwaysOpenOriginal} />
          </View>
          <View style={styles.divider} />
          {/* <Link href="/settings/icon" asChild>
            <TouchableOpacity style={styles.listItem}>
              <Text style={styles.itemText}>App Icon</Text>
              <Ionicons name="chevron-forward" size={22} color={COLORS.textDark} />
            </TouchableOpacity>
          </Link> */}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About & support</Text>
        <View style={styles.listContainer}>
          <TouchableOpacity style={styles.listItem} onPress={openLink}>
            <Text style={styles.itemText}>Get help and support</Text>
            <Ionicons name="help-circle-outline" size={22} color={COLORS.textDark} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.listItem} onPress={openLink}>
            <Text style={styles.itemText}>Terms of service</Text>
            <Ionicons name="document-text-outline" size={22} color={COLORS.textDark} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.listItem} onPress={openLink}>
            <Text style={styles.itemText}>Privacy policy</Text>
            <Ionicons name="document-text-outline" size={22} color={COLORS.textDark} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.listItem} onPress={launchNotice}>
            <Text style={styles.itemText}>Open source licenses</Text>
            <Ionicons name="document-text-outline" size={22} color={COLORS.textDark} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.versionInfo}>
        <Text style={styles.versionText}>Pocket for iOS 8.26.0 (27550)</Text>
        <Text style={styles.thankYouText}>Thank you for using Pocket</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 8,
    marginLeft: 16,
  },
  subTitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 8,
    marginLeft: 16,
  },
  listContainer: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.itemBackground,
    minHeight: 44,
  },
  itemText: {
    fontSize: 16,
    color: COLORS.textDark,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#C6C6C8',
    marginLeft: 16,
  },
  versionInfo: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  versionText: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  thankYouText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
});