import * as Colors from './colors';
import * as Spacing from './spacing';
import * as Typography from './typography';

export const cardBorderRadius = 20;

export const base = {
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'space-around',
  overflow: 'hidden',
};

export const styleBase = {
  borderRadius: cardBorderRadius,
  backgroundColor: Colors.card,
  borderTopWidth: 3,
  borderRightWidth: 3,
  borderColor: Colors.lightGreen,
  borderTopLeftRadius: 0,
  borderBottomRightRadius: 0,
};

export const card = {
  ...base,
  ...styleBase,
  flexDirection: 'column',
  padding: Spacing.small,
  paddingVertical: Spacing.smallest,
  marginVertical: Spacing.smallest,
};

export const cardHeader = {
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
};

export const cardHeaderText = {
  ...Typography.sectionHeaderText,
};

export const cardContent = {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  padding: Spacing.smallest,
};
