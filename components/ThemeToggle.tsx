import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { MoonIcon, SunIcon } from '@/components/ui/icon';
import { useColorScheme } from 'nativewind';

export function ThemeToggle() {
    const { colorScheme, toggleColorScheme } = useColorScheme();

    return (
        <Button
            action="secondary"
            variant="outline"
            onPress={toggleColorScheme}
            className="flex-row items-center gap-2"
        >
            <ButtonIcon as={colorScheme === 'dark' ? SunIcon : MoonIcon} />
            <ButtonText>
                {colorScheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </ButtonText>
        </Button>
    );
}
