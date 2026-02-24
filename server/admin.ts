import { Hono } from 'hono';
import { getProducts, getCategories } from './db';

interface AdminRequest {
  username: string;
  password: string;
}

interface AdminToken {
  token: string;
  expires: number;
}

const adminTokens = new Map<string, AdminToken>();
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';
const TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function verifyAdminToken(token: string): boolean {
  const tokenData = adminTokens.get(token);
  if (!tokenData) return false;
  if (Date.now() > tokenData.expires) {
    adminTokens.delete(token);
    return false;
  }
  return true;
}

export const adminApp = new Hono();

// Login endpoint
adminApp.post('/login', async (c) => {
  try {
    const body = (await c.req.json()) as AdminRequest;
    const { username, password } = body;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const token = generateToken();
      adminTokens.set(token, {
        token,
        expires: Date.now() + TOKEN_EXPIRY,
      });

      return c.json({
        success: true,
        token,
        message: 'Успешный вход',
      });
    }

    return c.json(
      {
        success: false,
        message: 'Неверный логин или пароль',
      },
      401
    );
  } catch (error) {
    console.error('Login error:', error);
    return c.json(
      {
        success: false,
        message: 'Ошибка сервера',
      },
      500
    );
  }
});

// Verify token endpoint
adminApp.get('/verify', (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      return c.json({ success: false, message: 'No token' }, 401);
    }

    const token = authHeader.replace('Bearer ', '');
    const isValid = verifyAdminToken(token);

    return c.json({ success: isValid });
  } catch (error) {
    console.error('Verify error:', error);
    return c.json(
      {
        success: false,
        message: 'Ошибка сервера',
      },
      500
    );
  }
});

// Get products (admin)
adminApp.get('/products', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const token = authHeader?.replace('Bearer ', '') || '';

    if (!verifyAdminToken(token)) {
      return c.json({ success: false, message: 'Unauthorized' }, 401);
    }

    const result = await getProducts(1000, 0);
    return c.json({
      success: true,
      products: result.products,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return c.json(
      {
        success: false,
        message: 'Error fetching products',
      },
      500
    );
  }
});

// Create product
adminApp.post('/products', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const token = authHeader?.replace('Bearer ', '') || '';

    if (!verifyAdminToken(token)) {
      return c.json({ success: false, message: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    // TODO: Implement product creation in database
    return c.json({
      success: true,
      message: 'Product created',
      data: body,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return c.json(
      {
        success: false,
        message: 'Error creating product',
      },
      500
    );
  }
});

// Update product
adminApp.put('/products/:id', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const token = authHeader?.replace('Bearer ', '') || '';

    if (!verifyAdminToken(token)) {
      return c.json({ success: false, message: 'Unauthorized' }, 401);
    }

    const { id } = c.req.param();
    const body = await c.req.json();
    // TODO: Implement product update in database
    return c.json({
      success: true,
      message: 'Product updated',
      id,
      data: body,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return c.json(
      {
        success: false,
        message: 'Error updating product',
      },
      500
    );
  }
});

// Delete product
adminApp.delete('/products/:id', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const token = authHeader?.replace('Bearer ', '') || '';

    if (!verifyAdminToken(token)) {
      return c.json({ success: false, message: 'Unauthorized' }, 401);
    }

    const { id } = c.req.param();
    // TODO: Implement product deletion in database
    return c.json({
      success: true,
      message: 'Product deleted',
      id,
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return c.json(
      {
        success: false,
        message: 'Error deleting product',
      },
      500
    );
  }
});

// Get categories (admin)
adminApp.get('/categories', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const token = authHeader?.replace('Bearer ', '') || '';

    if (!verifyAdminToken(token)) {
      return c.json({ success: false, message: 'Unauthorized' }, 401);
    }

    const categories = await getCategories();
    return c.json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return c.json(
      {
        success: false,
        message: 'Error fetching categories',
      },
      500
    );
  }
});

// Get orders (admin)
adminApp.get('/orders', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const token = authHeader?.replace('Bearer ', '') || '';

    if (!verifyAdminToken(token)) {
      return c.json({ success: false, message: 'Unauthorized' }, 401);
    }

    // TODO: Fetch from database
    return c.json({
      success: true,
      orders: [],
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return c.json(
      {
        success: false,
        message: 'Error fetching orders',
      },
      500
    );
  }
});

// Get analytics (admin)
adminApp.get('/analytics', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const token = authHeader?.replace('Bearer ', '') || '';

    if (!verifyAdminToken(token)) {
      return c.json({ success: false, message: 'Unauthorized' }, 401);
    }

    // TODO: Calculate analytics from database
    return c.json({
      success: true,
      total_revenue: 0,
      total_orders: 0,
      total_customers: 0,
      avg_order_value: 0,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return c.json(
      {
        success: false,
        message: 'Error fetching analytics',
      },
      500
    );
  }
});
