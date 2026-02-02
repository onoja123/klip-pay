import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/context';
import { fonts, spacing, radii, shadows } from '@/constants/tokens';
import { Button } from '@/components/ui';

const { width } = Dimensions.get('window');

export interface CardCustomization {
  name: string;
  color: [string, string, string];
  type: 'debit' | 'virtual';
  brand: 'mastercard' | 'visa';
}

interface CardCustomizeModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (customization: CardCustomization) => void;
  mode: 'add' | 'customize';
  initialData?: Partial<CardCustomization>;
}

const CARD_COLORS: { name: string; colors: [string, string, string] }[] = [
  { name: 'Midnight', colors: ['#2A2A2A', '#1A1A1A', '#0F0F0F'] },
  { name: 'Gold', colors: ['#C9A227', '#9A7B0A', '#6B5400'] },
  { name: 'Platinum', colors: ['#6B7280', '#4B5563', '#374151'] },
  { name: 'Rose', colors: ['#9D174D', '#831843', '#500724'] },
  { name: 'Ocean', colors: ['#0369A1', '#075985', '#0C4A6E'] },
  { name: 'Forest', colors: ['#166534', '#14532D', '#052E16'] },
  { name: 'Purple', colors: ['#7C3AED', '#6D28D9', '#4C1D95'] },
  { name: 'Coral', colors: ['#EA580C', '#C2410C', '#9A3412'] },
];

