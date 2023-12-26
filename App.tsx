import 'react-native-gesture-handler';
import React from 'react';
import {ToastProvider} from 'react-native-toast-notifications';

import {DataProvider} from './src/hooks';
import AppNavigation from './src/navigation/App';

export default function App() {
  return (
    <ToastProvider>
      <DataProvider>
        <AppNavigation />
      </DataProvider>
    </ToastProvider>
  );
}
