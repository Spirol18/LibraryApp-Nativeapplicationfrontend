import PlayPopup from "@/components/playpopop";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { BOOKS, Chapter } from "@/data/books";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Mic, Play } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import React, { useState } from "react";
import { Pressable, ScrollView } from "react-native";

export default function BookDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colorScheme } = useColorScheme();

  const book = BOOKS.find((b) => b.id === id);

  const [voice, setVoice] = useState<"Female">("Female");

  // Global popup state
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null);
  const [isOpen, setOpen] = useState(false);

  if (!book) {
    return (
      <Box className="flex-1 items-center justify-center bg-background-0">
        <Text>Book not found</Text>
        <Button onPress={() => router.back()} className="mt-4">
          <ButtonText>Go Back</ButtonText>
        </Button>
      </Box>
    );
  }

  const handlePlay = (chapter: Chapter) => {
    setActiveChapter(chapter);
    setOpen(true);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <Box className="flex-1 bg-background-0">
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>

          {/* Header Image */}
          <Box
            className={`w-full h-64 ${book.coverColor} items-center justify-center relative`}
          >
            {book.image && (
              <Image
                source={book.image}
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  opacity: 0.3,
                }}
                contentFit="cover"
                blurRadius={10}
              />
            )}

            <Pressable
              onPress={() => router.back()}
              className="absolute top-12 left-4 w-10 h-10 bg-black/20 rounded-full items-center justify-center z-10"
            >
              <Icon as={ArrowLeft} color="white" />
            </Pressable>

            {book.image ? (
              <Image
                source={book.image}
                style={{
                  width: 128,
                  height: 192,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.3)",
                }}
                contentFit="cover"
              />
            ) : (
              <Box className="w-32 h-48 bg-white/20 rounded-lg border border-white/30" />
            )}
          </Box>

          <Box className="px-5 -mt-8">

            {/* Title */}
            <Box
              className={`p-5 rounded-2xl ${colorScheme === "dark" ? "bg-background-50" : "bg-white"
                } border border-outline-100`}
            >
              <Heading size="2xl" className="text-center mb-1">
                {book.title}
              </Heading>

              <Text className="text-center text-typography-500 font-medium mb-4">
                {book.author}
              </Text>

              {/* Voice Toggle */}
              <HStack className="bg-background-100 rounded-full p-1 self-center w-full max-w-[200px]">
                <Pressable
                  onPress={() => setVoice("Female")}
                  className={`flex-1 py-2 rounded-full items-center ${voice === "Female" ? "bg-white" : ""
                    }`}
                >
                  <HStack space="xs" className="items-center">
                    <Icon
                      as={Mic}
                      size="xs"
                      className={
                        voice === "Female"
                          ? "text-secondary-500"
                          : "text-typography-400"
                      }
                    />
                    <Text size="xs" className="font-bold">
                      Female
                    </Text>
                  </HStack>
                </Pressable>
              </HStack>
            </Box>

            {/* Description */}
            <VStack space="lg" className="mt-6">
              <Box>
                <Heading size="md" className="mb-2">
                  Synopsis
                </Heading>

                <Text className="text-typography-600 leading-6">
                  {book.description}
                </Text>
              </Box>

              {/* Chapters */}
              <Box>
                <Heading size="md" className="mb-3">
                  Chapters
                </Heading>

                <VStack space="md">
                  {book.chapters.map((chapter, index) => (
                    <ChapterItem
                      key={chapter.id}
                      chapter={chapter}
                      index={index}
                      colorScheme={colorScheme}
                      onPlay={handlePlay}
                    />
                  ))}
                </VStack>
              </Box>
            </VStack>
          </Box>
        </ScrollView>

        {/* SINGLE POPUP */}
        <PlayPopup
          chapter={activeChapter}
          isOpen={isOpen}
          onClose={() => setOpen(false)}
        />
      </Box>
    </>
  );
}

function ChapterItem({
  chapter,
  index,
  colorScheme,
  onPlay,
}: {
  chapter: Chapter;
  index: number;
  colorScheme: any;
  onPlay: (chapter: Chapter) => void;
}) {
  return (
    <Pressable onPress={() => onPlay(chapter)}>
      <Box
        className={`p-4 rounded-xl border border-outline-100 ${colorScheme === "dark" ? "bg-background-50" : "bg-white"
          } flex-row items-center justify-between`}
      >
        <HStack space="md" className="items-center flex-1">
          <Box className="w-8 h-8 rounded-full bg-background-100 items-center justify-center">
            <Text className="font-bold text-typography-500">{index + 1}</Text>
          </Box>

          <VStack>
            <Text className="font-bold text-typography-900">
              {chapter.title}
            </Text>

            <Text size="xs" className="text-typography-400">
              {chapter.duration}
            </Text>
          </VStack>
        </HStack>

        <Button
          size="sm"
          action="secondary"
          className="rounded-full bg-primary-500 w-10 h-10 p-0 items-center justify-center"
          onPress={() => onPlay(chapter)}
        >
          <ButtonIcon as={Play} />
        </Button>
      </Box>
    </Pressable>
  );
}