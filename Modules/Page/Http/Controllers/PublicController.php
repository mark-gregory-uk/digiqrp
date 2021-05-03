<?php

namespace Modules\Page\Http\Controllers;

use Illuminate\Contracts\Foundation\Application;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\URL;
use Modules\Blog\Entities\Post;
use Modules\Blog\Repositories\PostRepository;
use Modules\Core\Http\Controllers\BasePublicController;
use Modules\Logbook\Entities\Logbook;
use Modules\Logbook\Repositories\LogbookRepository;
use Modules\Menu\Entities\Menu;
use Modules\Menu\Repositories\MenuItemRepository;
use Modules\Page\Entities\Page;
use Modules\Page\Repositories\PageRepository;
use Modules\Solar\Repositories\SolarRepository;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\SitemapGenerator;

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

    /**
     * @var Application
     */
    private $app;

    private $disabledPage = false;

    public function __construct(PageRepository $page, PostRepository $postsRepository, LogbookRepository $logBookRepository, SolarRepository $solarRepository, Application $app)
    {
        parent::__construct();
        $this->page = $page;
        $this->app = $app;
        $this->postRepository = $postsRepository;
        $this->logbookRepository = $logBookRepository;
        $this->solarReportsRepository = $solarRepository;
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
        $latestContacts = $this->logbookRepository->latestContacts();
        $furthestContacts = $this->logbookRepository->longestContacts();
        $latestSolarReports = $this->solarReportsRepository->latestReports();
        $this->throw404IfNotFound($page);

        $currentTranslatedPage = $page->getTranslation(locale());
        if ($slug !== $currentTranslatedPage->slug) {
            return redirect()->to($currentTranslatedPage->locale.'/'.$currentTranslatedPage->slug, 301);
        }

        $template = $this->getTemplateForPage($page);

        $this->addAlternateUrls($this->getAlternateMetaData($page));

        return view($template, compact('page', 'latestPosts', 'latestContacts', 'latestSolarReports', 'furthestContacts'));
    }

    /**
     * @return \Illuminate\View\View
     */
    public function homepage()
    {
        $page = $this->page->findHomepage();
        $latestPosts = $this->postRepository->latest();
        $latestContacts = $this->logbookRepository->latestContacts();
        $furthestContacts = $this->logbookRepository->longestContacts();
        $latestSolarReports = $this->solarReportsRepository->latestReports();
        $this->throw404IfNotFound($page);

        $template = $this->getTemplateForPage($page);

        $this->addAlternateUrls($this->getAlternateMetaData($page));

        return view($template, compact('page', 'latestPosts', 'latestContacts', 'latestSolarReports', 'furthestContacts'));
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
}
