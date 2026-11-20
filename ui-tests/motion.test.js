import React from 'react';
import {render, waitFor} from '@testing-library/react-native';
import {AccessibilityInfo, Animated, Text} from 'react-native';
import {PageEnter} from '../src/motion';
import {FadeIn} from '../src/screens/auth/Anim';

test('les apparitions deviennent immédiates lorsque la réduction des animations est activée', async () => {
  jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true);
  const timing = jest.spyOn(Animated, 'timing');
  await render(<PageEnter><FadeIn delay={500}><Text>Contenu</Text></FadeIn></PageEnter>);
  await waitFor(() => {
    const configs = timing.mock.calls.map(call => call[1]);
    expect(configs.some(config => config.duration === 0 && config.delay === 0)).toBe(true);
    expect(configs.some(config => config.duration === 0 && config.delay === undefined)).toBe(true);
  });
  timing.mockRestore();
  AccessibilityInfo.isReduceMotionEnabled.mockRestore();
});