export function CardCustomizeModal({
  visible,
  onClose,
  onSave,
  mode,
  initialData,
}: CardCustomizeModalProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const [cardName, setCardName] = useState(initialData?.name || '');
  const [selectedColor, setSelectedColor] = useState<[string, string, string]>(
    initialData?.color || CARD_COLORS[0].colors
  );
  const [selectedType, setSelectedType] = useState<'debit' | 'virtual'>(
    initialData?.type || 'virtual'
  );
  const [selectedBrand, setSelectedBrand] = useState<'mastercard' | 'visa'>(
    initialData?.brand || 'mastercard'
  );

  const handleSave = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onSave({
      name: cardName || (selectedType === 'virtual' ? 'Virtual Card' : 'Debit Card'),
      color: selectedColor,
      type: selectedType,
      brand: selectedBrand,
    });
    onClose();
  };

  const handleColorSelect = (colors: [string, string, string]) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedColor(colors);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Animated.View 
        entering={FadeIn.duration(200)} 
        exiting={FadeOut.duration(200)}
        style={styles.overlay}
      >
        <BlurView intensity={20} style={StyleSheet.absoluteFill} />
        <TouchableOpacity 
          style={StyleSheet.absoluteFill} 
          onPress={onClose}
          activeOpacity={1}
        />
        
        <Animated.View 
          entering={SlideInDown.springify().damping(15)}
          exiting={SlideOutDown.duration(200)}
          style={styles.modalContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              {mode === 'add' ? 'Add New Card' : 'Customize Card'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Card Preview */}
            <View style={styles.previewSection}>
              <LinearGradient
                colors={selectedColor}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardPreview}
              >
                <View style={styles.cardContent}>
                  <View style={styles.cardTopRow}>
                    <Text style={styles.cardBrand}>klip.</Text>
                    <Text style={styles.cardType}>
                      {selectedType === 'virtual' ? 'VIRTUAL' : 'DEBIT'}
                    </Text>
                  </View>
                  <Text style={styles.cardNumber}>•••• •••• •••• ••••</Text>
                  <View style={styles.cardBottomRow}>
                    <Text style={styles.cardName}>{cardName || 'CARD NAME'}</Text>
                    {selectedBrand === 'mastercard' ? (
                      <View style={styles.mastercardLogo}>
                        <View style={[styles.mcCircle, { backgroundColor: '#EB001B' }]} />
                        <View style={[styles.mcCircle, { backgroundColor: '#F79E1B', marginLeft: -8 }]} />
                      </View>
                    ) : (
                      <Text style={styles.visaLogo}>VISA</Text>
                    )}
                  </View>
                </View>
              </LinearGradient>
            </View>

            {/* Card Name */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Card Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter card name"
                placeholderTextColor={colors.textSecondary}
                value={cardName}
                onChangeText={setCardName}
                maxLength={20}
              />
            </View>

            {/* Card Type */}
            {mode === 'add' && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Card Type</Text>
                <View style={styles.optionsRow}>
                  <TouchableOpacity
                    style={[
                      styles.optionButton,
                      selectedType === 'virtual' && styles.optionButtonActive,
                    ]}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setSelectedType('virtual');
                    }}
                  >
                    <Ionicons 
                      name="globe-outline" 
                      size={20} 
                      color={selectedType === 'virtual' ? '#FFFFFF' : colors.text} 
                    />
                    <Text style={[
                      styles.optionText,
                      selectedType === 'virtual' && styles.optionTextActive,
                    ]}>
                      Virtual
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.optionButton,
                      selectedType === 'debit' && styles.optionButtonActive,
                    ]}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setSelectedType('debit');
                    }}
                  >
                    <Ionicons 
                      name="card-outline" 
                      size={20} 
                      color={selectedType === 'debit' ? '#FFFFFF' : colors.text} 
                    />
                    <Text style={[
                      styles.optionText,
                      selectedType === 'debit' && styles.optionTextActive,
                    ]}>
                      Physical
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Card Brand */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Card Network</Text>
              <View style={styles.optionsRow}>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    selectedBrand === 'mastercard' && styles.optionButtonActive,
                  ]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedBrand('mastercard');
                  }}
                >
                  <View style={styles.mastercardSmall}>
                    <View style={[styles.mcCircleSmall, { backgroundColor: '#EB001B' }]} />
                    <View style={[styles.mcCircleSmall, { backgroundColor: '#F79E1B', marginLeft: -6 }]} />
                  </View>
                  <Text style={[
                    styles.optionText,
                    selectedBrand === 'mastercard' && styles.optionTextActive,
                  ]}>
                    Mastercard
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    selectedBrand === 'visa' && styles.optionButtonActive,
                  ]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedBrand('visa');
                  }}
                >
                  <Text style={[
                    styles.visaSmall,
                    selectedBrand === 'visa' && { color: '#FFFFFF' },
                  ]}>
                    VISA
                  </Text>
                  <Text style={[
                    styles.optionText,
                    selectedBrand === 'visa' && styles.optionTextActive,
                  ]}>
                    Visa
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Card Color */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Card Color</Text>
              <View style={styles.colorGrid}>
                {CARD_COLORS.map((colorOption) => (
                  <TouchableOpacity
                    key={colorOption.name}
                    style={styles.colorOption}
                    onPress={() => handleColorSelect(colorOption.colors)}
                  >
                    <LinearGradient
                      colors={colorOption.colors}
                      style={[
                        styles.colorSwatch,
                        selectedColor[0] === colorOption.colors[0] && styles.colorSwatchActive,
                      ]}
                    >
                      {selectedColor[0] === colorOption.colors[0] && (
                        <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                      )}
                    </LinearGradient>
                    <Text style={styles.colorName}>{colorOption.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Save Button */}
          <View style={styles.footer}>
            <Button 
              onPress={handleSave}
              fullWidth
            >
              {mode === 'add' ? 'Create Card' : 'Save Changes'}
            </Button>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radii['2xl'],
    borderTopRightRadius: radii['2xl'],
    maxHeight: '90%',
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: 22,
    fontFamily: fonts.sansSemiBold,
    color: colors.text,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  previewSection: {
    marginBottom: spacing.xl,
  },
  cardPreview: {
    aspectRatio: 1.586,
    borderRadius: radii.xl,
    padding: spacing.lg,
    ...shadows.md,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardBrand: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    fontStyle: 'italic',
  },
  cardType: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1,
  },
  cardNumber: {
    fontSize: 18,
    color: '#FFFFFF',
    letterSpacing: 3,
    textAlign: 'center',
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardName: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  mastercardLogo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mcCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  visaLogo: {
    fontSize: 18,
    fontWeight: '700',
    fontStyle: 'italic',
    color: '#FFFFFF',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: fonts.sansMedium,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 16,
    fontFamily: fonts.sansRegular,
    color: colors.text,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  optionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  optionButtonActive: {
    backgroundColor: colors.text,
  },
  optionText: {
    fontSize: 14,
    fontFamily: fonts.sansMedium,
    color: colors.text,
  },
  optionTextActive: {
    color: colors.background,
  },
  mastercardSmall: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mcCircleSmall: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  visaSmall: {
    fontSize: 14,
    fontWeight: '700',
    fontStyle: 'italic',
    color: colors.text,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  colorOption: {
    width: (width - spacing.xl * 2 - spacing.md * 3) / 4,
    alignItems: 'center',
  },
  colorSwatch: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorSwatchActive: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  colorName: {
    fontSize: 11,
    fontFamily: fonts.sansMedium,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
