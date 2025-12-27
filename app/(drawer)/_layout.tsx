import { Sidebar } from '@/components/Sidebar';
import { Icon, MenuIcon } from '@/components/ui/icon';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { useColorScheme } from 'nativewind';
import { Pressable } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function DrawerLayout() {
    const { colorScheme } = useColorScheme();
    const navigation = useNavigation();

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer
                drawerContent={(props) => <Sidebar {...props} />}
                screenOptions={{
                    headerShown: false, // We will create custom header or use screen options
                    drawerType: 'front',
                    drawerStyle: {
                        backgroundColor: colorScheme === 'dark' ? '#181719' : '#FFFFFF',
                        width: '80%',
                    },
                }}
            >
                <Drawer.Screen
                    name="index"
                    options={{
                        title: 'Home',
                        headerShown: true,
                        headerTitle: '',
                        headerLeft: () => (
                            <Pressable onPress={() => navigation.dispatch(DrawerActions.openDrawer())} className="ml-4 p-2 bg-background-50 rounded-full border border-outline-100 shadow-sm">
                                <Icon as={MenuIcon} size="md" className="text-typography-900" />
                            </Pressable>
                        ),
                        headerTitleAlign: 'center',
                        headerStyle: {
                            backgroundColor: colorScheme === 'dark' ? '#181719' : '#FFFFFF',
                            shadowColor: 'transparent',
                            borderBottomWidth: 0,
                            elevation: 0,
                        }
                    }}
                />
            </Drawer>
        </GestureHandlerRootView>
    );
}
