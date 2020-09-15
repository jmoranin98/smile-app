import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DoctorOverview from './DoctorOverview';
import ConfirmAppointment from './ConfirmAppointment';
import BudgetDetail from './BudgetDetail';

const DoctorFeedNavigator = createStackNavigator();

const DoctorFeed = () => {
  return (
    <DoctorFeedNavigator.Navigator
      initialRouteName='DoctorOverview'
      screenOptions={{
        headerShown: false,
      }}
    >
      <DoctorFeedNavigator.Screen
        name='DoctorOverview'
        component={DoctorOverview}
      />
      <DoctorFeedNavigator.Screen
        name='ConfirmAppointment'
        component={ConfirmAppointment}
      />
      <DoctorFeedNavigator.Screen
        name='BudgetDetail'
        component={BudgetDetail}
      />
    </DoctorFeedNavigator.Navigator>
  );
};

export default DoctorFeed;
