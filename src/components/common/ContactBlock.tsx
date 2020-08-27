import React from 'react';
import {IContact} from '../../typings/FetchData';
import {StyleSheet, View} from 'react-native';
import {sizes, useTheme} from '../../context/ThemeContext';
import MyText from '../controls/MyText';
import {getFontFamily} from '../../utils/getFontFamily';

interface IContactBlockProps {
  contact: IContact;
}

const ContactBlock = ({contact}: IContactBlockProps) => {
  const {border, lightText} = useTheme();

  return (
    <View style={[styles.con, {borderColor: border}]}>
      <View style={styles.topBlock}>
        <MyText
          style={
            styles.text
          }>{`${contact.firstName} ${contact.lastName}`}</MyText>
      </View>
      <MyText style={styles.text}>{contact.phone}</MyText>
    </View>
  );
};

const styles = StyleSheet.create({
  con: {
    padding: sizes[8],
    borderWidth: 1,
    borderRadius: 1,
  },
  text: {
    fontSize: sizes[9],
    fontFamily: getFontFamily('500'),
  },
  topBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: sizes[8],
  },
  point: {
    width: sizes[2],
    height: sizes[2],
    marginVertical: sizes[2],
  },
});

export default ContactBlock;
