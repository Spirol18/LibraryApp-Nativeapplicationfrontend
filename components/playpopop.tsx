import React, { useEffect, useState } from "react";

import { ActivityIndicator, Dimensions, Image, StyleSheet } from "react-native";

import Slider from "@react-native-community/slider";

import TrackPlayer, {
  Capability,
  State,
  usePlaybackState,
  useProgress,
} from "react-native-track-player";

import { Pause, Play, RotateCcw, RotateCw, X } from "lucide-react-native";

import { TouchableOpacity } from "react-native";

import { Box } from "@/components/ui/box";

import { ButtonIcon } from "@/components/ui/button";

import { Portal } from "@/components/ui/portal";

import { Text } from "@/components/ui/text";

import { Chapter } from "@/data/books";

const { width } = Dimensions.get("window");

function PlayPopup({
  chapter,
  isOpen,
  onClose,
  initialTimestamp,
}: {
  chapter: Chapter | null;

  isOpen: boolean;
  onClose: () => void;
  initialTimestamp?: number;
}) {
  const playbackState = usePlaybackState();

  const progress = useProgress();

  const [isReady, setIsReady] = useState(false);

  // Handle modern state object

  const currentState = (playbackState as any).state ?? playbackState;

  useEffect(() => {
    if (!isOpen || !chapter) return;

    const setup = async () => {
      try {
        try {
          await TrackPlayer.setupPlayer();
        } catch (e) {}

        await TrackPlayer.updateOptions({
          capabilities: [Capability.Play, Capability.Pause, Capability.SeekTo],
        });

        const currentTrack = await TrackPlayer.getActiveTrack();

        // Check if we are switching to a DIFFERENT chapter
        if (!currentTrack || currentTrack.id !== chapter.id) {
          await TrackPlayer.reset();

          await TrackPlayer.add({
            id: chapter.id,
            url: `http://localhost:5001/audio/${chapter.id}`,
            title: chapter.title,
            artist: "Audiobook",
            artwork: "https://picsum.photos/id/145/600/600",
          });

          // --- THE FIX IS HERE ---
          if (initialTimestamp && initialTimestamp > 0) {
            await TrackPlayer.seekTo(initialTimestamp);
          } else {
            // Explicitly force the player back to the start
            await TrackPlayer.seekTo(0);
          }
          // -----------------------

          // Start playing automatically when switching chapters
          await TrackPlayer.play();
        }

        setIsReady(true);
      } catch (err) {
        console.error(err);
      }
    };

    setup();
  }, [isOpen, chapter, initialTimestamp]);

  if (!chapter || !isOpen) return null;

  const togglePlayback = async () => {
    currentState === State.Playing
      ? await TrackPlayer.pause()
      : await TrackPlayer.play();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);

    const secs = Math.floor(seconds % 60);

    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <Portal isOpen={isOpen}>
      {/* Dark Overlay */}

      <Box className="flex-1 bg-black/80 justify-center items-center">
        {/* Spotify-styled Modal Container */}

        <Box className="w-[85%] bg-[#121212] rounded-[20px] p-5 shadow-xl border border-white/10">
          {/* Top Grabber / Close */}

          <Box className="flex-row justify-between items-center mb-3">
            <Text className="text-white/40 text-[9px] font-bold tracking-widest uppercase">
              Now Playing
            </Text>

            <TouchableOpacity
              onPress={onClose}
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: "rgba(255,255,255,0.1)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <X color="white" size={14} />
            </TouchableOpacity>
          </Box>

          {/* Compact Artwork */}

          <Box className="items-center mb-3">
            <Image
              source={require("../assets/images/unnamed.jpg")}
              style={styles.spotifyArt}
              className="rounded-lg"
            />
          </Box>

          {/* Title and Artist */}

          <Box className="mb-3">
            <Text className="text-white text-lg font-bold" numberOfLines={1}>
              {chapter.title}
            </Text>

            <Text className="text-[#b3b3b3] text-sm">Chapter Audio</Text>
          </Box>

          {/* Progress Slider */}

          <Box className="mb-1">
            <Slider
              style={{ width: "100%", height: 25 }}
              minimumValue={0}
              maximumValue={progress.duration || 1}
              value={progress.position}
              minimumTrackTintColor="#1DB954" // Spotify Green
              maximumTrackTintColor="#4d4d4d"
              thumbTintColor="#FFFFFF"
              onSlidingComplete={TrackPlayer.seekTo}
            />

            <Box className="flex-row justify-between px-1">
              <Text className="text-[#b3b3b3] text-[10px]">
                {formatTime(progress.position)}
              </Text>

              <Text className="text-[#b3b3b3] text-[10px]">
                {formatTime(progress.duration)}
              </Text>
            </Box>
          </Box>

          {/* Controls Row */}

          <Box className="flex-row justify-center items-center gap-5 mt-1">
            <TouchableOpacity
              onPress={() => TrackPlayer.seekTo(progress.position - 10)}
            >
              <RotateCcw size={20} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={togglePlayback}
              style={styles.spotifyPlayBtn}
            >
              {currentState === State.Buffering ? (
                <ActivityIndicator color="black" />
              ) : (
                <ButtonIcon
                  as={currentState === State.Playing ? Pause : Play}
                  color="black"
                  size="md"
                  className="p-1"
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => TrackPlayer.seekTo(progress.position + 10)}
            >
              <RotateCw size={20} color="white" />
            </TouchableOpacity>
          </Box>
        </Box>
      </Box>
    </Portal>
  );
}

// Custom styles for the Spotify feel

const styles = StyleSheet.create({
  spotifyArt: {
    width: width * 0.3,

    height: width * 0.3,

    shadowColor: "#000",

    shadowOffset: { width: 0, height: 2 },

    shadowOpacity: 0.2,

    shadowRadius: 5,
  },

  spotifyPlayBtn: {
    backgroundColor: "white",

    width: 48,

    height: 48,

    borderRadius: 24,

    justifyContent: "center",

    alignItems: "center",
  },
});

export default PlayPopup;
