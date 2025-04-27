
declare global {
  interface Window {
    hj?: (
      method: string,
      ...args: any[]
    ) => void;
    _hjSettings?: {
      hjid: number;
      hjsv: number;
      hjdebug?: boolean;
    };
  }
}

export {};
