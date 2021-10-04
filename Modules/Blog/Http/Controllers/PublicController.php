<?php

namespace Modules\Blog\Http\Controllers;

use App\Http\Requests\Request;
use Illuminate\Support\Facades\App;
use Modules\Blog\Entities\Category;
use Modules\Blog\Entities\CategoryTranslation;
use Modules\Blog\Repositories\PostRepository;
use Modules\Core\Http\Controllers\BasePublicController;
use Modules\Logbook\Repositories\LogbookRepository;
use Modules\Setting\Repositories\SettingRepository;
use Modules\Solar\Repositories\SolarRepository;

class PublicController extends BasePublicController
{
    /**
     * @var PostRepository
     */
    private $post;

    /**
     * @var LogbookRepository
     */
    private $logRepository;

    private $setting;
    private $maxCount;
    private $maxContacts;

    /**
     * @var SolarRepository
     */
    private $solarReportsRepository;

    public function __construct(PostRepository $post, LogbookRepository $logRepository, SolarRepository $solarRepository,SettingRepository $setting)
    {
        parent::__construct();
        $this->post = $post;
        $this->logRepository = $logRepository;
        $this->solarReportsRepository = $solarRepository;
        $this->setting=$setting;
        $this->maxCount = (int)$this->setting->get('logbook::maxcount')->plainValue;
        $this->maxContacts = (int)$this->setting->get('logbook::maxcontacts')->plainValue;
    }

    public function index()
    {
        $posts = $this->post->allTranslatedIn(App::getLocale());
        $latestPosts = $this->post->latest();
        $latestContacts = $this->logRepository->latestContacts(($this->maxContacts > 0 ? $this->maxContacts : 4));
        $furthestContacts = $this->logRepository->longestContacts(($this->maxCount > 0 ? $this->maxCount : 4));
        $latestSolarReports = $this->solarReportsRepository->latestReports();

        return view('blog.index', compact('posts', 'latestPosts', 'latestContacts', 'latestSolarReports', 'furthestContacts'));
    }

    public function show($slug)
    {
        $post = $this->post->findBySlug($slug);

        $latestPosts = $this->post->latest();
        $latestContacts = $this->logRepository->latestContacts(($this->maxContacts > 0 ? $this->maxContacts : 4));
        $furthestContacts = $this->logRepository->longestContacts(($this->maxCount > 0 ? $this->maxCount : 4));
        $latestSolarReports = $this->solarReportsRepository->latestReports();

        return view('blog.show', compact('post', 'latestPosts', 'latestContacts', 'latestSolarReports', 'furthestContacts'));
    }

    public function byCategory($cat)
    {
        $categoryTrans = CategoryTranslation::where('slug', $cat)->first();
        $posts = $this->post->findByCategory($categoryTrans->category_id);
        $latestPosts = $this->post->latest();
        $latestContacts = $this->logRepository->latestContacts(($this->maxContacts > 0 ? $this->maxContacts : 4));
        $furthestContacts = $this->logRepository->longestContacts(($this->maxCount > 0 ? $this->maxCount : 4));
        $latestSolarReports = $this->solarReportsRepository->latestReports();

        if ($cat === 'development')
        {
            return view('blog.development', compact('posts', 'latestPosts', 'latestContacts', 'latestSolarReports', 'furthestContacts'));
        }

        return view('blog.category', compact('posts', 'latestPosts', 'latestContacts', 'latestSolarReports', 'furthestContacts'));
    }

    public function slugByCategory($cat,$slug)
    {
        $post = $this->post->findBySlug($slug);
        $latestPosts = $this->post->latest();
        $latestContacts = $this->logRepository->latestContacts(($this->maxContacts > 0 ? $this->maxContacts : 4));
        $furthestContacts = $this->logRepository->longestContacts(($this->maxCount > 0 ? $this->maxCount : 4));
        $latestSolarReports = $this->solarReportsRepository->latestReports();

        return view('blog.show', compact('post', 'latestPosts', 'latestContacts', 'latestSolarReports', 'furthestContacts'));
    }

}
