import { AbstractLoggerGwAdp } from '../../abstracts';

declare const console: {
  log: (message: string) => void;
};

export class ConsoleLoggerGwAdp extends AbstractLoggerGwAdp {
  private readonly name: string = 'ConsoleLoggerGwAdp';

  log(message: string, context: string): void {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${this.name}] [${context}] ${message}`);
  }
} 