<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Modules\Solar\Entities\SolarBandData;
use Modules\Solar\Entities\SolarData;
use Modules\Solar\Repositories\SolarDataRowRepository;
use SimpleXMLElement;

class PullSolar extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'solar:pull';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Pull latest solar data';

    /**
     * @var SolarDataRowRepository
     */
    private $solarDataRowRepository;

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(SolarDataRowRepository $solarDataRowRepository)
    {
        parent::__construct();
        $this->solarDataRowRepository = $solarDataRowRepository;
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $xmlstr = file_get_contents('http://www.hamqsl.com/solarxml.php');
        $xmlobj = new SimpleXMLElement($xmlstr);

        $this->info('Pulling Latest Solar Data');

        $data = [];
        $data['source'] = $xmlobj->source;
        $data['last_updated'] = $xmlobj->updated;
        $data['noise_level'] = $xmlobj->signalnoise;

        $solarData = new SolarData();
        $solarData->source = (string) $xmlobj->solardata->source;
        $solarData->noise_level = (string) $xmlobj->solardata->signalnoise;
        $solarData->last_updated = (string) $xmlobj->solardata->updated;
        $solarData->save();

        foreach ($xmlobj->solardata->calculatedconditions as $bands) {
            $bar = $this->output->createProgressBar(count($bands));
            $bar->start();
            foreach ($bands as $band) {
                $target = (string) $band->attributes()->name;
                $existingRow = $this->solarDataRowRepository->where('name', '=', $target)->where('solar_id', '=', $solarData->id)->first();

                if (! empty($existingRow)) {
                    if ((string) $band->attributes()->time == 'day') {
                        $existingRow->day = (string) $band->attributes()->time;
                        $existingRow->day_condx = (string) $band[0];
                    }
                    if ((string) $band->attributes()->time == 'night') {
                        $existingRow->night = (string) $band->attributes()->time;
                        $existingRow->night_condx = (string) $band[0];
                    }

                    $existingRow->save();
                } else {
                    $dataRow = new SolarBandData();
                    $dataRow->name = (string) $band->attributes()->name;

                    if ((string) $band->attributes()->time == 'day') {
                        $dataRow->day = (string) $band->attributes()->time;
                        $dataRow->day_condx = (string) $band[0];
                    }
                    if ((string) $band->attributes()->time == 'night') {
                        $dataRow->night = (string) $band->attributes()->time;
                        $dataRow->night_condx = (string) $band[0];
                    }
                    $dataRow->solar_id = $solarData->id;
                    $dataRow->save();
                }
                $bar->advance();
            }

            $bar->finish();
        }

        $this->info('Complete'.PHP_EOL);

        return true;
    }
}
