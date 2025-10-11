# Deployment Guide

## Проблемы с 500 ошибками на Render

### Основные причины 500 ошибок:

1. **Отсутствующие переменные окружения**
2. **Проблемы с подключением к базе данных**
3. **Неправильная конфигурация JWT**
4. **Проблемы с CORS**

### Необходимые переменные окружения для Render:

```bash
# Database
DATABASE_URL="postgresql://username:password@hostname:5432/database_name?schema=public&connection_limit=1&pool_timeout=20"

# JWT Configuration (ОБЯЗАТЕЛЬНО!)
JWT_SECRET="your-super-secret-jwt-key-here-minimum-32-characters"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-here-minimum-32-characters"
JWT_REFRESH_EXPIRES_IN="7d"

# Server Configuration
NODE_ENV="production"
PORT=3000
API_URL="https://your-app-name.onrender.com"

# CORS Configuration
ALLOWED_ORIGINS="https://your-frontend-domain.com,https://your-app-name.onrender.com"
```

### Настройка на Render:

1. **Перейдите в настройки вашего сервиса на Render**
2. **Добавьте все переменные окружения из списка выше**
3. **Убедитесь, что DATABASE_URL указывает на вашу PostgreSQL базу данных**
4. **JWT_SECRET и JWT_REFRESH_SECRET должны быть длинными случайными строками (минимум 32 символа)**

### Проверка базы данных:

1. **Убедитесь, что база данных PostgreSQL доступна**
2. **Проверьте, что миграции Prisma выполнены:**
   ```bash
   npx prisma migrate deploy
   ```

### Логи для отладки:

После деплоя проверьте логи в Render Dashboard. Теперь приложение будет показывать подробные ошибки:

- Ошибки подключения к базе данных
- Проблемы с JWT конфигурацией
- Ошибки CORS
- Детали ошибок аутентификации

### Частые проблемы:

1. **"JWT_SECRET is not configured"** - добавьте JWT_SECRET в переменные окружения
2. **"Failed to connect to database"** - проверьте DATABASE_URL
3. **"Not allowed by CORS"** - добавьте ваш фронтенд домен в ALLOWED_ORIGINS

### Тестирование:

После деплоя протестируйте эндпоинты:
- POST `/auth/signUp`
- POST `/auth/signIn`
- GET `/api-docs` (для проверки Swagger)

### Мониторинг:

Проверьте логи в Render Dashboard для получения подробной информации об ошибках.
