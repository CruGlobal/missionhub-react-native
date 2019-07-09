// Pick different icons based on the platform

interface IconMapping {
  [key: string]: {
    android: {
      type: 'Material' | 'FontAwesome' | 'Ionicons' | 'MissionHub';
      name: string;
    };
    ios: {
      type: 'Material' | 'FontAwesome' | 'Ionicons' | 'MissionHub';
      name: string;
    };
  };
}

const mapping: IconMapping = {
  'arrow-back': {
    android: { type: 'Material', name: 'arrow-back' },
    ios: { type: 'Material', name: 'arrow-back' },
  },
  'arrow-right': {
    android: { type: 'Material', name: 'keyboard-arrow-right' },
    ios: { type: 'Material', name: 'keyboard-arrow-right' },
  },
};

export default mapping;
