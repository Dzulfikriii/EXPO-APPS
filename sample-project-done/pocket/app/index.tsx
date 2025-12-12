import AntDesign from "@expo/vector-icons/AntDesign";
import { Link } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { COLORS } from "../utils/Colors";

// return Redirect({ href: "/(tabs)/explore" });

import { useSSO } from "@clerk/clerk-expo";
import { OAuthStrategy } from "@clerk/types";

const Page = () => {
    const { startSSOFlow } = useSSO();

  const openLink = (url: string) => {
    WebBrowser.openBrowserAsync(url);
  };

  const handleSocialLogin = async (provider: string) => {
    try {
        const { createdSessionId, setActive } = await startSSOFlow({ 
            strategy: provider as OAuthStrategy,
         });

         if (createdSessionId) {
            setActive?.({ 
                session: createdSessionId,
                navigate: async ({session}) => {
                    //await navigate("/(tabs)/explore");
                    console.log("Navigating to explore");
                }
            });
         } else {
            // console.error("SSO flow failed");
         }
    } catch (error) {
        console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container} keyboardVerticalOffset={100}>
      <View style={styles.header}>
        <View style={styles.logo}>
            <Image source={require("../assets/images/icon.png")} style={styles.logoIcon} />
        </View>
        <Text style={styles.title}>Log In</Text>
      </View>

      <View style={styles.buttonSection}>
        <TouchableOpacity style={styles.button} onPress={() => handleSocialLogin("apple")}>
          <AntDesign name="apple" size={24} color={'#000'} />
          <Text style={styles.buttonText}>Continue with Apple</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => handleSocialLogin("oauth_google")}>
          <AntDesign name="google" size={24} color={'#000'} />
          <Text style={styles.buttonText}>Continue with Google</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={{ fontSize: 16, color: COLORS.textLight }}> OR </Text>
        <View style={styles.line} />
      </View>

      <View style={styles.emailSection}>
        <TextInput style={styles.emailInput} placeholder="Email" />
        <TouchableOpacity style={styles.nextButton}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>

        <Link href="/(tabs)/home" style={{ marginTop: 16 }} replace asChild>
            <TouchableOpacity style={{ marginTop: 16, alignItems: "center" }}>
                <Text style={{ color: COLORS.secondary, fontWeight: "bold" }}>Skip for now</Text>
            </TouchableOpacity>
        </Link>
      </View>

        <View style={styles.footer}>
          <Text style={styles.termText}>By continuing, you agree to our <Text onPress={() => openLink("https://www.pocket.co/terms")} style={styles.link}>Terms of Service</Text> and <Text onPress={() => openLink("https://www.pocket.co/privacy")} style={styles.link}>Privacy Policy</Text>.</Text>
        </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingTop: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 30,
  },
  logoIcon: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.textDark,
  },
  button: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 24,
    borderColor: COLORS.border,
  },
  buttonText: {
    fontSize: 16,
  },
  buttonSection: {
    gap: 12,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
    gap: 8,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  emailSection: {
    marginBottom: 30,
  },
  emailInput: {
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderColor: COLORS.primary,
    marginBottom: 16,
  },
  nextButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  nextButtonText: {
    fontSize: 16,
    color: COLORS.white,
  },
  footer: {
    marginTop: 20,
  },
  termText: {
    fontSize: 12,
    color: COLORS.textGray,
    textAlign: "center",
    lineHeight: 18,
  },
  link: {
    fontSize: 14,
    color: COLORS.primary,
    textDecorationLine: "underline",
  },
});

export default Page;
