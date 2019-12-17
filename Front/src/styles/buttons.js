import * as Colors from './colors';
import * as Spacing from './spacing';
import * as Typography from './typography';

export const base = {
  alignItems: 'center',
  justifyContent: 'center',
};

export const smallSquare = {
  height: 60,
  width: 60,
};

export const smallRectangle = {
  height: 40,
  width: 80,
};

export const large = {
  height: 40,
  width: 180,
};

export const fabIcon = {
  transform: [{ translateX: +2 }],
  fontSize: Typography.smallIconFontSize,
  color: Colors.icon,
};

export const text = {
  color: Colors.baseText,
  fontSize: Typography.smallFontSize,
  fontWeight: 'bold',
  letterSpacing: 1,
};

export const rounded = {
  borderRadius: 50,
};

export const halfRounded = {
  borderRadius: 20,
  borderTopLeftRadius: 0,
  borderBottomRightRadius: 0,
};

export const bottomRightCorner = {
  position: 'absolute',
  right: 20,
};

export const fab = {
  ...base,
  ...smallSquare,
  ...rounded,
  position: 'absolute',
  backgroundColor: Colors.button,
  right: 20, // va plutôt dans les styles des components
};

export const largeButton = {
  ...base,
  ...large,
  ...rounded,
  backgroundColor: Colors.button,
  margin: Spacing.small,
};

export const smallSpecialButton = {
  ...base,
  ...smallRectangle,
  ...halfRounded,
  backgroundColor: Colors.button,
};
