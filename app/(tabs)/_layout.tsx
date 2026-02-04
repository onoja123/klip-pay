import React, { useEffect, useRef } from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context';
import { fonts } from '@/constants/tokens';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { OverlayProvider, type OverlayStepName } from '@/components/overlay/OverlayProvider';
import { useOverlay } from '@/components/overlay/useOverlay';

function TabBarButton({
  name,
  ...props
}: BottomTabBarButtonProps & {
  name: OverlayStepName;
}) {
  const buttonRef = useRef<TouchableOpacity>(null);
  const { registerTabRef } = useOverlay();

  useEffect(() => {
    registerTabRef(name, buttonRef);
  }, [name, registerTabRef]);

  return <TouchableOpacity {...props} ref={buttonRef} activeOpacity={0.7} />;
}

export default function TabLayout() {
  const { colors, isDark } = useTheme();

  return (
    <OverlayProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.text,
          tabBarInactiveTintColor: colors.textTertiary,
          tabBarStyle: {
            position: 'absolute',
            backgroundColor: Platform.OS === 'ios' ? 'transparent' : colors.background,
            borderTopWidth: 0,
            elevation: 0,
            height: 85,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: fonts.sansMedium,
            marginBottom: Platform.OS === 'ios' ? 0 : 8,
          },
          tabBarItemStyle: {
            paddingTop: 4,
          },
          tabBarBackground: () =>
            Platform.OS === 'ios' ? (
              <BlurView
                intensity={80}
                style={StyleSheet.absoluteFill}
                tint={isDark ? 'dark' : 'light'}
              />
            ) : null,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarButton: props => <TabBarButton name="Home" {...props} />,
            tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
              <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="cards"
          options={{
            title: 'Cards',
            tabBarButton: props => <TabBarButton name="Card" {...props} />,
            tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
              <Ionicons name={focused ? 'card' : 'card-outline'} size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="defi"
          options={{
            title: 'DeFi',
            tabBarButton: props => <TabBarButton name="DeFi" {...props} />,
            tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
              <Ionicons
                name={focused ? 'swap-horizontal' : 'swap-horizontal-outline'}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="activity"
          options={{
            title: 'Activity',
            tabBarButton: props => <TabBarButton name="Activity" {...props} />,
            tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
              <Ionicons name={focused ? 'globe' : 'globe-outline'} size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarButton: props => <TabBarButton name="Profile" {...props} />,
            tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
              <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </OverlayProvider>
  );
}
