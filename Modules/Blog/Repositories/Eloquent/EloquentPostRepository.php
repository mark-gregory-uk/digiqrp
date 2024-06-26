<?php

namespace Modules\Blog\Repositories\Eloquent;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Arr;
use Modules\Blog\Entities\Post;
use Modules\Blog\Entities\Status;
use Modules\Blog\Events\PostIsCreating;
use Modules\Blog\Events\PostIsUpdating;
use Modules\Blog\Events\PostWasCreated;
use Modules\Blog\Events\PostWasDeleted;
use Modules\Blog\Events\PostWasUpdated;
use Modules\Blog\Repositories\Collection;
use Modules\Blog\Repositories\PostRepository;
use Modules\Core\Repositories\Eloquent\EloquentBaseRepository;

class EloquentPostRepository extends EloquentBaseRepository implements PostRepository
{
    /**
     * @param int $id
     *
     * @return object
     */
    public function find($id)
    {
        return $this->model->with('translations', 'tags','category')->find($id);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function all()
    {
        return $this->model->with('translations', 'tags','category')->orderBy('created_at', 'DESC')->get();
    }

    /**
     * Update a resource.
     *
     * @param $post
     * @param array $data
     *
     * @return mixed
     */
    public function update($post, $data)
    {
        event($event = new PostIsUpdating($post, $data));
        $post->update($event->getAttributes());

        $post->setTags(Arr::get($data, 'tags'));

        event(new PostWasUpdated($post, $data));

        return $post;
    }

    /**
     * Create a blog post.
     *
     * @param array $data
     *
     * @return Post
     */
    public function create($data)
    {
        event($event = new PostIsCreating($data));
        $post = $this->model->create($event->getAttributes());

        $post->setTags(Arr::get($data, 'tags'));

        event(new PostWasCreated($post, $data));

        return $post;
    }

    public function destroy($model)
    {
        $model->untag();

        event(new PostWasDeleted($model->id, get_class($model)));

        return $model->delete();
    }

    /**
     * Return all resources in the given language.
     *
     * @param string $lang
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function allTranslatedIn($lang)
    {
        return $this->model->whereHas('translations', function (Builder $q) use ($lang) {
            $q->where('locale', "$lang");
            $q->where('title', '!=', '');
            $q->where('category_only', false);
        })->with('translations')->with('category')->whereStatus(Status::PUBLISHED)->orderBy('created_at', 'DESC')->get();
    }

    /**
     * Return the latest x blog posts.
     *
     * @param int $amount
     *
     * @return Collection
     */
    public function latest($amount = 5)
    {
        return $this->model->whereStatus(Status::PUBLISHED)
            ->with('translations')
            ->with('category')
            ->where('category_only', false)
            ->orderBy('created_at', 'desc')
            ->take($amount)
            ->get();
    }

    /**
     * Get the previous post of the given post.
     *
     * @param object $post
     *
     * @return object
     */
    public function getPreviousOf($post)
    {
        return $this->model->where('created_at', '<', $post->created_at)
            ->whereStatus(Status::PUBLISHED)->orderBy('created_at', 'desc')->where('category_only', false)->first();
    }

    /**
     * Get the next post of the given post.
     *
     * @param object $post
     *
     * @return object
     */
    public function getNextOf($post)
    {
        return $this->model->where('created_at', '>', $post->created_at)
            ->whereStatus(Status::PUBLISHED)->where('category_only', false)->first();
    }

    /**
     * Find a resource by the given slug.
     *
     * @param string $slug
     *
     * @return object
     */
    public function findBySlug($slug)
    {
        return $this->model->whereHas('translations', function (Builder $q) use ($slug) {
            $q->where('slug', "$slug");
        })->with('translations')->with('category')->whereStatus(Status::PUBLISHED)->firstOrFail();
    }

    /**
     * Find a resource by the given category.
     *
     * @param string $slug
     *
     * @return object
     */
    public function findByCategory($category)
    {
        return $this->model->whereHas('translations', function (Builder $q) use ($category) {
            $q->where('category_id', "$category")->where('category_only', true);
        })->with(['translations','category'])->orderBy('created_at','DESC')->get();
    }
}
