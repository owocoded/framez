import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SignIn, SignUp } from '@clerk/clerk-expo';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="SignIn" 
        component={SignIn} 
        options={{
          headerShown: true,
          title: 'Sign In',
        }}
      />
      <Stack.Screen 
        name="SignUp" 
        component={SignUp} 
        options={{
          headerShown: true,
          title: 'Sign Up',
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;