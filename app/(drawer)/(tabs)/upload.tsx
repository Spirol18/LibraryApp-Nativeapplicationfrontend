import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import React, { useState, useEffect } from 'react';
import { Pressable, Alert, Platform, ActivityIndicator } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import * as DocumentPicker from 'expo-document-picker';
import { Audio } from 'expo-av';
import { Play, Pause } from 'lucide-react-native';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function UploadPage() {
    const { colorScheme } = useColorScheme();

    const scale = useSharedValue(1);
    const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL!;
    const uploadEndpoint = baseUrl + process.env.EXPO_PUBLIC_UPLOAD_ENDPOINT;

    const [isUploading, setIsUploading] = useState(false);
    const [audioId, setAudioId] = useState<string | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);

    // Audio Playback States
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isAudioLoading, setIsAudioLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    // Cleanup sound on unmount
    useEffect(() => {
        return sound
            ? () => {
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    // Handle Play/Pause
    const togglePlayback = async () => {
        if (!audioUrl) return;

        try {
            if (sound) {
                if (isPlaying) {
                    await sound.pauseAsync();
                } else {
                    await sound.playAsync();
                }
            } else {
                setIsAudioLoading(true);
                await Audio.setAudioModeAsync({
                    playsInSilentModeIOS: true,
                });
                const { sound: newSound } = await Audio.Sound.createAsync(
                    { uri: audioUrl },
                    { shouldPlay: true },
                    (status) => {
                        if (status.isLoaded) {
                            setIsPlaying(status.isPlaying);
                            if (status.durationMillis && status.durationMillis > 0) {
                                setProgress((status.positionMillis / status.durationMillis) * 100);
                            }
                            if (status.didJustFinish) {
                                setIsPlaying(false);
                                setProgress(0);
                                newSound.setPositionAsync(0);
                            }
                        }
                    }
                );
                setSound(newSound);
                setIsPlaying(true);
                setIsAudioLoading(false);
            }
        } catch (err) {
            console.error("Playback error:", err);
            Alert.alert("Error", "Could not play the audio. " + String(err));
            setIsAudioLoading(false);
        }
    };

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    const handlePressIn = () => {
        if (!isUploading) scale.value = withSpring(0.96);
    };

    const handlePressOut = () => {
        if (!isUploading) scale.value = withSpring(1);
    };

    const resetUpload = async () => {
        if (sound) {
            await sound.unloadAsync();
            setSound(null);
        }
        setIsPlaying(false);
        setProgress(0);
        setAudioId(null);
        setAudioUrl(null);
    };

    const uploadPDF = async () => {
        if (isUploading) return;

        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: "application/pdf",
                copyToCacheDirectory: true
            });

            if (result.canceled) return;

            const file = result.assets[0];

            setIsUploading(true);
            setAudioId(null);
            setAudioUrl(null);

            const formData = new FormData();

            // On React Native Web, Expo DocumentPicker returns the actual HTML5 File object in `file.file`.
            // Appending the `{ uri, name, type }` object literal on Web results in FormData converting it to the string "[object Object]".
            if (Platform.OS === 'web' && file.file) {
                formData.append("file", file.file);
            } else {
                formData.append("file", {
                    uri: file.uri,
                    name: file.name,
                    type: file.mimeType || "application/pdf"
                } as any);
            }

            const response = await fetch(uploadEndpoint, {
                method: "POST",
                body: formData,
            });

            const responseText = await response.text();
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                console.error("Non-JSON Server Response:", responseText);
                data = { message: `Server error (${response.status})` };
            }

            if (response.ok) {
                Alert.alert("Success", data.message || "File uploaded and processed successfully!");
                if (data.audio_id) {
                    setAudioId(data.audio_id);
                    setAudioUrl(`${baseUrl}/audio/${data.audio_id}`);
                }
            } else {
                Alert.alert("Error", data.message || "Something went wrong.");
            }

        } catch (error) {
            console.error("Upload Error:", error);
            Alert.alert(
                "Upload Failed",
                error instanceof Error ? error.message : "Something went wrong during upload."
            );
        } finally {
            setIsUploading(false);
        }
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
                            Add a new PDF to generate audio
                        </Text>
                    </VStack>

                    {!audioId && (
                        <AnimatedPressable
                            onPress={uploadPDF}
                            onPressIn={handlePressIn}
                            onPressOut={handlePressOut}
                            className="w-full"
                            style={animatedStyle}
                            disabled={isUploading}
                        >
                            {({ pressed }) => (
                                <Box
                                    className={`w-full py-20 px-4 rounded-3xl border-2 border-dashed flex-col items-center justify-center
                                        ${colorScheme === 'dark'
                                            ? (pressed ? 'bg-background-100 border-primary-500' : 'bg-background-50 border-outline-800')
                                            : (pressed ? 'bg-primary-50 border-primary-400' : 'bg-background-50 border-outline-200')
                                        }`}
                                >
                                    {isUploading ? (
                                        <VStack space="md" className="items-center justify-center">
                                            <ActivityIndicator size="large" color={colorScheme === 'dark' ? '#0EA5E9' : '#0284C7'} />
                                            <Text size="sm" className="text-typography-500 text-center px-4 font-medium mt-2">
                                                Processing PDF and generating audio...{'\n'}This might take a few minutes.
                                            </Text>
                                        </VStack>
                                    ) : (
                                        <>
                                            <Box className={`w-16 h-16 rounded-full items-center justify-center mb-4
                                                ${pressed ? 'bg-primary-200' : 'bg-primary-100'}`}
                                            >
                                                <IconSymbol size={32} name="arrow.up.doc.fill" color={pressed ? "#0284C7" : "#0EA5E9"} />
                                            </Box>

                                            <Heading size="lg" className="text-typography-900 mb-2">
                                                Click to browse
                                            </Heading>

                                            <Text size="sm" className="text-typography-500 text-center px-4">
                                                Supported format: PDF (max 50MB)
                                            </Text>
                                        </>
                                    )}
                                </Box>
                            )}
                        </AnimatedPressable>
                    )}

                    {audioId && (
                        <VStack space="lg" className="w-full mt-4">
                            <Box className="w-full bg-background-50 rounded-2xl p-6 border border-outline-200 dark:bg-background-50 dark:border-outline-800">
                                <Heading size="md" className="text-typography-900 mb-4 text-center">
                                    Generated Audio Book
                                </Heading>

                                <Box className="w-full bg-background-100 dark:bg-background-100/10 rounded-2xl p-6 mt-2 items-center justify-center">
                                    {isAudioLoading ? (
                                        <ActivityIndicator size="large" color="#0EA5E9" />
                                    ) : (
                                        <Pressable
                                            onPress={togglePlayback}
                                            className="w-16 h-16 bg-primary-500 rounded-full items-center justify-center shadow-lg"
                                        >
                                            {isPlaying ? (
                                                <Pause size={32} color="white" />
                                            ) : (
                                                <Play size={32} color="white" fill="white" className="ml-1" />
                                            )}
                                        </Pressable>
                                    )}

                                    <Box className="w-full h-2 bg-outline-300 dark:bg-outline-700 rounded-full mt-6 overflow-hidden">
                                        <Box
                                            className="h-full bg-primary-500 rounded-full"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </Box>
                                </Box>

                                <Pressable
                                    onPress={resetUpload}
                                    className="mt-6 w-full py-3 rounded-xl bg-primary-100 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800"
                                >
                                    <Text className="text-primary-600 dark:text-primary-400 font-semibold text-center">
                                        Upload Another PDF
                                    </Text>
                                </Pressable>
                            </Box>
                        </VStack>
                    )}

                </VStack>
            </Box>
        </Box>
    );
}