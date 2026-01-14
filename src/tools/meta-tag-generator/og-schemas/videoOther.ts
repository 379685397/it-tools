import type { OGSchemaType } from '../OGSchemaType.type';
import { videoMovie } from './videoMovie';

export const videoOther: OGSchemaType = {
  id: 'video-other',
  name: 'Other video details',
  elements: [...videoMovie.elements],
};
