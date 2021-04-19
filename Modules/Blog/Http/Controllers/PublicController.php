<?php

namespace Modules\Blog\Http\Controllers;

use Illuminate\Support\Facades\App;
use Modules\Blog\Repositories\PostRepository;
use Modules\Core\Http\Controllers\BasePublicController;
use Modules\Logbook\Repositories\LogbookRepository;

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

    public function __construct(PostRepository $post, LogbookRepository $logRepository)
    {
        parent::__construct();
        $this->post = $post;
        $this->logRepository = $logRepository;
    }

    public function index()
    {
        $posts = $this->post->allTranslatedIn(App::getLocale());
        $latestPosts = $this->post->latest();
        $latestContacts = $this->logRepository->latestContacts();
        return view('blog.index', compact('posts','latestPosts','latestContacts'));
    }

    public function show($slug)
    {
        $post = $this->post->findBySlug($slug);
        $latestPosts = $this->post->latest();
        $latestContacts = $this->logRepository->latestContacts();
        return view('blog.show', compact('post','latestPosts','latestContacts'));
    }
}
