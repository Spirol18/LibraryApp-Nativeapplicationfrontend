import { Box } from "@/components/ui/box";
import { Button, ButtonIcon } from "@/components/ui/button";
import { Portal } from "@/components/ui/portal";
import { Text } from "@/components/ui/text";
import { Chapter } from "@/data/books";
import React from "react";

import { X } from "lucide-react-native";

import AudioPlayer from "@/components/AudioPlayer";

function PlayPopup({
  chapter,
  isOpen,
  onClose,
}: {
  chapter: Chapter | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!chapter) return null;

  return (
    <>
    <Portal isOpen={isOpen}>
  {/* Overlay */}
  <Box className="flex-1 bg-black/60 justify-center items-center">
    {/* Modal Container */}
    <Box className="w-11/12 p-6 rounded-2xl bg-background-0">
      
      {/* Header */}
      <Box className="flex-row justify-between items-center mb-4">
        <Text
          numberOfLines={2}
          className="text-lg font-semibold text-typography-900 flex-1 pr-4"
        >
          {chapter.title}
        </Text>

        <Button size="xs"  onPress={onClose}>
          <ButtonIcon as={X} />
        </Button>
      </Box>

      {/* Progress Bar */}
      <Box className="mb-4">
        <AudioPlayer audioId={"1"} />
      </Box>
    </Box>
  </Box>
</Portal>

  </>
  );
}

export default PlayPopup;