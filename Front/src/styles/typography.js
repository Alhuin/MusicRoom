import * as Colors from './colors';
import * as Spacing from './spacing';

export const extraLargeFontSize = 32;
export const largerFontSize = 24;
export const largeFontSize = 20;
export const buttonFontSize = 18;
export const baseFontSize = 16;
export const smallFontSize = 14;
export const smallestFontSize = 10;
export const largeHeaderFontSize = largerFontSize;
export const headerFontSize = 20;
export const iconFontSize = 40;
export const smallIconFontSize = 30;

export const headerBase = {
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'row',
  width: '100%',
};

export const contentBase = {
  display: 'flex',
  justifyContent: 'center',
};

export const screenHeader = {
  ...headerBase,
  backgroundColor: Colors.screenHeader,
  padding: Spacing.smaller,
};

export const screenHeaderText = {
  fontFamily: 'System',
  color: Colors.baseText,
  fontSize: largeHeaderFontSize,
  fontWeight: 'bold',
};

export const section = {
  ...contentBase,
  padding: Spacing.smallest,
};

export const sectionHeader = {
  ...headerBase,
  // backgroundColor: Colors.darkGrey,
};

export const sectionHeaderText = {
  color: Colors.lightText,
  fontSize: headerFontSize,
  fontWeight: 'bold',
};

export const headerSidesContainerStyle = {
  flex: 1,
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'row',
};

export const sectionContent = {
  ...contentBase,
  padding: Spacing.smallest,
};

export const sectionSeparator = {
  borderBottomColor: Colors.lightGreen,
  borderBottomWidth: 1,
};

export const body = {
  ...contentBase,
  flexDirection: 'row',
  flex: 12,
  paddingHorizontal: Spacing.small,
  paddingVertical: Spacing.smaller,
};

export const bodyText = {
  color: Colors.baseText,
  fontSize: smallFontSize,
  lineHeight: 19,
};

export const smallText = {
  color: Colors.baseText,
  fontSize: smallestFontSize,
};

export const iconWrapper = {
  alignItems: 'center',
  justifyContent: 'center',
};

export const icon = {
  color: Colors.icon,
  fontSize: iconFontSize,
};

export const smallIcon = {
  color: Colors.icon,
  fontSize: iconFontSize,
};

export const iconDisabled = {
  color: Colors.iconDisabled,
  fontSize: smallIconFontSize,
};

export const checkboxRow = {
  flexDirection: 'column',
  justifyContent: 'space-around',
  alignItems: 'flex-start',
};

export const checkboxesWrapper = {
  flexDirection: 'row',
  justifyContent: 'space-around',
};

export const paddingMiniPlayer = {
  paddingBottom: Spacing.paddingMiniPlayer,
};

export const textInput = {
  backgroundColor: Colors.background,
  borderBottomWidth: 1,
  borderColor: Colors.lightGreen,
  margin: Spacing.small,
  color: Colors.baseText,
  padding: 0,
};
