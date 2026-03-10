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

import { Play, CirclePause, Ban } from "lucide-react-native";


interface AudioPlayerProps {
  audioId: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioId }) => {
  const playbackState = usePlaybackState();
  const progress = useProgress();
  const [isInitializing, setIsInitializing] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [progressMeter, setProgressMeter] = React.useState(0);

  const duration = progress.duration || 0;
  const position = progress.position || 0;
  const progressValue = duration > 0 ? (position / duration) * 100 : 0;

  React.useEffect(() => {
    const timer = setTimeout(() => setProgressMeter(progressValue), 500);
    return () => clearTimeout(timer);
  }, [progressValue]);

  const expo_backend_url = process.env.expo_backend_url;
  console.log(audioId);
  console.log(expo_backend_url);
  const audioUrl = `http://127.0.0.1:5000/audio/${audioId}`;

  React.useEffect(() => {
    let isMounted = true;

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
      <Button
        onPress={togglePlayback}
        className="w-full"
      >
        <ButtonText>
          {playbackState.state === State.Playing ? <CirclePause size={20} className="text-white bg-green-500 rounded-full size-10 overflow-hidden p-1" /> : <Play size={20} className="text-white bg-green-500 rounded-full size-10 overflow-hidden p-1" />}
        </ButtonText>
      </Button>
      <View style={{ marginVertical: 10, width: '100%' }}>
        <Progress className='text-white bg-green-500' value={progressMeter} />
      </View>
      <Button onPress={stopSound} variant="destructive" className="w-full">
        <ButtonText><Ban className='bg-red-500 text-white hover:bg-red-600s size-10 overflow-hidden rounded-full p-1' size={20} /></ButtonText>
      </Button>
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