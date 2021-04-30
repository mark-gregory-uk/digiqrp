<?php

namespace Modules\Logbook\Entities;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class LogbookEntry extends Model
{
    protected $table = 'logbook__entries';

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
     * Adds new values to key variables.
     *
     * @param $response
     */
    public function addCallDetails($response)
    {
        $this->dxcc_country = $response['dxcc']['name'];
        $this->utc = $response['dxcc']['utc'];
        $this->adif = $response['dxcc']['adif'];
        $this->lat = $response['dxcc']['lat'];
        $this->lng = $response['dxcc']['lng'];
        $this->waz = $response['dxcc']['waz'];
        $this->itu = $response['dxcc']['itu'];
        $this->continent = $response['dxcc']['continent'];
        $this->country_details = $response['dxcc']['details'];
        $this->save();
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
}
