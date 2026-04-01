import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { BOOKS, Book } from '@/data/books';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Bookmark, BookmarkCheck, ChevronDown, Search } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, TextInput } from 'react-native';

const ALPHABET = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

type DateOrder = 'asc' | 'desc';

export default function HomePage() {
    const { colorScheme } = useColorScheme();
    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'recent' | 'author' | 'title'>('recent');
    const [dateOrder, setDateOrder] = useState<DateOrder>('desc'); // desc = newest first, asc = oldest first
    const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
    const [titleDropdownOpen, setTitleDropdownOpen] = useState(false);
    const [authorDropdownOpen, setAuthorDropdownOpen] = useState(false);
    const [authorLetter, setAuthorLetter] = useState<string | null>(null); // A–Z or null for all
    const [titleLetter, setTitleLetter] = useState<string | null>(null); // A–Z or null for all
    const [bookmarks, setBookmarks] = useState<string[]>([]);

    const closeDateDropdown = useCallback(() => setDateDropdownOpen(false), []);
    const closeTitleDropdown = useCallback(() => setTitleDropdownOpen(false), []);
    const closeAuthorDropdown = useCallback(() => setAuthorDropdownOpen(false), []);

    const toggleBookmark = (bookId: string) => {
        setBookmarks((prev) =>
            prev.includes(bookId)
                ? prev.filter((id) => id !== bookId)
                : [...prev, bookId]
        );
    };

    const filteredAndSortedBooks: Book[] = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        let data = BOOKS.slice();

        if (query.length > 0) {
            data = data.filter((book) => {
                const titleMatch = book.title.toLowerCase().includes(query);
                const authorMatch = book.author.toLowerCase().includes(query);
                return titleMatch || authorMatch;
            });
        }

        data.sort((a, b) => {
            // bookmarked books always come first
            const aBookmarked = bookmarks.includes(a.id);
            const bBookmarked = bookmarks.includes(b.id);
            if (aBookmarked !== bBookmarked) {
                return aBookmarked ? -1 : 1;
            }

            if (sortBy === 'author') {
                // When a letter is selected, authors starting with that letter come first
                if (authorLetter) {
                    const letterLower = authorLetter.toLowerCase();
                    const aFirst = a.author.trim().charAt(0).toLowerCase();
                    const bFirst = b.author.trim().charAt(0).toLowerCase();
                    const aMatches = aFirst === letterLower ? 1 : 0;
                    const bMatches = bFirst === letterLower ? 1 : 0;
                    if (aMatches !== bMatches) return bMatches - aMatches; // matching letter first
                }
                return a.author.localeCompare(b.author);
            }

            if (sortBy === 'title') {
                // When a letter is selected, titles starting with that letter come first
                if (titleLetter) {
                    const letterLower = titleLetter.toLowerCase();
                    const aFirst = a.title.trim().charAt(0).toLowerCase();
                    const bFirst = b.title.trim().charAt(0).toLowerCase();
                    const aMatches = aFirst === letterLower ? 1 : 0;
                    const bMatches = bFirst === letterLower ? 1 : 0;
                    if (aMatches !== bMatches) return bMatches - aMatches; // matching letter first
                }
                return a.title.localeCompare(b.title);
            }

            // sort by publishedDate (by year): desc = newest first, asc = oldest first
            const aYear = new Date(a.publishedDate).getFullYear();
            const bYear = new Date(b.publishedDate).getFullYear();
            return dateOrder === 'desc' ? bYear - aYear : aYear - bYear;
        });

        return data;
    }, [searchQuery, sortBy, dateOrder, authorLetter, titleLetter, bookmarks]);

    return (
        <Box className="relative flex-1 bg-background-0">
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                <Pressable onPress={dateDropdownOpen ? closeDateDropdown : authorDropdownOpen ? closeAuthorDropdown : titleDropdownOpen ? closeTitleDropdown : undefined} className="flex-1">
                    <Box className="flex-1 px-4 pt-4">

                        {/* Header / Brand */}
                        <HStack className="mb-8 items-center gap-3">
                            {/* <Box className="w-10 h-10 rounded-full items-center justify-center shadow-md overflow-hidden bg-white">
                                <Image source={require('@/assets/images/sunnai.jpg')} style={{ width: 65, height: 65, marginTop: 5 }} contentFit="cover" />
                            </Box> */}
                            <VStack>
                                <Heading size="md" className="text-typography-900">SUNN.ai</Heading>
                                <Text size="xs" className="text-typography-500">Listen to Literary fiction Audio book</Text>
                            </VStack>
                        </HStack>

                        <Heading size="2xl" className="mb-4">Welcome Back</Heading>

                        {/* Search + Sort Controls */}
                        <VStack space="md" className="mb-4">
                            {/* Search bar */}
                            <Box className={`flex-row items-center px-3 py-2 rounded-full border ${colorScheme === 'dark' ? 'bg-background-50 border-outline-100' : 'bg-white border-outline-100'} shadow-sm`}>
                                <Icon as={Search} size="sm" className="text-typography-400 mr-2" />
                                <TextInput
                                    placeholder="Search by title or author"
                                    placeholderTextColor={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                    className="flex-1 text-typography-900"
                                />
                            </Box>

                            {/* Sort pills */}
                            <HStack className="items-center justify-between">
                                <Text size="sm" className="text-typography-500">
                                    Sort by:
                                </Text>
                                <HStack space="sm">
                                    {/* Date Published with dropdown (attached to button; closes on option click or tap outside) */}
                                    <Box className="relative">
                                        <Pressable
                                            onPress={() => {
                                                setSortBy('recent');
                                                setAuthorLetter(null);
                                                setTitleLetter(null);
                                                setDateDropdownOpen((prev) => !prev);
                                                if (!dateDropdownOpen) {
                                                    setAuthorDropdownOpen(false);
                                                    setTitleDropdownOpen(false);
                                                }
                                            }}
                                        >
                                            {({ pressed }) => {
                                                const isActive = sortBy === 'recent';
                                                const bgClass = pressed || isActive
                                                    ? 'bg-gray-300 border-outline-200 shadow-sm'
                                                    : 'bg-gray-500 border-outline-100';
                                                const textClass = pressed || isActive
                                                    ? 'font-semibold text-black'
                                                    : 'font-semibold text-white';
                                                return (
                                                    <Box className={`flex-row items-center gap-1 px-3 py-1.5 rounded-full border ${bgClass}`}>
                                                        <Text size="xs" className={textClass}>
                                                            Date Published
                                                        </Text>
                                                        <Icon as={ChevronDown} size="xs" className={pressed || isActive ? "text-black" : "text-white"} />
                                                    </Box>
                                                );
                                            }}
                                        </Pressable>
                                        {dateDropdownOpen && (
                                            <Box
                                                className={`absolute left-0 top-full mt-1 min-w-[140px] rounded-lg border border-outline-200 py-1 z-[100] shadow-lg overflow-hidden bg-gray-500`}
                                            >
                                                <Pressable
                                                    onPress={() => {
                                                        setDateOrder('desc');
                                                        setSortBy('recent');
                                                        closeDateDropdown();
                                                    }}
                                                >
                                                    {({ pressed }) => {
                                                        const isActive = dateOrder === 'desc';
                                                        const bgClass = pressed || isActive ? 'bg-gray-300' : 'bg-transparent';
                                                        const textClass = pressed || isActive ? 'text-black' : 'text-white';
                                                        return (
                                                            <Box className={`px-3 py-2 ${bgClass}`}>
                                                                <Text size="xs" className={`font-medium ${textClass}`}>
                                                                    Newest first
                                                                </Text>
                                                            </Box>
                                                        );
                                                    }}
                                                </Pressable>
                                                <Pressable
                                                    onPress={() => {
                                                        setDateOrder('asc');
                                                        setSortBy('recent');
                                                        closeDateDropdown();
                                                    }}
                                                >
                                                    {({ pressed }) => {
                                                        const isActive = dateOrder === 'asc';
                                                        const bgClass = pressed || isActive ? 'bg-gray-300' : 'bg-transparent';
                                                        const textClass = pressed || isActive ? 'text-black' : 'text-white';
                                                        return (
                                                            <Box className={`px-3 py-2 ${bgClass}`}>
                                                                <Text size="xs" className={`font-medium ${textClass}`}>
                                                                    Oldest first
                                                                </Text>
                                                            </Box>
                                                        );
                                                    }}
                                                </Pressable>
                                            </Box>
                                        )}
                                    </Box>
                                    {/* Book Name with horizontal A–Z dropdown */}
                                    <Box className="relative">
                                        <Pressable
                                            onPress={() => {
                                                setSortBy('title');
                                                setTitleDropdownOpen((prev) => !prev);
                                                if (!titleDropdownOpen) {
                                                    setDateDropdownOpen(false);
                                                    setAuthorDropdownOpen(false);
                                                }
                                            }}
                                        >
                                            {({ pressed }) => {
                                                const isActive = sortBy === 'title';
                                                const bgClass = pressed || isActive
                                                    ? 'bg-gray-300 border-outline-200 shadow-sm'
                                                    : 'bg-gray-500 border-outline-100';
                                                const textClass = pressed || isActive
                                                    ? 'font-semibold text-black'
                                                    : 'font-semibold text-white';
                                                return (
                                                    <Box className={`px-3 py-1.5 rounded-full border ${bgClass}`}>
                                                        <Text size="xs" className={textClass}>
                                                            Book Name
                                                        </Text>
                                                    </Box>
                                                );
                                            }}
                                        </Pressable>
                                        {titleDropdownOpen && (
                                            <Box
                                                className={`absolute right-0 top-full mt-1 w-full min-w-[280px] rounded-lg border border-outline-200 py-2 px-2 z-[100] ${colorScheme === 'dark' ? 'bg-background-50' : 'bg-white'
                                                    } shadow-lg`}
                                            >
                                                <Box className="flex-row flex-wrap justify-end px-1 py-1">
                                                    {ALPHABET.map((letter) => (
                                                        <Box key={letter} style={{ width: `${100 / 13}%`, padding: 2 }}>
                                                            <Pressable
                                                                onPress={() => {
                                                                    setTitleLetter(letter);
                                                                    closeTitleDropdown();
                                                                }}
                                                                className="py-1.5 rounded-md active:opacity-70 items-end justify-center pr-1"
                                                            >
                                                                <Text size="xs" className={`font-medium text-right ${titleLetter === letter ? 'text-[#4b2e1f]' : 'text-typography-600'}`}>
                                                                    {letter}
                                                                </Text>
                                                            </Pressable>
                                                        </Box>
                                                    ))}
                                                </Box>
                                            </Box>
                                        )}
                                    </Box>

                                    {/* Author Name with horizontal A–Z dropdown */}
                                    <Box className="relative">
                                        <Pressable
                                            onPress={() => {
                                                setSortBy('author');
                                                setAuthorDropdownOpen((prev) => !prev);
                                                if (!authorDropdownOpen) {
                                                    setDateDropdownOpen(false);
                                                    setTitleDropdownOpen(false);
                                                }
                                            }}
                                        >
                                            {({ pressed }) => {
                                                const isActive = sortBy === 'author';
                                                const bgClass = pressed || isActive
                                                    ? 'bg-gray-300 border-outline-200 shadow-sm'
                                                    : 'bg-gray-500 border-outline-100';
                                                const textClass = pressed || isActive
                                                    ? 'font-semibold text-black'
                                                    : 'font-semibold text-white';
                                                return (
                                                    <Box className={`px-3 py-1.5 rounded-full border ${bgClass}`}>
                                                        <Text size="xs" className={textClass}>
                                                            Author Name
                                                        </Text>
                                                    </Box>
                                                );
                                            }}
                                        </Pressable>
                                        {authorDropdownOpen && (
                                            <Box
                                                className={`absolute right-0 top-full mt-1 w-full min-w-[280px] rounded-lg border border-outline-200 py-2 px-2 z-[100] ${colorScheme === 'dark' ? 'bg-background-50' : 'bg-white'
                                                    } shadow-lg`}
                                            >
                                                <Box className="flex-row flex-wrap justify-end px-1 py-1">
                                                    {ALPHABET.map((letter) => (
                                                        <Box key={letter} style={{ width: `${100 / 13}%`, padding: 2 }}>
                                                            <Pressable
                                                                onPress={() => {
                                                                    setAuthorLetter(letter);
                                                                    closeAuthorDropdown();
                                                                }}
                                                                className="py-1.5 rounded-md active:opacity-70 items-end justify-center pr-1"
                                                            >
                                                                <Text size="xs" className={`font-medium text-right ${authorLetter === letter ? 'text-[#4b2e1f]' : 'text-typography-600'}`}>
                                                                    {letter}
                                                                </Text>
                                                            </Pressable>
                                                        </Box>
                                                    ))}
                                                </Box>
                                            </Box>
                                        )}
                                    </Box>
                                </HStack>
                            </HStack>
                        </VStack>

                        <Box className={`z-0 ${dateDropdownOpen || titleDropdownOpen || authorDropdownOpen ? 'mt-24' : 'mt-4'}`}>
                            <Heading size="lg" className="mb-4 text-typography-700">Your Books</Heading>

                            <VStack space="md">
                                {filteredAndSortedBooks.map((book) => {
                                    const isBookmarked = bookmarks.includes(book.id);
                                    const publishedYear = new Date(book.publishedDate).getFullYear();

                                    return (
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
                                                        <HStack className="justify-between items-start mb-1">
                                                            <Box className="flex-1 pr-2">
                                                                <Heading size="lg" className="text-typography-900 leading-tight mb-1">
                                                                    {book.title}
                                                                </Heading>
                                                                <Text size="sm" className="text-typography-500 font-medium">
                                                                    {book.author}
                                                                </Text>
                                                                <Text size="xs" className="text-typography-400 mt-1">
                                                                    Published: {publishedYear}
                                                                </Text>
                                                            </Box>
                                                            <Pressable
                                                                onPress={(event) => {
                                                                    event.stopPropagation();
                                                                    toggleBookmark(book.id);
                                                                }}
                                                            >
                                                                <Box className="w-8 h-8 rounded-full items-center justify-center bg-background-100">
                                                                    <Icon
                                                                        as={isBookmarked ? BookmarkCheck : Bookmark}
                                                                        size="sm"
                                                                        className={
                                                                            isBookmarked
                                                                                ? 'text-primary-500'
                                                                                : 'text-typography-400'
                                                                        }
                                                                    />
                                                                </Box>
                                                            </Pressable>
                                                        </HStack>
                                                        <Text numberOfLines={2} size="xs" className="text-typography-400">
                                                            {book.description}
                                                        </Text>
                                                    </VStack>
                                                </HStack>
                                            </Box>
                                        </Pressable>
                                    );
                                })}
                            </VStack>
                        </Box>

                    </Box>
                </Pressable>
            </ScrollView>
        </Box>
    );
}
