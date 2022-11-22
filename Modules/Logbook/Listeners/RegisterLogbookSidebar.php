<?php

namespace Modules\Logbook\Listeners;

use Maatwebsite\Sidebar\Group;
use Maatwebsite\Sidebar\Item;
use Maatwebsite\Sidebar\Menu;
use Modules\Core\Events\BuildingSidebar;
use Modules\User\Contracts\Authentication;

class RegisterLogbookSidebar implements \Maatwebsite\Sidebar\SidebarExtender
{
    /**
     * @var Authentication
     */
    protected $auth;

    /**
     * @param Authentication $auth
     *
     * @internal param Guard $guard
     */
    public function __construct(Authentication $auth)
    {
        $this->auth = $auth;
    }

    public function handle(BuildingSidebar $sidebar)
    {
        $sidebar->add($this->extendWith($sidebar->getMenu()));
    }

    /**
     * @param Menu $menu
     *
     * @return Menu
     */
    public function extendWith(Menu $menu)
    {
        $menu->group(trans('core::sidebar.content'), function (Group $group) {
            $group->item(trans('logbook::logbooks.title.logbooks'), function (Item $item) {
                $item->icon('fa fa-book');
                $item->weight(60);
                $item->authorize(
                    (
                    $this->auth->hasAccess('logbook.logbooks.index')
                    )
                );

                $item->item(trans('logbook::logbooks.title.entries'), function (Item $item) {
                    $item->icon('fa fa-book');
                    $item->weight(1);
                    $item->route('admin.logbook.logbook.index');
                    $item->authorize(
                        $this->auth->hasAccess('logbook.logbooks.index')
                    );
                });

                $item->item(trans('Countries'), function (Item $item) {
                    $item->icon('fa fa-globe');
                    $item->weight(2);
                    $item->route('admin.logbook.countries.index');
                    $item->authorize(
                        $this->auth->hasAccess('logbook.countries.index')
                    );
                });
            });
        });

        return $menu;
    }
}
