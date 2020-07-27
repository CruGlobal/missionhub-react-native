declare module 'react-native-default-preference' {
  function get(key: string): Promise<string>;
  function set(key: string, value: string): Promise<Void>;
  function clear(key: string): Promise<Void>;
  function getMultiple(keys: string[]): Promise<string[]>;
  function setMultiple(data: Record<string, unknown>): Promise<Void>;
  function clearMultiple(keys: string[]): Promise<Void>;
  function getAll(): Promise<Record<string, unknown>>;
  function clearAll(): Promise<Void>;

  /** Gets and sets the current preferences file name (android) or user default suite name (ios) **/
  function getName(): Promise<string>;
  function setName(name: string): Promise<Void>;
}
