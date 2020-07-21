import { cleanup } from 'react-native-testing-library';

// https://callstack.github.io/react-native-testing-library/docs/api#cleanup
// Should be able to delete this after migration to v2 https://callstack.github.io/react-native-testing-library/docs/migration-v2#auto-cleanup
afterEach(cleanup);
