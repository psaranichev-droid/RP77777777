import { CollectionConfig } from 'payload/types';

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['id', 'customer_name', 'total_price', 'status', 'createdAt'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'customer_name',
      label: 'Имя клиента',
      type: 'text',
      required: true,
    },
    {
      name: 'customer_email',
      label: 'Email клиента',
      type: 'email',
      required: true,
    },
    {
      name: 'customer_phone',
      label: 'Телефон клиента',
      type: 'text',
    },
    {
      name: 'items',
      label: 'Товары в заказе',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'product',
          label: 'Товар',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'quantity',
          label: 'Количество',
          type: 'number',
          required: true,
          min: 1,
        },
        {
          name: 'price',
          label: 'Цена за единицу',
          type: 'number',
          required: true,
        },
      ],
    },
    {
      name: 'total_price',
      label: 'Общая сумма',
      type: 'number',
      required: true,
    },
    {
      name: 'status',
      label: 'Статус заказа',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Ожидание', value: 'pending' },
        { label: 'Обработка', value: 'processing' },
        { label: 'Завершён', value: 'completed' },
        { label: 'Отменён', value: 'cancelled' },
      ],
    },
    {
      name: 'delivery_address',
      label: 'Адрес доставки',
      type: 'textarea',
      required: true,
    },
    {
      name: 'notes',
      label: 'Примечания',
      type: 'textarea',
    },
  ],
  timestamps: true,
};
