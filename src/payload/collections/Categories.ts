import { CollectionConfig } from 'payload/types';

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'name',
      label: 'Название категории',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'description',
      label: 'Описание',
      type: 'textarea',
    },
    {
      name: 'slug',
      label: 'URL слаг',
      type: 'text',
      unique: true,
    },
    {
      name: 'parent',
      label: 'Родительская категория',
      type: 'relationship',
      relationTo: 'categories',
    },
  ],
  timestamps: true,
};
