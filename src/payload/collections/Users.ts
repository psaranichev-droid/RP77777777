import { CollectionConfig } from 'payload/types';

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'role', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true;
      return false;
    },
    create: ({ req: { user } }) => {
      if (user?.role === 'admin') return true;
      return false;
    },
    update: ({ req: { user } }) => {
      if (user?.role === 'admin') return true;
      if (user?.id === user?.id) return true;
      return false;
    },
    delete: ({ req: { user } }) => {
      if (user?.role === 'admin') return true;
      return false;
    },
  },
  fields: [
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'password',
      label: 'Пароль',
      type: 'password',
      required: true,
    },
    {
      name: 'role',
      label: 'Роль',
      type: 'select',
      defaultValue: 'editor',
      options: [
        { label: 'Администратор', value: 'admin' },
        { label: 'Редактор', value: 'editor' },
        { label: 'Просмотр', value: 'viewer' },
      ],
    },
    {
      name: 'name',
      label: 'Имя',
      type: 'text',
    },
  ],
  timestamps: true,
};
