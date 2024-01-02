composer install
copy .env.example and rename to .env
setup database in .env
setup url to project in .env

php artisan migrate
php artisan db:seed
php artisan db:seed --class=UsersTableSeeder
npm install
npm run dev
