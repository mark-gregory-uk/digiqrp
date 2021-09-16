# Notification module


Quickly send (real-time) notifications to your AsgardCms application.


  ``` php
  $this->notification->push('New subscription', 'Someone has subscribed!', 'fa fa-hand-peace-o text-green', route('admin.user.user.index'));
  ```

  ``` php
 /**
  * Push a notification on the dashboard
  * @param string $title
  * @param string $message
  * @param string $icon
  * @param string|null $link
 */
public function push($title, $message, $icon, $link = null);
 ```

![Notifications demo screenshot](https://cldup.com/Dvb8rrcJLv.thumb.png)

***

## Installation

### Composer

Execute the following command in your terminal:

``` bash
composer require asgardcms/notification-module
```

**Note: After installation you'll have to give you the required permissions to get to the blog module pages in the backend.**

#### Run migrations

``` bash
php artisan module:migrate notification
```

### Publish the configuration

``` bash
php artisan module:publish-config notification
```

## Real time?

If you want real time notifications over websockets, you need to configure the `broadcasting.php` config file. After that is done, set the `asgard.notification.config.real-time` option to `true`.

Currently, [Laravel broadcasting](https://laravel.com/docs/5.5/broadcasting) supports Pusher and Redis, but AsgardCms only has the front-end integration for Pusher. More integrations are welcome via pull-request. Look at the [Pusher integration](https://github.com/AsgardCms/Notification/blob/master/Assets/js/pusherNotifications.js) for inspiration.

For configuring Pusher, you can add the following lines to your `.env` file:

```
PUSHER_APP_KEY=
PUSHER_APP_SECRET=
PUSHER_APP_ID=
PUSHER_APP_CLUSTER=us2
PUSHER_APP_ENCRYPTED=true
```

Your app's "Getting Started" tab on Pusher's website has a section for `.env`. You can just copy and paste those directly.

## Usage

Usage is simple and straightforward:

Inject the `Modules\Notification\Services\Notification` interface where you need it and assign it to a class variable.

### Send notification to logged in user

``` php
$this->notification->push('New subscription', 'Someone has subscribed!', 'fa fa-hand-peace-o text-green', route('admin.user.user.index'));
```

### Send notification to a specific user

``` php
$this->notification->to($userId)->push('New subscription', 'Someone has subscribed!', 'fa fa-hand-peace-o text-green', route('admin.user.user.index'));
```
