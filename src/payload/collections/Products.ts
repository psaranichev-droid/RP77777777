import { CollectionConfig } from 'payload/types';

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'price', 'category', 'vendor', 'in_stock'],
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
      label: 'Название товара',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'Описание',
      type: 'richText',
    },
    {
      name: 'price',
      label: 'Цена',
      type: 'number',
      required: true,
    },
    {
      name: 'old_price',
      label: 'Старая цена',
      type: 'number',
    },
    {
      name: 'vendor',
      label: 'Производитель',
      type: 'text',
    },
    {
      name: 'main_image',
      label: 'Основное изображение',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'images',
      label: 'Дополнительные изображения',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'category',
      label: 'Категория',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
    },
    {
      name: 'in_stock',
      label: 'В наличии',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'quantity',
      label: 'Количество',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'sku',
      label: 'SKU/Артикул',
      type: 'text',
      unique: true,
    },
  ],
  timestamps: true,
};
