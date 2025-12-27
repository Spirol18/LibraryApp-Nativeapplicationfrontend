import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import React from 'react';
import { ThemeToggle } from './ThemeToggle';

export function Sidebar(props: any) {
    const router = useRouter();

    return (
        <Box className="flex-1 bg-background-0">
            <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
                <Box className="p-4 border-b border-outline-100 mb-2 mt-10">
                    <Heading size="xl" className="text-typography-900">
                        Nepali Audio Books
                    </Heading>
                    <Text size="sm" className="text-typography-500">
                        Your library of stories
                    </Text>
                </Box>

                <VStack space="sm" className="px-2">
                    <DrawerItem
                        label="Home"
                        onPress={() => router.push('/(drawer)')}
                    />
                </VStack>
            </DrawerContentScrollView>

            <Box className="p-4 border-t border-outline-100">
                <ThemeToggle />
            </Box>
        </Box>
    );
}
