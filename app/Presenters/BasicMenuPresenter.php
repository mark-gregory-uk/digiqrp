<?php

namespace App\Presenters;

use Nwidart\Menus\Presenters\Presenter;

class BasicMenuPresenter extends Presenter
{
    /**
     * {@inheritdoc}.
     */
    public function getOpenTagWrapper()
    {
        return PHP_EOL.'<ul class="nav menu nav-pills mod-list">'.PHP_EOL;
    }

    /**
     * {@inheritdoc}.
     */
    public function getCloseTagWrapper()
    {
        return PHP_EOL.'</ul>'.PHP_EOL;
    }

    /**
     * {@inheritdoc}.
     */
    public function getMenuWithoutDropdownWrapper($item)
    {
        return '<li'.$this->getActiveState($item).'><a href="'.$item->getUrl().'" '.$item->getAttributes().'>'.$item->getIcon().' '.$item->title.'</a></li>'.PHP_EOL;
    }

    /**
     * {@inheritdoc}.
     */
    public function getActiveState($item, $state = ' class="active"')
    {
        $urlSegments = \Request::segments();
        $target = explode('/',$item->url);

        if (count($urlSegments) === 0 and $target[0] === 'welcome'){
            return $state;
        }

        if (count($urlSegments) === 3 and count($target) === 2){
               return $state;
        }

        if (count($urlSegments) === 1 and count($target) === 1){
            if ($target[0] === 'welcome' && $urlSegments[0] === 'logbook-stats')
                return $state;

        }

        if (count($urlSegments) === 5 and count($target) === 4){

            if ($target[3] === $urlSegments[3])
             return $state;
            if ($urlSegments[3] === '12' and $target[3] ==='software')
              return $state;
            if ($urlSegments[3] === '21' and $target[3] ==='development')
                return $state;
        }


        return $item->isActive() ? $state : null;
    }

    /**
     * Get active state on child items.
     *
     * @param $item
     * @param string $state
     *
     * @return null|string
     */
    public function getActiveStateOnChild($item, $state = 'active')
    {
        return $item->hasActiveOnChild() ? $state : null;
    }

    /**
     * {@inheritdoc}.
     */
    public function getDividerWrapper()
    {
        return '<li class="divider"></li>';
    }

    /**
     * {@inheritdoc}.
     */
    public function getHeaderWrapper($item)
    {
        return '<li class="dropdown-header">'.$item->title.'</li>';
    }

    /**
     * {@inheritdoc}.
     */
    public function getMenuWithDropDownWrapper($item)
    {
        return '<li class="dropdown'.$this->getActiveStateOnChild($item, ' active').'">
		          <a href="#" class="dropdown-toggle" data-toggle="dropdown">
					'.$item->getIcon().' '.$item->title.'
			      	<b class="caret"></b>
			      </a>
			      <ul class="dropdown-menu">
			      	'.$this->getChildMenuItems($item).'
			      </ul>
		      	</li>'
            .PHP_EOL;
    }

    /**
     * Get multilevel menu wrapper.
     *
     * @param \Nwidart\Menus\MenuItem $item
     *
     * @return string`
     */
    public function getMultiLevelDropdownWrapper($item)
    {
        return '<li class="dropdown'.$this->getActiveStateOnChild($item, ' active').'">
		          <a href="#" class="dropdown-toggle" data-toggle="dropdown">
					'.$item->getIcon().' '.$item->title.'
			      	<b class="caret pull-right caret-right"></b>
			      </a>
			      <ul class="dropdown-menu">
			      	'.$this->getChildMenuItems($item).'
			      </ul>
		      	</li>'
            .PHP_EOL;
    }
}
