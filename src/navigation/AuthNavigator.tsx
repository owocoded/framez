import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="SignIn" 
        component={SignInScreen} 
        options={{
          headerShown: true,
          title: 'Sign In',
        }}
      />
      <Stack.Screen 
        name="SignUp" 
        component={SignUpScreen} 
        options={{
          headerShown: true,
          title: 'Sign Up',
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;