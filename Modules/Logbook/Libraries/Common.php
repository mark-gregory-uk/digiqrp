<?php


namespace Modules\Logbook\Libraries;

use Illuminate\Support\Facades\Log;

class Common
{

    protected $socket;
    protected $port;
    protected $address;
    protected $version;
    protected $stdin;
    protected $targetUrl;


    public function __construct()
    {

        $this->version = '1.1.0';
        $this->port = 2333;

        $this->address = '0.0.0.0';

        error_reporting(~E_WARNING); // Reduce errors


        if(!($this->socket = socket_create(AF_INET, SOCK_DGRAM, 0)))
        {
            $errorcode = socket_last_error();
            $errormsg = socket_strerror($errorcode);

            Log::error("Couldn't create socket: [" . $errorcode ."]" . $errormsg);

        }
        Log::info('MAC Logger Bridge '.$this->version.' created');

        // Bind the source address
        if( !socket_bind($this->socket, $this->address ,$this->port) )
        {
            $errorcode = socket_last_error();
            $errormsg = socket_strerror($errorcode);

            Log::error("Couldn't create socket: [" . $errorcode ."]" . $errormsg);
        }

    }

    function __destruct() {
        Log::info('Closing Socket');
        $this->close();
    }

    public function close(){
        Log::info('Socket Closing');
        socket_close($this->socket);
    }


    private function setLocalBroadcastIP(){
        $hostAddress =   explode(".", gethostbyname(php_uname('n')));
        $hostAddress[3]=255;
        return implode('.',$hostAddress);
    }
}