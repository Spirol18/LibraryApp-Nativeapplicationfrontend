import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useSession } from '@/context/auth';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useRouter } from 'expo-router';
import { BookHeadphones, Lock, Mail } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

WebBrowser.maybeCompleteAuthSession();

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/+$/, '');
const SIGNIN_ENDPOINT = process.env.EXPO_PUBLIC_SIGNIN_ENDPOINT ?? (API_BASE_URL ? `${API_BASE_URL}/signin` : '');

export default function LoginScreen() {
    const { signIn } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [request, response, promptAsync] = Google.useAuthRequest({
        iosClientId: '496315060239-90atrbmshpriqesrh460smcmh1unlrna.apps.googleusercontent.com',
        androidClientId: '496315060239-c5rdma3r8gr51tf12uolisimgh8en1uj.apps.googleusercontent.com',
        webClientId: '496315060239-rb68ijmmm7ig8ir27ri6e809jgvr3omd.apps.googleusercontent.com',
    });
    useEffect(() => {
        console.log('Redirect URI:', request?.redirectUri);
    }, [request]);

    useEffect(() => {
        if (response?.type === 'success') {
            const { authentication } = response;
            handleGoogleAuthResponse(authentication?.accessToken);
        } else if (response?.type === 'error') {
            setError('Google Sign-In failed. Please try again.');
        } else if (response?.type === 'cancel') {
            setError('Sign-in cancelled.');
        }
    }, [response]);

    const handleGoogleAuthResponse = async (accessToken?: string) => {
        if (!accessToken) {
            setError('Google Sign-In failed: no access token.');
            return;
        }
        try {
            const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            const user = await res.json();
            if (user.email) {
                await signIn(`session:${user.email}`);
                setSuccess('Google Sign-In successful.');
                router.replace('/');
            } else {
                setError('Failed to retrieve email from Google.');
            }
        } catch {
            setError('Failed to fetch Google user info.');
        }
    };

    const extractMessage = (payload: unknown): string | null => {
        if (!payload || typeof payload !== 'object') return null;
        const candidates = ['message', 'error', 'detail'] as const;
        for (const key of candidates) {
            const value = (payload as Record<string, unknown>)[key];
            if (typeof value === 'string' && value.trim()) return value.trim();
        }
        return null;
    };

    const handleLogin = async () => {
        const normalizedEmail = email.trim().toLowerCase();

        if (!normalizedEmail || !password) {
            setError('Please enter both email and password.');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
            setError('Invalid email format.');
            return;
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }
        if (!SIGNIN_ENDPOINT) {
            setError('Signin endpoint is not configured. Set EXPO_PUBLIC_API_BASE_URL or EXPO_PUBLIC_SIGNIN_ENDPOINT.');
            return;
        }

        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await fetch(SIGNIN_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: normalizedEmail,
                    password,
                }),
            });

            const rawBody = await response.text();
            let payload: unknown = null;
            if (rawBody) {
                try {
                    payload = JSON.parse(rawBody);
                } catch {
                    payload = null;
                }
            }

            if (!response.ok) {
                const backendMessage = extractMessage(payload);
                if (backendMessage) {
                    setError(backendMessage);
                    return;
                }
                if (response.status === 401) {
                    setError('Invalid email or password.');
                    return;
                }
                if (response.status >= 500) {
                    setError('Server error. Please try again later.');
                    return;
                }
                setError('Signin failed. Please try again.');
                return;
            }

            const backendMessage = extractMessage(payload);
            const token =
                payload && typeof payload === 'object' && typeof (payload as Record<string, unknown>).token === 'string'
                    ? ((payload as Record<string, unknown>).token as string)
                    : `session:${normalizedEmail}`;

            await signIn(token);
            setSuccess(backendMessage ?? 'Authentication successful.');
            router.replace('/');
        } catch (e) {
            console.error('Signin request failed:', e);
            setError('Network error. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
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
                                    onChangeText={(value) => {
                                        setEmail(value);
                                        if (error) setError('');
                                    }}
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
                                    onChangeText={(value) => {
                                        setPassword(value);
                                        if (error) setError('');
                                    }}
                                    style={styles.input}
                                    autoCapitalize="none"
                                />
                            </View>
                            <Text className="text-[#61dafb] text-xs text-right mt-2 font-medium">
                                Forgot Password?
                            </Text>
                        </VStack>

                        {error ? (
                            <Text className="text-red-400 text-sm">{error}</Text>
                        ) : null}
                        {success ? (
                            <Text className="text-green-400 text-sm">{success}</Text>
                        ) : null}

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

                        {/* Divider */}
                        <View className="flex-row items-center mt-6">
                            <View className="flex-1 h-[1px] bg-[#313538]" />
                            <Text className="text-[#9BA1A6] text-xs mx-4 font-medium uppercase tracking-wider">
                                Or continue with
                            </Text>
                            <View className="flex-1 h-[1px] bg-[#313538]" />
                        </View>

                        {/* Google Sign-In Button */}
                        <View className="mt-6">
                            <Button
                                size="lg"
                                variant="outline"
                                onPress={() => promptAsync()}
                                disabled={loading || !request}
                                style={styles.googleButton}
                            >
                                <FontAwesome name="google" size={20} color="#ECEDEE" style={{ marginRight: 12 }} />
                                <ButtonText className="text-[#ECEDEE] font-semibold text-lg">
                                    Continue with Google
                                </ButtonText>
                            </Button>
                        </View>

                        {/* Bottom Footer */}
                        <View className="flex-row justify-center items-center mt-6">
                            <Text className="text-[#9BA1A6] text-sm">Don&apos;t have an account? </Text>
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
    },
    googleButton: {
        backgroundColor: 'transparent',
        borderRadius: 16,
        height: 56,
        borderWidth: 1,
        borderColor: '#313538',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    }
});