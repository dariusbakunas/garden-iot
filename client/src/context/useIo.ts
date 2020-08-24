import { IIOContext, IOContext } from './io';
import { useRequiredContext } from './useRequiredContext';

export const useIOContext = (): IIOContext => {
  return useRequiredContext(IOContext);
};
