<?php

namespace Deployer;

require 'recipe/laravel.php';

set('application', 'DigiQRP Laravel 8 Application'); // The Application Title
set('repository', 'git@github.com:G4LCH/digiqrp.git');     // The Repository in use
set('keep_releases', 4);                                   // Number of releases to keep on hosts
set('default_timeout', 1200);

add('shared_files', array('.env','public/sitemap.xml'));                       // Shared files between deploys
add('shared_dirs', array('storage', 'vendor', 'node_modules','Laravel'));      // Shared dirs between deploys
add('writable_dirs', array('storage', 'vendor', 'node_modules'.'Laravel'));    // Writable dirs by web server

// **********************************************************************************
// Task Definitions
// **********************************************************************************
task('deploy:permissions', function () {
    $releases = get('releases_list');
    $stage = null;

    if (input()->hasArgument('stage')) {
        $stage = input()->getArgument('stage');
    }

    if ('prod' === $stage) {
        desc('Deploying Project Production');
        run("cp {{deploy_path}}/releases/{$releases[0]}/env/.env.prod {{deploy_path}}/releases/{$releases[0]}/.env");
    }
})->desc('Set ownership and permissions');

task('reload:php-fpm', function () {
    $stage = input()->getArgument('stage');
    if ($stage === 'dev') {
        run('sudo /usr/sbin/service php7.4-fpm reload');
    }
    if ($stage === 'stage') {
        run('sudo /usr/sbin/service php7.4-fpm reload');
    }
    if ($stage === 'prod') {
        run('sudo /usr/sbin/service php7.4-fpm reload');
    }
})->desc('Reloading PHP-FPM');

task('reload:nginx', function () {
    run('sudo /usr/sbin/service nginx reload');
})->desc('Reloading Nginx');

task('udpserver:stop', function () {
    $stage = input()->getArgument('stage');
    if ($stage === 'prod') {
        run('sudo systemctl stop digiqrp');
    }
})->desc('Reloading DIGIUdp Server');

task('udpserver:start', function () {
    $stage = input()->getArgument('stage');
    if ($stage === 'prod') {
        run('sudo systemctl start digiqrp');
    }
})->desc('Starting DIGIUdp Server');


task('reload:supervisor', function () {
    run('sudo /usr/sbin/service supervisor reload');
})->desc('Reloading Supervisor');

task('build', function () {
    run('cd {{release_path}} && build');
})->desc('Building Application');

task('migrate', function () {
        invoke('artisan:migrate');
})->desc('Migrating Database');

// if deploy to production, then ask to be sure
task('cache-clean', function () {
    run('{{bin/php}} {{release_path}}/artisan cache:clear');
    run('{{bin/php}} {{release_path}}/artisan view:clear');
    run('{{bin/php}} {{release_path}}/artisan config:clear');
})->desc('Clearing System Config and Cache');

task('sitemap', function () {
    run('{{bin/php}} {{release_path}}/artisan sitemap:generate');
})->desc('Generating Sitemap');

// **********************************************************************************
// Host Definitions
// **********************************************************************************
host('prod')
    ->hostname('192.168.0.7')
    ->port(702)
    ->user('deploy')
    ->identityFile('~/.ssh/id_rsa_pi_deploy')
    ->set('writable_use_sudo', true)
    ->set('http_user', 'www-data')
    ->set('use_relative_symlink', false)
    ->set('branch', 'main')
    ->set('composer_options', '{{composer_action}} --verbose --no-dev --prefer-dist --no-interaction')
    ->set('deploy_path', '/var/www/digiqrp')
    ->set('ssh_multiplexing', true)
    ->set('git_tty', false)                         // [Optional] Allocate tty for git clone. Default value is false.
    ->set('ssh_type', 'native');                    // How we communicate with the host system

// **********************************************************************************
// Rules & Actions
// **********************************************************************************

after('deploy:prepare', 'udpserver:stop');
after('success', 'deploy:permissions');
after('deploy:failed', 'deploy:unlock');
after('deploy:permissions', 'migrate');
after('deploy', 'cache-clean');
after('deploy', 'reload:php-fpm');
after('deploy', 'reload:nginx');
after('deploy', 'reload:supervisor');
after('deploy', 'udpserver:start');
after('deploy', 'sitemap');
