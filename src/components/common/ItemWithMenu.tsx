import React, {useEffect, useState} from 'react';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {IContact} from '../../typings/FetchData';
import {Dimensions, StyleSheet, View} from 'react-native';
import {sizes, useTheme} from '../../context/ThemeContext';
import MyText from '../controls/MyText';
import {getFontFamily} from '../../utils/getFontFamily';
import IconButton from '../controls/IconButton';

interface IItemWithMenuProps {
  menu: any;
  content: any;
  isLoading?: boolean;
}

const window = Dimensions.get('window');
const size = Math.max(window.width, window.height);

const ItemWithMenu = ({content, menu, isLoading}: IItemWithMenuProps) => {
  const focus = useIsFocused();
  const [top, setTop] = useState(0);
  const [isShow, setIsShow] = useState(false);
  const {border, lightText, background} = useTheme();

  useEffect(() => {
    if (!focus) {
      setIsShow(false);
    }
  }, [focus]);

  return (
    <React.Fragment>
      {isShow && (
        <TouchableWithoutFeedback
          onPress={() => setIsShow(false)}
          containerStyle={{
            ...StyleSheet.absoluteFillObject,
            width: size,
            height: size,
            zIndex: 100,
          }}
        />
      )}
      {isShow && (
        <View
          style={[
            styles.blockMenu,
            {
              borderColor: border,
              backgroundColor: background,
              zIndex: 1000,
              top,
            },
          ]}>
          {menu}
        </View>
      )}
      <View
        onLayout={(e) => setTop(e.nativeEvent.layout.y)}
        style={[
          styles.con,
          {borderColor: border, opacity: isLoading ? 0.3 : 1},
        ]}>
        <View style={styles.topBlock}>{content}</View>
        <View>
          <IconButton
            icon={{
              name: 'menu-keb',
              size: sizes[10],
              fill: lightText,
            }}
            style={{
              padding: sizes[4],
              marginRight: -sizes[8],
              marginTop: -sizes[4],
            }}
            onPress={() => setIsShow(true)}
            hitSlop={{
              right: 20,
              left: 20,
              bottom: 20,
              top: 20,
            }}
          />
        </View>
      </View>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  con: {
    padding: sizes[8],
    borderWidth: 1,
    borderRadius: 1,
    marginBottom: sizes[8],
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topBlock: {
    maxWidth: '90%',
  },
  point: {
    width: sizes[2],
    height: sizes[2],
    borderRadius: sizes[1],
    marginVertical: sizes[1],
  },
  points: {
    marginVertical: -sizes[1],
  },
  blockMenu: {
    padding: sizes[5],
    borderWidth: 1,
    position: 'absolute',
    right: 0,
    top: -sizes[6],
    zIndex: 10,
    width: sizes[70],
    transform: [
      {
        translateY: -sizes[6],
      },
    ],
  },
});

export default ItemWithMenu;
