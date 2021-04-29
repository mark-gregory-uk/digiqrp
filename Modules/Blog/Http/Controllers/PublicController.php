<?php

namespace Modules\Blog\Http\Controllers;

use Illuminate\Support\Facades\App;
use Modules\Blog\Repositories\PostRepository;
use Modules\Core\Http\Controllers\BasePublicController;
use Modules\Logbook\Repositories\LogbookRepository;
use Modules\Solar\Repositories\SolarDataRepository;

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
     * @var SolarDataRepository
     */
    private $solarReportsRepository;

    public function __construct(PostRepository $post, LogbookRepository $logRepository, SolarDataRepository $solarDataRepository)
    {
        parent::__construct();
        $this->post = $post;
        $this->logRepository = $logRepository;
        $this->solarReportsRepository = $solarDataRepository;
    }

    public function index()
    {
        $posts = $this->post->allTranslatedIn(App::getLocale());
        $latestPosts = $this->post->latest();
        $latestContacts = $this->logRepository->latestContacts();
        $latestSolarReports = $this->solarReportsRepository->latestReports();

        return view('blog.index', compact('posts', 'latestPosts', 'latestContacts', 'latestSolarReports'));
    }

    public function show($slug)
    {
        $post = $this->post->findBySlug($slug);
        $latestPosts = $this->post->latest();
        $latestContacts = $this->logRepository->latestContacts();
        $latestSolarReports = $this->solarReportsRepository->latestReports();

        return view('blog.show', compact('post', 'latestPosts', 'latestContacts', 'latestSolarReports'));
    }
}
