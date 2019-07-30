import { NavigationActions, StackActions } from 'react-navigation';

const resetStack = (elem, routeName, params) => {
  elem.props
    .navigation
    .dispatch(StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName,
          params,
        }),
      ],
    }));
};

export default {
  resetStack,
};
