import { IconSymbol } from '@/components/ui/icon-symbol';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React from 'react';

export default function TabsLayout() {
    const { colorScheme } = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
                tabBarInactiveTintColor: colorScheme === 'dark' ? '#888888' : '#888888',
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: colorScheme === 'dark' ? '#181719' : '#FFFFFF',
                    borderTopColor: colorScheme === 'dark' ? '#333333' : '#E5E5E5',
                }
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Library',
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="books.vertical.fill" color={color} />,
                }}
            />
            <Tabs.Screen
                name="upload"
                options={{
                    title: 'Upload',
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="arrow.up.doc.fill" color={color} />,
                }}
            />
        </Tabs>
    );
}
