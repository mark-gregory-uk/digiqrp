<?php

namespace Modules\Notes\Listeners;

use Maatwebsite\Sidebar\Group;
use Maatwebsite\Sidebar\Item;
use Maatwebsite\Sidebar\Menu;
use Modules\Core\Events\BuildingSidebar;
use Modules\User\Contracts\Authentication;

class RegisterNotesSidebar implements \Maatwebsite\Sidebar\SidebarExtender
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
            $group->item(trans('notes::notes.title.notes'), function (Item $item) {
                $item->icon('fa fa-copy');
                $item->weight(10);
                $item->authorize(
                     /* append */
                );
                $item->item(trans('notes::documents.title.documents'), function (Item $item) {
                    $item->icon('fa fa-copy');
                    $item->weight(0);
                    $item->append('admin.notes.document.create');
                    $item->route('admin.notes.document.index');
                    $item->authorize(
                        $this->auth->hasAccess('notes.documents.index')
                    );
                });
                $item->item(trans('notes::responses.title.responses'), function (Item $item) {
                    $item->icon('fa fa-copy');
                    $item->weight(0);
                    $item->append('admin.notes.response.create');
                    $item->route('admin.notes.response.index');
                    $item->authorize(
                        $this->auth->hasAccess('notes.responses.index')
                    );
                });
                $item->item(trans('notes::responsetoresponses.title.responsetoresponses'), function (Item $item) {
                    $item->icon('fa fa-copy');
                    $item->weight(0);
                    $item->append('admin.notes.responsetoresponse.create');
                    $item->route('admin.notes.responsetoresponse.index');
                    $item->authorize(
                        $this->auth->hasAccess('notes.responsetoresponses.index')
                    );
                });
// append



            });
        });

        return $menu;
    }
}
