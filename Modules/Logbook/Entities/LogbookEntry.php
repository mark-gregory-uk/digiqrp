<?php

namespace Modules\Logbook\Entities;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Modules\Setting\Contracts\Setting;

class LogbookEntry extends Model
{
    protected $table = 'logbook__entries';

    /**
     * @var Setting
     */
    private $settings;

    protected $fillable = [
        'qso_start',
        'qso_end',
        'call',
        'grid',
        'mode',
        'tx_frequency',
        'rx_frequency',
        'rst_received',
        'rst_sent',
        'power',
        'comments',
        'band_rx',
        'band_tx',
        'payload',
        'parent_id',
        'distance_km',
        'distance_miles',
        'created_at',
        'updated_at',
        'country_slug',
        'dxcc_country',
    ];

    /**
     * The computed properties returned when model called for.
     *
     * @var string[]
     */
    protected $appends = [
        'end_date',
        'end_time',
    ];

    /**
     * Return the date as a formatted string.
     *
     * @return string
     */
    public function getEndDateAttribute()
    {
        return Carbon::parse($this->qso_end)->format('d-m-Y');
    }

    /**
     * Returns only the time component.
     *
     * @return string
     */
    public function getEndTimeAttribute()
    {
        return Carbon::createFromFormat('Y-m-d H:i:s', $this->qso_end)->format('H:i');
    }

    /**
     * populate from exisitng log entry
     * @param LogbookEntry $existingEntry
     */
    public function addExistingCallDetails(LogbookEntry $existingEntry)
    {
        $this->dxcc_country = $existingEntry->dxcc_country;
        $this->lat = $existingEntry->lat;
        $this->lng = $existingEntry->lng;
        $this->itu = $existingEntry->itu;
        $this->grid = $existingEntry->grid;
        $this->country_slug = $existingEntry->country_slug;
        $this->distance_km = $existingEntry->distance_km;
        $this->distance_miles = $existingEntry->distance_miles;
        $this->save();
    }

    /**
     * Adds new values to key variables.
     *
     * @param $response
     */
    public function addCallDetails(Setting $settings,$response)
    {

        $this->settings = $settings;
        $default_lat = 52.3848;
        $default_lng = 1.8215;
        $countries = LogbookCountry::all();

        $user_lat = $this->settings->get('logbook::latitude');
        $user_lng = $this->settings->get('logbook::longitude');

        if ($user_lat & $user_lng) {
            $latitude = $user_lat;
            $longitude = $user_lng;
        } else {
            $latitude = $default_lat;
            $longitude = $default_lng;
        }

        $this->dxcc_country = $response['dxcc']['name'];
        $this->lat = $response['dxcc']['lat'];
        $this->lng = $response['dxcc']['lng'];
        $this->itu = $response['dxcc']['itu'];

        if ($slug =  DB::table('logbook__countries')->where('name', $response['dxcc']['name'])->value('code')){
            $this->country_slug = $slug;
        } else {
            $this->country_slug = $response['dxcc']['continent'];
        }

        $distanceKM = (float) $this->distance($latitude, $longitude, $this->lat, $this->lng);
        if ($distanceKM > 0) {
            $distanceMiles = $distanceKM / 1.609;
            $this->distance_km = $distanceKM;
            $this->distance_miles = $distanceMiles;
        }

        $this->save();
    }


    /**
     * Adds new values to key variables.
     *
     * @param $response
     */
    public function addCallNewDetails($response)
    {

        $default_lat = 52.3848;
        $default_lng = 1.8215;
        $countries = LogbookCountry::all();

        $latitude = $default_lat;
        $longitude = $default_lng;

        $this->dxcc_country = $response['dxcc']['name'];
        $this->lat = $response['dxcc']['lat'];
        $this->lng = $response['dxcc']['lng'];
        $this->itu = $response['dxcc']['itu'];

        if ($slug =  DB::table('logbook__countries')->where('name', $response['dxcc']['name'])->value('code')){
            $this->country_slug = $slug;
        } else {
            $this->country_slug = $response['dxcc']['continent'];
        }

        $distanceKM = (float) $this->distance($latitude, $longitude, $this->lat, $this->lng);
        if ($distanceKM > 0) {
            $distanceMiles = $distanceKM / 1.609;
            $this->distance_km = $distanceKM;
            $this->distance_miles = $distanceMiles;
        }

        $this->save();
    }

    public function addDXCCEntries($response){
        $default_lat = 52.3848;
        $default_lng = 1.8215;

        $latitude = $default_lat;
        $longitude = $default_lng;

        $this->dxcc_country = $response['country'];
        $this->lat = $response['lat'];
        $this->lng = $response['lng'];

        if ($slug =  DB::table('logbook__countries')->where('name', $response['country'])->value('code')){
            $this->country_slug = $slug;
        } else {
            $this->country_slug = $response['continent'];
        }

        $distanceKM = (float) $this->distance($latitude, $longitude, $this->lat, $this->lng);
        if ($distanceKM > 0) {
            $distanceMiles = $distanceKM / 1.609;
            $this->distance_km = $distanceKM;
            $this->distance_miles = $distanceMiles;
        }
    }

    /**
     * The logbook that own this item.
     *
     * @return mixed
     */
    public function Logbook()
    {
        return $this->belongsTo(Logbook::class);
    }

    public function getImageUrlAttribute()
    {
        return $this->attributes['image_url'] === 'none';
    }

    /**
     * Calculate the as the crow flies distance in miles and kilometers.
     * @param $lat1
     * @param $lon1
     * @param $lat2
     * @param $lon2
     * @return float|int
     */
    private function distance($lat1, $lon1, $lat2, $lon2)
    {
        $pi80 = M_PI / 180;
        $r = 6372.797; // mean radius of Earth in km
        $calculatedDistance = 0;
        if ((float) $lat2 != 0 && (float) $lon2 != 0) {
            $lat1 *= $pi80;
            $lon1 *= $pi80;
            $lat2 *= $pi80;
            $lon2 *= $pi80;
            $dlat = $lat2 - $lat1;
            $dlon = $lon2 - $lon1;
            $a = sin($dlat / 2) * sin($dlat / 2) + cos($lat1) * cos($lat2) * sin($dlon / 2) * sin($dlon / 2);
            $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
            $calculatedDistance = $r * $c;
        }

        return $calculatedDistance;
    }


}
