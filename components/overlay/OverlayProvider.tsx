import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LayoutRectangle, StyleSheet, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { OverlayMask } from './OverlayMask';

export type OverlayStepName = 'Home' | 'Card' | 'DeFi' | 'Activity' | 'Profile';
export interface OverlayStep {
  name: OverlayStepName;
  description: string;
}

interface OverlayContextValue {
  isOpen: boolean;
  steps: OverlayStep[];
  activeIndex: number;
  start: (steps: OverlayStep[]) => void;
  next: () => void;
  skip: () => void;
  finish: () => void;
  registerTabRef: (name: OverlayStepName, ref: React.RefObject<TouchableOpacity>) => void;
}

export const OverlayContext = createContext<OverlayContextValue | null>(null);

export function OverlayProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [steps, setSteps] = useState<OverlayStep[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeRect, setActiveRect] = useState<LayoutRectangle | null>(null);
  const tabRefs = useRef(new Map<OverlayStepName, React.RefObject<TouchableOpacity>>());
  const { width, height } = useWindowDimensions();

  const start = useCallback((nextSteps: OverlayStep[]) => {
    setSteps(nextSteps);
    setActiveIndex(0);
    setIsOpen(true);
  }, []);

  const finish = useCallback(() => {
    setIsOpen(false);
    setSteps([]);
    setActiveIndex(0);
    setActiveRect(null);
  }, []);

  const next = useCallback(() => {
    setActiveIndex(prev => {
      if (prev >= steps.length - 1) {
        finish();
        return prev;
      }
      return prev + 1;
    });
  }, [finish, steps.length]);

  const skip = useCallback(() => {
    finish();
  }, [finish]);

  const registerTabRef = useCallback(
    (name: OverlayStepName, ref: React.RefObject<TouchableOpacity>) => {
      tabRefs.current.set(name, ref);
    },
    []
  );

  useEffect(() => {
    if (!isOpen || steps.length === 0) {
      return;
    }
    const activeStep = steps[activeIndex];
    const ref = activeStep ? tabRefs.current.get(activeStep.name) : undefined;
    const handle = requestAnimationFrame(() => {
      if (!ref?.current) {
        setActiveRect(null);
        return;
      }
      ref.current.measureInWindow((x, y, widthRect, heightRect) => {
        setActiveRect({ x, y, width: widthRect, height: heightRect });
      });
    });
    return () => cancelAnimationFrame(handle);
  }, [activeIndex, isOpen, steps, width, height]);

  const value = useMemo(
    () => ({
      isOpen,
      steps,
      activeIndex,
      start,
      next,
      skip,
      finish,
      registerTabRef,
    }),
    [isOpen, steps, activeIndex, start, next, skip, finish, registerTabRef]
  );

  const currentStep = steps[activeIndex];

  return (
    <OverlayContext.Provider value={value}>
      <View style={styles.container}>
        {children}
      <OverlayMask
        visible={isOpen}
        stepName={currentStep?.name ?? 'Home'}
        description={currentStep?.description}
        rect={activeRect}
        isLast={activeIndex >= steps.length - 1}
        onNext={next}
          onSkip={skip}
        />
      </View>
    </OverlayContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
