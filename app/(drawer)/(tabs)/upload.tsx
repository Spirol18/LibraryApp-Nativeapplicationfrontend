import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function UploadPage() {
    const { colorScheme } = useColorScheme();

    // Animation state values
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    const handlePressIn = () => {
        scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    };

    return (
        <Box className="flex-1 bg-background-0">
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

            <Box className="flex-1 px-6 pt-6 justify-center">
                <VStack space="xl" className="w-full">
                    <VStack space="sm" className="mb-4">
                        <Heading size="2xl" className="text-typography-900 text-center">
                            Upload Book
                        </Heading>
                        <Text size="sm" className="text-typography-500 text-center">
                            Add a new PDF to your library audio generation
                        </Text>
                    </VStack>

                    <AnimatedPressable
                        onPress={() => console.log('Upload pressed')}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                        className="w-full"
                        style={animatedStyle}
                    >
                        {({ pressed }) => (
                            <Box
                                className={`w-full py-20 px-4 rounded-3xl border-2 border-dashed flex-col items-center justify-center
                                    ${colorScheme === 'dark'
                                        ? (pressed ? 'bg-background-100 border-primary-500' : 'bg-background-50 border-outline-800')
                                        : (pressed ? 'bg-primary-50 border-primary-400' : 'bg-background-50 border-outline-200')
                                    }`}
                            >
                                <Box className={`w-16 h-16 rounded-full items-center justify-center mb-4
                                    ${pressed ? 'bg-primary-200' : 'bg-primary-100'}`}
                                >
                                    <IconSymbol size={32} name="arrow.up.doc.fill" color={pressed ? "#0284C7" : "#0EA5E9"} />
                                </Box>

                                <Heading size="lg" className="text-typography-900 mb-2">
                                    Click to browse
                                </Heading>
                                <Text size="sm" className="text-typography-500 text-center px-4">
                                    Supported formats: PDF. Maximum file size: 50MB.
                                </Text>
                            </Box>
                        )}
                    </AnimatedPressable>
                </VStack>
            </Box>
        </Box>
    );
}
