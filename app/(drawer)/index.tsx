import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { BOOKS } from '@/data/books';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { Pressable, ScrollView } from 'react-native';

export default function HomePage() {
    const { colorScheme } = useColorScheme();
    const router = useRouter();

    return (
        <Box className="flex-1 bg-background-0">
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                <Box className="flex-1 px-4 pt-4">

                    {/* Header / Brand */}
                    <HStack className="mb-8 items-center gap-3">
                        <Box className="w-10 h-10 bg-primary-500 rounded-full items-center justify-center shadow-md">
                            <Text className="text-white font-bold text-xl">N</Text>
                        </Box>
                        <VStack>
                            <Heading size="md" className="text-typography-900">SUNN.ai</Heading>
                            <Text size="xs" className="text-typography-500">Listen to Literary fiction Audio book</Text>
                        </VStack>
                    </HStack>

                    <Heading size="2xl" className="mb-6">Welcome Back</Heading>

                    <Heading size="lg" className="mb-4 text-typography-700">Recent Books</Heading>

                    <VStack space="md">
                        {BOOKS.map((book) => (
                            <Pressable key={book.id} onPress={() => router.push(`/book/${book.id}`)}>
                                <Box className={`p-4 rounded-xl border border-outline-100 ${colorScheme === 'dark' ? 'bg-background-50' : 'bg-white'} shadow-sm`}>
                                    <HStack space="md">
                                        {book.image ? (
                                            <Image
                                                source={book.image}
                                                style={{ width: 80, height: 112, borderRadius: 6 }}
                                                contentFit="cover"
                                            />
                                        ) : (
                                            <Box className={`w-20 h-28 rounded-md ${book.coverColor} shadow-sm`} />
                                        )}
                                        <VStack className="flex-1 py-1 justify-between">
                                            <Box>
                                                <Heading size="lg" className="text-typography-900 leading-tight mb-1">{book.title}</Heading>
                                                <Text size="sm" className="text-typography-500 font-medium">{book.author}</Text>
                                            </Box>
                                            <Text numberOfLines={2} size="xs" className="text-typography-400">
                                                {book.description}
                                            </Text>
                                        </VStack>
                                    </HStack>
                                </Box>
                            </Pressable>
                        ))}
                    </VStack>

                </Box>
            </ScrollView>
        </Box>
    );
}
