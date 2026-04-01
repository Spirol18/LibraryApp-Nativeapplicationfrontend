import { Box } from '@/components/ui/box';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useSession } from '@/context/auth';
import { BOOKS } from '@/data/books';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LogOut, User } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import React, { useMemo, useState, useEffect } from 'react';
import { Modal, Pressable, ScrollView, TextInput } from 'react-native';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:5001';

interface CurrentBook {
    id: string; // chapter ID
    bookId: string;
    chapterId: string;
    title: string;
    author: string;
    progress: number;
    timestamp?: number;
    image: any;
}

export const getBookByAudioId = (audioId: string) => {
    // 1. Find the book that contains a chapter with the matching ID
    const foundBook = BOOKS.find(book =>
        book.chapters.some(chapter => chapter.id === audioId)
    );

    if (!foundBook) return null;

    // 2. Extract the specific chapter from that book
    const foundChapter = foundBook.chapters.find(chapter => chapter.id === audioId);

    return {
        book: foundBook,
        chapter: foundChapter
    };
};

function ContinuePlayingSection({ userEmail }: { userEmail: string }) {
    const [book, setBook] = useState<CurrentBook | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!userEmail) {
            setLoading(false);
            return;
        }

        // We append the email as a query parameter as required by your Flask backend
        fetch(`${API_BASE_URL}/getcurrentbook?email=${encodeURIComponent(userEmail)}`)
            .then((res) => res.json())
            .then((data) => {
                // If backend returns {"id": null}, data.id will be falsy
                if (data && data.id) {
                    const bookData = getBookByAudioId(data.id);
                    const book: CurrentBook = {
                        id: data.id,
                        bookId: bookData?.book.id || "",
                        chapterId: bookData?.chapter?.id || "",
                        title: `${bookData?.book.title} - ${bookData?.chapter!.title}`,
                        author: bookData?.book.author ?? "Unknown Author",
                        progress: data.progress,
                        timestamp: data.timestamp,
                        image: bookData?.book.image,
                    }

                    setBook(book);
                } else {
                    setBook(null);
                }
            })
            .catch((err) => {
                console.error("Error fetching current book:", err);
                setBook(null);
            })
            .finally(() => setLoading(false));
    }, [userEmail]);

    // Requirement: "if there is no audio files than dont show any things"
    if (loading || !book || !book.id) {
        return null;
    }

    const pct = Math.round(book.progress * 100);

    return (
        <Box className="px-4 py-3">
            <Pressable
                onPress={() => {
                    const params = new URLSearchParams({
                        autoPlayChapter: book.chapterId,
                        timestamp: book.timestamp?.toString() || "0"
                    });
                    router.push(`/book/${book.bookId}?${params.toString()}`);
                }}
                style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
            >
                {/* Main Card Container */}
                <Box className="p-4 rounded-2xl border border-outline-100 bg-background-0 shadow-soft-2">
                    <HStack space="md" className="items-center">

                        {/* Book/Audio Cover */}
                        <Box className="shadow-sm">
                            {book.image ? (
                                <Image
                                    source={book.image}
                                    style={{ width: 64, height: 64, borderRadius: 12 }}
                                    contentFit="cover"
                                />
                            ) : (
                                <Box className="w-16 h-16 rounded-xl bg-background-200 items-center justify-center">
                                    <IconSymbol name="music.note" size={24} color="#666" />
                                </Box>
                            )}
                        </Box>

                        {/* Text Content */}
                        <VStack className="flex-1">
                            <Heading size="xs" className="text-typography-900 leading-tight" numberOfLines={1}>
                                {book.title}
                            </Heading>
                            <Text size="xs" className="text-typography-500 mb-2" numberOfLines={1}>
                                {book.author}
                            </Text>

                            {/* Progress Section */}
                            <VStack space="xs">
                                <Box className="h-1.5 w-full bg-outline-100 rounded-full overflow-hidden">
                                    <Box
                                        style={{ width: `${pct}%` }}
                                        className="h-full bg-primary-600"
                                    />
                                </Box>
                                <Text size="2xl" className="text-typography-400">
                                    {pct}% completed
                                </Text>
                            </VStack>
                        </VStack>
                    </HStack>
                </Box>
            </Pressable>
        </Box>
    );
}

