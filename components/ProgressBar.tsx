import React from 'react';
import { StyleSheet, View } from 'react-native';

interface ProgressBarProps {
    progressValue: number; // 0 to 100
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progressValue }) => {
    // Ensure the value does not exceed 100
    const clampedProgress = Math.min(Math.max(progressValue, 0), 100);

    return (
        <View style={styles.container}>
            <View style={[styles.bar, { width: `${clampedProgress}%` }]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 4, // 3-4px height requirement
        backgroundColor: 'rgba(0, 0, 0, 0.1)', // Subtle background track
        overflow: 'hidden',
        marginTop: 8,
        borderRadius: 2, // Slightly rounded edges
    },
    bar: {
        height: '100%',
        backgroundColor: '#ff0000', // Red, akin to YouTube, or replace with theme color
    },
});

export default ProgressBar;
