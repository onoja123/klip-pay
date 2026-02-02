import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/context';
import { spacing, radii, fonts } from '@/constants/tokens';

const AnimatedView = Animated.View;

export default function ProfileScreen() {
  const { colors, mode, setMode, isDark } = useTheme();
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showAppearanceModal, setShowAppearanceModal] = useState(false);

  const appearanceOptions = [
    { id: 'light' as const, label: 'Light', icon: 'sunny' as const },
    { id: 'dark' as const, label: 'Dark', icon: 'moon' as const },
    { id: 'system' as const, label: 'System', icon: 'phone-portrait' as const },
  ];

  const getAppearanceLabel = () => {
    if (mode === 'system') return 'System';
    if (mode === 'dark') return 'Dark';
    return 'Light';
  };

  const handleAppearanceSelect = async (selectedMode: 'light' | 'dark' | 'system') => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setMode(selectedMode);
    setShowAppearanceModal(false);
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <AnimatedView entering={FadeInDown.delay(100).duration(400)} style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </AnimatedView>

        {/* Profile Card */}
        <AnimatedView entering={FadeInDown.delay(150).duration(400)} style={styles.profileSection}>
          <View style={styles.profileCard}>
            <LinearGradient
              colors={['#E8D5FF', '#FFD5E5']}
              style={styles.avatar}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Address 1</Text>
              <Text style={styles.profileAddress}>7nYB...4kPq</Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="create-outline" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
        </AnimatedView>

        {/* Security Section */}
        <AnimatedView entering={FadeInDown.delay(200).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          <View style={styles.sectionCard}>
            {/* Biometric */}
            <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
              <View style={[styles.settingIcon, { backgroundColor: colors.infoLight }]}>
                <Ionicons name="finger-print" size={20} color={colors.info} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Biometric Login</Text>
                <Text style={styles.settingSubtitle}>Use Face ID or Touch ID</Text>
              </View>
              <Switch
                value={biometricEnabled}
                onValueChange={setBiometricEnabled}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Change PIN */}
            <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
              <View style={[styles.settingIcon, { backgroundColor: colors.successLight }]}>
                <Ionicons name="lock-closed" size={20} color={colors.success} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Change PIN</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Backup Phrase */}
            <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
              <View style={[styles.settingIcon, { backgroundColor: colors.warningLight }]}>
                <Ionicons name="key" size={20} color={colors.warning} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Backup Phrase</Text>
                <Text style={styles.settingSubtitle}>View your recovery phrase</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          </View>
        </AnimatedView>

        {/* Preferences Section */}
        <AnimatedView entering={FadeInDown.delay(250).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.sectionCard}>
            {/* Notifications */}
            <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
              <View style={[styles.settingIcon, { backgroundColor: '#F3E8FF' }]}>
                <Ionicons name="notifications" size={20} color="#8B5CF6" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Notifications</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Currency */}
            <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
              <View style={[styles.settingIcon, { backgroundColor: colors.surface }]}>
                <Ionicons name="globe" size={20} color={colors.text} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Currency</Text>
                <Text style={styles.settingSubtitle}>USD</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Appearance - Opens Modal */}
            <TouchableOpacity 
              style={styles.settingRow} 
              activeOpacity={0.7}
              onPress={() => setShowAppearanceModal(true)}
            >
              <View style={[styles.settingIcon, { backgroundColor: isDark ? colors.primary + '20' : colors.surface }]}>
                <Ionicons name={isDark ? 'moon' : 'sunny'} size={20} color={isDark ? colors.primary : colors.text} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Appearance</Text>
                <Text style={styles.settingSubtitle}>{getAppearanceLabel()}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          </View>
        </AnimatedView>

        {/* Support Section */}
        <AnimatedView entering={FadeInDown.delay(300).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.sectionCard}>
            <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
              <View style={[styles.settingIcon, { backgroundColor: colors.surface }]}>
                <Ionicons name="help-circle" size={20} color={colors.text} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Help Center</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
              <View style={[styles.settingIcon, { backgroundColor: colors.surface }]}>
                <Ionicons name="chatbubble" size={20} color={colors.text} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Contact Support</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
              <View style={[styles.settingIcon, { backgroundColor: colors.surface }]}>
                <Ionicons name="document-text" size={20} color={colors.text} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Terms of Service</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          </View>
        </AnimatedView>

        <AnimatedView entering={FadeInDown.delay(350).duration(400)} style={styles.versionContainer}>
          <Text style={styles.versionText}>Klip Wallet v1.0.0</Text>
        </AnimatedView>
      </ScrollView>

      {/* Appearance Modal */}
      <Modal
        visible={showAppearanceModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAppearanceModal(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowAppearanceModal(false)}
        >
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Appearance</Text>
            <Text style={styles.modalSubtitle}>Choose how Klip looks to you</Text>
            
            <View style={styles.appearanceOptions}>
              {appearanceOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.appearanceOption,
                    mode === option.id && styles.appearanceOptionSelected,
                  ]}
                  onPress={() => handleAppearanceSelect(option.id)}
                >
                  <View style={[
                    styles.appearanceIconBg,
                    mode === option.id && styles.appearanceIconBgSelected,
                  ]}>
                    <Ionicons 
                      name={option.icon} 
                      size={24} 
                      color={mode === option.id ? colors.primary : colors.text} 
                    />
                  </View>
                  <Text style={[
                    styles.appearanceLabel,
                    mode === option.id && styles.appearanceLabelSelected,
                  ]}>
                    {option.label}
                  </Text>
                  {mode === option.id && (
                    <View style={styles.checkIcon}>
                      <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontFamily: fonts.displayBold,
    color: colors.text,
  },
  profileSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderRadius: radii.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  profileInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  profileName: {
    fontSize: 18,
    fontFamily: fonts.sansSemiBold,
    color: colors.text,
  },
  profileAddress: {
    fontSize: 14,
    fontFamily: fonts.sansRegular,
    color: colors.textSecondary,
    marginTop: 2,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: fonts.sansSemiBold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  sectionCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: fonts.sansMedium,
    color: colors.text,
  },
  settingSubtitle: {
    fontSize: 13,
    fontFamily: fonts.sansRegular,
    color: colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 68,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  versionText: {
    fontSize: 13,
    fontFamily: fonts.sansRegular,
    color: colors.textTertiary,
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surfaceElevated,
    borderTopLeftRadius: radii['2xl'],
    borderTopRightRadius: radii['2xl'],
    padding: spacing.xl,
    paddingBottom: spacing['4xl'],
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.xl,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: fonts.displaySemiBold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  modalSubtitle: {
    fontSize: 15,
    fontFamily: fonts.sansRegular,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  appearanceOptions: {
    gap: spacing.md,
  },
  appearanceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  appearanceOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  appearanceIconBg: {
    width: 48,
    height: 48,
    borderRadius: radii.lg,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appearanceIconBgSelected: {
    backgroundColor: colors.primary + '20',
  },
  appearanceLabel: {
    flex: 1,
    fontSize: 17,
    fontFamily: fonts.sansMedium,
    color: colors.text,
    marginLeft: spacing.md,
  },
  appearanceLabelSelected: {
    color: colors.primary,
    fontFamily: fonts.sansSemiBold,
  },
  checkIcon: {
    marginLeft: spacing.sm,
  },
});
