declare module 'bcryptjs' {
  /**
   * Generate a salt synchronously
   * @param {number} rounds Number of rounds to use, defaults to 10 if omitted
   * @returns {string} salt
   */
  export function genSaltSync(rounds?: number): string;

  /**
   * Generate a salt asynchronously
   * @param {number} rounds Number of rounds to use, defaults to 10 if omitted
   * @param {function} callback Callback receiving the error, if any, and the generated salt
   */
  export function genSalt(rounds: number, callback: (err: Error | null, salt: string) => void): void;
  export function genSalt(callback: (err: Error | null, salt: string) => void): void;
  export function genSalt(rounds?: number): Promise<string>;

  /**
   * Hash data synchronously
   * @param {string|Buffer} data Data to be hashed
   * @param {string|number} saltOrRounds Salt or number of rounds to use
   * @returns {string} hash
   */
  export function hashSync(data: string | Buffer, saltOrRounds: string | number): string;

  /**
   * Hash data asynchronously
   * @param {string|Buffer} data Data to be hashed
   * @param {string|number} saltOrRounds Salt or number of rounds to use
   * @param {function} callback Callback receiving the error, if any, and the hashed data
   */
  export function hash(data: string | Buffer, saltOrRounds: string | number, callback: (err: Error | null, hash: string) => void): void;
  export function hash(data: string | Buffer, saltOrRounds: string | number): Promise<string>;

  /**
   * Compare a string or buffer with a hash synchronously
   * @param {string|Buffer} data Data to compare
   * @param {string} hash Hash to compare to
   * @returns {boolean} true if compared successfully, false otherwise
   */
  export function compareSync(data: string | Buffer, hash: string): boolean;

  /**
   * Compare a string or buffer with a hash asynchronously
   * @param {string|Buffer} data Data to compare
   * @param {string} hash Hash to compare to
   * @param {function} callback Callback receiving the error, if any, and the result of the comparison
   */
  export function compare(data: string | Buffer, hash: string, callback: (err: Error | null, result: boolean) => void): void;
  export function compare(data: string | Buffer, hash: string): Promise<boolean>;

  /**
   * Gets the number of rounds used for a certain hash
   * @param {string} hash Hash
   * @returns {number} number of rounds
   */
  export function getRounds(hash: string): number;

  /**
   * Gets encoded salt from hash
   * @param {string} hash Hash
   * @returns {string} salt
   */
  export function getSalt(hash: string): string;
} 