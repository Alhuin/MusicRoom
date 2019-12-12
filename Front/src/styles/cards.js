import * as Colors from './colors';
import * as Spacing from './spacing';
import * as Typography from './typography';

export const smallCardHeight = 60;
export const largeCardHeight = 110;
export const cardBorderRadius = 20;

export const base = {
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'space-around',
};

export const largeCard = {
  ...base,
  flexDirection: 'row',
  padding: Spacing.smallest,
  height: largeCardHeight,
  backgroundColor: Colors.mediumGrey,
  borderRadius: cardBorderRadius,
  overflow: 'hidden',
  justifyContent: 'space-around',
  marginVertical: Spacing.small,

};

export const smallCard = {
  ...base,
  flexDirection: 'column',
  padding: Spacing.smallest,
  // height: smallCardHeight,
  backgroundColor: Colors.mediumGrey,
  borderRadius: cardBorderRadius,
  overflow: 'hidden',
  justifyContent: 'space-around',
  marginVertical: Spacing.small,
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
  margin: Spacing.smallest,
};
