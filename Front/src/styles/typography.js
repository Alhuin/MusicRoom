import * as Colors from './colors';

export const extraLargeFontSize = 32;
export const largeFontSize = 24;
export const buttonFontSize = 18;
export const baseFontSize = 16;
export const smallFontSize = 14;
export const smallestFontSize = 10;
export const largeHeaderFontSize = 20;
export const headerFontSize = 18;
export const iconFontSize = 45;
export const smallIconFontSize = 30;

export const base = {
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
};

export const bodyText = {
  color: Colors.baseText,
  fontSize: smallFontSize,
  lineHeight: 19,
};

export const sectionHeaderText = {
  color: Colors.lightText,
  fontSize: headerFontSize,
  fontWeight: 'bold',
};

export const screenHeaderText = {
  color: Colors.baseText,
  fontSize: headerFontSize,
  fontWeight: 'bold',
};

export const screenHeader = {
  ...base,
  ...screenHeaderText,
};

export const sectionHeader = {
  ...base,
  ...sectionHeaderText,
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
