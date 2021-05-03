<?php

namespace Modules\Solar\Console;

use Illuminate\Console\Command;
use Modules\Setting\Contracts\Setting;
use Modules\Solar\Entities\Solar;
use Modules\Solar\Entities\SolarBandData;
use Modules\Solar\Repositories\SolarDataRowRepository;
use SimpleXMLElement;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;

class PullSolarData extends Command
{
    /**
     * @var Setting
     */
    private $setting;

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
    protected $description = 'Recover Latest Solar Data.';

    /**
     * @var SolarDataRowRepository
     */
    private $solarDataRowRepository;

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(Setting $setting, SolarDataRowRepository $solarDataRowRepository)
    {
        parent::__construct();
        $this->setting = $setting;
        $this->solarDataRowRepository = $solarDataRowRepository;
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $xmlstr = file_get_contents($this->setting->get('solar::target_url'));
        $xmlobj = new SimpleXMLElement($xmlstr);

        $this->info('Pulling Latest Solar Data');

        $solarData = new Solar();
        $solarData->source = (string) $xmlobj->solardata->source;
        $solarData->noise_level = (string) $xmlobj->solardata->signalnoise;
        $solarData->last_updated = (string) $xmlobj->solardata->updated;

        $solarData->solarwind = (string) $xmlobj->solardata->solarwind;
        $solarData->aurora = (string) $xmlobj->solardata->aurora;
        $solarData->solarflux = (string) $xmlobj->solardata->solarflux;
        $solarData->aindex = (string) $xmlobj->solardata->aindex;
        $solarData->kindex = (string) $xmlobj->solardata->kindex;
        $solarData->xray = (string) $xmlobj->solardata->xray;
        $solarData->heliumline = (string) $xmlobj->solardata->heliumline;
        $solarData->sunspots = (string) $xmlobj->solardata->sunspots;
        $solarData->protonflux = (string) $xmlobj->solardata->protonflux;
        $solarData->electonflux = (string) $xmlobj->solardata->electonflux;

        $solarData->magneticfield = (string) $xmlobj->solardata->magneticfield;
        $solarData->kindexnt = (string) $xmlobj->solardata->kindexnt;
        $solarData->normalization = (string) $xmlobj->solardata->normalization;

        $solarData->latdegree = (string) $xmlobj->solardata->latdegree;
        $solarData->geomagfield = (string) $xmlobj->solardata->geomagfield;
        $solarData->fof2 = (string) $xmlobj->solardata->fof2;
        $solarData->muffactor = (string) $xmlobj->solardata->muffactor;
        $solarData->muf = (string) $xmlobj->solardata->muf;

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

    /**
     * Get the console command arguments.
     *
     * @return array
     */
    protected function getArguments()
    {
        return [
            ['example', InputArgument::REQUIRED, 'An example argument.'],
        ];
    }

    /**
     * Get the console command options.
     *
     * @return array
     */
    protected function getOptions()
    {
        return [
            ['example', null, InputOption::VALUE_OPTIONAL, 'An example option.', null],
        ];
    }
}
