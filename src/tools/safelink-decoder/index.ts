import { Mailbox } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.safelink-decoder.title'),
  path: '/safelink-decoder',
  description: translate('tools.safelink-decoder.description'),
  keywords: ['outlook', 'safelink', 'decoder', '解码', '安全链接'],
  component: () => import('./safelink-decoder.vue'),
  icon: Mailbox,
  createdAt: new Date('2024-03-11'),
});
