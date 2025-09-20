# Путь к сертификату
CERT_PATH="/etc/nginx/certs/live/marsonoid.ru/fullchain.pem"

# Проверяем, существует ли сертификат
if [ -f "$CERT_PATH" ]; then
    echo "✅ Сертификат найден — включаю HTTPS"
    cp /etc/nginx/nginx.conf.https /etc/nginx/nginx.conf
else
    echo "🔒 Сертификата ещё нет — запускаю в режиме HTTP"
    cp /etc/nginx/nginx.conf.http /etc/nginx/nginx.conf
fi

# Запускаем Nginx
exec nginx -g "daemon off;"