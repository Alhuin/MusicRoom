import * as Colors from './colors';
import * as Spacing from './spacing';

export const extraLargeFontSize = 32;
export const largeFontSize = 24;
export const buttonFontSize = 18;
export const baseFontSize = 16;
export const smallFontSize = 14;
export const smallestFontSize = 10;
export const largeHeaderFontSize = largeFontSize;
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
  flex: 1,
  minHeight: 15,
  backgroundColor: Colors.darkestGrey,
};

export const screenHeaderText = {
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
  minHeight: 15,
  // backgroundColor: Colors.darkGrey,
};

export const sectionHeaderText = {
  color: Colors.lightText,
  fontSize: headerFontSize,
  fontWeight: 'bold',
};

export const sectionContent = {
  ...contentBase,
  padding: Spacing.smallest,
};

export const sectionSeparator = {
  borderBottomColor: Colors.offWhite,
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

export const iconWrapper = {
  alignItems: 'center',
  justifyContent: 'center',
};

export const icon = {
  color: Colors.baseText,
  fontSize: iconFontSize,
};

export const iconDisabled = {
  color: Colors.darkGrey,
  fontSize: iconFontSize,
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

/* const FontSizes = {
  lightOpacity: 0.72,
  strongOpacity: 0.3,
  bigIcon: 60,
  icon: 45,
  smallIcon: 30,
  screenTitle: 28,
  sectionTitle: 20,
  smallTitle: 16,
  default: 12,
  note: 10,
}; */
