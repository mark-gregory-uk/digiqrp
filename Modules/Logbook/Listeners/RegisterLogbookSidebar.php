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
     * @return Menu
     */
    public function extendWith(Menu $menu)
    {
        $menu->group(trans('core::sidebar.content'), function (Group $group) {
            $group->item(trans('logbook::logbooks.title.logbooks'), function (Item $item) {
                $item->icon('fa fa-book');
                $item->weight(60);
                $item->authorize(
                     /* append */
                );
                $item->item(trans('logbook::logbooks.title.logbooks'), function (Item $item) {
                    $item->icon('fa fa-list');
                    $item->weight(0);
                    $item->append('admin.logbook.logbook.create');
                    $item->route('admin.logbook.logbook.index');
                    $item->authorize(
                        $this->auth->hasAccess('logbook.logbooks.index')
                    );
                });
            });
        });

        return $menu;
    }
}
