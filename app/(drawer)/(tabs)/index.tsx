import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { BOOKS } from '@/data/books';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, TextInput } from 'react-native';

export default function HomePage() {
    const { colorScheme } = useColorScheme();
    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'date' | 'alphabet'>('date');

    const filteredAndSortedBooks = useMemo(() => {
        let result = BOOKS;

        // Search filter
        if (searchQuery.trim()) {
            const lowerQuery = searchQuery.toLowerCase();
            result = result.filter(book =>
                book.title.toLowerCase().includes(lowerQuery) ||
                book.author.toLowerCase().includes(lowerQuery)
            );
        }

        // Sort
        result = [...result].sort((a, b) => {
            if (sortBy === 'alphabet') {
                return a.title.localeCompare(b.title);
            } else {
                // sort by date descending
                return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
            }
        });

        return result;
    }, [searchQuery, sortBy]);

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

                    {/* Search Bar */}
                    <Box className={`flex-row items-center px-4 py-3 rounded-full mb-6 border border-outline-100 ${colorScheme === 'dark' ? 'bg-background-50' : 'bg-white'}`}>
                        <IconSymbol name="magnifyingglass" size={20} color={colorScheme === 'dark' ? '#A3A3A3' : '#737373'} />
                        <TextInput
                            className={`flex-1 ml-2 text-base ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}
                            placeholder="Search books, authors..."
                            placeholderTextColor={colorScheme === 'dark' ? '#A3A3A3' : '#737373'}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </Box>

                    {/* Header and Sort Options */}
                    <HStack className="justify-between items-center mb-4">
                        <Heading size="lg" className="text-typography-700">Recent Books</Heading>
                        <HStack space="sm">
                            <Pressable
                                onPress={() => setSortBy('date')}
                                className={`px-3 py-1.5 rounded-full border ${sortBy === 'date' ? 'bg-primary-500 border-primary-500' : 'border-outline-200'}`}
                            >
                                <Text className={`text-xs font-medium ${sortBy === 'date' ? 'text-white' : 'text-typography-500'}`}>Newest</Text>
                            </Pressable>
                            <Pressable
                                onPress={() => setSortBy('alphabet')}
                                className={`px-3 py-1.5 rounded-full border ${sortBy === 'alphabet' ? 'bg-primary-500 border-primary-500' : 'border-outline-200'}`}
                            >
                                <Text className={`text-xs font-medium ${sortBy === 'alphabet' ? 'text-white' : 'text-typography-500'}`}>A-Z</Text>
                            </Pressable>
                        </HStack>
                    </HStack>

                    <VStack space="md">
                        {filteredAndSortedBooks.map((book) => (
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
