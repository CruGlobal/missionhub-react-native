declare module 'react-native-default-preference' {
  function get(key: string): Promise<string>;
  function set(key: string, value: string): Promise<Void>;
  function clear(key: string): Promise<Void>;
  function getMultiple(keys: string[]): Promise<string[]>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function setMultiple(data: Record<string, any>): Promise<Void>;
  function clearMultiple(keys: string[]): Promise<Void>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function getAll(): Promise<Record<string, any>>;
  function clearAll(): Promise<Void>;

  /** Gets and sets the current preferences file name (android) or user default suite name (ios) **/
  function getName(): Promise<string>;
  function setName(name: string): Promise<Void>;
}
