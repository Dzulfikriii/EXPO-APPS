import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { COLORS } from "../../utils/Colors";

export default function RootLayout() {
  return (
    <NativeTabs blurEffect="systemChromeMaterial" tintColor={COLORS.textDark}>
      <NativeTabs.Trigger name="home">  
        <Label>Homes</Label>
        <Icon sf={{default: "house", selected: "house.fill" }} /> drawable="home_drawable"
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="saves">
        <Label>Saves</Label>
        <Icon sf={{default: "heart", selected: "heart.fill" }} /> drawable="saves_drawable"
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <Label>Settings</Label>
        <Icon sf={{default: "gearshape", selected: "gearshape.fill" }} /> drawable="settings_drawable"
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
