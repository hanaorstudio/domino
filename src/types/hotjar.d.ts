
interface HotjarWindow extends Window {
  hj?: (
    method: string,
    ...args: any[]
  ) => void;
  _hjSettings?: {
    hjid: number;
    hjsv: number;
  };
}

declare const window: HotjarWindow;
