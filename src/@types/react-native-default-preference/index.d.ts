declare module 'react-native-default-preference' {
  function get(key: String): Promise<String>;
  function set(key: String, value: String): Promise<Void>;
  function clear(key: String): Promise<Void>;
  function getMultiple(keys: Array<String>): Promise<Array<String>>;
  function setMultiple(data: Object): Promise<Void>;
  function clearMultiple(keys: Array<String>): Promise<Void>;
  function getAll(): Promise<Object>;
  function clearAll(): Promise<Void>;

  /** Gets and sets the current preferences file name (android) or user default suite name (ios) **/
  function getName(): Promise<String>;
  function setName(name: String): Promise<Void>;
}
