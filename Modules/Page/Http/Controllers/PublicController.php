<?php

namespace Modules\Page\Http\Controllers;

use Illuminate\Contracts\Foundation\Application;
use Modules\Blog\Entities\Post;
use Modules\Blog\Repositories\PostRepository;
use Modules\Core\Http\Controllers\BasePublicController;
use Modules\Logbook\Entities\Logbook;
use Modules\Logbook\Repositories\LogbookRepository;
use Modules\Menu\Entities\Menu;
use Modules\Menu\Repositories\MenuItemRepository;
use Modules\Page\Entities\Page;
use Modules\Page\Repositories\PageRepository;
use Modules\Setting\Repositories\SettingRepository;
use Modules\Solar\Repositories\SolarRepository;
use Modules\Notification\Services\Notification;


class PublicController extends BasePublicController
{
    /**
     * @var PageRepository
     */
    private $page;

    /**
     * @var Post
     */
    private $postRepository;

    /**
     * @var Logbook
     */
    private $logbookRepository;

    /**
     * @var SolarRepository
     */
    private $solarReportsRepository;

    private $notification;

    /**
     * @var Application
     */
    private $app;

    private $setting;
    private $maxCount;
    private $maxContacts;
    private $mapTargets;
    private $mapMarkers = [];

    private $disabledPage = false;

    public function __construct(PageRepository $page, PostRepository $postsRepository, LogbookRepository $logBookRepository, SolarRepository $solarRepository, Application $app,SettingRepository $setting, Notification $notification)
    {
        parent::__construct();
        $this->notification = $notification;
        $this->page = $page;
        $this->app = $app;
        $this->postRepository = $postsRepository;
        $this->logbookRepository = $logBookRepository;
        $this->solarReportsRepository = $solarRepository;
        $this->setting=$setting;
        $this->maxCount = (int)$this->setting->get('logbook::maxcount')->plainValue;
        $this->maxContacts = (int)$this->setting->get('logbook::maxcontacts')->plainValue;
        $this->mapTargets=$this->logbookRepository->contactsForMap();

        foreach($this->mapTargets as $marker)
        {
            array_push($this->mapMarkers, array(
                'title' => $marker->call,
                'lat' => $marker->lat,
                'lng' => $marker->lng,
            ));
        }
    }

    /**
     * @param $slug
     *
     * @return \Illuminate\View\View
     */
    public function uri($slug)
    {
        $page = $this->findPageForSlug($slug);
        $latestPosts = $this->postRepository->latest();
        $latestContacts = $this->logbookRepository->latestContacts(($this->maxContacts > 0 ? $this->maxContacts : 4));
        $furthestContacts = $this->logbookRepository->longestContacts(($this->maxCount > 0 ? $this->maxCount : 4));
        $latestSolarReports = $this->solarReportsRepository->latestReports();
        $contacts = $this->logbookRepository->totalContacts();
        $markers=$this->mapMarkers;

        $this->throw404IfNotFound($page);

        $currentTranslatedPage = $page->getTranslation(locale());
        if ($slug !== $currentTranslatedPage->slug) {
            return redirect()->to($currentTranslatedPage->locale.'/'.$currentTranslatedPage->slug, 301);
        }

        $template = $this->getTemplateForPage($page);

        $this->addAlternateUrls($this->getAlternateMetaData($page));

        return view($template, compact('page', 'latestPosts', 'latestContacts', 'latestSolarReports', 'furthestContacts','contacts','markers'));
    }

    /**
     * @return \Illuminate\View\View
     */
    public function homepage()
    {
        $page = $this->page->findHomepage();
        $contacts  = $this->logbookRepository->totalContacts();
        $latestPosts = $this->postRepository->latest();
        $latestContacts = $this->logbookRepository->latestContacts(($this->maxContacts > 0 ? $this->maxContacts : 4));
        $furthestContacts = $this->logbookRepository->longestContacts(($this->maxCount > 0 ? $this->maxCount : 4));
        $latestSolarReports = $this->solarReportsRepository->latestReports();
        $markers=$this->mapMarkers;

        $this->throw404IfNotFound($page);

        $template = $this->getTemplateForPage($page);

        $this->addAlternateUrls($this->getAlternateMetaData($page));

        return view($template, compact('page', 'latestPosts', 'latestContacts', 'latestSolarReports', 'furthestContacts','contacts','markers'));
    }

    /**
     * Find a page for the given slug.
     * The slug can be a 'composed' slug via the Menu.
     *
     * @param string $slug
     *
     * @return Page
     */
    private function findPageForSlug($slug)
    {

        $menuItem = app(MenuItemRepository::class)->findByUriInLanguage($slug, locale());

        if ($menuItem) {
            return $this->page->find($menuItem->page_id);
        }

        return $this->page->findBySlug($slug);
    }

    /**
     * Return the template for the given page
     * or the default template if none found.
     *
     * @param $page
     *
     * @return string
     */
    private function getTemplateForPage($page)
    {
        return (view()->exists($page->template)) ? $page->template : 'default';
    }

    /**
     * Throw a 404 error page if the given page is not found or draft.
     *
     * @param $page
     */
    private function throw404IfNotFound($page)
    {
        if (null === $page || $page->status === $this->disabledPage) {
            $this->app->abort('404');
        }
    }

    /**
     * Create a key=>value array for alternate links.
     *
     * @param $page
     *
     * @return array
     */
    private function getAlternateMetaData($page)
    {
        $translations = $page->getTranslationsArray();

        $alternate = [];
        foreach ($translations as $locale => $data) {
            $alternate[$locale] = $data['slug'];
        }

        return $alternate;
    }

    /**
     * Generates the systems site map.
     *
     * @return mixed
     */
    public function sitemap()
    {
        // create new sitemap object
        $sitemap = App::make('sitemap');

        // set cache key (string), duration in minutes (Carbon|Datetime|int), turn on/off (boolean)
        // by default cache is disabled
        $sitemap->setCache('laravel.sitemap', 60);

        // check if there is cached sitemap and build new only if is not
        if (! $sitemap->isCached()) {
            // add item to the sitemap (url, date, priority, freq)
            $sitemap->add(URL::to('/'), '2012-08-25T20:10:00+02:00', '1.0', 'daily');
            $sitemap->add(URL::to('/logbook/index'), '2012-08-26T12:30:00+02:00', '0.9', 'weekly');

            // get all posts from db, with image relations
            $pages = \DB::table('pages')->orderBy('created_at', 'desc')->get();

            // add every page to the sitemap
            foreach ($pages as $page) {
                $sitemap->add(URL::to('page /'.$page->slug), '2012-08-26T12:30:00+02:00', '0.9', 'weekly');
            }

            // add every post to the sitemap
            $posts = \DB::table('posts')->orderBy('created_at', 'desc')->get();

            foreach ($posts as $post) {
                $sitemap->add(URL::to('post/'.$post->id), '2012-08-26T12:30:00+02:00', '0.9', 'daily');
            }

            $newsItems = \DB::table('news_items')->orderBy('created_at', 'desc')->get();

            foreach ($newsItems as $news) {
                $sitemap->add(URL::to('news/'.$news->id), '2012-08-26T12:30:00+02:00', '0.9', 'daily');
            }
        }

        // show your sitemap (options: 'xml' (default), 'html', 'txt', 'ror-rss', 'ror-rdf')
        return $sitemap->render('xml');
    }
}
