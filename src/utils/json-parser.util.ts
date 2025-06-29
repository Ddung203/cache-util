export class JSONParserUtil {
  parse<T>(input: string): [error: string, result: T] {
    try {
      const result = JSON.parse(input) as T;
      return ['', result];
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown parsing error';
      return [errorMessage, null as T];
    }
  }
} 