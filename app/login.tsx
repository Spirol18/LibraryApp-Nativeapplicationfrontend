import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useSession } from '@/context/auth';
import { useRouter } from 'expo-router';
import { BookHeadphones, Lock, Mail } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Dimensions, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
    const { signIn } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!email || !password) return;
        setLoading(true);
        // Simulate API call
        setTimeout(async () => {
            await signIn('fake-token-123');
            setLoading(false);
            router.replace('/');
        }, 1500);
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                keyboardShouldPersistTaps="handled"
                className="bg-[#151718] px-6"
            >
                <Box className="w-full max-w-[400px] self-center py-12">

                    {/* Logo and Header Section */}
                    <VStack space="xl" className="items-center mb-8 mt-4">
                        <View className="bg-[#202325] p-5 rounded-full shadow-lg border border-[#313538] items-center justify-center">
                            <BookHeadphones size={60} color="#61dafb" strokeWidth={1.5} />
                        </View>
                        <VStack space="xs" className="items-center">
                            <Heading size="3xl" className="text-white font-bold tracking-tight">
                                Welcome Back
                            </Heading>
                            <Text className="text-[#9BA1A6] text-center mt-1">
                                Sign in to access your library account
                            </Text>
                        </VStack>
                    </VStack>

                    {/* Form Section */}
                    <VStack space="lg" className="w-full">

                        <VStack space="sm">
                            <Text className="text-[#ECEDEE] text-sm font-medium ml-1">Email Address</Text>
                            <View style={styles.inputWrapper}>
                                <Mail color="#9BA1A6" size={20} style={styles.inputIcon} />
                                <TextInput
                                    placeholder="Enter your email"
                                    placeholderTextColor="#687076"
                                    value={email}
                                    onChangeText={setEmail}
                                    style={styles.input}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    autoComplete="email"
                                />
                            </View>
                        </VStack>

                        <VStack space="sm">
                            <Text className="text-[#ECEDEE] text-sm font-medium ml-1">Password</Text>
                            <View style={styles.inputWrapper}>
                                <Lock color="#9BA1A6" size={20} style={styles.inputIcon} />
                                <TextInput
                                    placeholder="Enter your password"
                                    placeholderTextColor="#687076"
                                    secureTextEntry
                                    value={password}
                                    onChangeText={setPassword}
                                    style={styles.input}
                                    autoCapitalize="none"
                                />
                            </View>
                            <Text className="text-[#61dafb] text-xs text-right mt-2 font-medium">
                                Forgot Password?
                            </Text>
                        </VStack>

                        {/* Action Button */}
                        <View className="mt-4">
                            <Button
                                size="lg"
                                variant="default"
                                onPress={handleLogin}
                                disabled={loading}
                                style={styles.button}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#151718" />
                                ) : (
                                    <ButtonText className="text-[#151718] font-semibold text-lg">
                                        Sign In
                                    </ButtonText>
                                )}
                            </Button>
                        </View>

                        {/* Bottom Footer */}
                        <View className="flex-row justify-center items-center mt-6">
                            <Text className="text-[#9BA1A6] text-sm">Don't have an account? </Text>
                            <Text
                                className="text-[#61dafb] font-semibold text-sm"
                                onPress={() => router.replace('/signup')}
                                suppressHighlighting
                            >
                                Sign Up
                            </Text>
                        </View>

                    </VStack>
                </Box>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#202325',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#313538',
        paddingHorizontal: 16,
        height: 56,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        color: '#ECEDEE',
        fontSize: 16,
        height: '100%',
    },
    button: {
        backgroundColor: '#61dafb',
        borderRadius: 16,
        height: 56,
        shadowColor: '#61dafb',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 0,
    }
});
