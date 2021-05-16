## Development Notes

1. Add published and publish on and un-publish with necessary commands
2. Add total station count


Run though joomla and document area / features

1. Forum
2. Uploads we need to complete these
3. Registration 
3. the ability to edit when logged into the site



Mail::to('mark.gregory@gmx.com')->send(new NewUserNotification);

Mail::send('email.newuser', [], function($message) {
$message->to('mark.gregory@gmx.com')->subject('Testing mails');
});
