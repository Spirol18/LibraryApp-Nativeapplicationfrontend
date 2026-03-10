import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Dimensions, TouchableOpacity } from "react-native";
import Slider from "@react-native-community/slider";
import TrackPlayer, {
  Capability,
  State,
  usePlaybackState,
  useProgress,
  Event,
  useTrackPlayerEvents,
} from "react-native-track-player";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";

const { width } = Dimensions.get("window");

export default function AudioPlayer({ audioId, title }: { audioId: string, title?: string }) {
  const playbackState = usePlaybackState();
  const progress = useProgress();
  const [isReady, setIsReady] = useState(false);

  // Modern state check
  const currentState = (playbackState as any).state ?? playbackState;

  useEffect(() => {
    let mounted = true;

    const prepare = async () => {
      try {
        // 1. Just check if player exists, don't keep setting it up
        try {
          await TrackPlayer.setupPlayer();
        } catch (e) { }

        // 2. Only add the track if it's NOT already the current track
        const currentTrackIndex = await TrackPlayer.getCurrentTrack();
        const currentTrack = currentTrackIndex !== null ? await TrackPlayer.getTrack(currentTrackIndex) : null;

        if (!currentTrack || currentTrack.id !== audioId) {
          await TrackPlayer.reset();
          await TrackPlayer.add({
            id: audioId,
            url: `http://localhost:5001/audio/${audioId}`, // Ensure this URL is correct
            title: title || "Chapter Audio",
            artist: "Book Player",
            artwork: "https://picsum.photos/200", // Placeholder
          });
        }

        if (mounted) setIsReady(true);
      } catch (err) {
        console.error("Audio Setup Error:", err);
      }
    };

    prepare();
    return () => { mounted = false; };
  }, [audioId]);

  const togglePlay = async () => {
    if (currentState === State.Playing) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  };

  if (!isReady) return <ActivityIndicator color="#1DB954" />;

  return (
    <View style={styles.container}>
      {/* Small Compact Scrubber */}
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={progress.duration}
        value={progress.position}
        minimumTrackTintColor="#1DB954"
        maximumTrackTintColor="#333"
        thumbTintColor="#1DB954"
        onSlidingComplete={TrackPlayer.seekTo}
      />

      <View style={styles.timeRow}>
        <Text style={styles.timeLabel}>{Math.floor(progress.position / 60)}:{(progress.position % 60).toFixed(0).padStart(2, '0')}</Text>
        <Text style={styles.timeLabel}>{Math.floor(progress.duration / 60)}:{(progress.duration % 60).toFixed(0).padStart(2, '0')}</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity onPress={() => TrackPlayer.seekTo(progress.position - 10)}>
          <SkipBack size={24} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity onPress={togglePlay} style={styles.playCircle}>
          {currentState === State.Playing ?
            <Pause size={28} color="#fff" fill="#fff" /> :
            <Play size={28} color="#fff" fill="#fff" style={{ marginLeft: 4 }} />}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => TrackPlayer.seekTo(progress.position + 10)}>
          <SkipForward size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Internal styles to keep it independent of the Box components
const styles = StyleSheet.create({
  container: { width: '100%', alignItems: 'center' },
  slider: { width: '110%', height: 40 }, // Slightly wider to bleed to edges
  timeRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 10 },
  timeLabel: { fontSize: 12, color: '#666' },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 30 },
  playCircle: { backgroundColor: '#000', width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' }
});