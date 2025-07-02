import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  StyleProp,
  ViewStyle,
  ScrollView,
} from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Input } from './Input';
import Button from './Button';
import { theme } from './theme';
import Divider from './Divider';
import { ThemedText } from './ThemedText';
import { BlurView } from 'expo-blur';

interface SelectProps {
  enableFilter?: boolean;
  options: SelectOption[];
  placeholder?: string;
  readOnly?: boolean;
  selectedOptions?: SelectOption;
  style?: StyleProp<ViewStyle>;

  onSelect?: (option: SelectOption) => void;
  onChange?: (value: string) => void;
}

export interface SelectOption {
  label: string;
  value: string;
}

const Select = ({
  enableFilter = true,
  onChange,
  onSelect,
  options: initialOptions,
  placeholder,
  readOnly = false,
  selectedOptions,
  style,
}: SelectProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState<SelectOption | null>(null);
  const [searchText, setSearchText] = useState('');
  const [filteredOptions, setFilteredOptions] =
    useState<SelectOption[]>(initialOptions);

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

  const handleSelect = (option: SelectOption) => {
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
      <Button
        disabled={readOnly}
        iconRight={
          <AntDesign name={modalVisible ? 'up' : 'down'} color={'white'} />
        }
        variant="outlined"
        textStyle={{ fontWeight: 'normal', fontSize: 14 }}
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
      </Button>

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
          <BlurView
            intensity={50}
            experimentalBlurMethod="dimezisBlurView"
            style={{
              flex: 1,
              // backgroundColor: theme.background,
              padding: 20,
              width: '90%',
              maxWidth: 360,
              maxHeight: '80%',
              overflow: 'hidden',
              borderRadius: theme.radius,
            }}
          >
            {enableFilter && (
              <Input
                leadingIcon="search-outline"
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
          </BlurView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  selectButtonText: {
    color: 'white',
  },
});

export default Select;
