<?php

namespace Modules\Blog\Http\Controllers;

use App\Http\Requests\Request;
use Illuminate\Support\Facades\App;
use Modules\Blog\Entities\Category;
use Modules\Blog\Entities\CategoryTranslation;
use Modules\Blog\Repositories\PostRepository;
use Modules\Core\Http\Controllers\BasePublicController;
use Modules\Logbook\Repositories\LogbookRepository;
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

    /**
     * @var SolarRepository
     */
    private $solarReportsRepository;

    public function __construct(PostRepository $post, LogbookRepository $logRepository, SolarRepository $solarRepository)
    {
        parent::__construct();
        $this->post = $post;
        $this->logRepository = $logRepository;
        $this->solarReportsRepository = $solarRepository;
    }

    public function index()
    {
        $posts = $this->post->allTranslatedIn(App::getLocale());
        $latestPosts = $this->post->latest();
        $latestContacts = $this->logRepository->latestContacts();
        $furthestContacts = $this->logRepository->longestContacts();
        $latestSolarReports = $this->solarReportsRepository->latestReports();

        return view('blog.index', compact('posts', 'latestPosts', 'latestContacts', 'latestSolarReports', 'furthestContacts'));
    }

    public function show($slug)
    {
        $post = $this->post->findBySlug($slug);
        $latestPosts = $this->post->latest();
        $latestContacts = $this->logRepository->latestContacts();
        $furthestContacts = $this->logRepository->longestContacts();
        $latestSolarReports = $this->solarReportsRepository->latestReports();

        return view('blog.show', compact('post', 'latestPosts', 'latestContacts', 'latestSolarReports', 'furthestContacts'));
    }

    public function byCategory($cat)
    {

        $categoryTrans = CategoryTranslation::where('slug',$cat)->first();

        $posts = $this->post->findByCategory($categoryTrans->category_id);

        $latestPosts = $this->post->latest();
        $latestContacts = $this->logRepository->latestContacts();
        $furthestContacts = $this->logRepository->longestContacts();
        $latestSolarReports = $this->solarReportsRepository->latestReports();

        return view('blog.index', compact('posts', 'latestPosts', 'latestContacts', 'latestSolarReports', 'furthestContacts'));
    }


}
