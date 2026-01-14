import type { OGSchemaType } from '../OGSchemaType.type';
import { videoMovie } from './videoMovie';

export const videoTVShow: OGSchemaType = {
  id: 'video-tv-show',
  name: 'TV show details',
  elements: [...videoMovie.elements],
};
