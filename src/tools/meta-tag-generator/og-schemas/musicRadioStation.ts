import type { OGSchemaType } from '../OGSchemaType.type';

export const musicRadioStation: OGSchemaType = {
  id: 'music-radio-station',
  name: 'Radio station details',
  elements: [
    { type: 'input', label: 'Creator', key: 'music:creator', placeholder: 'The creator of this radio station...' },
  ],
};