export default function HomePage() {
    const { colorScheme } = useColorScheme();
    const router = useRouter();
    const { signOut, user } = useSession();

    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'date' | 'alphabet'>('date');
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const userName = user?.given_name || 'Amrit';
    const userEmail = user?.email || 'user@sunn.ai';
    const userInitial = userName.charAt(0).toUpperCase();

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
                    <HStack className="mb-8 items-center justify-between">
                        <HStack className="items-center gap-3">
                            <Box className="w-10 h-10 bg-primary-500 rounded-full items-center justify-center shadow-md">
                                <Text className="text-white font-bold text-xl">N</Text>
                            </Box>
                            <VStack>
                                <Heading size="md" className="text-typography-900">SUNN.ai</Heading>
                                <Text size="xs" className="text-typography-500">Listen to Literary fiction Audio book</Text>
                            </VStack>
                        </HStack>

                        <Pressable onPress={() => setIsProfileOpen(true)} className="p-2.5 rounded-full border border-[#313538] bg-[#202325]">
                            <User color="#FFFFFF" size={20} />
                        </Pressable>
                    </HStack>

                    {/* Profile Modal */}
                    <Modal visible={isProfileOpen} transparent={true} animationType="fade" onRequestClose={() => setIsProfileOpen(false)}>
                        <Pressable className="flex-1 bg-black/60 justify-center items-center" onPress={() => setIsProfileOpen(false)}>
                            <Pressable className="w-4/5 max-w-[340px] bg-[#202325] border border-[#313538] rounded-3xl p-6 items-center shadow-lg" onPress={(e) => e.stopPropagation()}>
                                <Box className="w-16 h-16 bg-[#61dafb] rounded-full items-center justify-center mb-4 shadow-md">
                                    <Text className="text-[#151718] font-bold text-3xl">{userInitial}</Text>
                                </Box>
                                <Heading size="xl" className="text-white mb-1">{userName}</Heading>
                                <Text size="sm" className="text-[#9BA1A6] mb-8 font-medium">{userEmail}</Text>

                                <Pressable
                                    className="w-full bg-[#EF4444]/10 py-3.5 rounded-2xl flex-row justify-center items-center border border-[#EF4444]/20"
                                    onPress={() => {
                                        setIsProfileOpen(false);
                                        signOut();
                                    }}
                                >
                                    <LogOut color="#EF4444" size={20} />
                                    <Text className="text-[#EF4444] font-semibold text-base ml-2">Log Out</Text>
                                </Pressable>
                            </Pressable>
                        </Pressable>
                    </Modal>

                    <Heading size="2xl" className="mb-6">Welcome back {userName}</Heading>

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

                    <ContinuePlayingSection userEmail={userEmail} />

                    {/* Header and Sort Options */}
                    <HStack className="justify-between items-center mb-4">
                        <Heading size="lg" className="text-typography-700">Recent Books</Heading>
                        <HStack space="sm">
                            <Pressable
                                onPress={() => setSortBy('date')}
                                className={`px-3 py-1.5 rounded-full border ${sortBy === 'date' ? 'bg-primary-500 border-primary-500' : 'border-outline-200'}`}
                            >
                                <Text className={`text-xs font-medium ${sortBy === 'date' ? 'text-black' : 'text-typography-500'}`}>Newest</Text>
                            </Pressable>
                            <Pressable
                                onPress={() => setSortBy('alphabet')}
                                className={`px-3 py-1.5 rounded-full border ${sortBy === 'alphabet' ? 'bg-primary-500 border-primary-500' : 'border-outline-200'}`}
                            >
                                <Text className={`text-xs font-medium ${sortBy === 'alphabet' ? 'text-black' : 'text-typography-500'}`}>A-Z</Text>
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
