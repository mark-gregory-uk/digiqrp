<?php

namespace Modules\Core\Foundation\Asset\Types;

class AssetTypeFactory
{
    /**
     * @param $asset
     *
     * @throws \InvalidArgumentException
     *
     * @return \Modules\Core\Foundation\Asset\Types\AssetType
     */
    public function make($asset)
    {
        $typeClass = 'Modules\Core\Foundation\Asset\Types\\'.ucfirst(key($asset)).'Asset';

        if (class_exists($typeClass) === false) {
            throw new \InvalidArgumentException("Asset Type Class [$typeClass] not found");
        }

        return new $typeClass($asset);
    }
}
