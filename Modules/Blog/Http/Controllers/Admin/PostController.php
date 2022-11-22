<?php

namespace Modules\Blog\Http\Controllers\Admin;

use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Modules\Blog\Entities\Post;
use Modules\Blog\Entities\Status;
use Modules\Blog\Http\Requests\CreatePostRequest;
use Modules\Blog\Http\Requests\UpdatePostRequest;
use Modules\Blog\Repositories\CategoryRepository;
use Modules\Blog\Repositories\PostRepository;
use Modules\Core\Http\Controllers\Admin\AdminBaseController;
use Modules\Media\Repositories\FileRepository;

class PostController extends AdminBaseController
{
    /**
     * @var PostRepository
     */
    private $post;
    /**
     * @var CategoryRepository
     */
    private $category;
    /**
     * @var FileRepository
     */
    private $file;
    /**
     * @var Status
     */
    private $status;

    public function __construct(
        PostRepository $post,
        CategoryRepository $category,
        FileRepository $file,
        Status $status
    ) {
        parent::__construct();

        $this->post = $post;
        $this->category = $category;
        $this->file = $file;
        $this->status = $status;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\View\View
     */
    public function index()
    {
        $posts = $this->post->all();

        return view('blog::admin.posts.index', compact('posts'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\View\View
     */
    public function create()
    {
        $categories = $this->category->allTranslatedIn(app()->getLocale());
        $statuses = $this->status->lists();
        $this->assetPipeline->requireJs('ckeditor.js');

        return view('blog::admin.posts.create', compact('categories', 'statuses'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param CreatePostRequest $request
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(CreatePostRequest $request)
    {
        $data = $request->all();
        $data['author_id'] = Auth::id();
        if (array_key_exists('category_only', $data)) {
            if ($data['category_only'] === 'on') {
                $data['category_only'] = true;
            }
        } else {
            $data['category_only'] = false;
        }
        $this->post->create($data);

        return redirect()->route('admin.blog.post.index')
            ->withSuccess(trans('blog::messages.post created'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param Post $post
     *
     * @return \Illuminate\View\View
     */
    public function edit(Post $post)
    {
        $thumbnail = $this->file->findFileByZoneForEntity('thumbnail', $post);
        $categories = $this->category->allTranslatedIn(app()->getLocale());
        $statuses = $this->status->lists();
        $this->assetPipeline->requireJs('ckeditor.js');

        return view('blog::admin.posts.edit', compact('post', 'categories', 'thumbnail', 'statuses'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Post              $post
     * @param UpdatePostRequest $request
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Post $post, UpdatePostRequest $request)
    {
        $data = $request->all();
        $data['editor_id'] = Auth::id();

        if (array_key_exists('category_only', $data)) {
            if ($data['category_only'] === 'on') {
                $data['category_only'] = true;
            }
        } else {
            $data['category_only'] = false;
        }

        if (array_key_exists('meta_title', $data)) {
            $post->meta_title = $data['meta_title'];
        }

        if (array_key_exists('meta_description', $data)) {
            $post->meta_title = $data['meta_description'];
        }


        $post->updated_at=Carbon::now();

        $this->post->update($post, $data);

        return redirect()->route('admin.blog.post.index')
            ->withSuccess(trans('blog::messages.post updated'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Post $post
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Post $post)
    {
        $post->tags()->detach();

        $this->post->destroy($post);

        return redirect()->route('admin.blog.post.index')
            ->withSuccess(trans('blog::messages.post deleted'));
    }
}
