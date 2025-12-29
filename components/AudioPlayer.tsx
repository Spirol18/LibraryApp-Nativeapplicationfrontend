import * as React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import TrackPlayer, {
  Capability,
  State,
  usePlaybackState,
  useProgress
} from 'react-native-track-player';


import { Button, ButtonText } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Text } from "@/components/ui/text";


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

  const audioUrl = `http://localhost:5000/audio/${audioId}`;

  React.useEffect(() => {
    let isMounted = true;

    const initializePlayer = async () => {
      try {
        setIsInitializing(true);
        setError(null);

        // Try to setup player, catch error if already initialized
        try {
          await TrackPlayer.setupPlayer();
          await TrackPlayer.updateOptions({
            capabilities: [Capability.Play, Capability.Pause, Capability.Stop],
            compactCapabilities: [Capability.Play, Capability.Pause],
          });
        } catch (setupError: any) {
          // If error is about player already being setup, that's fine
          if (!setupError.message?.includes('already been initialized')) {
            throw setupError;
          }
        }

        // Stop any playing audio
        await TrackPlayer.pause();

        // Reset queue and add new track
        await TrackPlayer.reset();
        await TrackPlayer.add({
          id: audioId,
          url: audioUrl,
          title: 'Track Title',
          artist: 'Artist Name',
        });

        if (isMounted) {
          setIsInitializing(false);
        }
      } catch (error: any) {
        console.error("Error setting up player:", error);
        if (isMounted) {
          setError(error.message || 'Failed to load audio');
          setIsInitializing(false);
        }
      }
    };

    initializePlayer();

    return () => {
      isMounted = false;

      // Cleanup: Stop playback and clear queue when component unmounts
      const cleanup = async () => {
        try {
          await TrackPlayer.pause();
          await TrackPlayer.reset();
        } catch (err) {
          console.error('Cleanup error:', err);
        }
      };

      cleanup();
    };
  }, [audioId, audioUrl]);

  const togglePlayback = async () => {
    try {
      const currentTrack = await TrackPlayer.getActiveTrack();
      if (currentTrack == null) return;

      if (playbackState.state === State.Paused || playbackState.state === State.Ready) {
        await TrackPlayer.play();
      } else {
        await TrackPlayer.pause();
      }
    } catch (err) {
      console.error('Playback error:', err);
    }
  };

  const stopSound = async () => {
    try {
      await TrackPlayer.pause();
      await TrackPlayer.seekTo(0);
    } catch (err) {
      console.error('Stop error:', err);
    }
  };

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (isInitializing || playbackState.state === State.Buffering) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading Audio...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button
        onPress={togglePlayback}
        className="w-full"
      >
        <ButtonText>
          {playbackState.state === State.Playing ? "Pause" : "Play"}
        </ButtonText>
      </Button>
      <View style={{ marginVertical: 10, width: '100%' }}>
        <Progress className='text-white bg-green-500' value={progressMeter} />
      </View>
      <Button onPress={stopSound} variant="destructive" className="w-full">
        <ButtonText>Stop</ButtonText>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});

export default AudioPlayer;