<?php

namespace Deployer;

require 'recipe/laravel.php';

set('application', 'G4LCH Larval 6 Digicore Blog Engine'); // The Application Title
set('repository', 'git@github.com:G4LCH/digiqrp.git');  // The Repository in use
set('keep_releases', 5);                                  // Number of releases to keep on hosts
set('default_timeout', 1200);

add('shared_files', ['.env']);                                  // Shared files between deploys
add('shared_dirs', ['storage', 'vendor', 'node_modules','Laravel']);      // Shared dirs between deploys
add('writable_dirs', ['storage', 'vendor', 'node_modules'.'Laravel']);    // Writable dirs by web server

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
    } elseif ('dev' === $stage) {
        desc('Deploying Project Develop ..');
        run("cp {{deploy_path}}/releases/{$releases[0]}/env/.env.dev {{deploy_path}}/releases/{$releases[0]}/.env");
    } else {
        desc('Deploying Project Stage ....');
        run("cp {{deploy_path}}/releases/{$releases[0]}/env/.env.stage {{deploy_path}}/releases/{$releases[0]}/.env");
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
});

task('reload:nginx', function () {
    run('sudo /usr/sbin/service nginx reload');
})->desc('Reloading Nginx');

task('udpserver:stop', function () {
    $stage = input()->getArgument('stage');
    if ($stage === 'prod') {
        run('sudo systemctl stop digiudp');
    }
})->desc('Reloading DIGIUdp Server');

task('udpserver:start', function () {
    $stage = input()->getArgument('stage');
    if ($stage === 'prod') {
        run('sudo systemctl start digiudp');
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

// **********************************************************************************
// Host Definitions
// **********************************************************************************
host('prod')
    ->hostname('digiqrp.com')
    ->port(22)
    ->user('root')
    ->identityFile('~/.ssh/id_rsa_root')
    ->set('writable_use_sudo', true)
    ->set('http_user', 'www-data')
    ->set('use_relative_symlink', false)
    ->set('branch', 'master')
    ->set('composer_options', '{{composer_action}} --verbose --no-dev --prefer-dist --no-interaction')
    ->set('deploy_path', '/var/www/digiqrp')
    ->set('ssh_multiplexing', true)
    ->set('git_tty', false)                         // [Optional] Allocate tty for git clone. Default value is false.
    ->set('ssh_type', 'native');                    // How we communicate with the host system

host('stage')
    ->hostname('stage.digiqrp.com')
    ->port(22)
    ->user('root')
    ->identityFile('~/.ssh/id_rsa_root')
    ->set('writable_use_sudo', true)
    ->set('http_user', 'mag')
    ->set('use_relative_symlink', false)
    ->set('branch', 'develop')
    ->set('composer_options', '{{composer_action}} --verbose --prefer-dist --no-interaction')
    ->set('deploy_path', '/var/www/digiqrp_dev')
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
