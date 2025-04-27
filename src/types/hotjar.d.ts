
interface HotjarWindow extends Window {
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

declare const window: HotjarWindow;
