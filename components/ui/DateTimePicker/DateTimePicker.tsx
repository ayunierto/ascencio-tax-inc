import { View, Text, Platform, Modal, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import Button from '../Button';
import RNDateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { theme } from '../theme';

interface DateTimePickerProps {
  mode?: 'date' | 'time';
  is24Hour?: boolean;
  onChange?: (date: string) => void;
  value?: string;
}
const DateTimeInput = ({
  mode = 'date',
  is24Hour = false,
  value,
  onChange,
}: DateTimePickerProps) => {
  const [date, setDate] = useState<Date>();

  useEffect(() => {
    if (value) {
      setDate(new Date(value));
    }
  }, [value]);

  // const [modeState, setModeState] = useState<'date' | 'time'>(mode);

  const [modalVisible, setModalVisible] = useState(false);

  const handleOnChange = (event: DateTimePickerEvent, date?: Date) => {
    if (onChange) {
      if (date) {
        onChange(date.toISOString());
      }
    }
    setDate(date);
  };

  const showDatepicker = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: date || new Date(),
        onChange: handleOnChange,
        mode,
        is24Hour,
      });
    }
    if (Platform.OS === 'ios') {
      setModalVisible(true);
    }
  };

  return (
    <View>
      <Button
        style={{ paddingHorizontal: 20 }}
        onPress={() => showDatepicker()}
        variant="outlined"
        containerTextAndIconsStyle={{ justifyContent: 'space-between' }}
        textStyle={{ fontWeight: 'normal' }}
      >
        {date ? (
          date.toLocaleDateString()
        ) : (
          <Text style={{ color: theme.muted }}>1/1/2025</Text>
        )}
      </Button>
      {Platform.OS === 'ios' && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(!modalVisible)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <RNDateTimePicker
                testID="dateTimePicker"
                value={date || new Date()}
                mode={mode}
                is24Hour={is24Hour}
                display="spinner"
                onChange={handleOnChange}
              />
              <Button
                variant="destructive"
                containerTextAndIconsStyle={{ justifyContent: 'flex-start' }}
                onPress={() => setModalVisible(false)}
              >
                Close
              </Button>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default DateTimeInput;
