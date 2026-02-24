import { CollectionConfig } from 'payload/types';

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticURL: '/media',
    staticDir: 'media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        crop: 'center',
      },
      {
        name: 'card',
        width: 600,
        height: 600,
        crop: 'center',
      },
      {
        name: 'large',
        width: 1200,
        height: 800,
        crop: 'center',
      },
    ],
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'alt',
      label: 'Альтернативный текст',
      type: 'text',
    },
  ],
};
