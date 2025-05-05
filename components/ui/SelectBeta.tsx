import React, { createContext, useState } from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from './Button';
import { theme } from './theme';
import { BlurView } from 'expo-blur';

interface SelectProps {
  children: (args: SelectContextProps) => JSX.Element;
}

interface SelectContextProps {
  isOpen: boolean;
  toggle: () => void;
}

export const SelectContext = createContext({} as SelectContextProps);
const SelectProvider = SelectContext.Provider;

export const Select = React.forwardRef<
  React.ElementRef<typeof View>,
  React.ComponentPropsWithoutRef<typeof View> & SelectProps
>(({ children, ...props }, ref) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <View ref={ref} {...props}>
      <SelectProvider value={{ isOpen, toggle }}>{children}</SelectProvider>
    </View>
  );
});
Select.displayName = 'Select';

export const SelectContent = React.forwardRef<
  React.ElementRef<typeof BlurView>,
  React.ComponentPropsWithoutRef<typeof BlurView>
>(({ children, style, ...props }, ref) => (
  <BlurView
    intensity={30}
    experimentalBlurMethod="dimezisBlurView"
    tint="dark"
    style={[
      {
        flex: 1,
        overflow: 'hidden',
        position: 'absolute',
        zIndex: 2,
        marginTop: 50,
        width: '100%',
        borderRadius: theme.radius,
        borderColor: theme.border,
        borderWidth: 1,
      },
      style,
    ]}
    {...props}
    ref={ref}
  >
    {children}
  </BlurView>
));
SelectContent.displayName = 'SelectContent';

interface SelectItemProps {
  active?: boolean;
  onPress?: () => void;
}

export const SelectItem = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button> & SelectItemProps
>(({ active, onPress, children, ...props }, ref) => (
  <Button
    ref={ref}
    {...props}
    iconLeft={
      <Ionicons
        name={active ? 'checkbox-outline' : 'square-outline'}
        size={20}
        color={active ? theme.primary : theme.muted}
      />
    }
    variant="ghost"
    onPress={onPress}
    containerTextAndIconsStyle={{
      justifyContent: 'flex-start',
    }}
  >
    {children}
  </Button>
));
SelectItem.displayName = 'SelectItem';

export default Select;
