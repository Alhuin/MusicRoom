import * as Colors from './colors';
import * as Spacing from './spacing';
import * as Typography from './typography';

export const largeCardHeight = 110;
export const cardBorderRadius = 20;

export const base = {
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-around',
};

export const largeCard = {
  ...base,
  padding: Spacing.smallest,
  height: largeCardHeight,
  backgroundColor: Colors.darkestGrey,
  borderRadius: cardBorderRadius,
  overflow: 'hidden',
  justifyContent: 'space-around',
  marginVertical: Spacing.small,
};

export const cardHeader = {
  ...base,
  backgroundColor: Colors.darkGrey,
};

export const cardHeaderText = {
  ...Typography.sectionHeaderText,
};

export const cardContent = {
  flexDirection: 'column',
  justifyContent: 'center',
  margin: Spacing.smallest,
};
