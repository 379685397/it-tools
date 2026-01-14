// eslint-disable-next-line no-restricted-imports
import { type MaybeRefOrGetter, get, useClipboard } from '@vueuse/core';
import { useMessage } from 'naive-ui';
import { translate } from '@/plugins/i18n.plugin';

export function useCopy({
  source,
  text = () => translate('common.copiedToClipboard'),
  createToast = true,
}: { source?: MaybeRefOrGetter<string>; text?: MaybeRefOrGetter<string>; createToast?: boolean } = {}) {
  const { copy, copied, ...rest } = useClipboard({
    source,
    legacy: true,
  });

  const message = useMessage();

  return {
    ...rest,
    isJustCopied: copied,
    async copy(content?: string, { notificationMessage }: { notificationMessage?: string } = {}) {
      if (source) {
        await copy();
      }
      else {
        await copy(content);
      }

      if (createToast) {
        message.success(notificationMessage ?? get(text));
      }
    },
  };
}
