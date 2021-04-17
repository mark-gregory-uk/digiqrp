<?php

namespace Deployer;

require 'recipe/laravel.php';

set('application', 'G4LCH Larval 6 Digicore Blog Engine'); // The Application Title
set('repository', 'git@github.com:hamcore/digiqrp.git');  // The Repository in use
set('keep_releases', 4);                                  // Number of releases to keep on hosts
set('default_timeout', 1200);

add('shared_files', ['.env']);                            // Shared files between deploys
add('shared_dirs', ['storage','vendor','node_modules']);  // Shared dirs between deploys
add('writable_dirs', ['storage','vendor','node_modules']);                        // Writable dirs by web server

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
        run("cp {{deploy_path}}/releases/{$releases[0]}/provision/environment/.env.prod {{deploy_path}}/releases/{$releases[0]}/.env");
    } elseif ('dev' === $stage) {
        desc('Deploying Project Develop ..');
        run("cp {{deploy_path}}/releases/{$releases[0]}/provision/environment/.env.dev {{deploy_path}}/releases/{$releases[0]}/.env");
    } else {
        desc('Deploying Project Stage ....');
        run("cp {{deploy_path}}/releases/{$releases[0]}/provision/environment/.env.stage {{deploy_path}}/releases/{$releases[0]}/.env");
    }
})->desc('Set ownership and permissions');

task('build', function () {
    run('cd {{release_path}} && build');
})->desc('Building Application');

task('reload:php-fpm', function () {
    $stage = input()->getArgument('stage');
    if ($stage === 'dev') {
        run('sudo /usr/sbin/service php7.4-fpm reload');
    }
    if ($stage === 'stage'){
        run('sudo /usr/sbin/service php7.4-fpm reload');
    }
    if ($stage === 'prod'){
        run('sudo /usr/sbin/service php7.4-fpm reload');
    }
});

task('reload:nginx', function () {
    run('sudo /usr/sbin/service nginx reload');
})->desc('Reloading Nginx');

task('reload:supervisor', function () {
    run('sudo /usr/sbin/service supervisor reload');
})->desc('Reloading Supervisor');

// install npm
task('npm:install', function () {
    cd('{{release_path}}');
    run ('./provision/scripts/buildsys.sh');
})->desc('Running NPM Install');

task( 'npm-build-sys', function () {
    if ( askConfirmation( 'Are you sure you want to build assets ?' ) ) {
        invoke('npm:install');
        invoke('npm:build');
    }
});

// Build using laravel mix
task('npm:build', function () {
    cd('{{release_path}}');
    run ('./provision/scripts/refreshbuild.sh');
})->desc('Reloading NPM');

task( 'migrate', function () {
    if ( askConfirmation( 'Are you sure you want to run migrations?' ) ) {
        invoke('artisan:migrate:fresh');
        invoke('artisan:db:seed');
    }
})->desc('Migrating Database');

// if deploy to production, then ask to be sure
task( 'cache-clean', function () {
//    if ( askConfirmation( 'Are you sure you want to  clear system cache ?' ) ) {
        invoke('artisan:cache:clear');
        invoke('artisan:view:clear');
        invoke('artisan:config:cache');
//    }
})->desc('Clearing System Cache');


// **********************************************************************************
// Host Definitions
// **********************************************************************************
host('prod')
    ->hostname('digiqrp.com')
    ->port(22)
    ->user('root')
    ->identityFile('~/.ssh/id_rsa')
    ->set('writable_use_sudo', true)
    ->set('http_user', 'www-data')
    ->set('use_relative_symlink', false)
    ->set('branch', 'master')
    ->set('composer_options','{{composer_action}} --verbose --no-dev --prefer-dist --no-interaction')
    ->set('deploy_path', '/var/www/digiqrp')
    ->set('ssh_multiplexing', true)
    ->set('git_tty', false)                         // [Optional] Allocate tty for git clone. Default value is false.
    ->set('ssh_type', 'native');                    // How we communicate with the host system

host('dev')
    ->hostname('192.168.0.5')
    ->port(22)
    ->user('mag')
    ->identityFile('~/.ssh/id_rsa')
    ->set('writable_use_sudo', true)
    ->set('http_user', 'mag')
    ->set('use_relative_symlink', false)
    ->set('branch', 'develop')
    ->set('composer_options','{{composer_action}} --verbose --prefer-dist --no-interaction')
    ->set('deploy_path', '/var/www/dev/hamcore')
    ->set('ssh_multiplexing', true)
    ->set('git_tty', false)                         // [Optional] Allocate tty for git clone. Default value is false.
    ->set('ssh_type', 'native');                    // How we communicate with the host system

// **********************************************************************************
// Rules & Actions
// **********************************************************************************

after('success', 'deploy:permissions');
after('deploy:failed', 'deploy:unlock');

//after('deploy:permissions', 'migrate');

after('deploy:permissions','cache-clean');

//after('deploy:permissions','npm-build-sys');

// **********************************************************************************
// Restart the web servers if needed so that they can pick up any routing changes
// **********************************************************************************

after('deploy', 'reload:php-fpm');
after('deploy', 'reload:nginx');
after('deploy', 'reload:supervisor');

// **********************************************************************************
// Restart the web servers after we have performed a rollback this is important
// **********************************************************************************
after('rollback', 'reload:php-fpm');
after('rollback', 'reload:nginx');
