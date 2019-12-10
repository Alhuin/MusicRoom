import * as Colors from './colors';
import * as Spacing from './spacing';
import * as Typography from './typography';

export const base = {
  alignItems: 'center',
  justifyContent: 'center',
};

export const small = {
  height: 60,
  width: 60,
};

export const large = {
  height: 40,
  width: 180,
};

export const fabIcon = {
  transform: [{ translateX: +2 }],
  fontSize: Typography.smallIconFontSize,
  color: Colors.white,
};

export const text = {
  color: Colors.white,
  fontSize: Typography.smallestFontSize,
  fontWeight: 'bold',
  letterSpacing: 1,
};

export const rounded = {
  borderRadius: 50,
};

export const bottomRightCorner = {
  position: 'absolute',
  right: 20,
};

export const fab = {
  ...base,
  ...small,
  ...rounded,
  position: 'absolute',
  right: 20, // va plutôt dans les styles des components
};

export const largeButton = {
  ...base,
  ...large,
  backgroundColor: Colors.button,
  margin: Spacing.small,
};
