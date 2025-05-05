import React, { useEffect, useState } from 'react';
import { View, Modal, StyleProp, ViewStyle, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Input } from './Input';
import Button from './Button';
import { theme } from './theme';
import Divider from './Divider';
import { ThemedText } from './ThemedText';
import { BlurView } from 'expo-blur';

interface SelectProps {
  label?: string;
  enableFilter?: boolean;
  options: Option[];
  placeholder?: string;
  selectedOptions?: Option;
  style?: StyleProp<ViewStyle>;

  onSelect?: (option: Option) => void;
  onChange?: (value: string) => void;
}

export interface Option {
  label: string;
  value: string;
}

export const Select = ({
  label = 'Select your item',
  enableFilter = true,
  onChange,
  onSelect,
  options: initialOptions,
  placeholder,
  selectedOptions,
  style,
}: SelectProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState<Option | null>(null);
  const [searchText, setSearchText] = useState('');
  const [filteredOptions, setFilteredOptions] =
    useState<Option[]>(initialOptions);

  useEffect(() => {
    if (selectedOptions) {
      setSelectedValue(selectedOptions);
    }
  }, [selectedOptions]);

  useEffect(() => {
    if (searchText === '') {
      setFilteredOptions(initialOptions);
    } else {
      const newItems = initialOptions.filter((item) =>
        item.label.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredOptions(newItems);
    }
  }, [searchText, initialOptions]); // It runs when search text or items changes

  const handleSelect = (option: Option) => {
    setSelectedValue(option);
    if (onSelect) onSelect(option);
    if (onChange) onChange(option.value);
    setModalVisible(false);
    setSearchText(''); // Clean the search text when selecting an option
  };

  const handleSearchChange = (text: string) => {
    setSearchText(text);
  };

  return (
    <View style={style}>
      <Input
        label={label}
        placeholder={placeholder}
        onPress={() => setModalVisible(true)}
      />

      <SelectContent>
        <SelectItem label="item 1" />
        <SelectItem label="item 2" />
        <SelectItem label="item 3" />
      </SelectContent>

      {/* <Button
        disabled={readOnly}
        iconRight={
          <AntDesign name={modalVisible ? 'up' : 'down'} color={'white'} />
        }
        onPress={() => setModalVisible(true)}
        containerTextAndIconsStyle={{ justifyContent: 'space-between' }}
      >
        <Text style={styles.selectButtonText}>
          {selectedValue ? (
            selectedValue.label
          ) : placeholder ? (
            <Text style={{ color: theme.muted }}>{placeholder}</Text>
          ) : (
            'Select'
          )}
        </Text>
      </Button> */}

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#0009',
          }}
        >
          <View
            style={{
              backgroundColor: theme.background,
              borderRadius: theme.radius,
              padding: 20,
              width: '90%',
              maxWidth: 360,
              maxHeight: '80%',
            }}
          >
            {enableFilter && (
              <Input
                placeholder="Search"
                onChange={(e) => handleSearchChange(e.nativeEvent.text)}
                value={searchText}
                placeholderTextColor={theme.mutedForeground}
                style={{ borderColor: theme.mutedForeground, marginBottom: 10 }}
              />
            )}
            <ScrollView>
              {filteredOptions.map((option) => (
                <Button
                  key={option.label}
                  iconLeft={
                    <Ionicons
                      name={
                        selectedValue && selectedValue.label === option.label
                          ? 'checkbox-outline'
                          : 'square-outline'
                      }
                      size={20}
                      color={
                        selectedValue && selectedValue.label === option.label
                          ? theme.primary
                          : theme.muted
                      }
                    />
                  }
                  variant="ghost"
                  onPress={() => handleSelect(option)}
                  containerTextAndIconsStyle={{
                    justifyContent: 'flex-start',
                  }}
                >
                  <ThemedText
                    style={{
                      color:
                        selectedValue && selectedValue.label === option.label
                          ? theme.primary
                          : '#fff',
                      fontWeight:
                        selectedValue && selectedValue.label === option.label
                          ? 'bold'
                          : 'normal',
                    }}
                  >
                    {option.label}
                  </ThemedText>
                </Button>
              ))}
            </ScrollView>

            <Divider style={{ marginVertical: 10 }} />

            <Button
              variant="outlined"
              onPress={() => {
                setModalVisible(false);
                setSearchText('');
              }}
            >
              Close
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
};

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
  label: string;
  active?: boolean;
  onPress?: () => void;
}

export const SelectItem = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button> & SelectItemProps
>(({ label, active, onPress, ...props }, ref) => (
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
    <ThemedText
      style={{
        color: active ? theme.primary : theme.foreground,
        fontWeight: active ? 'bold' : 'normal',
      }}
    >
      {label}
    </ThemedText>
  </Button>
));
SelectItem.displayName = 'SelectItem';

export default Select;
