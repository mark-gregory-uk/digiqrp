#!/usr/bin/perl

# dxcc - determining the DXCC country of a callsign
#
# Copyright (C) 2007-2019  Fabian Kurz, DJ1YFK
#
# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 2 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the
# Free Software Foundation, Inc., 59 Temple Place - Suite 330,
# Boston, MA 02111-1307, USA.

use strict;
use POSIX;

my $version = 'VERSION';
my $gui = 0;
my $earthfile = '';		# world map. location will be found later.
my $splash =  "                    Please enter a callsign!";
my $credits = "dxcc $version (c) Fabian Kurz, DJ1YFK.  http://fkurz.net/ham/dxcc.html

Determines the ARRL DXCC entity of a ham radio callsign, based on the cty.dat
country file by Jim Reisert, AD1C (http://country-files.com/).

This is free software, and you are welcome to redistribute it
under certain conditions (see COPYING).";

my %fullcalls;          # hash of full calls (=DL1XYZ)
my %prefixes;			# hash of arrays  main prefix -> (all, prefixes,..)
my %dxcc;				# hash of arrays  main prefix -> (CQZ, ITUZ, ...)
my $mainprefix;
my @dxcc;

my ($mylat, $mylon) = (0,0);
my $args='';

my $lidadditions="^QRP\$|^LGT\$";
my $csadditions="(^P\$)|(^M{1,2}\$)|(^AM\$)|(^A\$)";

&read_cty();

if (!$ARGV[0] || ($ARGV[0] =~ /-[^mg]/)) {
	print "$credits

Usage:  dxcc <callsign>\n\n";

	exit;
}
else {
	$args = "@ARGV";
	if ($args =~ /-g/) {
		$gui = 1;
	}
	if ($args =~ /-m (.+?)\b/) {			# Own DXCC for beam headings
		($mylat, $mylon)  = (&dxcc("\U$1"))[4,5];
		$args =~ s/.+\b([A-Z0-9\/]+)/$1/g;
	}
}

unless ($gui) {
	my @dxcc = &dxcc("\U$args");

	my ($bearing, $distance) = &qrbqtf($mylat, $mylon, $dxcc[4], $dxcc[5]);

	print "\U$args\n\n";
	print "Main Prefix:    $dxcc[7]\n";
	print "$dxcc[0]\n";
	print "WAZ Zone:       $dxcc[1]\n";
	print "ITU Zone:       $dxcc[2]\n";
	print "$dxcc[3]\n";
	print "Latitude:       $dxcc[4]\n";
	print "Longitude:      $dxcc[5]\n";
	print "UTC shift:      $dxcc[6]\n";
	if ($mylat || $mylon) {
		print "Bearing:        $bearing°\n";
		print "Distance:       $distance km\n";
	}
	print "\n";
}

###############################################################################
# GUI
# This part is for the GUI only.
###############################################################################

else {								# if $gui

	our $hastk = 0;
	foreach (@INC) {
		if (-e $_."/Tk.pm") {
			$hastk = 1;
		}
	}

	unless ($hastk) {
		die "Tk.pm not found. Exiting.";
	}

	# This is like 'use Tk', except that use is always done at compile
	# time, which is not wanted in this case (when running w/o gui).
	require Tk; import Tk;

	$earthfile = &search_earth_file;

	print "Found earth.gif: $earthfile\n";

	my $callsign='';

	my $dxcc_result = $splash;
	my $mw = MainWindow->new();
	$mw->geometry("640x480");
	$mw->title("dxcc - a DXCC lookup utility");

	my $dot;
	my $t_frame = $mw->Frame(-relief=>'groove', -bd=>1)
		->pack(-side => 'top', -fill => 'y');
	my $m_frame = $mw->Frame(-bd => 2)
		->pack(-side => 'top', -fill => 'y');
	my $b_frame = $mw->Frame( -bd => 2)
		->pack(-side => 'bottom', -fill => 'both');

	my $canvas = $t_frame->Canvas(-height => 320, -width=> 640  )->pack( );
	my $photo = $t_frame->Photo( -file => $earthfile );
	my $earth = $canvas->createImage(320,160, -image=> $photo, -tags => 'item');

	# Home-Marker, if $mylon || $mylat set
	if ($mylon || $mylat) {
		my $homedot = $canvas->createOval((640*(180 - $mylon)/360)-5,(320*(90 -
			$mylat)/180)-5, (640*(180 - $mylon)/360)+5,
			(320*(90 - $mylat)/180)+5, -fill => 'green');
	}

	$m_frame->Label(-text => "Callsign: ")->pack(-side => 'left');
	my $call_entry = $m_frame->Entry(-textvariable => \$callsign,
		-relief => 'sunken', -validate => 'all', -validatecommand =>
			\&validate) ->pack(-side =>'right');

	$call_entry->focus;

	$mw->Label(-textvariable => \$dxcc_result, -justify => 'left',
		-font => "courier 12")->pack(-side => 'left');


	my $exit_b = $b_frame->Button(-text => "Exit", -command => sub { exit })
		->pack(-side=>'right', -expand => 1);
	my $clear_b= $b_frame->Button(-text => "Clear", -command =>
		sub { $call_entry->delete(0, 'end'); $callsign = ''; })
		->pack(-side => 'left', -expand => 1);

	my $credits_b = $b_frame->Button(-text => "Credits", -command => \&credits)
		->pack(-side => 'left', -expand => 1);

	MainLoop();

	sub validate {
		if ($_[1] =~ /[0-9A-Za-z\/]/) {
			@dxcc = &dxcc("\U$_[0]");
			my ($bearing, $distance) = &qrbqtf($mylat, $mylon, $dxcc[4], $dxcc[5]);
			unless ($dxcc[2]) {
				$dxcc_result = $splash;
			}
			else {
				$dxcc[0] .= " ($dxcc[7])";
				$dxcc_result = sprintf(
					"Country Name:   %-20s".
						"WAZ Zone:       %s\n".
						"ITU Zone:       %-20s".
						"Continent:      %s\n".
						"Latitude:       %-20s".
						"Longitude:      %s\n".
						"UTC shift:      %-20s\n", @dxcc[0..6]
				);
				if ($mylat || $mylon) {		# One may be zero :-)
					$dxcc_result .= sprintf(
						"Distance (km):  %-20s".
							"Bearing (°):    %s\n",
						$distance, $bearing
					)
				}
			}

			my $lon = 640*(180 - $dxcc[5])/360;
			my $lat = 320*(90 - $dxcc[4])/180;

			$canvas->delete($dot) if (defined($dot));

			$dot = $canvas->createOval($lon-5,$lat-5, $lon+5, $lat+5, -fill =>
				'red') if ($dxcc[2]);

			return 1;
		}
		else {
			return 0;
		}
	}

	sub credits {
		my $creditwindow = MainWindow->new();
		$creditwindow->geometry("500x170");
		$creditwindow->title("dxcc - Credits");
		$creditwindow->Label(-text =>
			"$credits\n\nMap: http://earthobservatory.nasa.gov/Newsroom/BlueMarble/",
			-justify => 'left')->pack();
		my $exit_b = $creditwindow->Button(-text => "Exit", -command =>
			sub { $creditwindow->destroy })
			->pack(-side=>'right', -expand => 1);
	}

}
# End of GUI

###############################################################################
#
# &wpx derives the Prefix following WPX rules from a call. These can be found
# at: http://www.cq-amateur-radio.com/wpxrules.html
#  e.g. DJ1YFK/TF3  can be counted as both DJ1 or TF3, but this sub does
# not ask for that, always TF3 (= the attached prefix) is returned. If that is
# not want the OP wanted, it can still be modified manually.
#
###############################################################################

sub wpx {
	my ($prefix,$a,$b,$c);

	# First check if the call is in the proper format, A/B/C where A and C
	# are optional (prefix of guest country and P, MM, AM etc) and B is the
	# callsign. Only letters, figures and "/" is accepted, no further check if the
	# callsign "makes sense".
	# 23.Apr.06: Added another "/X" to the regex, for calls like RV0AL/0/P
	# as used by RDA-DXpeditions....

	if ($_[0] =~
		/^((\d|[A-Z])+\/)?((\d|[A-Z]){3,})(\/(\d|[A-Z])+)?(\/(\d|[A-Z])+)?$/) {

		# Now $1 holds A (incl /), $3 holds the callsign B and $5 has C
		# We save them to $a, $b and $c respectively to ensure they won't get
		# lost in further Regex evaluations.

		($a, $b, $c) = ($1, $3, $5);
		if ($a) { chop $a };            # Remove the / at the end
		if ($c) { $c = substr($c,1,)};  # Remove the / at the beginning

		# In some cases when there is no part A but B and C, and C is longer than 2
		# letters, it happens that $a and $b get the values that $b and $c should
		# have. This often happens with liddish callsign-additions like /QRP and
		# /LGT, but also with calls like DJ1YFK/KP5. ~/.yfklog has a line called
		# "lidadditions", which has QRP and LGT as defaults. This sorts out half of
		# the problem, but not calls like DJ1YFK/KH5. This is tested in a second
		# try: $a looks like a call (.\d[A-Z]) and $b doesn't (.\d), they are
		# swapped. This still does not properly handle calls like DJ1YFK/KH7K where
		# only the OP's experience says that it's DJ1YFK on KH7K.

		if (!$c && $a && $b) {                  # $a and $b exist, no $c
			if ($b =~ /$lidadditions/) {    # check if $b is a lid-addition
				$b = $a; $a = undef;        # $a goes to $b, delete lid-add
			}
			elsif (($a =~ /\d[A-Z]+$/) && ($b =~ /\d$/)) {   # check for call in $a
			}
		}

		# *** Added later ***  The check didn't make sure that the callsign
		# contains a letter. there are letter-only callsigns like RAEM, but not
		# figure-only calls.

		if ($b =~ /^[0-9]+$/) {			# Callsign only consists of numbers. Bad!
			return undef;			# exit, undef
		}

		# Depending on these values we have to determine the prefix.
		# Following cases are possible:
		#
		# 1.    $a and $c undef --> only callsign, subcases
		# 1.1   $b contains a number -> everything from start to number
		# 1.2   $b contains no number -> first two letters plus 0
		# 2.    $a undef, subcases:
		# 2.1   $c is only a number -> $a with changed number
		# 2.2   $c is /P,/M,/MM,/AM -> 1.
		# 2.3   $c is something else and will be interpreted as a Prefix
		# 3.    $a is defined, will be taken as PFX, regardless of $c

		if ((not defined $a) && (not defined $c)) {  # Case 1
			if ($b =~ /\d/) {                    # Case 1.1, contains number
				$b =~ /(.+\d)[A-Z]*/;            # Prefix is all but the last
				$prefix = $1;                    # Letters
			}
			else {                               # Case 1.2, no number
				$prefix = substr($b,0,2) . "0";  # first two + 0
			}
		}
		elsif ((not defined $a) && (defined $c)) {   # Case 2, CALL/X
			if ($c =~ /^(\d)$/) {              # Case 2.1, number
				$b =~ /(.+\d)[A-Z]*/;            # regular Prefix in $1
				# Here we need to find out how many digits there are in the
				# prefix, because for example A45XR/0 is A40. If there are 2
				# numbers, the first is not deleted. If course in exotic cases
				# like N66A/7 -> N7 this brings the wrong result of N67, but I
				# think that's rather irrelevant cos such calls rarely appear
				# and if they do, it's very unlikely for them to have a number
				# attached.   You can still edit it by hand anyway..
				if ($1 =~ /^([A-Z]\d)\d$/) {        # e.g. A45   $c = 0
					$prefix = $1 . $c;  # ->   A40
				}
				else {                         # Otherwise cut all numbers
					$1 =~ /(.*[A-Z])\d+/;          # Prefix w/o number in $1
					$prefix = $1 . $c;}            # Add attached number
			}
			elsif ($c =~ /$csadditions/) {
				$b =~ /(.+\d)[A-Z]*/;       # Known attachment -> like Case 1.1
				$prefix = $1;
			}
			elsif ($c =~ /^\d\d+$/) {		# more than 2 numbers -> ignore
				$b =~ /(.+\d)[A-Z]*/;       # see above
				$prefix = $1;
			}
			else {                          # Must be a Prefix!
				if ($c =~ /\d$/) {      # ends in number -> good prefix
					$prefix = $c;
				}
				else {                  # Add Zero at the end
					$prefix = $c . "0";
				}
			}
		}
		elsif (defined $a) {                    # $a contains the prefix we want
			if ($a =~ /\d$/) {              # ends in number -> good prefix
				$prefix = $a
			}
			else {                          # add zero if no number
				$prefix = $a . "0";
			}
		}

		# In very rare cases (right now I can only think of KH5K and KH7K and FRxG/T
		# etc), the prefix is wrong, for example KH5K/DJ1YFK would be KH5K0. In this
		# case, the superfluous part will be cropped. Since this, however, changes the
		# DXCC of the prefix, this will NOT happen when invoked from with an
		# extra parameter $_[1]; this will happen when invoking it from &dxcc.

		if (($prefix =~ /(\w+\d)[A-Z]+\d/) && (not defined $_[1])) {
			$prefix = $1;
		}

		return $prefix;
	}
	else { return ''; }    # no proper callsign received.
} # wpx ends here


##############################################################################
#
# &dxcc determines the DXCC country of a given callsign using the cty.dat file
# provided by K1EA at http://www.k1ea.com/cty/cty.dat .
# An example entry of the file looks like this:
#
# Portugal:                 14:  37:  EU:   39.50:     8.00:     0.0:  CT:
#    CQ,CR,CS,CT,=CR5FB/LH,=CS2HNI/LH,=CS5E/LH,=CT/DJ5AA/LH,=CT1BWW/LH,=CT1GFK/LH,=CT1GPQ/LGT,
#    =CT7/ON4LO/LH,=CT7/ON7RU/LH;
#
# The first line contains the name of the country, WAZ, ITU zones, continent,
# latitude, longitude, UTC difference and main Prefix, the second line contains
# possible Prefixes and/or whole callsigns that fit for the country, sometimes
# followed by zones in brackets (WAZ in (), ITU in []).
#
# This sub checks the callsign against this list and the DXCC in which
# the best match (most matching characters) appear. This is needed because for
# example the CTY file specifies only "D" for Germany, "D4" for Cape Verde.
# Also some "unusual" callsigns which appear to be in wrong DXCCs will be
# assigned properly this way, for example Antarctic-Callsigns.
#
# Then the callsign (or what appears to be the part determining the DXCC if
# there is a "/" in the callsign) will be checked against the list of prefixes
# and the best matching one will be taken as DXCC.
#
# The return-value will be an array ("Country Name", "WAZ", "ITU", "Continent",
# "latitude", "longitude", "UTC difference", "DXCC").
#
###############################################################################

sub dxcc {
	my $testcall = shift;
	my $matchchars=0;
	my $matchprefix='';
	my $test;
	my $zones = '';                 # annoying zone exceptions
	my $goodzone;
	my $letter='';


	if ($fullcalls{$testcall}) {            # direct match with "="
		# do nothing! don't try to resolve WPX, it's a full
		# call and will match correctly even if it contains a /
	}
	elsif ($testcall =~ /(^OH\/)|(\/OH[1-9]?$)/) {    # non-Aland prefix!
		$testcall = "OH";                      # make callsign OH = finland
	}
	elsif ($testcall =~ /(^3D2R)|(^3D2.+\/R)/) { # seems to be from Rotuma
		$testcall = "3D2RR";                 # will match with Rotuma
	}
	elsif ($testcall =~ /^3D2C/) {               # seems to be from Conway Reef
		$testcall = "3D2CR";                 # will match with Conway
	}
	elsif ($testcall =~ /(^LZ\/)|(\/LZ[1-9]?$)/) {  # LZ/ is LZ0 by DXCC but this is VP8h
		$testcall = "LZ";
	}
	elsif ($testcall =~ /\w\/\w/) {             # check if the callsign has a "/"
		$testcall = &wpx($testcall,1)."AA";		# use the wpx prefix instead, which may
		# intentionally be wrong, see &wpx!
	}

	$letter = substr($testcall, 0,1);


	foreach $mainprefix (keys %prefixes) {

		foreach $test (@{$prefixes{$mainprefix}}) {
			my $len = length($test);

			if ($letter ne substr($test,0,1)) {			# gains 20% speed
				next;
			}

			$zones = '';

			if (($len > 5) && ((index($test, '(') > -1)			# extra zones
				|| (index($test, '[') > -1))) {
				$test =~ /^([A-Z0-9\/]+)([\[\(].+)/;
				$zones .= $2 if defined $2;
				$len = length($1);
			}

			if ((substr($testcall, 0, $len) eq substr($test,0,$len)) &&
				($matchchars <= $len))	{
				$matchchars = $len;
				$matchprefix = $mainprefix;
				$goodzone = $zones;
			}
		}
	}

	my @mydxcc;										# save typing work

	if (defined($dxcc{$matchprefix})) {
		@mydxcc = @{$dxcc{$matchprefix}};
	}
	else {
		@mydxcc = qw/Unknown 0 0 0 0 0 0 ?/;
	}

	# Different zones?

	if ($goodzone) {
		if ($goodzone =~ /\((\d+)\)/) {				# CQ-Zone in ()
			$mydxcc[1] = $1;
		}
		if ($goodzone =~ /\[(\d+)\]/) {				# ITU-Zone in []
			$mydxcc[2] = $1;
		}
	}

	# cty.dat has special entries for WAE countries which are not separate DXCC
	# countries. Those start with a "*", for example *TA1. Those have to be changed
	# to the proper DXCC. Since there are opnly a few of them, it is hardcoded in
	# here.

	if ($mydxcc[7] =~ /^\*/) {							# WAE country!
		if ($mydxcc[7] eq '*TA1') { $mydxcc[7] = "TA" }		# Turkey
		if ($mydxcc[7] eq '*4U1V') { $mydxcc[7] = "OE" }	# 4U1VIC is in OE..
		if ($mydxcc[7] eq '*GM/s') { $mydxcc[7] = "GM" }	# Shetlands
		if ($mydxcc[7] eq '*IG9') { $mydxcc[7] = "I" }		# African Italy
		if ($mydxcc[7] eq '*IT9') { $mydxcc[7] = "I" }		# Sicily
		if ($mydxcc[7] eq '*JW/b') { $mydxcc[7] = "JW" }	# Bear Island
	}

	# CTY.dat uses "/" in some DXCC names, but I prefer to remove them, for example
	# VP8/s ==> VP8s etc.

	$mydxcc[7] =~ s/\///g;

	return @mydxcc;

} # dxcc ends here


sub read_cty {
	# Read cty.dat from AD1C, or this program itself (contains cty.dat)
	my $self=0;
	my $filename;

	if (-e "/usr/share/dxcc/cty.dat") {
		$filename = "/usr/share/dxcc/cty.dat";
	}
	elsif (-e "/usr/local/share/dxcc/cty.dat") {
		$filename = "/usr/local/share/dxcc/cty.dat";
	}
	else {
		$filename = $0;
		$self = 1;
	}

	open CTY, $filename;

	while (my $line = <CTY>) {
		# When opening itself, skip all lines before "CTY".
		if ($self) {
			if ($line =~ /^#CTY/) {
				$self = 0
			}
			next;
		}

		# In case we're reading this file, remove #s
		if (substr($line, 0, 1) eq '#') {
			substr($line, 0, 1) = '';
		}

		if (substr($line, 0, 1) ne ' ') {			# New DXCC
			$line =~ /\s+([*A-Za-z0-9\/]+):\s+$/;
			$mainprefix = $1;
			$line =~ s/\s{2,}//g;
			@{$dxcc{$mainprefix}} = split(/:/, $line);
		}
		else {										# prefix-line
			$line =~ s/\s+//g;

			# read full calls into separate hash. this hash only
			# contains the information that this is a full call and
			# therefore doesn't need to be handled by &wpx even if
			# it contains a slash

			if ($line =~ /=/) {
				my @matches = ($line =~ /=([A-Z0-9\/]+)(\(\d+\))?(\[\d+\])?[,;]/g);
				foreach (@matches) {
					$fullcalls{$_} = 1;
				}
			}

			# Continue with everything else. Including full calls, which will
			# be read as normal prefixes.

			$line =~ s/=//g;

			# handle "normal" prefixes
			unless (defined($prefixes{$mainprefix}[0])) {
				@{$prefixes{$mainprefix}} = split(/,|;/, $line);
			}
			else {
				push(@{$prefixes{$mainprefix}}, split(/,|;/, $line));
			}

		}
	}
	close CTY;

} # read_cty


sub search_earth_file {
	if (-e 'earth.gif') {		# current dir
		return 'earth.gif';
	}
	elsif ($0 =~ /(.+)\/bin\/dxcc$/) {
		if (-e $1."/share/dxcc/earth.gif") {
			return $1."/share/dxcc/earth.gif"
		}
	}

	if (-e '/usr/local/share/dxcc/earth.gif') {
		return '/usr/local/share/dxcc/earth.gif';
	}
	elsif (-e '/usr/share/dxcc/earth.gif') {
		return '/usr/share/dxcc/earth.gif';
	}

	die "Couldn't find 'earth.gif'. Tried:\n".
		"./earth.gif,\n$1/share/dxcc/earth.gif,\n".
		"/usr/local/share/dxcc/earth.gif,\n/usr/share/dxcc/earth.gif\n";

}




sub qrbqtf {
	my ($mylat, $mylon, $hislat, $hislon) = @_;
	my $PI=3.14159265;
	my $z =180/$PI;

	my $g = acos(sin($mylat/$z)*sin($hislat/$z)+cos($mylat/$z)*cos($hislat/$z)*
		cos(($hislon-$mylon)/$z));

	my $dist = $g * 6371;
	my $dir = 0;

	unless ($dist == 0) {
		$dir = acos((sin($hislat/$z)-sin($mylat/$z)*cos($g))/
			(cos($mylat/$z)*sin($g)))*360/(2*$PI);
	}

	if (sin(($hislon-$mylon)/$z) < 0) { $dir = 360 - $dir;}
	$dir = 360 - $dir;

	return (int($dir), int($dist));

}




exit;
#CTY
#
#Sov Mil Order of Malta:   15:  28:  EU:   41.90:   -12.43:    -1.0:  1A:
#    1A;
#Spratly Islands:          26:  50:  AS:    9.88:  -114.23:    -8.0:  1S:
#    9M0,BM9S,BN9S,BO9S,BP9S,BQ9S,BU9S,BV9S,BW9S,BX9S,=9M2/PG5M,=9M4SDX,=9M4SLL,=9M6/LA6VM,=9M6/LA7XK,
#    =9M6/N1UR,=9M6/OH2YY,=DX0JP,=DX0K,=DX0P;
#Monaco:                   14:  27:  EU:   43.73:    -7.40:    -1.0:  3A:
#    3A,=3A/4Z5KJ/LH;
#Agalega & St. Brandon:    39:  53:  AF:  -10.45:   -56.67:    -4.0:  3B6:
#    3B6,
#    3B7;
#Mauritius:                39:  53:  AF:  -20.35:   -57.50:    -4.0:  3B8:
#    3B8;
#Rodriguez Island:         39:  53:  AF:  -19.70:   -63.42:    -4.0:  3B9:
#    3B9;
#Equatorial Guinea:        36:  47:  AF:    1.70:   -10.33:    -1.0:  3C:
#    3C;
#Annobon Island:           36:  52:  AF:   -1.43:    -5.62:    -1.0:  3C0:
#    3C0;
#Fiji:                     32:  56:  OC:  -17.78:  -177.92:   -12.0:  3D2:
#    3D2,=3D5X;
#Conway Reef:              32:  56:  OC:  -22.00:  -175.00:   -12.0:  3D2/c:
#    =3D20CR,=3D2C,=3D2CI,=3D2CR,=3D2CY;
#Rotuma Island:            32:  56:  OC:  -12.48:  -177.08:   -12.0:  3D2/r:
#    =3D2AG/P,=3D2EU,=3D2GC/P,=3D2HY/R,=3D2NV/P,=3D2NV/R,=3D2R,=3D2RA,=3D2RI,=3D2RO,=3D2RR,=3D2RX,
#    =3D2VB/R;
#Kingdom of eSwatini:      38:  57:  AF:  -26.65:   -31.48:    -2.0:  3DA:
#    3DA,=3DA0BP/J;
#Tunisia:                  33:  37:  AF:   35.40:    -9.32:    -1.0:  3V:
#    3V,TS,=3V8CB/J,=3V8ST/J;
#Vietnam:                  26:  49:  AS:   15.80:  -107.90:    -7.0:  3W:
#    3W,XV,=XV2G/C;
#Guinea:                   35:  46:  AF:   11.00:    10.68:     0.0:  3X:
#    3X;
#Bouvet:                   38:  67:  AF:  -54.42:    -3.38:    -1.0:  3Y/b:
#    =3Y/ZS6GCM,=3Y0C,=3Y0E;
#Peter 1 Island:           12:  72:  SA:  -68.77:    90.58:     4.0:  3Y/p:
#    =3Y0X;
#Azerbaijan:               21:  29:  AS:   40.45:   -47.37:    -4.0:  4J:
#    4J,4K,=4J5T/FF,=4J7WMF/FF,=4K4K/FF,=4K6AE/FF;
#Georgia:                  21:  29:  AS:   42.00:   -45.00:    -4.0:  4L:
#    4L,=4L1W/FF,=R3TT/UF6V,=RN7G/UF6V,=RV3F/UF6V,=RX3F/UF6V,=UF/UA6GG/FF;
#Montenegro:               15:  28:  EU:   42.50:   -19.28:    -1.0:  4O:
#    4O;
#Sri Lanka:                22:  41:  AS:    7.60:   -80.70:    -5.5:  4S:
#    4P,4Q,4R,4S,=4S7CGM/AVR;
#ITU HQ:                   14:  28:  EU:   46.17:    -6.05:    -1.0:  4U1I:
#    =4U0ITU,=4U150ITU,=4U1ITU,=4U1WRC;
#United Nations HQ:        05:  08:  NA:   40.75:    73.97:     5.0:  4U1U:
#    =4U1UN,=4U50SPACE,=4U60UN,=4U64UN,=4U70UN;
#Vienna Intl Ctr:          15:  28:  EU:   48.20:   -16.30:    -1.0:  *4U1V:
#    =4U0R,=4U10NPT,=4U18FIFA,=4U1A,=4U1VIC,=4U1WED,=4U1XMAS,=4U2U,=4U30VIC,=4U500M,=4U70VIC,=4Y1A,
#    =C7A;
#Timor - Leste:            28:  54:  OC:   -8.80:  -126.05:    -9.0:  4W:
#    4W,=4U1ET;
#Israel:                   20:  39:  AS:   31.32:   -34.82:    -2.0:  4X:
#    4X,4Z,=4X01T/FF,=4X1FC/LH,=4X1GO/LH,=4X1IG/LH,=4X1KS/LH,=4X1OM/LH,=4X1OZ/LH,=4X1ST/LH,=4X1VF/LH,
#    =4X1ZM/LH,=4X1ZZ/LH,=4X4FC/LH,=4X4FR/LH,=4X4YM/LH,=4X5HF/LH,=4X5IQ/LH,=4X5MG/LH,=4X6DK/LH,
#    =4X6HP/LH,=4X6RE/LH,=4X6TT/JY1,=4X6UT/LH,=4X6UU/LH,=4X6ZM/LH,=4Z1DZ/LH,=4Z1KD/LH,=4Z1KM/LH,
#    =4Z1ZV/LH,=4Z4DX/ANT,=4Z4DX/J,=4Z4DX/LGT,=4Z4DX/LH,=4Z4HC/LH,=4Z4KJ/LH,=4Z4KX/LH,=4Z5DZ/LH,
#    =4Z5FL/LH,=4Z5FW/LH,=4Z5KJ/LGT,=4Z5KJ/LH,=4Z5NW/YL,=4Z5OT/LH,=4Z5SL/LH,=4Z8GZ/LH;
#Libya:                    34:  38:  AF:   27.20:   -16.60:    -2.0:  5A:
#    5A;
#Cyprus:                   20:  39:  AS:   35.00:   -33.00:    -2.0:  5B:
#    5B,C4,H2,P3,=5B/DJ5AA/LH,=5B/LY1DF/LGT,=5B4AKV/EURO,=5B4PSG/J,=5B4STA/J,=5B8AP/LH;
#Tanzania:                 37:  53:  AF:   -5.75:   -33.92:    -3.0:  5H:
#    5H,5I;
#Nigeria:                  35:  46:  AF:    9.87:    -7.55:    -1.0:  5N:
#    5N,5O;
#Madagascar:               39:  53:  AF:  -19.00:   -46.58:    -3.0:  5R:
#    5R,5S,6X;
#Mauritania:               35:  46:  AF:   20.60:    10.50:     0.0:  5T:
#    5T;
#Niger:                    35:  46:  AF:   17.63:    -9.43:    -1.0:  5U:
#    5U;
#Togo:                     35:  46:  AF:    8.40:    -1.28:     0.0:  5V:
#    5V;
#Samoa:                    32:  62:  OC:  -13.93:   171.70:   -13.0:  5W:
#    5W;
#Uganda:                   37:  48:  AF:    1.92:   -32.60:    -3.0:  5X:
#    5X;
#Kenya:                    37:  48:  AF:    0.32:   -38.15:    -3.0:  5Z:
#    5Y,5Z,=5Z4IC/Y2K,=5Z4RT/Y2K;
#Senegal:                  35:  46:  AF:   15.20:    14.63:     0.0:  6W:
#    6V,6W;
#Jamaica:                  08:  11:  NA:   18.20:    77.47:     5.0:  6Y:
#    6Y;
#Yemen:                    21:  39:  AS:   15.65:   -48.12:    -3.0:  7O:
#    7O,
#    =7O2A(37)[48],=7O6T(37)[48];
#Lesotho:                  38:  57:  AF:  -29.22:   -27.88:    -2.0:  7P:
#    7P;
#Malawi:                   37:  53:  AF:  -14.00:   -34.00:    -2.0:  7Q:
#    7Q;
#Algeria:                  33:  37:  AF:   28.00:    -2.00:    -1.0:  7X:
#    7R,7T,7U,7V,7W,7X,7Y,=7X2BDX/JOTA,=7X5VRK/ND;
#Barbados:                 08:  11:  NA:   13.18:    59.53:     4.0:  8P:
#    8P;
#Maldives:                 22:  41:  AS:    4.15:   -73.45:    -5.0:  8Q:
#    8Q;
#Guyana:                   09:  12:  SA:    6.02:    59.45:     4.0:  8R:
#    8R,=8R1AK/LH;
#Croatia:                  15:  28:  EU:   45.18:   -15.30:    -1.0:  9A:
#    9A,=9A/DL9CHR/LH,=9A/F5OGG/LH,=9A/IK3MZS/LH,=9A/IW3ILP/LH,=9A/OK1FZM/LH,=9A0CI/LH,=9A2MF/LH,
#    =9A2MF/LT,=9A2WJ/LH,=9A3FO/P/LH,=9A3KB/LH,=9A3KR/LH,=9A5JR/LH,=9A5SM/YL,=9A5V/LH,=9A6AA/LH,
#    =9A6PBT/YL,=9A70DP/KA,=9A70DP/PU,=9A70DP/RI,=9A70DP/ZG,=9A7K/LH,=9A7SSY/LH;
#Ghana:                    35:  46:  AF:    7.70:     1.57:     0.0:  9G:
#    9G;
#Malta:                    15:  28:  EU:   35.88:   -14.42:    -1.0:  9H:
#    9H,=9H1AW/EU25,=9H1EI/EU25,=9H1JN/EU25,=9H1MRL/EU25,=9H1RV/EU25,=9H1SP/EU25,=9H1VC/CGA,=9H1VC/CGS,
#    =9H1VC/KHS,=9H1VC/KHS/P,=9H1ZZ/EU25,=9H4GRS/LH,=9H9DSG/J,=9H9PSG/J,=9H9SEL/LH;
#Zambia:                   36:  53:  AF:  -14.22:   -26.73:    -2.0:  9J:
#    9I,9J,=4U/ON6TT/M;
#Kuwait:                   21:  39:  AS:   29.38:   -47.38:    -3.0:  9K:
#    9K,NLD,=9K2BI/J,=9K2BI/JOTA,=9K2OK/KACC;
#Sierra Leone:             35:  46:  AF:    8.50:    13.25:     0.0:  9L:
#    9L;
#West Malaysia:            28:  54:  AS:    3.95:  -102.23:    -8.0:  9M2:
#    9M,9W,=9M0SEA,=9M6/PA0RRS/2,=9M6/ZS6EZ/2,=9M6XX/2,=9M6YBG/2,=9M8DX/2,=9M8SYA/2,=9W6KOM/2,
#    =9W6MAN/2;
#East Malaysia:            28:  54:  OC:    2.68:  -113.32:    -8.0:  9M6:
#    =9M4CKT/6,=9M4CRP/6,=9M9/7M2VPR,=9M9/CCL,=VERSION,
#    9M6,9W6,=9M1CSS,=9M2/G3TMA/6,=9M2/PG5M/6,=9M2/R6AF/6,=9M2GCN/6,=9M2MDX/6,=9M4ARD/6,=9M4CBP,
#    =9M4CCB,=9M4CKT,=9M4CMY,=9M4CRB,=9M4CRP,=9M4CWS,=9M4GCW,=9M4LHS,=9M4LTW,=9M4SAB,=9M4SEB,=9M4SHQ,
#    =9M4SJO,=9M4SJS,=9M4SJSA,=9M4SJSB,=9M4SJSD,=9M4SJSL,=9M4SJSM,=9M4SJSP,=9M4SJST,=9M4SJSW,=9M4SJX,
#    =9M4SMO,=9M4SMS,=9M4SMY,=9M4STA,=9M50IARU/6,=9M50MS,=9M51SB,=9M57MS,=9M58MS,=9M59MS,=9W2RCR/6,
#    =9W2VVH/6,
#    9M8,9W8,=9M1CSQ,=9M4CHQ,=9M4CJN,=9M4CPB,=9M4CSR,=9M4CSS,=9M4JSE,=9M4LHM,=9M4RSA,=9M4SJE,=9M4SJQ,
#    =9M4SWK,=9M50IARU/8,=9M50MQ,=9M51GW,=9M53QA,=9M57MW,=9M58MW,=9M59MW;
#Nepal:                    22:  42:  AS:   27.70:   -85.33:   -5.75:  9N:
#    9N;
#Dem. Rep. of the Congo:   36:  52:  AF:   -3.12:   -23.03:    -1.0:  9Q:
#    9O,9P,9Q,9R,9S,9T;
#Burundi:                  36:  52:  AF:   -3.17:   -29.78:    -2.0:  9U:
#    9U;
#Singapore:                28:  54:  AS:    1.37:  -103.78:    -8.0:  9V:
#    9V,S6;
#Rwanda:                   36:  52:  AF:   -1.75:   -29.82:    -2.0:  9X:
#    9X;
#Trinidad & Tobago:        09:  11:  SA:   10.38:    61.28:     4.0:  9Y:
#    9Y,9Z;
#Botswana:                 38:  57:  AF:  -22.00:   -24.00:    -2.0:  A2:
#    8O,A2;
#Tonga:                    32:  62:  OC:  -21.22:   175.13:   -13.0:  A3:
#    A3,=A35JP/H,=A35TN/N,=A35TN/V,=A35ZG/H;
#Oman:                     21:  39:  AS:   23.60:   -58.55:    -4.0:  A4:
#    A4,=A41CK/ND,=A41HA/ND,=A41JR/RD,=A41KA/ND,=A41KB/ND,=A41KC/ND,=A41KJ/ND,=A41LD/ND,=A41LD/ND/P,
#    =A41LD/RD,=A41LD/SQ,=A41LX/M/ND,=A41LX/ND,=A41LX/RD,=A41LZ/RD,=A41MA/RD,=A41MD/RD,=A41ME/ND,
#    =A41MO/ND,=A41MO/RD,=A41MO/SQ,=A41MX/ND,=A41NN/ND,=A41NN/ND/P,=A41NW/ND,=A41OD/ND,=A41OM/SQ,
#    =A41OO/ND,=A41OO/ND/M,=A41OP/ND,=A41OR/ND,=A41PB/ND,=A41PB/ND/M,=A41PG/M/ND,=A41PG/ND,=A41PG/SQ,
#    =A41PH/ND,=A41PJ/ND,=A41PY/ND,=A41RS/ND,=A41WM/ND,=A45ND/ND/P,=A45RS/ND,=A45VU/ND,=A45WH/MF,
#    =A45WH/ND,=A45WH/P/ND,=A45WM/ND,=A45WR/ND,=A45XO/ND,=A45XO/ND/P,=A45XO/RD,=A45XW/ND,=A47RK/ND,
#    =A47RS/JOTA,=A47RS/ND,=A47RS/SQ;
#Bhutan:                   22:  41:  AS:   27.40:   -90.18:    -6.0:  A5:
#    A5;
#United Arab Emirates:     21:  39:  AS:   24.00:   -54.00:    -4.0:  A6:
#    A6,=A61B/ND,=A61BK/DM,=A61BK/JJ,=A61BK/ND,=A61C/ND,=A61D/ND,=A61DA/MD,=A61DD/FD,=A61DD/MD,
#    =A61DD/ND,=A61DJ/ND,=A61E/ND,=A61EI/ARS,=A61FJ/ARS,=A61FJ/FD,=A61FJ/ND,=A61FK/47ND,=A61FK/FD,
#    =A61FK/MD,=A61HA/ND,=A61K/ND,=A61LL/ND,=A61M/ND,=A61N/ND,=A61Q/ARS,=A61Q/FD,=A61Q/MD,=A61Q/ND,
#    =A61QQ/ND,=A61R/ND,=A61RK/ND,=A61SM/ND,=A61ZA/FD,=A62ER/ND,=A62ER/ZM3,=A65DC/FD;
#Qatar:                    21:  39:  AS:   25.25:   -51.13:    -3.0:  A7:
#    A7,=A71CM/ND,=A71EM/QND,=A71FJ/QND;
#Bahrain:                  21:  39:  AS:   26.03:   -50.53:    -3.0:  A9:
#    A9,=A92AA/GR;
#Pakistan:                 21:  41:  AS:   30.00:   -70.00:    -5.0:  AP:
#    6P,6Q,6R,6S,AP,AQ,AR,AS;
#Scarborough Reef:         27:  50:  AS:   15.08:  -117.72:    -8.0:  BS7:
#    =BS7H;
#Taiwan:                   24:  44:  AS:   23.72:  -120.88:    -8.0:  BV:
#    BM,BN,BO,BP,BQ,BU,BV,BW,BX;
#Pratas Island:            24:  44:  AS:   20.70:  -116.70:    -8.0:  BV9P:
#    BM9P,BN9P,BO9P,BP9P,BQ9P,BU9P,BV9P,BW9P,BX9P;
#China:                    24:  44:  AS:   36.00:  -102.00:    -8.0:  BY:
#    3H,3H0(23)[42],3H9(23)[43],3I,3I0(23)[42],3I9(23)[43],3J,3J0(23)[42],3J9(23)[43],3K,3K0(23)[42],
#    3K9(23)[43],3L,3L0(23)[42],3L9(23)[43],3M,3M0(23)[42],3M9(23)[43],3N,3N0(23)[42],3N9(23)[43],3O,
#    3O0(23)[42],3O9(23)[43],3P,3P0(23)[42],3P9(23)[43],3Q,3Q0(23)[42],3Q9(23)[43],3R,3R0(23)[42],
#    3R9(23)[43],3S,3S0(23)[42],3S9(23)[43],3T,3T0(23)[42],3T9(23)[43],3U,3U0(23)[42],3U9(23)[43],
#    B0(23)[42],B2,B3,B4,B5,B6,B7,B8,B9(23)[43],BA,BA0(23)[42],BA9(23)[43],BD,BD0(23)[42],BD9(23)[43],
#    BG,BG0(23)[42],BG9(23)[43],BH,BH0(23)[42],BH9(23)[43],BI,BI0(23)[42],BI9(23)[43],BJ,BJ0(23)[42],
#    BJ9(23)[43],BL,BL0(23)[42],BL9(23)[43],BT,BT0(23)[42],BT9(23)[43],BY,BY0(23)[42],BY9(23)[43],BZ,
#    BZ0(23)[42],BZ9(23)[43],XS,XS0(23)[42],XS9(23)[43],=B7/BA7CK(26),=B7/BA7NQ(26),=B7/BD1TX(26),
#    =B7CRA(26),=B90IARU,=BA7CK(26),=BA7IA(26),=BD1TX(26),=BD6KF/0(23)[42],=BD7HC(26),=BD7MQ/9(23),
#    =BG6IFR/9(23),=BG9XD/4,=BG9XD/5,=BG9XD/7,=BH4CXY/9(23),=W5FKX/BY1RX,
#    =BA4DC/0(23)[42],=BD9BI/0(23)[42],=BG8FUL/0(23)[42],
#    =BA4DT/0(23)[42],=BA4RF/0(23)[42],=BA7IO/0(23)[42],=BA7JS/0(23)[42],=BD1PTA/0(23)[42],
#    =BD7IEE/0(23)[42],=BG1KIY/0(23)[42],=BG1LLB/0(23)[42],=BG1PIP/0(23)[42],=BG4WUA/0(23)[42],
#    =BY1WXD/0(23)[42],
#    B1,=AA1IZ/BY1DX,=AJ3M/BY1RX,=BG9XD/1,=BT1OY/YL,=BY1BJ/1DX,=BY1PK/I1ZB,=BY1TTY/OD5LN,=DL5MC/BY1PK,
#    =F5RAV/BY1RX,=F6HMJ/BY1TX,=G4DFN/BY1PK,=JT1BV/BY1DX,=JT1BV/BY1RX,=K0MD/BY1TX,=K5SF/BY1RX,
#    =KO4RR/BY1PK,=KU1CW/BY1RX,=LZ2HM/BY1RX,=N4OE/BY1TTY,=N4WV/BY1PK,=OD5LN/BA1RB,=OD5LN/BY1TTY,
#    =OH2MA/BY1DX,=OM3UU/BY1CJL,=UW1GZ/BA1RB,=VE3FU/BY1TTY,=VO1AU/BY1DX,=VO1AU/BY1RX,=VO1AU/BY1TTY,
#    =W0NB/BY1PK,=W4IM/BY1PK,
#    3H2A[33],3H2B[33],3H2C[33],3H2D[33],3H2E[33],3H2F[33],3H2G[33],3H2H[33],3I2A[33],3I2B[33],
#    3I2C[33],3I2D[33],3I2E[33],3I2F[33],3I2G[33],3I2H[33],3J2A[33],3J2B[33],3J2C[33],3J2D[33],
#    3J2E[33],3J2F[33],3J2G[33],3J2H[33],3K2A[33],3K2B[33],3K2C[33],3K2D[33],3K2E[33],3K2F[33],
#    3K2G[33],3K2H[33],3L2A[33],3L2B[33],3L2C[33],3L2D[33],3L2E[33],3L2F[33],3L2G[33],3L2H[33],
#    3M2A[33],3M2B[33],3M2C[33],3M2D[33],3M2E[33],3M2F[33],3M2G[33],3M2H[33],3N2A[33],3N2B[33],
#    3N2C[33],3N2D[33],3N2E[33],3N2F[33],3N2G[33],3N2H[33],3O2A[33],3O2B[33],3O2C[33],3O2D[33],
#    3O2E[33],3O2F[33],3O2G[33],3O2H[33],3P2A[33],3P2B[33],3P2C[33],3P2D[33],3P2E[33],3P2F[33],
#    3P2G[33],3P2H[33],3Q2A[33],3Q2B[33],3Q2C[33],3Q2D[33],3Q2E[33],3Q2F[33],3Q2G[33],3Q2H[33],
#    3R2A[33],3R2B[33],3R2C[33],3R2D[33],3R2E[33],3R2F[33],3R2G[33],3R2H[33],3S2A[33],3S2B[33],
#    3S2C[33],3S2D[33],3S2E[33],3S2F[33],3S2G[33],3S2H[33],3T2A[33],3T2B[33],3T2C[33],3T2D[33],
#    3T2E[33],3T2F[33],3T2G[33],3T2H[33],3U2A[33],3U2B[33],3U2C[33],3U2D[33],3U2E[33],3U2F[33],
#    3U2G[33],3U2H[33],B2A[33],B2B[33],B2C[33],B2D[33],B2E[33],B2F[33],B2G[33],B2H[33],BA2A[33],
#    BA2B[33],BA2C[33],BA2D[33],BA2E[33],BA2F[33],BA2G[33],BA2H[33],BD2A[33],BD2B[33],BD2C[33],
#    BD2D[33],BD2E[33],BD2F[33],BD2G[33],BD2H[33],BG2A[33],BG2B[33],BG2C[33],BG2D[33],BG2E[33],
#    BG2F[33],BG2G[33],BG2H[33],BH2A[33],BH2B[33],BH2C[33],BH2D[33],BH2E[33],BH2F[33],BH2G[33],
#    BH2H[33],BI2A[33],BI2B[33],BI2C[33],BI2D[33],BI2E[33],BI2F[33],BI2G[33],BI2H[33],BJ2A[33],
#    BJ2B[33],BJ2C[33],BJ2D[33],BJ2E[33],BJ2F[33],BJ2G[33],BJ2H[33],BL2A[33],BL2B[33],BL2C[33],
#    BL2D[33],BL2E[33],BL2F[33],BL2G[33],BL2H[33],BT2A[33],BT2B[33],BT2C[33],BT2D[33],BT2E[33],
#    BT2F[33],BT2G[33],BT2H[33],BY2A[33],BY2B[33],BY2C[33],BY2D[33],BY2E[33],BY2F[33],BY2G[33],
#    BY2H[33],BZ2A[33],BZ2B[33],BZ2C[33],BZ2D[33],BZ2E[33],BZ2F[33],BZ2G[33],BZ2H[33],XS2A[33],
#    XS2B[33],XS2C[33],XS2D[33],XS2E[33],XS2F[33],XS2G[33],XS2H[33],=UA9OW/BY2HIT[33],
#    3H2I[33],3H2J[33],3H2K[33],3H2L[33],3H2M[33],3H2N[33],3H2O[33],3H2P[33],3I2I[33],3I2J[33],
#    3I2K[33],3I2L[33],3I2M[33],3I2N[33],3I2O[33],3I2P[33],3J2I[33],3J2J[33],3J2K[33],3J2L[33],
#    3J2M[33],3J2N[33],3J2O[33],3J2P[33],3K2I[33],3K2J[33],3K2K[33],3K2L[33],3K2M[33],3K2N[33],
#    3K2O[33],3K2P[33],3L2I[33],3L2J[33],3L2K[33],3L2L[33],3L2M[33],3L2N[33],3L2O[33],3L2P[33],
#    3M2I[33],3M2J[33],3M2K[33],3M2L[33],3M2M[33],3M2N[33],3M2O[33],3M2P[33],3N2I[33],3N2J[33],
#    3N2K[33],3N2L[33],3N2M[33],3N2N[33],3N2O[33],3N2P[33],3O2I[33],3O2J[33],3O2K[33],3O2L[33],
#    3O2M[33],3O2N[33],3O2O[33],3O2P[33],3P2I[33],3P2J[33],3P2K[33],3P2L[33],3P2M[33],3P2N[33],
#    3P2O[33],3P2P[33],3Q2I[33],3Q2J[33],3Q2K[33],3Q2L[33],3Q2M[33],3Q2N[33],3Q2O[33],3Q2P[33],
#    3R2I[33],3R2J[33],3R2K[33],3R2L[33],3R2M[33],3R2N[33],3R2O[33],3R2P[33],3S2I[33],3S2J[33],
#    3S2K[33],3S2L[33],3S2M[33],3S2N[33],3S2O[33],3S2P[33],3T2I[33],3T2J[33],3T2K[33],3T2L[33],
#    3T2M[33],3T2N[33],3T2O[33],3T2P[33],3U2I[33],3U2J[33],3U2K[33],3U2L[33],3U2M[33],3U2N[33],
#    3U2O[33],3U2P[33],B2I[33],B2J[33],B2K[33],B2L[33],B2M[33],B2N[33],B2O[33],B2P[33],BA2I[33],
#    BA2J[33],BA2K[33],BA2L[33],BA2M[33],BA2N[33],BA2O[33],BA2P[33],BD2I[33],BD2J[33],BD2K[33],
#    BD2L[33],BD2M[33],BD2N[33],BD2O[33],BD2P[33],BG2I[33],BG2J[33],BG2K[33],BG2L[33],BG2M[33],
#    BG2N[33],BG2O[33],BG2P[33],BH2I[33],BH2J[33],BH2K[33],BH2L[33],BH2M[33],BH2N[33],BH2O[33],
#    BH2P[33],BI2I[33],BI2J[33],BI2K[33],BI2L[33],BI2M[33],BI2N[33],BI2O[33],BI2P[33],BJ2I[33],
#    BJ2J[33],BJ2K[33],BJ2L[33],BJ2M[33],BJ2N[33],BJ2O[33],BJ2P[33],BL2I[33],BL2J[33],BL2K[33],
#    BL2L[33],BL2M[33],BL2N[33],BL2O[33],BL2P[33],BT2I[33],BT2J[33],BT2K[33],BT2L[33],BT2M[33],
#    BT2N[33],BT2O[33],BT2P[33],BY2I[33],BY2J[33],BY2K[33],BY2L[33],BY2M[33],BY2N[33],BY2O[33],
#    BY2P[33],BZ2I[33],BZ2J[33],BZ2K[33],BZ2L[33],BZ2M[33],BZ2N[33],BZ2O[33],BZ2P[33],XS2I[33],
#    XS2J[33],XS2K[33],XS2L[33],XS2M[33],XS2N[33],XS2O[33],XS2P[33],
#    =OD5LN/BY1RX,
#    3H3G(23)[33],3H3H(23)[33],3H3I(23)[33],3H3J(23)[33],3H3K(23)[33],3H3L(23)[33],3I3G(23)[33],
#    3I3H(23)[33],3I3I(23)[33],3I3J(23)[33],3I3K(23)[33],3I3L(23)[33],3J3G(23)[33],3J3H(23)[33],
#    3J3I(23)[33],3J3J(23)[33],3J3K(23)[33],3J3L(23)[33],3K3G(23)[33],3K3H(23)[33],3K3I(23)[33],
#    3K3J(23)[33],3K3K(23)[33],3K3L(23)[33],3L3G(23)[33],3L3H(23)[33],3L3I(23)[33],3L3J(23)[33],
#    3L3K(23)[33],3L3L(23)[33],3M3G(23)[33],3M3H(23)[33],3M3I(23)[33],3M3J(23)[33],3M3K(23)[33],
#    3M3L(23)[33],3N3G(23)[33],3N3H(23)[33],3N3I(23)[33],3N3J(23)[33],3N3K(23)[33],3N3L(23)[33],
#    3O3G(23)[33],3O3H(23)[33],3O3I(23)[33],3O3J(23)[33],3O3K(23)[33],3O3L(23)[33],3P3G(23)[33],
#    3P3H(23)[33],3P3I(23)[33],3P3J(23)[33],3P3K(23)[33],3P3L(23)[33],3Q3G(23)[33],3Q3H(23)[33],
#    3Q3I(23)[33],3Q3J(23)[33],3Q3K(23)[33],3Q3L(23)[33],3R3G(23)[33],3R3H(23)[33],3R3I(23)[33],
#    3R3J(23)[33],3R3K(23)[33],3R3L(23)[33],3S3G(23)[33],3S3H(23)[33],3S3I(23)[33],3S3J(23)[33],
#    3S3K(23)[33],3S3L(23)[33],3T3G(23)[33],3T3H(23)[33],3T3I(23)[33],3T3J(23)[33],3T3K(23)[33],
#    3T3L(23)[33],3U3G(23)[33],3U3H(23)[33],3U3I(23)[33],3U3J(23)[33],3U3K(23)[33],3U3L(23)[33],
#    B3G(23)[33],B3H(23)[33],B3I(23)[33],B3J(23)[33],B3K(23)[33],B3L(23)[33],BA3G(23)[33],BA3H(23)[33],
#    BA3I(23)[33],BA3J(23)[33],BA3K(23)[33],BA3L(23)[33],BD3G(23)[33],BD3H(23)[33],BD3I(23)[33],
#    BD3J(23)[33],BD3K(23)[33],BD3L(23)[33],BG3G(23)[33],BG3H(23)[33],BG3I(23)[33],BG3J(23)[33],
#    BG3K(23)[33],BG3L(23)[33],BH3G(23)[33],BH3H(23)[33],BH3I(23)[33],BH3J(23)[33],BH3K(23)[33],
#    BH3L(23)[33],BI3G(23)[33],BI3H(23)[33],BI3I(23)[33],BI3J(23)[33],BI3K(23)[33],BI3L(23)[33],
#    BJ3G(23)[33],BJ3H(23)[33],BJ3I(23)[33],BJ3J(23)[33],BJ3K(23)[33],BJ3L(23)[33],BL3G(23)[33],
#    BL3H(23)[33],BL3I(23)[33],BL3J(23)[33],BL3K(23)[33],BL3L(23)[33],BT3G(23)[33],BT3H(23)[33],
#    BT3I(23)[33],BT3J(23)[33],BT3K(23)[33],BT3L(23)[33],BY3G(23)[33],BY3H(23)[33],BY3I(23)[33],
#    BY3J(23)[33],BY3K(23)[33],BY3L(23)[33],BZ3G(23)[33],BZ3H(23)[33],BZ3I(23)[33],BZ3J(23)[33],
#    BZ3K(23)[33],BZ3L(23)[33],XS3G(23)[33],XS3H(23)[33],XS3I(23)[33],XS3J(23)[33],XS3K(23)[33],
#    XS3L(23)[33],
#    =7K1OUO/BY4AOH,=AA2WN/BA4DW,=BY4DX/W9HQ,=DF4ZK/BY4AA,=DF4ZK/BY4BZB,=DJ7BU/BY4BZB,=F5JSD/BY4AA,
#    =F5NVF/BY4AA,=HZ1MD/BY4AOH,=JA0AZ/BY4AEE,=JA1UQA/BY4AOH,=JE1PYH/BY4AOH,=JE2FUP/BY4AOH,
#    =JE2LPC/BY4AOH,=JH1TEB/BY4AOH,=JH3TXR/BY4AOH,=JH7DFZ/BY4AOH,=JJ1LRD/BY4AOH,=JL1KBS/BY4HAM,
#    =JP1STX/BY4HAM,=KA8PVS/BY4BBS,=KD3TB/BY4BZB,=KK7PW/BA4DW,=KT8X/BY4BNS,=KU1CW/BY4AE,=KU1CW/BY4DX,
#    =VE3LBQ/BY4AOH,=VE7AF/BY4AOH,=VE7KC/BA4DW,=VR2SS/BY4AOH,=W0NB/BY4AA,=W8NF/BY4AOH,=W8NF/BY4CYL,
#    =WX8C/BY4AA,
#    =DL2JRM/BY4RRR,=DL3OCH/BY4RRR,=F6AJA/BY4RJZ,=JA0AZ/BY4SZ,=PG5M/BA4RF,
#    =K8ZCT/BA5AN,=OK7MT/BY5HB,
#    =UA9HW/BY6IA,
#    3H6Q[43],3H6R[43],3H6S[43],3H6T[43],3H6U[43],3H6V[43],3H6W[43],3H6X[43],3I6Q[43],3I6R[43],
#    3I6S[43],3I6T[43],3I6U[43],3I6V[43],3I6W[43],3I6X[43],3J6Q[43],3J6R[43],3J6S[43],3J6T[43],
#    3J6U[43],3J6V[43],3J6W[43],3J6X[43],3K6Q[43],3K6R[43],3K6S[43],3K6T[43],3K6U[43],3K6V[43],
#    3K6W[43],3K6X[43],3L6Q[43],3L6R[43],3L6S[43],3L6T[43],3L6U[43],3L6V[43],3L6W[43],3L6X[43],
#    3M6Q[43],3M6R[43],3M6S[43],3M6T[43],3M6U[43],3M6V[43],3M6W[43],3M6X[43],3N6Q[43],3N6R[43],
#    3N6S[43],3N6T[43],3N6U[43],3N6V[43],3N6W[43],3N6X[43],3O6Q[43],3O6R[43],3O6S[43],3O6T[43],
#    3O6U[43],3O6V[43],3O6W[43],3O6X[43],3P6Q[43],3P6R[43],3P6S[43],3P6T[43],3P6U[43],3P6V[43],
#    3P6W[43],3P6X[43],3Q6Q[43],3Q6R[43],3Q6S[43],3Q6T[43],3Q6U[43],3Q6V[43],3Q6W[43],3Q6X[43],
#    3R6Q[43],3R6R[43],3R6S[43],3R6T[43],3R6U[43],3R6V[43],3R6W[43],3R6X[43],3S6Q[43],3S6R[43],
#    3S6S[43],3S6T[43],3S6U[43],3S6V[43],3S6W[43],3S6X[43],3T6Q[43],3T6R[43],3T6S[43],3T6T[43],
#    3T6U[43],3T6V[43],3T6W[43],3T6X[43],3U6Q[43],3U6R[43],3U6S[43],3U6T[43],3U6U[43],3U6V[43],
#    3U6W[43],3U6X[43],B6Q[43],B6R[43],B6S[43],B6T[43],B6U[43],B6V[43],B6W[43],B6X[43],BA6Q[43],
#    BA6R[43],BA6S[43],BA6T[43],BA6U[43],BA6V[43],BA6W[43],BA6X[43],BD6Q[43],BD6R[43],BD6S[43],
#    BD6T[43],BD6U[43],BD6V[43],BD6W[43],BD6X[43],BG6Q[43],BG6R[43],BG6S[43],BG6T[43],BG6U[43],
#    BG6V[43],BG6W[43],BG6X[43],BH6Q[43],BH6R[43],BH6S[43],BH6T[43],BH6U[43],BH6V[43],BH6W[43],
#    BH6X[43],BI6Q[43],BI6R[43],BI6S[43],BI6T[43],BI6U[43],BI6V[43],BI6W[43],BI6X[43],BJ6Q[43],
#    BJ6R[43],BJ6S[43],BJ6T[43],BJ6U[43],BJ6V[43],BJ6W[43],BJ6X[43],BL6Q[43],BL6R[43],BL6S[43],
#    BL6T[43],BL6U[43],BL6V[43],BL6W[43],BL6X[43],BT6Q[43],BT6R[43],BT6S[43],BT6T[43],BT6U[43],
#    BT6V[43],BT6W[43],BT6X[43],BY6Q[43],BY6R[43],BY6S[43],BY6T[43],BY6U[43],BY6V[43],BY6W[43],
#    BY6X[43],BZ6Q[43],BZ6R[43],BZ6S[43],BZ6T[43],BZ6U[43],BZ6V[43],BZ6W[43],BZ6X[43],XS6Q[43],
#    XS6R[43],XS6S[43],XS6T[43],XS6U[43],XS6V[43],XS6W[43],XS6X[43],
#    3H7A[43],3H7B[43],3H7C[43],3H7D[43],3H7E[43],3H7F[43],3H7G[43],3H7H[43],3I7A[43],3I7B[43],
#    3I7C[43],3I7D[43],3I7E[43],3I7F[43],3I7G[43],3I7H[43],3J7A[43],3J7B[43],3J7C[43],3J7D[43],
#    3J7E[43],3J7F[43],3J7G[43],3J7H[43],3K7A[43],3K7B[43],3K7C[43],3K7D[43],3K7E[43],3K7F[43],
#    3K7G[43],3K7H[43],3L7A[43],3L7B[43],3L7C[43],3L7D[43],3L7E[43],3L7F[43],3L7G[43],3L7H[43],
#    3M7A[43],3M7B[43],3M7C[43],3M7D[43],3M7E[43],3M7F[43],3M7G[43],3M7H[43],3N7A[43],3N7B[43],
#    3N7C[43],3N7D[43],3N7E[43],3N7F[43],3N7G[43],3N7H[43],3O7A[43],3O7B[43],3O7C[43],3O7D[43],
#    3O7E[43],3O7F[43],3O7G[43],3O7H[43],3P7A[43],3P7B[43],3P7C[43],3P7D[43],3P7E[43],3P7F[43],
#    3P7G[43],3P7H[43],3Q7A[43],3Q7B[43],3Q7C[43],3Q7D[43],3Q7E[43],3Q7F[43],3Q7G[43],3Q7H[43],
#    3R7A[43],3R7B[43],3R7C[43],3R7D[43],3R7E[43],3R7F[43],3R7G[43],3R7H[43],3S7A[43],3S7B[43],
#    3S7C[43],3S7D[43],3S7E[43],3S7F[43],3S7G[43],3S7H[43],3T7A[43],3T7B[43],3T7C[43],3T7D[43],
#    3T7E[43],3T7F[43],3T7G[43],3T7H[43],3U7A[43],3U7B[43],3U7C[43],3U7D[43],3U7E[43],3U7F[43],
#    3U7G[43],3U7H[43],B7A[43],B7B[43],B7C[43],B7D[43],B7E[43],B7F[43],B7G[43],B7H[43],BA7A[43],
#    BA7B[43],BA7C[43],BA7D[43],BA7E[43],BA7F[43],BA7G[43],BA7H[43],BD7A[43],BD7B[43],BD7C[43],
#    BD7D[43],BD7E[43],BD7F[43],BD7G[43],BD7H[43],BG7A[43],BG7B[43],BG7C[43],BG7D[43],BG7E[43],
#    BG7F[43],BG7G[43],BG7H[43],BH7A[43],BH7B[43],BH7C[43],BH7D[43],BH7E[43],BH7F[43],BH7G[43],
#    BH7H[43],BI7A[43],BI7B[43],BI7C[43],BI7D[43],BI7E[43],BI7F[43],BI7G[43],BI7H[43],BJ7A[43],
#    BJ7B[43],BJ7C[43],BJ7D[43],BJ7E[43],BJ7F[43],BJ7G[43],BJ7H[43],BL7A[43],BL7B[43],BL7C[43],
#    BL7D[43],BL7E[43],BL7F[43],BL7G[43],BL7H[43],BT7A[43],BT7B[43],BT7C[43],BT7D[43],BT7E[43],
#    BT7F[43],BT7G[43],BT7H[43],BY7A[43],BY7B[43],BY7C[43],BY7D[43],BY7E[43],BY7F[43],BY7G[43],
#    BY7H[43],BZ7A[43],BZ7B[43],BZ7C[43],BZ7D[43],BZ7E[43],BZ7F[43],BZ7G[43],BZ7H[43],XS7A[43],
#    XS7B[43],XS7C[43],XS7D[43],XS7E[43],XS7F[43],XS7G[43],XS7H[43],
#    =BD7JZC/UT3GF,=BD7LPD/UT3GF,=BG7JJW/UT3GF,=DL3NM/BY7KG,=F4BKV/BY7PP,=G0SFJ/BY7KP,=LZ2HM/BY7PP,
#    =VE7AF/BY7KH,=W1DF/BA7MY,=W1DF/BA7NO,=W6BBA/BD7PUZ,=W6BBA/BY7KTO,
#    3H7Q[43],3H7R[43],3H7S[43],3H7T[43],3H7U[43],3H7V[43],3H7W[43],3H7X[43],3I7Q[43],3I7R[43],
#    3I7S[43],3I7T[43],3I7U[43],3I7V[43],3I7W[43],3I7X[43],3J7Q[43],3J7R[43],3J7S[43],3J7T[43],
#    3J7U[43],3J7V[43],3J7W[43],3J7X[43],3K7Q[43],3K7R[43],3K7S[43],3K7T[43],3K7U[43],3K7V[43],
#    3K7W[43],3K7X[43],3L7Q[43],3L7R[43],3L7S[43],3L7T[43],3L7U[43],3L7V[43],3L7W[43],3L7X[43],
#    3M7Q[43],3M7R[43],3M7S[43],3M7T[43],3M7U[43],3M7V[43],3M7W[43],3M7X[43],3N7Q[43],3N7R[43],
#    3N7S[43],3N7T[43],3N7U[43],3N7V[43],3N7W[43],3N7X[43],3O7Q[43],3O7R[43],3O7S[43],3O7T[43],
#    3O7U[43],3O7V[43],3O7W[43],3O7X[43],3P7Q[43],3P7R[43],3P7S[43],3P7T[43],3P7U[43],3P7V[43],
#    3P7W[43],3P7X[43],3Q7Q[43],3Q7R[43],3Q7S[43],3Q7T[43],3Q7U[43],3Q7V[43],3Q7W[43],3Q7X[43],
#    3R7Q[43],3R7R[43],3R7S[43],3R7T[43],3R7U[43],3R7V[43],3R7W[43],3R7X[43],3S7Q[43],3S7R[43],
#    3S7S[43],3S7T[43],3S7U[43],3S7V[43],3S7W[43],3S7X[43],3T7Q[43],3T7R[43],3T7S[43],3T7T[43],
#    3T7U[43],3T7V[43],3T7W[43],3T7X[43],3U7Q[43],3U7R[43],3U7S[43],3U7T[43],3U7U[43],3U7V[43],
#    3U7W[43],3U7X[43],B7Q[43],B7R[43],B7S[43],B7T[43],B7U[43],B7V[43],B7W[43],B7X[43],BA7Q[43],
#    BA7R[43],BA7S[43],BA7T[43],BA7U[43],BA7V[43],BA7W[43],BA7X[43],BD7Q[43],BD7R[43],BD7S[43],
#    BD7T[43],BD7U[43],BD7V[43],BD7W[43],BD7X[43],BG7Q[43],BG7R[43],BG7S[43],BG7T[43],BG7U[43],
#    BG7V[43],BG7W[43],BG7X[43],BH7Q[43],BH7R[43],BH7S[43],BH7T[43],BH7U[43],BH7V[43],BH7W[43],
#    BH7X[43],BI7Q[43],BI7R[43],BI7S[43],BI7T[43],BI7U[43],BI7V[43],BI7W[43],BI7X[43],BJ7Q[43],
#    BJ7R[43],BJ7S[43],BJ7T[43],BJ7U[43],BJ7V[43],BJ7W[43],BJ7X[43],BL7Q[43],BL7R[43],BL7S[43],
#    BL7T[43],BL7U[43],BL7V[43],BL7W[43],BL7X[43],BT7Q[43],BT7R[43],BT7S[43],BT7T[43],BT7U[43],
#    BT7V[43],BT7W[43],BT7X[43],BY7Q[43],BY7R[43],BY7S[43],BY7T[43],BY7U[43],BY7V[43],BY7W[43],
#    BY7X[43],BZ7Q[43],BZ7R[43],BZ7S[43],BZ7T[43],BZ7U[43],BZ7V[43],BZ7W[43],BZ7X[43],XS7Q[43],
#    XS7R[43],XS7S[43],XS7T[43],XS7U[43],XS7V[43],XS7W[43],XS7X[43],=BY7STC/F4CYZ[43],
#    3H8A[43],3H8B[43],3H8C[43],3H8D[43],3H8E[43],3H8F[43],3I8A[43],3I8B[43],3I8C[43],3I8D[43],
#    3I8E[43],3I8F[43],3J8A[43],3J8B[43],3J8C[43],3J8D[43],3J8E[43],3J8F[43],3K8A[43],3K8B[43],
#    3K8C[43],3K8D[43],3K8E[43],3K8F[43],3L8A[43],3L8B[43],3L8C[43],3L8D[43],3L8E[43],3L8F[43],
#    3M8A[43],3M8B[43],3M8C[43],3M8D[43],3M8E[43],3M8F[43],3N8A[43],3N8B[43],3N8C[43],3N8D[43],
#    3N8E[43],3N8F[43],3O8A[43],3O8B[43],3O8C[43],3O8D[43],3O8E[43],3O8F[43],3P8A[43],3P8B[43],
#    3P8C[43],3P8D[43],3P8E[43],3P8F[43],3Q8A[43],3Q8B[43],3Q8C[43],3Q8D[43],3Q8E[43],3Q8F[43],
#    3R8A[43],3R8B[43],3R8C[43],3R8D[43],3R8E[43],3R8F[43],3S8A[43],3S8B[43],3S8C[43],3S8D[43],
#    3S8E[43],3S8F[43],3T8A[43],3T8B[43],3T8C[43],3T8D[43],3T8E[43],3T8F[43],3U8A[43],3U8B[43],
#    3U8C[43],3U8D[43],3U8E[43],3U8F[43],B8A[43],B8B[43],B8C[43],B8D[43],B8E[43],B8F[43],BA8A[43],
#    BA8B[43],BA8C[43],BA8D[43],BA8E[43],BA8F[43],BD8A[43],BD8B[43],BD8C[43],BD8D[43],BD8E[43],
#    BD8F[43],BG8A[43],BG8B[43],BG8C[43],BG8D[43],BG8E[43],BG8F[43],BH8A[43],BH8B[43],BH8C[43],
#    BH8D[43],BH8E[43],BH8F[43],BI8A[43],BI8B[43],BI8C[43],BI8D[43],BI8E[43],BI8F[43],BJ8A[43],
#    BJ8B[43],BJ8C[43],BJ8D[43],BJ8E[43],BJ8F[43],BL8A[43],BL8B[43],BL8C[43],BL8D[43],BL8E[43],
#    BL8F[43],BT8A[43],BT8B[43],BT8C[43],BT8D[43],BT8E[43],BT8F[43],BY8A[43],BY8B[43],BY8C[43],
#    BY8D[43],BY8E[43],BY8F[43],BZ8A[43],BZ8B[43],BZ8C[43],BZ8D[43],BZ8E[43],BZ8F[43],XS8A[43],
#    XS8B[43],XS8C[43],XS8D[43],XS8E[43],XS8F[43],=BA0AA/8[43],=ON5TN/BY8AC[43],
#    3H8G[43],3H8H[43],3H8I[43],3H8J[43],3H8K[43],3H8L[43],3I8G[43],3I8H[43],3I8I[43],3I8J[43],
#    3I8K[43],3I8L[43],3J8G[43],3J8H[43],3J8I[43],3J8J[43],3J8K[43],3J8L[43],3K8G[43],3K8H[43],
#    3K8I[43],3K8J[43],3K8K[43],3K8L[43],3L8G[43],3L8H[43],3L8I[43],3L8J[43],3L8K[43],3L8L[43],
#    3M8G[43],3M8H[43],3M8I[43],3M8J[43],3M8K[43],3M8L[43],3N8G[43],3N8H[43],3N8I[43],3N8J[43],
#    3N8K[43],3N8L[43],3O8G[43],3O8H[43],3O8I[43],3O8J[43],3O8K[43],3O8L[43],3P8G[43],3P8H[43],
#    3P8I[43],3P8J[43],3P8K[43],3P8L[43],3Q8G[43],3Q8H[43],3Q8I[43],3Q8J[43],3Q8K[43],3Q8L[43],
#    3R8G[43],3R8H[43],3R8I[43],3R8J[43],3R8K[43],3R8L[43],3S8G[43],3S8H[43],3S8I[43],3S8J[43],
#    3S8K[43],3S8L[43],3T8G[43],3T8H[43],3T8I[43],3T8J[43],3T8K[43],3T8L[43],3U8G[43],3U8H[43],
#    3U8I[43],3U8J[43],3U8K[43],3U8L[43],B8G[43],B8H[43],B8I[43],B8J[43],B8K[43],B8L[43],BA8G[43],
#    BA8H[43],BA8I[43],BA8J[43],BA8K[43],BA8L[43],BD8G[43],BD8H[43],BD8I[43],BD8J[43],BD8K[43],
#    BD8L[43],BG8G[43],BG8H[43],BG8I[43],BG8J[43],BG8K[43],BG8L[43],BH8G[43],BH8H[43],BH8I[43],
#    BH8J[43],BH8K[43],BH8L[43],BI8G[43],BI8H[43],BI8I[43],BI8J[43],BI8K[43],BI8L[43],BJ8G[43],
#    BJ8H[43],BJ8I[43],BJ8J[43],BJ8K[43],BJ8L[43],BL8G[43],BL8H[43],BL8I[43],BL8J[43],BL8K[43],
#    BL8L[43],BT8G[43],BT8H[43],BT8I[43],BT8J[43],BT8K[43],BT8L[43],BY8G[43],BY8H[43],BY8I[43],
#    BY8J[43],BY8K[43],BY8L[43],BZ8G[43],BZ8H[43],BZ8I[43],BZ8J[43],BZ8K[43],BZ8L[43],XS8G[43],
#    XS8H[43],XS8I[43],XS8J[43],XS8K[43],XS8L[43],
#    3H8M[43],3H8N[43],3H8O[43],3H8P[43],3H8Q[43],3H8R[43],3I8M[43],3I8N[43],3I8O[43],3I8P[43],
#    3I8Q[43],3I8R[43],3J8M[43],3J8N[43],3J8O[43],3J8P[43],3J8Q[43],3J8R[43],3K8M[43],3K8N[43],
#    3K8O[43],3K8P[43],3K8Q[43],3K8R[43],3L8M[43],3L8N[43],3L8O[43],3L8P[43],3L8Q[43],3L8R[43],
#    3M8M[43],3M8N[43],3M8O[43],3M8P[43],3M8Q[43],3M8R[43],3N8M[43],3N8N[43],3N8O[43],3N8P[43],
#    3N8Q[43],3N8R[43],3O8M[43],3O8N[43],3O8O[43],3O8P[43],3O8Q[43],3O8R[43],3P8M[43],3P8N[43],
#    3P8O[43],3P8P[43],3P8Q[43],3P8R[43],3Q8M[43],3Q8N[43],3Q8O[43],3Q8P[43],3Q8Q[43],3Q8R[43],
#    3R8M[43],3R8N[43],3R8O[43],3R8P[43],3R8Q[43],3R8R[43],3S8M[43],3S8N[43],3S8O[43],3S8P[43],
#    3S8Q[43],3S8R[43],3T8M[43],3T8N[43],3T8O[43],3T8P[43],3T8Q[43],3T8R[43],3U8M[43],3U8N[43],
#    3U8O[43],3U8P[43],3U8Q[43],3U8R[43],B8M[43],B8N[43],B8O[43],B8P[43],B8Q[43],B8R[43],BA8M[43],
#    BA8N[43],BA8O[43],BA8P[43],BA8Q[43],BA8R[43],BD8M[43],BD8N[43],BD8O[43],BD8P[43],BD8Q[43],
#    BD8R[43],BG8M[43],BG8N[43],BG8O[43],BG8P[43],BG8Q[43],BG8R[43],BH8M[43],BH8N[43],BH8O[43],
#    BH8P[43],BH8Q[43],BH8R[43],BI8M[43],BI8N[43],BI8O[43],BI8P[43],BI8Q[43],BI8R[43],BJ8M[43],
#    BJ8N[43],BJ8O[43],BJ8P[43],BJ8Q[43],BJ8R[43],BL8M[43],BL8N[43],BL8O[43],BL8P[43],BL8Q[43],
#    BL8R[43],BT8M[43],BT8N[43],BT8O[43],BT8P[43],BT8Q[43],BT8R[43],BY8M[43],BY8N[43],BY8O[43],
#    BY8P[43],BY8Q[43],BY8R[43],BZ8M[43],BZ8N[43],BZ8O[43],BZ8P[43],BZ8Q[43],BZ8R[43],XS8M[43],
#    XS8N[43],XS8O[43],XS8P[43],XS8Q[43],XS8R[43],=VK5GG/BA8MM[43],
#    3H8S[43],3H8T[43],3H8U[43],3H8V[43],3H8W[43],3H8X[43],3I8S[43],3I8T[43],3I8U[43],3I8V[43],
#    3I8W[43],3I8X[43],3J8S[43],3J8T[43],3J8U[43],3J8V[43],3J8W[43],3J8X[43],3K8S[43],3K8T[43],
#    3K8U[43],3K8V[43],3K8W[43],3K8X[43],3L8S[43],3L8T[43],3L8U[43],3L8V[43],3L8W[43],3L8X[43],
#    3M8S[43],3M8T[43],3M8U[43],3M8V[43],3M8W[43],3M8X[43],3N8S[43],3N8T[43],3N8U[43],3N8V[43],
#    3N8W[43],3N8X[43],3O8S[43],3O8T[43],3O8U[43],3O8V[43],3O8W[43],3O8X[43],3P8S[43],3P8T[43],
#    3P8U[43],3P8V[43],3P8W[43],3P8X[43],3Q8S[43],3Q8T[43],3Q8U[43],3Q8V[43],3Q8W[43],3Q8X[43],
#    3R8S[43],3R8T[43],3R8U[43],3R8V[43],3R8W[43],3R8X[43],3S8S[43],3S8T[43],3S8U[43],3S8V[43],
#    3S8W[43],3S8X[43],3T8S[43],3T8T[43],3T8U[43],3T8V[43],3T8W[43],3T8X[43],3U8S[43],3U8T[43],
#    3U8U[43],3U8V[43],3U8W[43],3U8X[43],B8S[43],B8T[43],B8U[43],B8V[43],B8W[43],B8X[43],BA8S[43],
#    BA8T[43],BA8U[43],BA8V[43],BA8W[43],BA8X[43],BD8S[43],BD8T[43],BD8U[43],BD8V[43],BD8W[43],
#    BD8X[43],BG8S[43],BG8T[43],BG8U[43],BG8V[43],BG8W[43],BG8X[43],BH8S[43],BH8T[43],BH8U[43],
#    BH8V[43],BH8W[43],BH8X[43],BI8S[43],BI8T[43],BI8U[43],BI8V[43],BI8W[43],BI8X[43],BJ8S[43],
#    BJ8T[43],BJ8U[43],BJ8V[43],BJ8W[43],BJ8X[43],BL8S[43],BL8T[43],BL8U[43],BL8V[43],BL8W[43],
#    BL8X[43],BT8S[43],BT8T[43],BT8U[43],BT8V[43],BT8W[43],BT8X[43],BY8S[43],BY8T[43],BY8U[43],
#    BY8V[43],BY8W[43],BY8X[43],BZ8S[43],BZ8T[43],BZ8U[43],BZ8V[43],BZ8W[43],BZ8X[43],XS8S[43],
#    XS8T[43],XS8U[43],XS8V[43],XS8W[43],XS8X[43],=DL2JRM/BY8SKM[43],=XX9AH/BG8ST[43],
#    3H9A(24)[43],3H9B(24)[43],3H9C(24)[43],3H9D(24)[43],3H9E(24)[43],3H9F(24)[43],3I9A(24)[43],
#    3I9B(24)[43],3I9C(24)[43],3I9D(24)[43],3I9E(24)[43],3I9F(24)[43],3J9A(24)[43],3J9B(24)[43],
#    3J9C(24)[43],3J9D(24)[43],3J9E(24)[43],3J9F(24)[43],3K9A(24)[43],3K9B(24)[43],3K9C(24)[43],
#    3K9D(24)[43],3K9E(24)[43],3K9F(24)[43],3L9A(24)[43],3L9B(24)[43],3L9C(24)[43],3L9D(24)[43],
#    3L9E(24)[43],3L9F(24)[43],3M9A(24)[43],3M9B(24)[43],3M9C(24)[43],3M9D(24)[43],3M9E(24)[43],
#    3M9F(24)[43],3N9A(24)[43],3N9B(24)[43],3N9C(24)[43],3N9D(24)[43],3N9E(24)[43],3N9F(24)[43],
#    3O9A(24)[43],3O9B(24)[43],3O9C(24)[43],3O9D(24)[43],3O9E(24)[43],3O9F(24)[43],3P9A(24)[43],
#    3P9B(24)[43],3P9C(24)[43],3P9D(24)[43],3P9E(24)[43],3P9F(24)[43],3Q9A(24)[43],3Q9B(24)[43],
#    3Q9C(24)[43],3Q9D(24)[43],3Q9E(24)[43],3Q9F(24)[43],3R9A(24)[43],3R9B(24)[43],3R9C(24)[43],
#    3R9D(24)[43],3R9E(24)[43],3R9F(24)[43],3S9A(24)[43],3S9B(24)[43],3S9C(24)[43],3S9D(24)[43],
#    3S9E(24)[43],3S9F(24)[43],3T9A(24)[43],3T9B(24)[43],3T9C(24)[43],3T9D(24)[43],3T9E(24)[43],
#    3T9F(24)[43],3U9A(24)[43],3U9B(24)[43],3U9C(24)[43],3U9D(24)[43],3U9E(24)[43],3U9F(24)[43],
#    B9A(24)[43],B9B(24)[43],B9C(24)[43],B9D(24)[43],B9E(24)[43],B9F(24)[43],BA9A(24)[43],BA9B(24)[43],
#    BA9C(24)[43],BA9D(24)[43],BA9E(24)[43],BA9F(24)[43],BD9A(24)[43],BD9B(24)[43],BD9C(24)[43],
#    BD9D(24)[43],BD9E(24)[43],BD9F(24)[43],BG9A(24)[43],BG9B(24)[43],BG9C(24)[43],BG9D(24)[43],
#    BG9E(24)[43],BG9F(24)[43],BH9A(24)[43],BH9B(24)[43],BH9C(24)[43],BH9D(24)[43],BH9E(24)[43],
#    BH9F(24)[43],BI9A(24)[43],BI9B(24)[43],BI9C(24)[43],BI9D(24)[43],BI9E(24)[43],BI9F(24)[43],
#    BJ9A(24)[43],BJ9B(24)[43],BJ9C(24)[43],BJ9D(24)[43],BJ9E(24)[43],BJ9F(24)[43],BL9A(24)[43],
#    BL9B(24)[43],BL9C(24)[43],BL9D(24)[43],BL9E(24)[43],BL9F(24)[43],BT9A(24)[43],BT9B(24)[43],
#    BT9C(24)[43],BT9D(24)[43],BT9E(24)[43],BT9F(24)[43],BY9A(24)[43],BY9B(24)[43],BY9C(24)[43],
#    BY9D(24)[43],BY9E(24)[43],BY9F(24)[43],BZ9A(24)[43],BZ9B(24)[43],BZ9C(24)[43],BZ9D(24)[43],
#    BZ9E(24)[43],BZ9F(24)[43],XS9A(24)[43],XS9B(24)[43],XS9C(24)[43],XS9D(24)[43],XS9E(24)[43],
#    XS9F(24)[43],=B9/BH1NGG(24)[43],=BG0GE/9(24)[43],
#    3H9G(23)[43],3H9H(23)[43],3H9I(23)[43],3H9J(23)[43],3H9K(23)[43],3H9L(23)[43],3I9G(23)[43],
#    3I9H(23)[43],3I9I(23)[43],3I9J(23)[43],3I9K(23)[43],3I9L(23)[43],3J9G(23)[43],3J9H(23)[43],
#    3J9I(23)[43],3J9J(23)[43],3J9K(23)[43],3J9L(23)[43],3K9G(23)[43],3K9H(23)[43],3K9I(23)[43],
#    3K9J(23)[43],3K9K(23)[43],3K9L(23)[43],3L9G(23)[43],3L9H(23)[43],3L9I(23)[43],3L9J(23)[43],
#    3L9K(23)[43],3L9L(23)[43],3M9G(23)[43],3M9H(23)[43],3M9I(23)[43],3M9J(23)[43],3M9K(23)[43],
#    3M9L(23)[43],3N9G(23)[43],3N9H(23)[43],3N9I(23)[43],3N9J(23)[43],3N9K(23)[43],3N9L(23)[43],
#    3O9G(23)[43],3O9H(23)[43],3O9I(23)[43],3O9J(23)[43],3O9K(23)[43],3O9L(23)[43],3P9G(23)[43],
#    3P9H(23)[43],3P9I(23)[43],3P9J(23)[43],3P9K(23)[43],3P9L(23)[43],3Q9G(23)[43],3Q9H(23)[43],
#    3Q9I(23)[43],3Q9J(23)[43],3Q9K(23)[43],3Q9L(23)[43],3R9G(23)[43],3R9H(23)[43],3R9I(23)[43],
#    3R9J(23)[43],3R9K(23)[43],3R9L(23)[43],3S9G(23)[43],3S9H(23)[43],3S9I(23)[43],3S9J(23)[43],
#    3S9K(23)[43],3S9L(23)[43],3T9G(23)[43],3T9H(23)[43],3T9I(23)[43],3T9J(23)[43],3T9K(23)[43],
#    3T9L(23)[43],3U9G(23)[43],3U9H(23)[43],3U9I(23)[43],3U9J(23)[43],3U9K(23)[43],3U9L(23)[43],
#    B9G(23)[43],B9H(23)[43],B9I(23)[43],B9J(23)[43],B9K(23)[43],B9L(23)[43],BA9G(23)[43],BA9H(23)[43],
#    BA9I(23)[43],BA9J(23)[43],BA9K(23)[43],BA9L(23)[43],BD9G(23)[43],BD9H(23)[43],BD9I(23)[43],
#    BD9J(23)[43],BD9K(23)[43],BD9L(23)[43],BG9G(23)[43],BG9H(23)[43],BG9I(23)[43],BG9J(23)[43],
#    BG9K(23)[43],BG9L(23)[43],BH9G(23)[43],BH9H(23)[43],BH9I(23)[43],BH9J(23)[43],BH9K(23)[43],
#    BH9L(23)[43],BI9G(23)[43],BI9H(23)[43],BI9I(23)[43],BI9J(23)[43],BI9K(23)[43],BI9L(23)[43],
#    BJ9G(23)[43],BJ9H(23)[43],BJ9I(23)[43],BJ9J(23)[43],BJ9K(23)[43],BJ9L(23)[43],BL9G(23)[43],
#    BL9H(23)[43],BL9I(23)[43],BL9J(23)[43],BL9K(23)[43],BL9L(23)[43],BT9G(23)[43],BT9H(23)[43],
#    BT9I(23)[43],BT9J(23)[43],BT9K(23)[43],BT9L(23)[43],BY9G(23)[43],BY9H(23)[43],BY9I(23)[43],
#    BY9J(23)[43],BY9K(23)[43],BY9L(23)[43],BZ9G(23)[43],BZ9H(23)[43],BZ9I(23)[43],BZ9J(23)[43],
#    BZ9K(23)[43],BZ9L(23)[43],XS9G(23)[43],XS9H(23)[43],XS9I(23)[43],XS9J(23)[43],XS9K(23)[43],
#    XS9L(23)[43],
#    3H9M(23)[43],3H9N(23)[43],3H9O(23)[43],3H9P(23)[43],3H9Q(23)[43],3H9R(23)[43],3I9M(23)[43],
#    3I9N(23)[43],3I9O(23)[43],3I9P(23)[43],3I9Q(23)[43],3I9R(23)[43],3J9M(23)[43],3J9N(23)[43],
#    3J9O(23)[43],3J9P(23)[43],3J9Q(23)[43],3J9R(23)[43],3K9M(23)[43],3K9N(23)[43],3K9O(23)[43],
#    3K9P(23)[43],3K9Q(23)[43],3K9R(23)[43],3L9M(23)[43],3L9N(23)[43],3L9O(23)[43],3L9P(23)[43],
#    3L9Q(23)[43],3L9R(23)[43],3M9M(23)[43],3M9N(23)[43],3M9O(23)[43],3M9P(23)[43],3M9Q(23)[43],
#    3M9R(23)[43],3N9M(23)[43],3N9N(23)[43],3N9O(23)[43],3N9P(23)[43],3N9Q(23)[43],3N9R(23)[43],
#    3O9M(23)[43],3O9N(23)[43],3O9O(23)[43],3O9P(23)[43],3O9Q(23)[43],3O9R(23)[43],3P9M(23)[43],
#    3P9N(23)[43],3P9O(23)[43],3P9P(23)[43],3P9Q(23)[43],3P9R(23)[43],3Q9M(23)[43],3Q9N(23)[43],
#    3Q9O(23)[43],3Q9P(23)[43],3Q9Q(23)[43],3Q9R(23)[43],3R9M(23)[43],3R9N(23)[43],3R9O(23)[43],
#    3R9P(23)[43],3R9Q(23)[43],3R9R(23)[43],3S9M(23)[43],3S9N(23)[43],3S9O(23)[43],3S9P(23)[43],
#    3S9Q(23)[43],3S9R(23)[43],3T9M(23)[43],3T9N(23)[43],3T9O(23)[43],3T9P(23)[43],3T9Q(23)[43],
#    3T9R(23)[43],3U9M(23)[43],3U9N(23)[43],3U9O(23)[43],3U9P(23)[43],3U9Q(23)[43],3U9R(23)[43],
#    B9M(23)[43],B9N(23)[43],B9O(23)[43],B9P(23)[43],B9Q(23)[43],B9R(23)[43],BA9M(23)[43],BA9N(23)[43],
#    BA9O(23)[43],BA9P(23)[43],BA9Q(23)[43],BA9R(23)[43],BD9M(23)[43],BD9N(23)[43],BD9O(23)[43],
#    BD9P(23)[43],BD9Q(23)[43],BD9R(23)[43],BG9M(23)[43],BG9N(23)[43],BG9O(23)[43],BG9P(23)[43],
#    BG9Q(23)[43],BG9R(23)[43],BH9M(23)[43],BH9N(23)[43],BH9O(23)[43],BH9P(23)[43],BH9Q(23)[43],
#    BH9R(23)[43],BI9M(23)[43],BI9N(23)[43],BI9O(23)[43],BI9P(23)[43],BI9Q(23)[43],BI9R(23)[43],
#    BJ9M(23)[43],BJ9N(23)[43],BJ9O(23)[43],BJ9P(23)[43],BJ9Q(23)[43],BJ9R(23)[43],BL9M(23)[43],
#    BL9N(23)[43],BL9O(23)[43],BL9P(23)[43],BL9Q(23)[43],BL9R(23)[43],BT9M(23)[43],BT9N(23)[43],
#    BT9O(23)[43],BT9P(23)[43],BT9Q(23)[43],BT9R(23)[43],BY9M(23)[43],BY9N(23)[43],BY9O(23)[43],
#    BY9P(23)[43],BY9Q(23)[43],BY9R(23)[43],BZ9M(23)[43],BZ9N(23)[43],BZ9O(23)[43],BZ9P(23)[43],
#    BZ9Q(23)[43],BZ9R(23)[43],XS9M(23)[43],XS9N(23)[43],XS9O(23)[43],XS9P(23)[43],XS9Q(23)[43],
#    XS9R(23)[43],=BD4HF/9(23)[43],=BD5HSV/9(23)[43],
#    3H9S(23)[42],3H9T(23)[42],3H9U(23)[42],3H9V(23)[42],3H9W(23)[42],3H9X(23)[42],3I9S(23)[42],
#    3I9T(23)[42],3I9U(23)[42],3I9V(23)[42],3I9W(23)[42],3I9X(23)[42],3J9S(23)[42],3J9T(23)[42],
#    3J9U(23)[42],3J9V(23)[42],3J9W(23)[42],3J9X(23)[42],3K9S(23)[42],3K9T(23)[42],3K9U(23)[42],
#    3K9V(23)[42],3K9W(23)[42],3K9X(23)[42],3L9S(23)[42],3L9T(23)[42],3L9U(23)[42],3L9V(23)[42],
#    3L9W(23)[42],3L9X(23)[42],3M9S(23)[42],3M9T(23)[42],3M9U(23)[42],3M9V(23)[42],3M9W(23)[42],
#    3M9X(23)[42],3N9S(23)[42],3N9T(23)[42],3N9U(23)[42],3N9V(23)[42],3N9W(23)[42],3N9X(23)[42],
#    3O9S(23)[42],3O9T(23)[42],3O9U(23)[42],3O9V(23)[42],3O9W(23)[42],3O9X(23)[42],3P9S(23)[42],
#    3P9T(23)[42],3P9U(23)[42],3P9V(23)[42],3P9W(23)[42],3P9X(23)[42],3Q9S(23)[42],3Q9T(23)[42],
#    3Q9U(23)[42],3Q9V(23)[42],3Q9W(23)[42],3Q9X(23)[42],3R9S(23)[42],3R9T(23)[42],3R9U(23)[42],
#    3R9V(23)[42],3R9W(23)[42],3R9X(23)[42],3S9S(23)[42],3S9T(23)[42],3S9U(23)[42],3S9V(23)[42],
#    3S9W(23)[42],3S9X(23)[42],3T9S(23)[42],3T9T(23)[42],3T9U(23)[42],3T9V(23)[42],3T9W(23)[42],
#    3T9X(23)[42],3U9S(23)[42],3U9T(23)[42],3U9U(23)[42],3U9V(23)[42],3U9W(23)[42],3U9X(23)[42],
#    B9S(23)[42],B9T(23)[42],B9U(23)[42],B9V(23)[42],B9W(23)[42],B9X(23)[42],BA9S(23)[42],BA9T(23)[42],
#    BA9U(23)[42],BA9V(23)[42],BA9W(23)[42],BA9X(23)[42],BD9S(23)[42],BD9T(23)[42],BD9U(23)[42],
#    BD9V(23)[42],BD9W(23)[42],BD9X(23)[42],BG9S(23)[42],BG9T(23)[42],BG9U(23)[42],BG9V(23)[42],
#    BG9W(23)[42],BG9X(23)[42],BH9S(23)[42],BH9T(23)[42],BH9U(23)[42],BH9V(23)[42],BH9W(23)[42],
#    BH9X(23)[42],BI9S(23)[42],BI9T(23)[42],BI9U(23)[42],BI9V(23)[42],BI9W(23)[42],BI9X(23)[42],
#    BJ9S(23)[42],BJ9T(23)[42],BJ9U(23)[42],BJ9V(23)[42],BJ9W(23)[42],BJ9X(23)[42],BL9S(23)[42],
#    BL9T(23)[42],BL9U(23)[42],BL9V(23)[42],BL9W(23)[42],BL9X(23)[42],BT9S(23)[42],BT9T(23)[42],
#    BT9U(23)[42],BT9V(23)[42],BT9W(23)[42],BT9X(23)[42],BY9S(23)[42],BY9T(23)[42],BY9U(23)[42],
#    BY9V(23)[42],BY9W(23)[42],BY9X(23)[42],BZ9S(23)[42],BZ9T(23)[42],BZ9U(23)[42],BZ9V(23)[42],
#    BZ9W(23)[42],BZ9X(23)[42],XS9S(23)[42],XS9T(23)[42],XS9U(23)[42],XS9V(23)[42],XS9W(23)[42],
#    XS9X(23)[42],=BA7JS/9(23)[42],=BD5QDM/9(23)[42];
#Nauru:                    31:  65:  OC:   -0.52:  -166.92:   -12.0:  C2:
#    C2;
#Andorra:                  14:  27:  EU:   42.58:    -1.62:    -1.0:  C3:
#    C3;
#The Gambia:               35:  46:  AF:   13.40:    16.38:     0.0:  C5:
#    C5,=C56W/BI;
#Bahamas:                  08:  11:  NA:   24.25:    76.00:     5.0:  C6:
#    C6,=WK2G/C6A/LH;
#Mozambique:               37:  53:  AF:  -18.25:   -35.00:    -2.0:  C9:
#    C8,C9,=C98DC/YL;
#Chile:                    12:  14:  SA:  -30.00:    71.00:     4.0:  CE:
#    3G,CA,CB,CC,CD,CE,XQ,XR,=CE9/PA3EXX,=CE9/PA3EXX/P,=CE9/VE3LYC,=CE9/VE3LYC/P,=XR90IARU,
#    =CE6PGO[16],=CE6RFP[16],=XQ6CFX[16],=XQ6OA[16],=XQ6UMR[16],=XR6F[16],
#    3G7[16],CA7[16],CB7[16],CC7[16],CD7[16],CE7[16],XQ7[16],XR7[16],=XR7FTC/LH[16],
#    3G8[16],CA8[16],CB8[16],CC8[16],CD8[16],CE8[16],XQ8[16],XR8[16],=CE9/UA4WHX[16],=XR9A/8[16];
#San Felix & San Ambrosio: 12:  14:  SA:  -26.28:    80.07:     4.0:  CE0X:
#    3G0X,CA0X,CB0X,CC0X,CD0X,CE0X,XQ0X,XR0X,=XR0ZY;
#Easter Island:            12:  63:  SA:  -27.10:   109.37:     6.0:  CE0Y:
#    3G0,CA0,CB0,CC0,CD0,CE0,XQ0,XR0;
#Juan Fernandez Islands:   12:  14:  SA:  -33.60:    78.85:     4.0:  CE0Z:
#    3G0Z,CA0Z,CB0Z,CC0Z,CD0Z,CE0I,CE0Z,XQ0Z,XR0Z;
#Antarctica:               13:  74:  SA:  -90.00:     0.00:     0.0:  CE9:
#    =KC4/W3ASA,=KC4/W3WKO,=KC4/W3WKP,=VP8DFK,=W3ASA/KC4,=W3WKO/KC4,=W3WKP/KC4,
#    AY1Z[73],AY2Z[73],AY3Z[73],AY4Z[73],AY5Z[73],AY6Z[73],AY7Z[73],AY8Z[73],AY9Z[73],LU1Z[73],
#    LU2Z[73],LU3Z[73],LU4Z[73],LU5Z[73],LU6Z[73],LU7Z[73],LU8Z[73],LU9Z[73],
#    =LU6ECW/Z[73],
#    =LU/FT5YK[73],=LU/G0HFX/Z[73],
#    =LU8DBS/Z[73],
#    =VI0ANZAC(29)[70],=VK0BFG(29)[70],
#    AX0(39)[69],VI0(39)[69],VK0(39)[69],
#    =OP0LE(38)[67],
#    =CE9VPM[73],
#    =OR3AX(30)[71],=OR4AX(30)[71],
#    FT0Y(30)[70],FT1Y(30)[70],FT2Y(30)[70],FT3Y(30)[70],FT4Y(30)[70],FT5Y(30)[70],FT6Y(30)[70],
#    FT7Y(30)[70],FT8Y(30)[70],
#    =VP8DLM[73],
#    =VP8AL[73],
#    =FT5YK/KC4[73],=KC4/FT5YK[73],
#    =VP8/UT1KY[73],=VP8CTR[73],
#    =VP8DJB/P[73],
#    =VP8/G0VZM/P[73],=VP8/MM0TJR/P[73],=VP8BF[73],=VP8DJB[73],=VP8DOU[73],=VP8DPE[73],=VP8ROT[73],
#    =VP8ADE[73],=VP8ADE/B[73],=VP8DLJ[73],=VP8DPJ[73],
#    =VP8CPG[73],
#    =AT10BP(38)[67],=R1AND/A(38)[67],=VU/R1AND(38)[67],=VU2JBK/AT10(38)[67],
#    =I0HCJ/KC4(30)[71],=I0QHM/IA0PS(30)[71],=I0QHM/KC4(30)[71],=IA0/IZ1KHY(30)[71],=IA0MZ(30)[71],
#    =IA0PS(30)[71],=II0AMZS(30)[71],=II0MZ(30)[71],=IK7JGQ/KC4(30)[71],=IR0PS(30)[71],
#    =KC4/I0HCJ(30)[71],=KC4/I0QHM(30)[71],=KC4/IK7JGQ(30)[71],
#    =8J1RL(39)[67],=8J60JARE(39)[67],=JG2MLI/ANT(39)[67],=JH1TOF/ANT(39)[67],
#    =8J1RF(39)[67],=8J1RF/M(39)[67],
#    3Y[73],
#    =7S8AAA(38)[67],
#    ZL5(30)[71],ZM5(30)[71],
#    =R1ANJ(39)[69],
#    =R1ANL(30)[70],
#    RI1AN(29)[69],=R1ANB(29)[69],=R1ANT(29)[69],=R7C/ANT(29)[69],
#    =R1ANA(39)[69],=RI1ANA(39)[69],
#    =KC4/N2TA(38)[67],=R1/AT10BP(38)[67],=R1AND(38)[67],=R1AND/AT10BP(38)[67],=R1ANN(38)[67],
#    =RI1AND(38)[67],=RI1ANL(38)[67],=RI1ANW(38)[67],
#    =R1ANP(39)[69],=RI1ANC/A(39)[69],=RI1ANN(39)[69],=RI1ANP(39)[69],=RI1ANZ(39)[69],=RI63ANT(39)[69],
#    =VU3BPZ/RI1(39)[69],
#    =R1ANH(32)[72],
#    =RI1ANC(29)[70],=RI1ANC/P(29)[70],=RI1ANM(29)[70],=RI1ANV(29)[70],
#    =SM/OH2FFP(38)[67],
#    =EM1HO[73],=EM1KCC[73],=EM1KGG[73],=EM1KY[73],=EM1U[73],=EM1U/P[73],=EM1UA[73],=EM1UC[73],
#    =KC4/VE0HSS(32),=VE0HSS/KC4(32),
#    =KC4USB(12),
#    =KC4/R3CA(30),=KC4/R7C(30),=KC4AAA(39),=KC4AAA/NH6ON(30),=R1ANM(30),=R3CA/KC4(30),=R7C/KC4(30),
#    =AB0KG/KC4(30)[71],=KC4/AB0KG(30)[71],=KC4/KC5AEX(30)[71],=KC4/KE6ZYK(30)[71],=KC4/KK6KO(30)[71],
#    =KC4/N0NHP(30)[71],=KC4/N3SIG(30)[71],=KC4/NK3T(30)[71],=KC4/RW1AI(30)[71],=KC4/UA1PAC(30)[71],
#    =KC4/W1MRQ(30)[71],=KC4/W4OEP(30)[71],=KC4/WA1O(30)[71],=KC4USA(30)[71],=KC4USC(30)[71],
#    =KC4USM(30)[71],=KC4USV(30)[71],=KC5AEX/KC4(30)[71],=KE6ZYK/KC4(30)[71],=KK6KO/KC4(30)[71],
#    =N0NHP/KC4(30)[71],=N3SIG/KC4(30)[71],=NK3T/KC4(30)[71],=W1MRQ/KC4(30)[71],=W4OEP/KC4(30)[71],
#    =WA1O/KC4(30)[71],
#    =KC4/KD4VMM[73],=KD4VMM/KC4[73],
#    ZS7(38)[67],=ZS6KX/7(38)[67],
#    =KC4/KL7RL(12)[72],=KL7RL/KC4(12)[72],
#    =9V0A(12),=CE9/R3CA(12),=CE9/R3RRC(12),=CE9/R7C(12),=KC4/K2ARB(12),=OP0OL(12),=R3RRC/ANT(12),
#    =VP8DKF(12),=VP8PJ(12),
#    =IA/IZ2QEJ(29)[70],=IA/IZ3SUS(29)[70],=IA0/IZ1KHY/P(29)[70],=KC4/IK0AIH/P(29)[70],
#    =3Y8XSA(38)[67],=R1ANR/A(38)[67],
#    =OJ1ABOA(38)[67],
#    =HL1TJF/KC4(12),=HL1TR/KC4(12),=KC4/HL1TJF(12),=KC4/HL1TR(12),
#    =KC4/WB9YSD(12)[72],=WB9YSD/KC4(12)[72],
#    =R1ANP/A(39)[69],
#    =LU/FT5YJ[73],
#    =OR4TN(38)[67],
#    =CE9/K2ARB(12),
#    =DH1HB/P(38)[67],=DP0/OJ1ABOA(38)[67],=DP0GVN(38)[67],=DP1POL(38)[67],
#    =FT5YJ/P[73],
#    =R1ANR(38)[67],=RI1ANR(38)[67],
#    =OH2FFP/P(38)[67],
#    =KC4AAC[73],
#    =KC4/WA2DKJ(30),=WA2DKJ/KC4(30),
#    =8T2BH(39)[69],=VU3BPZ/P(39)[69],=VU3LBP(39)[69],=VU3LBP/P(39)[69],
#    =CE9/SQ1SGB[73],=VP8DMH[73],=VP8DMH/P[73],=VP8DOI[73],=VP8HAL[73],
#    =D8A(30)[71],
#    =DP1POL/P(38)[67],
#    =KC4/K6REF(32)[71],
#    =DP0GVN/P(38)[67],
#    =FT5YK/P[73],
#    =RI1ANX(38)[67];
#Cuba:                     08:  11:  NA:   21.50:    80.00:     5.0:  CM:
#    CL,CM,CO,T4,
#    =T40C/LT,
#    =CO2FRC/LH;
#Morocco:                  33:  37:  AF:   32.00:     5.00:     0.0:  CN:
#    5C,5D,5E,5F,5G,CN;
#Bolivia:                  10:  12:  SA:  -17.00:    65.00:     4.0:  CP:
#    CP,
#    CP2[14],
#    CP3[14],
#    CP4[14],
#    CP5[14],
#    CP6[14],
#    CP7[14];
#Portugal:                 14:  37:  EU:   39.50:     8.00:     0.0:  CT:
#    CQ,CR,CS,CT,=CR5FB/LH,=CR6L/LT,=CR6YLH/LT,=CS2HNI/LH,=CS5ARAM/LH,=CS5E/LH,=CT/DJ5AA/LH,=CT1BWW/LH,
#    =CT1GFK/LH,=CT1GPQ/LGT,=CT7/ON4LO/LH,=CT7/ON7RU/LH;
#Madeira Islands:          33:  36:  AF:   32.75:    16.95:     0.0:  CT3:
#    CQ2,CQ3,CQ9,CR3,CR9,CS3,CS9,CT3,CT9,=CT9500AEP/J;
#Azores:                   14:  36:  EU:   38.70:    27.23:     1.0:  CU:
#    CQ1,CQ8,CR1,CR2,CR8,CS4,CS8,CT8,CU,=CU2JU/ND,
#    =CQ8ARN/LH,
#    =CU5/CU3EJ/LH,
#    =CT8/DK6EA/LH;
#Uruguay:                  13:  14:  SA:  -33.00:    56.00:     3.0:  CX:
#    CV,CW,CX,=CW5X/LH,
#    =CV1AA/LH,
#    =CX1CAK/D,=CX1SI/D,
#    =CX7OV/H,
#    =CV9T/LH,=CX1TA/LH,=CX1TCR/LH,
#    =CX5TR/U,
#    =CX6DRA/V;
#Sable Island:             05:  09:  NA:   43.93:    59.90:     4.0:  CY0:
#    CY0;
#St. Paul Island:          05:  09:  NA:   47.00:    60.00:     4.0:  CY9:
#    CY9;
#Angola:                   36:  52:  AF:  -12.50:   -18.50:    -1.0:  D2:
#    D2,D3;
#Cape Verde:               35:  46:  AF:   16.00:    24.00:     1.0:  D4:
#    D4;
#Comoros:                  39:  53:  AF:  -11.63:   -43.30:    -3.0:  D6:
#    D6;
#Fed. Rep. of Germany:     14:  28:  EU:   51.00:   -10.00:    -1.0:  DL:
#    DA,DB,DC,DD,DE,DF,DG,DH,DI,DJ,DK,DL,DM,DN,DO,DP,DQ,DR,Y2,Y3,Y4,Y5,Y6,Y7,Y8,Y9,=DA0BHV/LGT,
#    =DA0BHV/LH,=DA0BLH/LGT,=DA0DAG/LH,=DA0FO/LH,=DA0LCC/LH,=DA0LGV/LH,=DA0LHT/LH,=DA0OIE/LGT,
#    =DA0QS/LGT,=DA0QS/LH,=DA0WLH/LH,=DB2BJT/LH,=DC1HPS/LH,=DD3D/LH,=DF0AWG/LH,=DF0BU/LH,=DF0CHE/LH,
#    =DF0ELM/LH,=DF0HC/LH,=DF0IF/LGT,=DF0IF/LH,=DF0LR/LH,=DF0MF/LGT,=DF0MF/LH,=DF0MF/LS,=DF0SX/LH,
#    =DF0VK/LH,=DF0WAT/LH,=DF0WFB/LH,=DF0WH/LGT,=DF0WLG/LH,=DF1AG/LH,=DF1HF/LH,=DF2BR/LH,=DF3LY/L,
#    =DF5A/LH,=DF5FO/LH,=DF8AN/LGT,=DF8AN/LH,=DF8AN/P/LH,=DF9HG/LH,=DG0GF/LH,=DG3XA/LH,=DH0IPA/LH,
#    =DH1DH/LH,=DH1DH/M/LH,=DH6RS/LH,=DH7RK/LH,=DH9JK/LH,=DH9UW/YL,=DJ0PJ/LH,=DJ2OC/LH,=DJ3XG/LH,
#    =DJ5AA/LH,=DJ7AO/LH,=DJ7MH/LH,=DJ8RH/LH,=DJ9QE/LH,=DK0DAN/LH,=DK0FC/LGT,=DK0FC/LH,=DK0IZ/LH,
#    =DK0KTL/LH,=DK0LWL/LH,=DK0OC/LH,=DK0PRE/LH,=DK0RA/LH,=DK0RBY/LH,=DK0RU/LH,=DK0RZ/LH,=DK3DUA/LH,
#    =DK3R/LH,=DK4DS/LH,=DK4MT/LT,=DK5AN/P/LH,=DK5T/LH,=DK5T/LS,=DL/HB9DQJ/LH,=DL0AWG/LH,=DL0BLA/LH,
#    =DL0BPS/LH,=DL0BUX/LGT,=DL0BUX/LH,=DL0CA/LH,=DL0CUX/LGT,=DL0CUX/LV,=DL0DAB/LH,=DL0EJ/LH,=DL0EL/LH,
#    =DL0EM/LGT,=DL0EM/LH,=DL0EO/LGT,=DL0EO/LH,=DL0FFF/LGT,=DL0FFF/LH,=DL0FFF/LS,=DL0FHD/LH,=DL0FL/FF,
#    =DL0HDF/LH,=DL0HGW/LGT,=DL0HGW/LH,=DL0HST/LH,=DL0II/LH,=DL0IOO/LH,=DL0IPA/LH,=DL0LGT/LH,
#    =DL0LNW/LH,=DL0MCM/LH,=DL0MFH/LGT,=DL0MFH/LH,=DL0MFK/LGT,=DL0MFK/LH,=DL0MFN/LH,=DL0MHR/LH,
#    =DL0NH/LH,=DL0OF/LH,=DL0PAS/LH,=DL0PBS/LH,=DL0PJ/LH,=DL0RSH/LH,=DL0RUG/LGT,=DL0RUG/LH,=DL0RWE/LH,
#    =DL0SH/LH,=DL0SY/LH,=DL0TO/LH,=DL0UEM/LH,=DL0VV/LH,=DL0YLM/LH,=DL1BSN/LH,=DL1DUT/LH,=DL1ELU/LH,
#    =DL1HZM/YL,=DL1SKK/LH,=DL2FCA/YL,=DL2RPS/LH,=DL3ANK/LH,=DL3JJ/LH,=DL3KWR/YL,=DL3KZA/LH,=DL3RNZ/LH,
#    =DL4ABB/LH,=DL5CX/LH,=DL5KUA/LH,=DL5SE/LH,=DL65DARC/LH,=DL6ABN/LH,=DL6AP/LH,=DL6KWN/LH,=DL7ANC/LH,
#    =DL7BMG/LH,=DL7MFK/LH,=DL7UVO/LH,=DL7VDX/LH,=DL8HK/YL,=DL8MTG/LH,=DL8TG/LH,=DL8TG/LV,=DL8UAA/FF,
#    =DL9CU/LH,=DL9NEI/ND2N,=DL9OE/LH,=DL9SEP/P/LH,=DM2C/LH,=DM3B/LH,=DM3G/LH,=DM3KF/LH,=DM5C/LH,
#    =DM5JBN/LH,=DN0AWG/LH,=DN4MB/LH,=DN8RLS/YL,=DO1EEW/YL,=DO1OMA/LH,=DO5MCL/LH,=DO5MCL/YL,=DO6KDS/LH,
#    =DO6UVM/LH,=DO7DC/LH,=DO7RKL/LH,=DQ4M/LH,=DQ4M/LT,=DR100MF/LS,=DR3M/LH,=DR4W/FF,=DR4X/LH,=DR9Z/LH;
#Philippines:              27:  50:  OC:   13.00:  -122.00:    -8.0:  DU:
#    4D,4E,4F,4G,4H,4I,DU,DV,DW,DX,DY,DZ;
#Eritrea:                  37:  48:  AF:   15.00:   -39.00:    -3.0:  E3:
#    E3;
#Palestine:                20:  39:  AS:   31.28:   -34.27:    -2.0:  E4:
#    E4;
#North Cook Islands:       32:  62:  OC:  -10.02:   161.08:    10.0:  E5/n:
#    =E51LYC,=E51QMA,=E51TUG,
#    =E51AMF,=E51M,=E51MAN,=E51MBX,=E51MKW,=E51MQT,=E51PT,=E51QQQ,=E51UFF,=E51WWB,=ZK1HCC,=ZK1MA,
#    =ZK1NCF,=ZK1NCI,=ZK1TTG,
#    =E50W[63],=E51PDX[63],=E51PEN[63],=E51WL[63],=ZK1/AC4LN/N[63],=ZK1KDN[63],=ZK1NCP[63],=ZK1NDK[63],
#    =ZK1NJC[63],=ZK1QMA[63],=ZK1TUG[63],=ZK1WL[63];
#South Cook Islands:       32:  63:  OC:  -21.90:   157.93:    10.0:  E5/s:
#    E5,=ZK1/AC4LN,=ZK1AKF,=ZK1AKX,=ZK1APM,=ZK1ASQ,=ZK1AXU,=ZK1BS,=ZK1CG,=ZK1EAA,=ZK1ETW,=ZK1JD/J,
#    =ZK1KH,=ZK1NDS,=ZK1NFK,=ZK1SDE,=ZK1SSB,=ZK1USA,=ZK1VVV,=ZK1XXC;
#Niue:                     32:  62:  OC:  -19.03:   169.85:    11.0:  E6:
#    E6;
#Bosnia-Herzegovina:       15:  28:  EU:   44.32:   -17.57:    -1.0:  E7:
#    E7,=YU4WU;
#Spain:                    14:  37:  EU:   40.37:     4.88:    -1.0:  EA:
#    AM,AN,AO,EA,EB,EC,ED,EE,EF,EG,EH,=AN92EXPO,=EF6,=EG90IARU,
#    =AM1TDH/LH,=EA1APV/LH,=EA1BEY/Y,=EA1EEY/L,=EA1EEY/LGT,=EA1EEY/LH,=EA1EK/ZAP,=EA1FGS/LH,=EA1HLW/YL,
#    =EA1RCG/CPV,=EA1RCG/SEU,=EA1RCG/YOA,=EA1RCI/CA,=EA1RCI/CR,=EA1RCI/CVG,=EA1RCI/ESM,=EA1RCI/IA,
#    =EA1RCI/ICA,=EA1RCI/JBN,=EA1RCI/KD,=EA1RCI/PAZ,=EA1RCI/PCV,=EA1RCI/RSM,=EA1RCI/YOA,=EA1URL/CVL,
#    =EA1URO/D,=EA1URO/KD,=EA5AER/P,=EA6QB/1,=EA8BFH/1,=EA8CZT/1,=EA8FC/1,=EA8RV/P,=EA9CD/1,=EA9CI/1,
#    =EA9CP/1,=EA9PD/1,=EB1DH/LH,=ED1IRM/LH,=EG1ILW/LH,=EG1LWB/LH,=EG1LWC/LH,=EG1LWI/LH,=EG1LWN/LH,
#    =EG1TDH/LH,=EG90IARU/1,
#    =AM08ATU/H,=AM08CAZ/H,=AM08CYQ/H,=AM08EIE/Z,=AM08FAC/H,=AN08ADE/H,=AO08BQH/Z,=AO08BTM/Z,
#    =AO08CIK/H,=AO08CVV/Z,=AO08CXK/H,=AO08CYL/H,=AO08DI/Z,=AO08EIE/Z,=AO08HV/Z,=AO08ICA/Z,=AO08ID/Z,
#    =AO08KJ/Z,=AO08KV/Z,=AO08OK/H,=AO08PB/Z,=AO08RKO/H,=AO08VK/Z,=AO2016DSS/LH,=EA2/ON7RU/LH,
#    =EA2CRX/LH,=EA2EZ/P,=EA2SPS/LH,=EA2URI/O,=EA6SK/2,=EA9CP/2,=EG90IARU/2,
#    =EA3ESZ/Z,=EA3EVR/R,=EA3HSD/P,=EA3LD/D,=EA3RCV/PAZ,=EA6LU/3,=EA8TL/3,=EA9CI/3,=EA9CP/3,
#    =EG90IARU/3,
#    =EA4AAQ/O,=EA4RCH/CIE,=EA6AFU/4,=EA6RC/4,=EA8BFH/4,=EA8BY/4,=EA9CI/4,=EA9CP/4,=EG8AOP/4,
#    =EG90IARU/4,
#    =EA5/ON4LO/LH,=EA5ADM/P,=EA5CC/P,=EA5EQ/N,=EA5FL/LH,=EA5GVT/AVW,=EA5HCC/P,=EA5IKT/P,=EA5KB/LH,
#    =EA5ND/D,=EA5RCK/CDI,=EA5RKD/PAZ,=EA5TOM/AVW,=EA5URE/IVA,=EA5URE/P,=EA5URM/C,=EA5URM/F,=EA5URM/G,
#    =EA5URM/H,=EA5URM/I,=EA5URM/L,=EA5URR/PAZ,=EA5URV/CAC,=EA6AKN/5,=EA8BFH/5,=EA8CWF/5,=EA9BLJ/5,
#    =EA9CI/5,=EA9CP/5,=EA9PD/5,=ED5MFP/C,=ED5MFP/G,=ED5MFP/H,=ED5MFP/I,=ED5MFP/K,=ED5MFP/Q,=ED5MFP/R,
#    =ED5MFP/S,=ED5URD/LH,=EG5FOM/LH,=EG90IARU/5,=EH5FL/LH,
#    =AO7WRD/MA,=EA5EZ/P,=EA6SK/7,=EA7CFU/U,=EA7FC/FCJ,=EA7HZ/F,=EA7OBH/LH,=EA7URA/GET,=EA7URA/PAZ,
#    =EA7URA/SG,=EA7URA/YOTA,=EA7URE/PAZ,=EA7URF/PAZ,=EA7URI/MDL,=EA7URJ/CPM,=EA7URL/FSV,=EA7URM/PAZ,
#    =EA7URP/LAI,=EA9CP/7,=EA9FN/7,=EA9HU,=EA9HU/7,=EA9JS/7,=EA9LZ/7,=EA9PD/7,=EA9QD/7,=EA9UL/7,
#    =EA9UV/7,=EB9PH/7,=EC7DZZ/LH,=EG90IARU/7;
#Balearic Islands:         14:  37:  EU:   39.60:    -2.95:    -1.0:  EA6:
#    AM6,AN6,AO6,EA6,EB6,EC6,ED6,EE6,EF6,EG6,EH6,=AM70URE/6,=EA1QE/6,=EA1YO/6,=EA2EZ/6,=EA2SG/6,
#    =EA2TW/6,=EA3BT/6,=EA3CBH/6,=EA3ERT/6,=EA3HSD/6,=EA3HUX/6,=EA3HZX/6,=EA3HZX/P,=EA3RKM/6,=EA4LO/6,
#    =EA5ADM/6,=EA5BB/6,=EA5BK/6,=EA5BTL/6,=EA5EOR/6,=EA5ER/6,=EA5EZ/6,=EA5FL/P,=EA5HCC/6,=EA5IIG/6,
#    =EA5IKT/6,=EA5RKB/6,=EA6/DJ5AA/LH,=EA6/DJ7AO/LH,=EA6/G0SGB/LH,=EA6HP/J,=EA6LU/P,=EA6URI/PAZ,
#    =EA6URL/IF,=EA7DUT/6,=EA9CI/6,=EA9CP/6,=EB1BRH/6,=EB2GKK/6,=EB3CW/6,=EC5AC/6,=EC5BME/6,=EC5EA/P,
#    =EC5EC/6,=EC6TV/N,=EC7AT/6,=ED4SHF/6,=ED5ON/6,=EH90IARU/6;
#Canary Islands:           33:  36:  AF:   28.32:    15.85:     0.0:  EA8:
#    AM8,AN8,AO8,EA8,EB8,EC8,ED8,EE8,EF8,EG8,EH8,=AM70URE/8,=AN400L,=AN400U,=AO150ITU/8,=AO150U,
#    =AO4AAA/8,=EA1AK/8,=EA1AP/8,=EA1EHW/8,=EA1YO/8,=EA3RKB/8,=EA4BQ/8,=EA4ESI/8,=EA4SV/8,=EA4WT/8,
#    =EA4ZK/8,=EA5BK/8,=EA5HCC/8,=EA5RKL/8,=EA7JR/8,=EA8/DJ5AA/LH,=EA8AKG/F,=EA8AKG/G,=EA8DO/LP,
#    =EA8EE/L,=EA8TH/LP,=EA8URE/YOTA,=EA8URL/LH,=EA8URL/P/SBI,=EA9CI/8,=EA9CP/8,=EB2EMH/8,=EC1KR/8,
#    =EC8AFM/LH,=ED4R/8,=ED5RKL/8,=ED8BTM/C,=ED8BTM/E,=ED8BTM/J,=ED8BTM/L,=ED8BTM/S,=ED8GSA/J,
#    =ED8LIB/C,=ED8LIB/D,=ED8LIB/E,=ED8LIB/F,=ED8LIB/G,=ED8LIB/H,=ED8LIB/I,=ED8LIB/J,=ED8LIB/K,
#    =ED8LIB/N,=ED8LIB/O,=ED8LIB/Q,=ED8LPA/L,=ED8MCC/LH,=ED8OTA/D,=ED8OTA/H,=ED8PDC/E,=ED8PDC/K,
#    =ED8PDC/LP,=ED8PDC/O,=EF8LIB/N,=EG8LIB/C,=EG8LIB/D,=EG8LIB/E,=EG8LIB/F,=EG8LIB/G,=EG8LIB/H,
#    =EG8LIB/I,=EG8LIB/L,=EG8LIB/M,=EG8LIB/N,=EG8LIB/O,=EG8LIB/P,=EG8LIB/Q,=EG8LP/YL,=EH8FLH/LH,
#    =EH90IARU/8,
#    =EA2TW/8,=EA3FNZ/8,=EA5EZ/8,
#    =AO3MWC/8,=EA2SG/8,=EA4BFH/8,=EA4DE/8,=EA5RKB/8,=EA8BFH/P;
#Ceuta & Melilla:          33:  37:  AF:   35.90:     5.27:    -1.0:  EA9:
#    AM9,AN9,AO9,EA9,EB9,EC9,ED9,EE9,EF9,EG9,EH9,=AM70URE/9,=EA1DFP/9,=EA4URE/9,=EA7URM/9,=EA9CE/C,
#    =EA9CE/D,=EA9CE/E,=EA9CE/F,=EA9CE/G,=EA9CE/H,=EA9CE/I,=EA9URC/PAZ,=EC7DZZ/9,=ED3AFR/9,=ED9CE/D,
#    =ED9CE/E,=ED9CE/F,
#    =EA3EGB/9,=EA5RKB/9,=EA7UV/P,=EA9CD/M,=EA9CD/P,=EB9PH/P,=EC5ALJ/9,
#    =EA5DCL/9,=EA7JTF/9,=EA9PD/M,=EA9PD/P,=EC7DRS/9;
#Ireland:                  14:  27:  EU:   53.13:     8.02:     0.0:  EI:
#    EI,EJ,=EI0CAR/LH,=EI0CPL/LH,=EI0LHL/LH,=EI0M/LH,=EI1K/LH,=EI1KARG/LH,=EI1NC/LH,=EI4LRC/LH,
#    =EI5ML/LH;
#Armenia:                  21:  29:  AS:   40.40:   -44.90:    -4.0:  EK:
#    EK;
#Liberia:                  35:  46:  AF:    6.50:     9.50:     0.0:  EL:
#    5L,5M,6Z,A8,D5,EL;
#Iran:                     21:  40:  AS:   32.00:   -53.00:    -3.5:  EP:
#    9B,9C,9D,EP,EQ;
#Moldova:                  16:  29:  EU:   47.00:   -29.00:    -2.0:  ER:
#    ER,=ER3AC/FF,=ER3CR/FF,=ER4LX/FF;
#Estonia:                  15:  29:  EU:   59.00:   -25.00:    -2.0:  ES:
#    ES,=ES/SA5FYR/LH,
#    =ES/RX3AMI/LH,=ES0TI/LH;
#Ethiopia:                 37:  48:  AF:    9.00:   -39.00:    -3.0:  ET:
#    9E,9F,ET,=ET3AA/YOTA;
#Belarus:                  16:  29:  EU:   54.00:   -28.00:    -2.0:  EU:
#    EU,EV,EW;
#Kyrgyzstan:               17:  30:  AS:   41.70:   -74.13:    -6.0:  EX:
#    EX,=EX/RU3TT/FF,
#    EX0P[31],EX2P[31],EX6P[31],EX7P[31],EX8P[31],
#    EX0Q[31],EX2Q[31],EX6Q[31],EX7Q[31],EX8Q[31];
#Tajikistan:               17:  30:  AS:   38.82:   -71.22:    -5.0:  EY:
#    EY,=U8JB;
#Turkmenistan:             17:  30:  AS:   38.00:   -58.00:    -5.0:  EZ:
#    EZ;
#France:                   14:  27:  EU:   46.00:    -2.00:    -1.0:  F:
#    F,HW,HX,HY,TH,TM,TP,TQ,TV,=4U60UO,=F/DL5SE/LH,=F/G0SGB/LH,=F/IK3MZS/LH,=F/ON4LO/LH,=F/ON7RU/LH,
#    =F/PH2CV/LH,=F4FET/LH,=F5HPY/LH,=F5NBX/LH,=F5NMK/LH,=F6/4Z5KJ/LH,=F6DXB/YL,=F6HDH/LH,=F6IFC/LH,
#    =F6KBG/MSW,=F6KMB/LH,=F6KMB/P/LH,=F6KUM/LH,=TM0BSM/LH,=TM0PDC/LH,=TM0PDH/LH,=TM5AF/LH;
#Guadeloupe:               08:  11:  NA:   16.13:    61.67:     4.0:  FG:
#    FG,=TO0MT,=TO10RR,=TO11A,=TO11A/P,=TO1T,=TO1USB,=TO22C,=TO2ANT,=TO2E,=TO2FG,=TO2FG/P,=TO2HI,
#    =TO2OOO,=TO2T,=TO3Z,=TO40R,=TO4D,=TO4R,=TO4T,=TO5BG,=TO5GI,=TO5ROM,=TO5S,=TO66R,=TO6A,=TO6D,=TO6T,
#    =TO6T/P,=TO7ACR,=TO7AES,=TO7D,=TO7DSR,=TO7T,=TO8CW,=TO8FTDM,=TO8RR,=TO8S,=TO8UFT,=TO9RRG,=TO9T;
#Mayotte:                  39:  53:  AF:  -12.88:   -45.15:    -3.0:  FH:
#    FH,=TO0X,=TO2FH,=TO2TT,=TO4M,=TO6OK,=TO7BC,=TO7RJ,=TO8MZ,=TX0P,=TX5M,=TX5NK,=TX7LX;
#St. Barthelemy:           08:  11:  NA:   17.90:    62.83:     4.0:  FJ:
#    FJ,=TO2D,=TO2EE,=TO2SP,=TO3A,=TO3J,=TO3X,=TO4K,=TO5DX,=TO5E,=TO5FJ,=TO5RZ,=TO7ZG,=TO8YY;
#New Caledonia:            32:  56:  OC:  -21.50:  -165.50:   -11.0:  FK:
#    FK,=FK8VHY/P,=T8HRC,=TX1A,=TX1B,=TX1CW,=TX3SAM,=TX4A,=TX5CW,=TX5FS,=TX8B,=TX8C,=TX8CW,=TX8D,=TX8F,
#    =TX8JOTA,=TX8NC,=TX90IARU;
#Chesterfield Islands:     30:  56:  OC:  -19.87:  -158.32:   -11.0:  FK/c:
#    =FK8C/AA7JV,=FK8IK/C,=TX0AT,=TX0C,=TX0DX,=TX3A,=TX3X,=TX9;
#Martinique:               08:  11:  NA:   14.70:    61.03:     4.0:  FM:
#    FM,=TO0O,=TO1BT,=TO1C,=TO1J,=TO1N,=TO1YR,=TO2M,=TO2MB,=TO3FM,=TO3GA,=TO3JA,=TO3M,=TO3T,=TO3W,
#    =TO40CDXC,=TO4A,=TO4C,=TO4FM,=TO4GU,=TO4IPA,=TO4OC,=TO4YL,=TO5A,=TO5AA,=TO5J,=TO5K,=TO5PX,=TO5T,
#    =TO5U,=TO5W,=TO5X,=TO5Y,=TO6ABM,=TO6M,=TO7A,=TO7HAM,=TO7X,=TO8A,=TO8M,=TO8T,=TO8Z,=TO90IARU,
#    =TO972A,=TO972M,=TO9A,=TO9R;
#French Polynesia:         32:  63:  OC:  -17.65:   149.40:    10.0:  FO:
#    FO,=FO0MIC/MM3,=TX0A,=TX0M,=TX5J,
#    =TX2AH,=TX6T/P,
#    =TX3T,=TX4FO,=TX4T,=TX5EG,=TX5JF,=TX5X,=TX6A,=TX6T,=TX7EME,
#    =TX5TES;
#Austral Islands:          32:  63:  OC:  -23.37:   149.48:    10.0:  FO/a:
#    =FO/AC4LN/A,=FO/DF6IC,=FO/DJ4OI,=FO/DL1AWI,=FO/DL1IAN,=FO/DL3APO,=FO/DL3GA,=FO/DL7FT,=FO/DL9AWI,
#    =FO/F6CTL,=FO/F8CFU,=FO/G3BJ,=FO/HG9B,=FO/HG9B/P,=FO/IK2GNW,=FO/JA8BMK,=FO/K7AR,=FO/OH6KN,
#    =FO/ON4AXU/A,=FO/UT6UD,=FO0CLA/A,=FO0ERI,=FO0FLA,=FO0FRY,=FO0HWU,=FO0MOT/P,=FO0SEV,=FO0WEG,
#    =FO0WII,=FO5FD,=TX0HF,=TX2A,=TX3D,=TX5BTY,=TX5D,=TX5RV,=TX5SPA,=TX5T,=TX5W,=TX5Z,=TX6G;
#Clipperton Island:        07:  10:  NA:   10.28:   109.22:     8.0:  FO/c:
#    =FO0/F8UFT,=FO0AAA,=TX5C,=TX5K,=TX5P;
#Marquesas Islands:        31:  63:  OC:   -8.92:   140.07:     9.5:  FO/m:
#    =FO/AC4LN/M,=FO/DJ7RJ,=FO/DL5XU,=FO/F6BCW,=FO/F6BFH/P,=FO/F6COW,=FO/F6EPY,=FO/F6GNZ,=FO/HA9G,
#    =FO/IZ2ZTQ,=FO/JA0SC,=FO/JI1WTF,=FO/KA7OQQ,=FO/N7WLR,=FO/OH1RX,=FO/ON4AXU,=FO/ON4AXU/M,=FO/SP9FIH,
#    =FO/W6TLD,=FO0ELY,=FO0POM,=FO0TOH,=FO5QS/M,=FO8RZ/P,=K7ST/FO,=TX0SIX,=TX4PG,=TX5A,=TX5SPM,=TX5VT,
#    =TX7EU,=TX7G,=TX7M,=TX7T;
#St. Pierre & Miquelon:    05:  09:  NA:   46.77:    56.20:     3.0:  FP:
#    FP,=TO200SPM,=TO2U,=TO5FP,=TO5M,=TO80SP;
#Reunion Island:           39:  53:  AF:  -21.12:   -55.48:    -4.0:  FR:
#    FR,=TO019IEEE,=TO0FAR,=TO0MPB,=TO0R,=TO19A,=TO1PF,=TO1PF/P,=TO1TAAF,=TO2R,=TO2R/P,=TO2Z,=TO3R,
#    =TO5R,=TO7CC,=TO90R;
#St. Martin:               08:  11:  NA:   18.08:    63.03:     4.0:  FS:
#    FS,=TO1E,=TO2EME,=TO4X,=TO5D,=TO5SM,=TO5SM/P,=TO9W;
#Glorioso Islands:         39:  53:  AF:  -11.55:   -47.28:    -4.0:  FT/g:
#    FT0G,FT1G,FT2G,FT3G,FT4G,FT5G,FT6G,FT7G,FT8G,FT9G,=FR5ZQ/G;
#Juan de Nova, Europa:     39:  53:  AF:  -17.05:   -42.72:    -3.0:  FT/j:
#    FT0E,FT1E,FT2E,FT3E,FT4E,FT6E,FT7E,FT8E,FT9E,=FR/F5NHJ/E,=FR5IZ/E,=TO4E,=TO4WW,
#    FT0J,FT1J,FT2J,FT3J,FT4J,FT6J,FT7J,FT8J,FT9J;
#Tromelin Island:          39:  53:  AF:  -15.88:   -54.50:    -4.0:  FT/t:
#    FT0T,FT1T,FT2T,FT3T,FT4T,FT5T,FT6T,FT7T,FT8T,FT9T,=FR/F6KDF/T,=FR5ZU/T;
#Crozet Island:            39:  68:  AF:  -46.42:   -51.75:    -5.0:  FT/w:
#    FT0W,FT4W,FT5W,FT8W;
#Kerguelen Islands:        39:  68:  AF:  -49.00:   -69.27:    -5.0:  FT/x:
#    FT0X,FT2X,FT4X,FT5X,FT8X;
#Amsterdam & St. Paul Is.: 39:  68:  AF:  -37.85:   -77.53:    -5.0:  FT/z:
#    FT0Z,FT1Z,FT2Z,FT3Z,FT4Z,FT5Z,FT6Z,FT7Z,FT8Z;
#Wallis & Futuna Islands:  32:  62:  OC:  -13.30:   176.20:   -12.0:  FW:
#    FW,TW;
#French Guiana:            09:  12:  SA:    4.00:    53.00:     3.0:  FY:
#    FY,=TO1A,=TO2A,=TO2BC,=TO5BR,=TO5G,=TO5NED,=TO7C,=TO7IR,=TO7R;
#England:                  14:  27:  EU:   52.77:     1.47:     0.0:  G:
#    2E,G,M,=2E0GWD/P/LH,=2MT,=2O0YYY/P,=2Q0XYL/P,=2Q0YYY/P,=2SZ,=G0IBN/LH,=G0IBN/LV,=G0IBN/P/LV,
#    =G0SGB/LH,=G0VML/LV,=G3PRC/LH,=G6HH/LH,=GB0BLL/LH,=GB0BMB/LH,=GB0HLH/LH,=GB0NCI/LH,=GB0PL/LH,
#    =GB0SLH/LH,=GB0WPS/JOTA,=GB1PBL/LH,=GB2APL/LH,=GB2BML/LGT,=GB2BML/LH,=GB2LZL/LH,=GB2PLH/LH,
#    =GB2SCA/LH,=GB2SJ/LH,=GB2SML/LH,=GB2SNM/MILL,=GB3HQ/YOTA,=GB4CWM/YL,=GB4LL/LH,=GB4WL/LH,=GB5PW/LH,
#    =GB6MD/IMD,=GB6MW/MILL,=GB8SL/LH,=GO4ONL/P,=GX0MWT/IMD,=GX3PRC/LH,=GX3SDS/LH,=M0DXT/LH,
#    =M0HAZ/A/TCM,=M0TXS/YL,=M0WDC/LH,=M1MJT/YL,=M2000Y/21B,=M2000Y/21F,=M2000Y/28B,=M2000Y/29C,
#    =M2000Y/71B,=M2001Y/21F,=M2001Y/71B,=M2001Y/97A,=M3AFR/LH,=M3MJT/YL,=M3ZKT/YL,=M6AIG/YL,=M6SUS/YL,
#    =MQ6BWA/P;
#Isle of Man:              14:  27:  EU:   54.20:     4.53:     0.0:  GD:
#    2D,GD,GT,MD,MT,=2O0YLX,=2Q0YLX,=2R0IOM,=2V0IOM,=2V0YLX,=GB0AOA,=GB0BEA,=GB0IOM,=GB0MST,=GB100TT,
#    =GB19CIM,=GB1MSG,=GB1RT,=GB1SOI,=GB2IOM,=GB2MAD,=GB2RT,=GB2WB,=GB4COM,=GB4IOM,=GB4JDF,=GB4MGR,
#    =GB4MNH,=GB4SPT,=GB4WXM,=GB4WXM/P,=GB5LB,=GB5MOB,=GB5TD,=GD3JIU/2K,=GO0OUD,=GQ0OUD,=GR0AMD,
#    =GR0HWA,=GR0OUD,=GR6AFB,=GT3FLH/LGT,=GT3FLH/LT,=GT4IOM/LH,=GT8IOM/LH,=GV0OUD,=GV3YEO,=GV6AFB,
#    =GV7HTG,=MB100TT,=MO1CLV,=MQ1CLV,=MR0CCE,=MR3LJB,=MR3MLD,=MV3YLX;
#Northern Ireland:         14:  27:  EU:   54.73:     6.68:     0.0:  GI:
#    2I,GI,GN,MI,MN,=2O0BAD,=2O0HBO,=2O0HRV,=2O0MFB,=2O0TWA,=2O0VEP,=2O0VGW,=2O0VIM,=2O0WAI,=2O0ZXM,
#    =2Q0BSA,=2Q0ETB,=2Q0HRV,=2Q0MFB,=2Q0NIE,=2Q0SXG,=2Q0TWA,=2Q0VEP,=2Q0VIM,=2Q0ZXM,=2R0IRZ,=2R0IRZ/P,
#    =2R0KPY,=2R0KYE,=2R0MFB,=2R0PTX,=2R0RMD,=2R0RVH,=2R0TCA,=2R0TMR,=2R0VAX,=2R0VEP,=2R0VIM,=2R0WAI,
#    =2R0WMN,=2V0CSB,=GB0ARM,=GB0AS,=GB0AVB,=GB0BIG,=GB0BMS,=GB0BPM,=GB0BTC,=GB0BVC,=GB0C,=GB0CAS,
#    =GB0CBS,=GB0COA,=GB0CSC,=GB0DDF,=GB0EBG,=GB0EG,=GB0FMF,=GB0FMH,=GB0GDI,=GB0GLS,=GB0GPF,=GB0KKM,
#    =GB0LNR,=GB0LSP,=GB0LVA,=GB0MAH,=GB0MAR,=GB0MFD,=GB0OGC,=GB0PAT,=GB0PSM,=GB0REL,=GB0RSL,=GB0SBG,
#    =GB0SPD,=GB0TCH,=GB0TGN,=GB0USR,=GB0VC,=GB0WOA,=GB100BOS,=GB100RNR,=GB106TBC,=GB150WCB,=GB16SW,
#    =GB1918EKN,=GB19CGI,=GB19CNI,=GB1AFP,=GB1BPM,=GB1DDG,=GB1IMD,=GB1RM,=GB1ROC,=GB1SPD,=GB1SRI,
#    =GB1UAS,=GB1WWC,=GB2AD,=GB2AD/P,=GB2AS,=GB2BCW,=GB2BDS,=GB2BOA,=GB2CA,=GB2CRU,=GB2DCI,=GB2DMR,
#    =GB2DPC,=GB2IL,=GB2LL,=GB2LOL,=GB2MAC,=GB2MRI,=GB2PP,=GB2PSW,=GB2REL,=GB2SDD,=GB2SPD,=GB2SPR,
#    =GB2STI,=GB2STP,=GB2SW,=GB2UAS,=GB3NGI,=GB4CSC,=GB4CTL,=GB4ONI,=GB4PS,=GB4SOS,=GB4SPD,=GB4UAS,
#    =GB50AAD,=GB50CSC,=GB5BIG,=GB5BL,=GB5BL/LH,=GB5DPR,=GB5OMU,=GB5SPD,=GB6EPC,=GB6VCB,=GB8BKY,
#    =GB8BRM,=GB8DS,=GB8EGT,=GB8GLM,=GB8ROC,=GB8SPD,=GB90RSGB/82,=GB90SOM,=GB9RAF,=GB9SPD,=GN0LIX/LH,
#    =GN4GTY/LH,=GO0AQD,=GO0BJH,=GO0DUP,=GO3KVD,=GO3MMF,=GO3SG,=GO4DOH,=GO4GID,=GO4GUH,=GO4LKG,=GO4NKB,
#    =GO4ONL,=GO4OYM,=GO4SRQ,=GO4SZW,=GO6MTL,=GO7AXB,=GO7KMC,=GO8YYM,=GQ0AQD,=GQ0BJG,=GQ0NCA,=GQ0RQK,
#    =GQ0TJV,=GQ0UVD,=GQ1CET,=GQ3KVD,=GQ3MMF,=GQ3SG,=GQ3UZJ,=GQ3XRQ,=GQ4DOH,=GQ4GID,=GQ4GUH,=GQ4JTF,
#    =GQ4LKG,=GQ4LXL,=GQ4NKB,=GQ4ONL,=GQ4OYM,=GQ4SZW,=GQ6JPO,=GQ6MTL,=GQ7AXB,=GQ7JYK,=GQ7KMC,=GQ8RQI,
#    =GQ8YYM,=GR0BJH,=GR0BRO,=GR0DVU,=GR0RQK,=GR0RWO,=GR0UVD,=GR1CET,=GR3GTR,=GR3KDR,=GR3SG,=GR3WEM,
#    =GR4AAM,=GR4DHW,=GR4DOH,=GR4FUE,=GR4FUM,=GR4GID,=GR4GOS,=GR4GUH,=GR4KQU,=GR4LXL,=GR4NKB,=GR6JPO,
#    =GR7AXB,=GR7KMC,=GR8RKC,=GR8RQI,=GR8YYM,=GV1BZT,=GV3KVD,=GV3SG,=GV4FUE,=GV4GUH,=GV4JTF,=GV4LXL,
#    =GV4SRQ,=GV4WVN,=GV7AXB,=GV7THH,=MI5AFK/2K,=MN0NID/LH,=MO0ALS,=MO0BDZ,=MO0CBH,=MO0IOU,=MO0IRZ,
#    =MO0JFC,=MO0JFC/P,=MO0JML,=MO0JST,=MO0KYE,=MO0LPO,=MO0MOD,=MO0MOD/P,=MO0MSR,=MO0MVP,=MO0RRE,
#    =MO0RUC,=MO0RYL,=MO0TGO,=MO0VAX,=MO0ZXZ,=MO3RLA,=MO6AOX,=MO6NIR,=MO6TUM,=MO6WAG,=MO6WDB,=MO6YDR,
#    =MQ0ALS,=MQ0BDZ,=MQ0BPB,=MQ0GGB,=MQ0IRZ,=MQ0JFC,=MQ0JST,=MQ0KAM,=MQ0KYE,=MQ0MOD,=MQ0MSR,=MQ0MVP,
#    =MQ0RMD,=MQ0RRE,=MQ0RUC,=MQ0RYL,=MQ0TGO,=MQ0VAX,=MQ0ZXZ,=MQ3GHW,=MQ3RLA,=MQ3STV,=MQ5AFK,=MQ6AOX,
#    =MQ6BJG,=MQ6GDN,=MQ6WAG,=MQ6WDB,=MQ6WGM,=MR0GDO,=MR0GGB,=MR0JFC,=MR0KQU,=MR0LPO,=MR0MOD,=MR0MSR,
#    =MR0MVP,=MR0RUC,=MR0SAI,=MR0SMK,=MR0TFK,=MR0TLG,=MR0TMW,=MR0VAX,=MR0WWB,=MR1CCU,=MR3RLA,=MR3TFF,
#    =MR3WHM,=MR5AMO,=MR6CCU,=MR6CWC,=MR6GDN,=MR6MME,=MR6MRJ,=MR6OKS,=MR6OLA,=MR6PUX,=MR6WAG,=MR6XGZ,
#    =MV0ALS,=MV0GGB,=MV0IOU,=MV0JFC,=MV0JLC,=MV0MOD,=MV0MSR,=MV0MVP,=MV0TGO,=MV0VAX,=MV0WGM,=MV0ZAO,
#    =MV1VOX,=MV6DTE,=MV6GTY,=MV6NIR,=MV6TLG;
#Jersey:                   14:  27:  EU:   49.22:     2.18:     0.0:  GJ:
#    2J,GH,GJ,MH,MJ,=2R0ODX,=GB0JSA,=GB19CJ,=GB2BYL,=GB2JSA,=GB50JSA,=GB5OJR,=GB8LMI,=GJ3DVC/L,
#    =GJ6WRI/LH,=GJ8PVL/LH,=GO8PVL,=GQ8PVL,=GR6TMM,=MO0ASP,=MQ0ASP,=MR0ASP,=MR0RZD,=MV0ASP;
#Shetland Islands:         14:  27:  EU:   60.50:     1.50:     0.0:  *GM/s:
#    =2M0BDR,=2M0BDT,=2M0CPN,=2M0GFC,=2M0SEG,=2M0SPX,=2M0VIK,=2M0ZET,=2M1ANT,=2M1ASQ,=2M1ODL,=G0FBJ,
#    =GB0BL,=GB0DAW,=GB100ZET,=GB2AES,=GB2CAS,=GB2DAW,=GB2ELH,=GB2ELH/LH,=GB2HMC,=GB2IGS,=GB2LHI,
#    =GB2MUC,=GB2NBC,=GB2QM,=GB2SB,=GB2SLH,=GB2SR,=GB2SUM,=GB2WAM,=GB2WG,=GB3LER,=GB3LER/B,=GB4LER,
#    =GM0AVR,=GM0CXQ,=GM0CYJ,=GM0DJI,=GM0EKM,=GM0GFL,=GM0GFL/P,=GM0ILB,=GM0JDB,=GM0SGB/M,=GM0VFA,
#    =GM1BYL,=GM1CBQ,=GM1FGN,=GM1KKI,=GM1MXN,=GM1ZNR,=GM3KLA,=GM3KZH,=GM3RFR,=GM3SJA,=GM3SKN,=GM3TXF/P,
#    =GM3WCH,=GM3WHT,=GM3ZET,=GM3ZXH,=GM4AFF/P,=GM4AGX,=GM4CHX/P,=GM4ENK,=GM4FNE,=GM4GPN,=GM4GPP,
#    =GM4GQD,=GM4GQM,=GM4IPK,=GM4JPI,=GM4LBE,=GM4LER,=GM4PXG,=GM4S,=GM4SLV,=GM4SSA,=GM4WXQ,=GM4ZHL,
#    =GM6RQW,=GM6RTO,=GM6VZB,=GM6WVI,=GM6YQA,=GM7AFE,=GM7GWW,=GM7RKD,=GM8LNH,=GM8MMA,=GM8YEC,=GS0AAA,
#    =GS0GRC,=GS3BSQ,=GS3ZET,=GS7V,=GS8YL,=MA0XAU,=MA1FJM,=MA6PTE,=MM/DJ6OZ,=MM/DL5KUA,=MM/OK1HDU,
#    =MM/OK7U,=MM/PA9D,=MM/PF9DC,=MM/W5ZE/P,=MM0/DJ6AU,=MM0/PA8MO,=MM0ECG,=MM0KAL,=MM0LON,=MM0LON/M,
#    =MM0LSM,=MM0NQY,=MM0SHF/P,=MM0VIK,=MM0XAU,=MM0ZAL,=MM0ZCG,=MM0ZRC,=MM1FJM,=MM3VQO,=MM3ZET,=MM5PSL,
#    =MM5PSL/P,=MM5YLO,=MM5YLO/P,=MM6ACW,=MM6BDU,=MM6BZQ,=MM6IKB,=MM6IMB,=MM6MFA,=MM6PTE,=MM6SJK,
#    =MM6YLO,=MM6ZBG,=MM6ZDW,=MM8A,=MO5PSL,=MQ5PSL,=MR5PSL,=MS0OXE,=MS0ZCG,=MS0ZET;
#Scotland:                 14:  27:  EU:   56.82:     4.18:     0.0:  GM:
#    2A,2M,GM,GS,MA,MM,MS,=2O0BSE,=2O0BZB,=2O0HJS,=2O0IMP,=2O0IOB,=2O0IVG,=2O0LIM,=2O0LJM,=2O0TOK,
#    =2O1MIC,=2O1SJB,=2Q0BSE,=2Q0BZB,=2Q0FYG,=2Q0HJS,=2Q0IMP,=2Q0IOB,=2Q0JOK,=2Q0LDO,=2Q0TAX,=2Q0TOK,
#    =2Q0YCG,=2Q1MIC,=2Q1SJB,=2R0BOO,=2R0BSE,=2R0BXN,=2R0BZB,=2R0DES,=2R0DXR,=2R0FYG,=2R0GLI,=2R0HJS,
#    =2R0IMP,=2R0IOB,=2R0ISM,=2R0JVR,=2R0KAU,=2R0KAU/P,=2R0NCM,=2R0OXX,=2R0YCG,=2R0ZPS,=2R1MIC,=2R1SJB,
#    =2V0GUL,=2V0IVG,=2V0JCH,=2V0KAU,=2V0TAX,=2V1HFE,=2V1MIC,=2V1SJB,=G0FBJ,=GA6NX/LH,=GB0AYR,=GB0BAJ,
#    =GB0BCG,=GB0BCK,=GB0BD,=GB0BDC,=GB0BL,=GB0BNA,=GB0BNC,=GB0BOC,=GB0BOL,=GB0BSS,=GB0BWT,=GB0CCF,
#    =GB0CHL,=GB0CLH,=GB0CML,=GB0CNL,=GB0CWF,=GB0CWS,=GB0DAM,=GB0DAW,=GB0DBS,=GB0DHL,=GB0DPK,=GB0EPC,
#    =GB0FFS,=GB0FSG,=GB0GDS,=GB0GDS/J,=GB0GGR,=GB0GRN,=GB0HHW,=GB0HLD,=GB0JOG,=GB0KEY,=GB0KGS,=GB0KKS,
#    =GB0KLT,=GB0LCS,=GB0LCW,=GB0LTM,=GB0MLH,=GB0MLM,=GB0MOG,=GB0MOL,=GB0MSL,=GB0MUL,=GB0NGG,=GB0NHL,
#    =GB0NHL/LH,=GB0NRL,=GB0OYT,=GB0PLS,=GB0POS,=GB0PPE,=GB0PSW,=GB0RGC,=GB0SAA,=GB0SBC,=GB0SCD,
#    =GB0SFM,=GB0SHP,=GB0SI,=GB0SK,=GB0SKG,=GB0SKY,=GB0SRC,=GB0SSB,=GB0TH,=GB0THL,=GB0TNL,=GB0TTS,
#    =GB0WRH,=GB100MAS,=GB100MUC,=GB100ZET,=GB10SP,=GB150NRL,=GB18FIFA,=GB19CGM,=GB19CS,=GB1AJ,=GB1ASC,
#    =GB1ASH,=GB1BD,=GB1BOL,=GB1CFL,=GB1DHL,=GB1FB,=GB1FRS,=GB1FVS,=GB1FVT,=GB1GEO,=GB1HRS,=GB1KGG,
#    =GB1KLD,=GB1LAY,=GB1LGG,=GB1LL,=GB1MAY,=GB1NHL,=GB1OL,=GB1OL/LH,=GB1PC,=GB1RB,=GB1RHU,=GB1SLH,
#    =GB1TAY,=GB1WLG,=GB250RB,=GB2AES,=GB2AGG,=GB2AL,=GB2AST,=GB2ATC,=GB2AYR,=GB2BAJ,=GB2BHM,=GB2BHS,
#    =GB2BMJ,=GB2BOL,=GB2CAS,=GB2CHC,=GB2CM,=GB2CMA,=GB2CVL,=GB2CWR,=GB2DAS,=GB2DAW,=GB2DHS,=GB2DL,
#    =GB2DRC,=GB2DT,=GB2DTM,=GB2ELH,=GB2ELH/LH,=GB2EPC,=GB2FBM,=GB2FSM,=GB2FSW,=GB2GEO,=GB2GKR,=GB2GNL,
#    =GB2GNL/LH,=GB2GTM,=GB2GVC,=GB2HLB,=GB2HMC,=GB2HRH,=GB2IGB,=GB2IGS,=GB2IMG,=GB2IMM,=GB2INV,
#    =GB2IOT,=GB2JCM,=GB2KDR,=GB2KGB,=GB2KW,=GB2LBN,=GB2LBN/LH,=GB2LCL,=GB2LCP,=GB2LCT,=GB2LDG,=GB2LG,
#    =GB2LGB,=GB2LHI,=GB2LK,=GB2LK/LH,=GB2LMG,=GB2LP,=GB2LS,=GB2LS/LH,=GB2LSS,=GB2LT,=GB2LT/LH,=GB2LXX,
#    =GB2M,=GB2MAS,=GB2MBB,=GB2MDG,=GB2MN,=GB2MOF,=GB2MSL,=GB2MUC,=GB2MUL,=GB2NBC,=GB2NEF,=GB2NL,
#    =GB2NMM,=GB2OL,=GB2OWM,=GB2PBF,=GB2PG,=GB2QM,=GB2RB,=GB2RDR,=GB2RRL,=GB2RWW,=GB2SAA,=GB2SAM,
#    =GB2SAS,=GB2SB,=GB2SBG,=GB2SHL/LH,=GB2SKG,=GB2SLH,=GB2SMM,=GB2SOH,=GB2SQN,=GB2SR,=GB2SSB,=GB2SUM,
#    =GB2SWF,=GB2TDS,=GB2THL,=GB2THL/LH,=GB2TNL,=GB2VCB,=GB2VEF,=GB2WAM,=GB2WBF,=GB2WG,=GB2WLS,=GB2YLS,
#    =GB2ZE,=GB3ANG,=GB3GKR,=GB3LER,=GB3LER/B,=GB3ORK,=GB3ORK/B,=GB3SWF,=GB3WOI,=GB4AAS,=GB4AST,
#    =GB4BBR,=GB4BG,=GB4CGS,=GB4CMA,=GB4DAS,=GB4DHX,=GB4DTD,=GB4DUK,=GB4EPC,=GB4FFS,=GB4GD,=GB4GDS,
#    =GB4GS,=GB4IE,=GB4JCM,=GB4JPJ,=GB4JYS,=GB4LER,=GB4MSE,=GB4NFE,=GB4OL,=GB4PAS,=GB4SK,=GB4SKO,
#    =GB4SLH,=GB4SMM,=GB4SRO,=GB4SWF,=GB50FVS,=GB50GDS,=GB50GT,=GB50JS,=GB5AG,=GB5AST,=GB5BBS,=GB5BOH,
#    =GB5C,=GB5CCC,=GB5CS,=GB5DHL,=GB5DX,=GB5EMF,=GB5FHC,=GB5FLM,=GB5JS,=GB5LTH,=GB5RO,=GB5RO/LH,
#    =GB5RR,=GB5SI,=GB5TAM,=GB5TI,=GB60CRB,=GB6BEN,=GB6TAA,=GB6WW,=GB75CC,=GB75GD,=GB80GD,=GB8AYR,
#    =GB8CSL,=GB8FSG,=GB8RU,=GB8RUM,=GB90RSGB/11,=GB90RSGB/12,=GB90RSGB/21,=GB90RSGB/22,=GB90RSGB/23,
#    =GB999SPC,=GG100AGG,=GG100GA,=GG100GCC,=GG100GGP,=GG100GGR,=GG100GLD,=GG100SBG,=GM/DL5SE/LH,
#    =GM0AZC/2K,=GM0DHZ/P,=GM0GFL/P,=GM0KTO/2K,=GM0MUN/2K,=GM0SGB/M,=GM0SGB/P,=GM0WUX/2K,=GM3JIJ/2K,
#    =GM3OFT/P,=GM3TKV/LH,=GM3TTC/P,=GM3TXF/P,=GM3USR/P,=GM3VLB/P,=GM3WFK/P,=GM4AFF/P,=GM4CHX/2K,
#    =GM4CHX/P,=GM4WSB/M,=GM4WSB/P,=GM4ZVD/P,=GM6WRW/P,=GO0AEG,=GO0AIR,=GO0BKC,=GO0DBW,=GO0DBW/M,
#    =GO0DEQ,=GO0GMN,=GO0OGN,=GO0SYY,=GO0TUB,=GO0VRP,=GO0WEZ,=GO1BAN,=GO1BKF,=GO1MQE,=GO1TBW,=GO2MP,
#    =GO3HVK,=GO3JIJ,=GO3NIG,=GO3VTB,=GO4BLO,=GO4CAU,=GO4CFS,=GO4CHX,=GO4CXM,=GO4DLG,=GO4EMX,=GO4FAM,
#    =GO4FAU,=GO4JOJ,=GO4JPZ,=GO4JR,=GO4MOX,=GO4MSL,=GO4PRB,=GO4UBJ,=GO4VTB,=GO4WZG,=GO4XQJ,=GO6JEP,
#    =GO6JRX,=GO6KON,=GO6LYJ,=GO6VCV,=GO7GAX,=GO7GDE,=GO7HUD,=GO7TUD,=GO7WEF,=GO8CBQ,=GO8MHU,=GO8SVB,
#    =GO8TTD,=GQ0AEG,=GQ0AIR,=GQ0BKC,=GQ0BWR,=GQ0DBW,=GQ0DEQ,=GQ0DUX,=GQ0FNE,=GQ0GMN,=GQ0HUO,=GQ0KWL,
#    =GQ0MUN,=GQ0NTL,=GQ0OGN,=GQ0RNR,=GQ0TKV/P,=GQ0VRP,=GQ0WEZ,=GQ0WNR,=GQ1BAN,=GQ1BKF,=GQ1MQE,=GQ1TBW,
#    =GQ3JIJ,=GQ3JQJ,=GQ3NIG,=GQ3NTL,=GQ3TKP,=GQ3TKP/P,=GQ3TKV,=GQ3TKV/P,=GQ3VTB,=GQ3WUX,=GQ3ZBE,
#    =GQ4AGG,=GQ4BAE,=GQ4BLO,=GQ4CAU,=GQ4CFS,=GQ4CHX,=GQ4CHX/P,=GQ4CXM,=GQ4DLG,=GQ4ELV,=GQ4EMX,=GQ4FAU,
#    =GQ4JOJ,=GQ4JPZ,=GQ4JR,=GQ4MSL,=GQ4OBG,=GQ4PRB,=GQ4UIB,=GQ4UPL,=GQ4VTB,=GQ4WZG,=GQ4XQJ,=GQ4YMM,
#    =GQ6JEP,=GQ6JRX,=GQ6KON,=GQ6LYJ,=GQ7GAX,=GQ7GDE,=GQ7HUD,=GQ7TUD,=GQ7UED,=GQ7WEF,=GQ8CBQ,=GQ8MHU,
#    =GQ8PLR,=GQ8SVB,=GQ8TTD,=GR0AXY,=GR0CDV,=GR0DBW,=GR0EKM,=GR0GMN,=GR0GRD,=GR0HPK,=GR0HPL,=GR0HUO,
#    =GR0OGN,=GR0PNS,=GR0SYV,=GR0TTV,=GR0TUB,=GR0UKZ,=GR0VRP,=GR0WED,=GR0WNR,=GR150NIB,=GR1BAN,=GR1MWK,
#    =GR1TBW,=GR1ZIV,=GR3JFG,=GR3MZX,=GR3NIG,=GR3OFT,=GR3PPE,=GR3PYU,=GR3VAL,=GR3VTB,=GR3WFJ,=GR3YXJ,
#    =GR3ZDH,=GR4BDJ,=GR4BLO,=GR4CAU,=GR4CCN,=GR4CFS,=GR4CMI,=GR4CXM,=GR4DLG,=GR4EMX,=GR4EOU,=GR4FQE,
#    =GR4GIF,=GR4JOJ,=GR4NSZ,=GR4PRB,=GR4SQM,=GR4VTB,=GR4XAW,=GR4XMD,=GR4XQJ,=GR4YMM,=GR6JEP,=GR6JNJ,
#    =GR7AAJ,=GR7GAX,=GR7GDE,=GR7GMC,=GR7HHB,=GR7HUD,=GR7LNO,=GR7NZI,=GR7TUD,=GR7USC,=GR7VSB,=GR8CBQ,
#    =GR8KJO,=GR8KPH,=GR8MHU,=GR8OFQ,=GR8SVB,=GS4WAB/P,=GV0DBW,=GV0GMN,=GV0GRD,=GV0LZE,=GV0OBX,=GV0OGN,
#    =GV0SYV,=GV0VRP,=GV1BAN,=GV3EEW,=GV3JIJ,=GV3NHQ,=GV3NIG,=GV3NKG,=GV3NNZ,=GV3PIP,=GV3ULP,=GV3VTB,
#    =GV4BLO,=GV4EMX,=GV4HRJ,=GV4ILS,=GV4JOJ,=GV4KLN,=GV4LVW,=GV4PRB,=GV4VTB,=GV4XQJ,=GV6KON,=GV7DHA,
#    =GV7GDE,=GV7GMC,=GV8AVM,=GV8DPV,=GV8LYS,=MB18FIFA,=MM/DH5JBR/P,=MM/DJ4OK/M,=MM/DJ8OK/M,
#    =MM/DL5SE/LH,=MM/F5BLC/P,=MM/F5LMJ/P,=MM/HB9IAB/P,=MM/KE5TF/P,=MM/N5ET/P,=MM/OK1FZM/P,=MM/W5ZE/P,
#    =MM0BNN/LH,=MM0BQI/2K,=MM0BQN/2K,=MM0BYE/2K,=MM0DFV/P,=MM0LON/M,=MM0SHF/P,=MM0YHB/P,=MM0ZOL/LH,
#    =MM5PSL/P,=MM5YLO/P,=MO0BFF,=MO0CWJ,=MO0CYR,=MO0DBC,=MO0DNX,=MO0FMF,=MO0GXQ,=MO0HZT,=MO0JST/P,
#    =MO0KJG,=MO0KSS,=MO0NFC,=MO0SGQ,=MO0SJT,=MO0TGB,=MO0TSG,=MO0WKC,=MO0XXW,=MO0ZBH,=MO1AWV,=MO1HMV,
#    =MO3BCA,=MO3BRR,=MO3GPL,=MO3OQR,=MO3TUP,=MO3UVL,=MO3YHA,=MO3YMU,=MO3ZRF,=MO5PSL,=MO6BJJ,=MO6CCS,
#    =MO6CHM,=MO6CRQ,=MO6CRQ/M,=MO6DGZ,=MO6HUT,=MO6KAU,=MO6KAU/M,=MO6KSJ,=MO6MCV,=MO6SRL,=MO6TEW,
#    =MQ0BNN/P,=MQ0BQM,=MQ0BRG,=MQ0CIN,=MQ0CXA,=MQ0CYR,=MQ0DNX,=MQ0DXD,=MQ0EQE,=MQ0FMF,=MQ0GXQ,=MQ0GYX,
#    =MQ0GYX/P,=MQ0KJG,=MQ0KSS,=MQ0LEN,=MQ0NFC,=MQ0NJC,=MQ0SJT,=MQ0TSG,=MQ0WKC,=MQ0XXW,=MQ0ZBH,=MQ1AWV,
#    =MQ1HMV,=MQ1JWF,=MQ3BCA,=MQ3BRR,=MQ3ERZ,=MQ3FET,=MQ3OVK,=MQ3SVK,=MQ3UIX,=MQ3UVL,=MQ3YHA,=MQ3YMU,
#    =MQ3ZRF,=MQ5PSL,=MQ6AQM,=MQ6BJJ,=MQ6CCS,=MQ6CHM,=MQ6CRQ,=MQ6DGZ,=MQ6HUT,=MQ6KAJ,=MQ6KAU,=MQ6KSJ,
#    =MQ6KUA,=MQ6LMP,=MQ6MCV,=MR0BQN,=MR0CWB,=MR0CXA,=MR0DHQ,=MR0DWF,=MR0DXD,=MR0DXH,=MR0EPC,=MR0EQE,
#    =MR0FME,=MR0FMF,=MR0GCF,=MR0GGG,=MR0GGI,=MR0GOR,=MR0HAI,=MR0HVU,=MR0OIL,=MR0POD,=MR0PSL,=MR0RDM,
#    =MR0SGQ,=MR0SJT,=MR0TAI,=MR0TSG,=MR0TSS,=MR0VTV,=MR0WEI,=MR0XAF,=MR0XXP,=MR0XXW,=MR1AWV,=MR1HMV,
#    =MR1JWF,=MR1VTB,=MR3AWA,=MR3AWD,=MR3BRR,=MR3PTS,=MR3UIX,=MR3UVL,=MR3WJZ,=MR3XGP,=MR3YHA,=MR3YPH,
#    =MR3ZCS,=MR5PSL,=MR6AHB,=MR6ARN,=MR6ATU,=MR6CHM,=MR6CTH,=MR6CTL,=MR6HFC,=MR6MCV,=MR6RLL,=MR6SSI,
#    =MR6TMS,=MV0DXH,=MV0FME,=MV0FMF,=MV0GHM,=MV0HAR,=MV0LGS,=MV0NFC,=MV0NJS,=MV0SGQ,=MV0SJT,=MV0XXW,
#    =MV1VTB,=MV3BRR,=MV3CVB,=MV3YHA,=MV3YMU,=MV5PSL,=MV6BJJ,=MV6KSJ,=MV6NRQ;
#Guernsey:                 14:  27:  EU:   49.45:     2.58:     0.0:  GU:
#    2U,GP,GU,MP,MU,=2O0FER,=2Q0ARE,=2Q0FER,=2U0ARE/2K,=GB0HAM,=GB0SRK,=GB0U,=GB19CG,=GB2AFG,=GB2FG,
#    =GB2GU,=GB2JTA,=GB4SGG,=GB50GSY,=GO8FBO,=GQ8FBO,=GU0DXX/2K,=GU4GG/2K,=MO0FAL,=MO0KWD,=MQ0FAL,
#    =MR0FAL,=MU/OT9Z/LH;
#Wales:                    14:  27:  EU:   52.28:     3.73:     0.0:  GW:
#    2W,GC,GW,MC,MW,=2O0CDY,=2O0CGM,=2O0CJI,=2O0CVE,=2O0DAA,=2O0DUL,=2O0DVP,=2O0IDT,=2O0JBJ,=2O0OJA,
#    =2O0RMR,=2O0RWF,=2O0TRR,=2O0UAA,=2O0WDS,=2O0ZJA,=2O12W,=2Q0CDY,=2Q0CGM,=2Q0CLJ,=2Q0CVE,=2Q0DAA,
#    =2Q0DAA/M,=2Q0IDT,=2Q0MKG,=2Q0OJA,=2Q0OTL,=2Q0RMR,=2Q0RWF,=2Q0SVW,=2Q0TRR,=2Q0UAA,=2Q0VAY,=2Q0WDS,
#    =2R0BRR,=2R0CDY,=2R0CDZ,=2R0CSS,=2R0CVE,=2R0DRB,=2R0IDT,=2R0OJA,=2R0PHP,=2R0PJP,=2R0REX,=2R0RWF,
#    =2R0TRR,=2R0TYG,=2R0XTP,=2R0YKK,=2R3SFC,=2V0CDY,=2V0CGM,=2V0CLJ,=2V0CVL,=2V0DAA,=2V0DUN,=2V0GME,
#    =2V0GNG,=2V0KED,=2V0WDS,=2V1EPO,=GB0AAW,=GB0AD,=GB0ATM,=GB0AWE,=GB0AWS,=GB0BHR,=GB0BP,=GB0BRE,
#    =GB0BTB,=GB0BVL,=GB0BYL,=GB0CAC,=GB0CCE,=GB0CEW,=GB0CFD,=GB0CGG,=GB0CLC,=GB0CQD,=GB0CSA,=GB0CSR,
#    =GB0CTK,=GB0CVA,=GB0DFD,=GB0DMT,=GB0DS,=GB0DVP,=GB0EUL,=GB0FHD,=GB0FHI,=GB0GDD,=GB0GIW,=GB0GLV,
#    =GB0GMD,=GB0GRM,=GB0HEL,=GB0HGC,=GB0HLT,=GB0HMM,=GB0HMT,=GB0KF,=GB0L,=GB0LBG,=GB0LM,=GB0LVF,
#    =GB0MFH,=GB0MIW,=GB0ML,=GB0MPA,=GB0MSB,=GB0MUU,=GB0MWL,=GB0NAW,=GB0NEW,=GB0NG,=GB0NLC,=GB0PBR,
#    =GB0PEM,=GB0PGG,=GB0PLB,=GB0PLL,=GB0PSG,=GB0RME,=GB0ROC,=GB0RPO,=GB0RS,=GB0RSC,=GB0RSF,=GB0RWM,
#    =GB0SCB,=GB0SDD,=GB0SGC,=GB0SH,=GB0SH/LH,=GB0SOA,=GB0SPE,=GB0SPS,=GB0TD,=GB0TL,=GB0TPR,=GB0TS,
#    =GB0TTT,=GB0VCA,=GB0VK,=GB0WHH,=GB0WHR,=GB0WIW,=GB0WUL,=GB0YG,=GB100AB,=GB100BP,=GB100CSW,
#    =GB100GGC,=GB100GGM,=GB100HD,=GB100LB,=GB100LSG,=GB100MCV,=GB100TMD,=GB10SOTA,=GB19CGW,=GB19CW,
#    =GB19SG,=GB1AD,=GB1ATC,=GB1BAF,=GB1BGS,=GB1BPL,=GB1BSW,=GB1BW,=GB1CCC,=GB1CDS,=GB1CPG,=GB1DS,
#    =GB1FHS,=GB1HAS,=GB1HTW,=GB1JC,=GB1LSG,=GB1LW,=GB1OOC,=GB1PCA,=GB1PCS,=GB1PD,=GB1PGW,=GB1PJ,
#    =GB1PLL,=GB1SEA,=GB1SL,=GB1SPN,=GB1SSL,=GB1TDS,=GB1WAA,=GB1WIW,=GB1WSM,=GB2000SET,=GB2003SET,
#    =GB200HNT,=GB200TT,=GB250TMB,=GB250TT,=GB2ADU,=GB2BEF,=GB2BGG,=GB2BOM,=GB2BOW,=GB2BPM,=GB2BYF,
#    =GB2CC,=GB2CI,=GB2COB,=GB2CR,=GB2CRS,=GB2DWR,=GB2EI,=GB2FC,=GB2FLB,=GB2GGM,=GB2GLS,=GB2GOL,
#    =GB2GSG,=GB2GVA,=GB2HDG,=GB2HMM,=GB2IMD,=GB2LBR,=GB2LM,=GB2LNP,=GB2LSA,=GB2LSA/LH,=GB2LSH,=GB2MD,
#    =GB2MGY,=GB2MIL,=GB2MLM,=GB2MMC,=GB2MOP,=GB2NF,=GB2NPH,=GB2NPL,=GB2OOA,=GB2ORM,=GB2PRC,=GB2RFS,
#    =GB2RSG,=GB2RTB,=GB2SAC,=GB2SCC,=GB2SCD,=GB2SCP,=GB2SFM,=GB2SIP,=GB2SLA,=GB2TD,=GB2TD/LH,=GB2TTA,
#    =GB2VK,=GB2WAA,=GB2WHO,=GB2WNA,=GB2WSF,=GB2WT,=GB3HLS,=GB3LMW,=GB4ADU,=GB4AFS,=GB4AOS,=GB4BB,
#    =GB4BIT,=GB4BOJ,=GB4BPL,=GB4BPL/LH,=GB4BPL/P,=GB4BPR,=GB4BRS/P,=GB4BSG,=GB4CI,=GB4CTC,=GB4EUL,
#    =GB4FAA,=GB4GM,=GB4GSS,=GB4HFH,=GB4HI,=GB4HLB,=GB4HMD,=GB4HMM,=GB4MBC,=GB4MD,=GB4MDH,=GB4MDI,
#    =GB4MJS,=GB4MPI,=GB4MUU,=GB4NDG,=GB4NPL,=GB4NTB,=GB4ON,=GB4OST,=GB4PAT,=GB4PCS,=GB4PD,=GB4POW,
#    =GB4RC,=GB4RME,=GB4RSL,=GB4SDD,=GB4SLC,=GB4SSP,=GB4SUB,=GB4TMS,=GB4UKG,=GB4VJD,=GB4WT,=GB4WWI,
#    =GB4XT,=GB50ABS,=GB50EVS,=GB50RSC,=GB50SGP,=GB5AC,=GB5FI,=GB5GEO,=GB5IMD,=GB5MD,=GB5ONG,=GB5PSJ,
#    =GB5SIP,=GB5WT,=GB60ATG,=GB60DITP,=GB60ER,=GB60PW,=GB60SPS,=GB60VLY,=GB65BTF,=GB6AC,=GB6BLB,
#    =GB6CRI,=GB6GGM,=GB6OQA,=GB6ORA,=GB6PLB,=GB6RNLI,=GB6SPD,=GB6TS,=GB6TSG,=GB6WT,=GB6WWT,=GB70BTF,
#    =GB750CC,=GB75ATC,=GB75BB,=GB8CCC,=GB8HI,=GB8MD,=GB8MG,=GB8ND,=GB8OAE,=GB8OQE,=GB8RAF,=GB8WOW,
#    =GB8WT,=GB90RSGB/62,=GB90RSGB/72,=GB9GGM,=GC4BRS/LH,=GG100ACD,=GG100ANG,=GG100CPG,=GG100RGG,
#    =GG100SG,=GO0DIV,=GO0EZQ,=GO0EZY,=GO0JEQ,=GO0MNP,=GO0MNP/P,=GO0NPL,=GO0PLB,=GO0PNI,=GO0PUP,
#    =GO0VKW,=GO0VML,=GO0VSW,=GO1DPL,=GO1IOT,=GO1JFV,=GO1MVL,=GO1PKM,=GO3PLB,=GO3UOF,=GO3UOF/M,=GO3XJQ,
#    =GO4BKG,=GO4BLE,=GO4CQZ,=GO4DTQ,=GO4GTI,=GO4JKR,=GO4JUN,=GO4JUW,=GO4MVA,=GO4NOO,=GO4OKT,=GO4SUE,
#    =GO4SUE/P,=GO4TNZ,=GO4WXM,=GO6IMS,=GO6NKG,=GO6UKO,=GO7DWR,=GO7SBO,=GO7VJK,=GO7VQD,=GO8BQK,=GO8IQC,
#    =GO8JOY,=GO8OKR,=GQ0ANA,=GQ0DIV,=GQ0JEQ,=GQ0JRF,=GQ0MNO,=GQ0MNP,=GQ0NPL,=GQ0PUP,=GQ0RYT,=GQ0SLM,
#    =GQ0TQM,=GQ0VKW,=GQ0VML,=GQ0VSW,=GQ0WVL,=GQ1FKY,=GQ1FOA/P,=GQ1IOT,=GQ1JFV,=GQ1MVL,=GQ1NRS,=GQ1WRV,
#    =GQ1ZKN,=GQ3IRK,=GQ3PLB,=GQ3SB,=GQ3UOF,=GQ3VEN,=GQ3VKL,=GQ3WSU,=GQ3XJA,=GQ3XJQ,=GQ4BKG,=GQ4BLE,
#    =GQ4CQZ,=GQ4EZW,=GQ4GSH,=GQ4GTI,=GQ4IIL,=GQ4JKR,=GQ4JUN,=GQ4JUW,=GQ4LZP,=GQ4MVA,=GQ4NOO,=GQ4OKT,
#    =GQ4SUE,=GQ4VNS,=GQ4VZJ,=GQ4WXM,=GQ4WXM/P,=GQ6IMS,=GQ6ITJ,=GQ6NKG,=GQ6UKO,=GQ7BQK,=GQ7DWR,=GQ7FBV,
#    =GQ7SBO,=GQ7UNJ,=GQ7UNV,=GQ7VJK,=GQ7VQD,=GQ8BQK,=GQ8IQC,=GQ8JOY,=GQ8OKR,=GR0ANA,=GR0DIV,=GR0DSP,
#    =GR0HUS,=GR0JEQ,=GR0MYY,=GR0NPL,=GR0PSV,=GR0RYT,=GR0SYN,=GR0TKX,=GR0VKW,=GR0WGK,=GR1FJI,=GR1HNG,
#    =GR1LFX,=GR1LHV,=GR1MCD,=GR1SGG,=GR1WVY,=GR1YQM,=GR3SB,=GR3SFC,=GR3TKH,=GR3UOF,=GR3XJQ,=GR4BKG,
#    =GR4BLE,=GR4CQZ,=GR4GNY,=GR4GTI,=GR4HZA,=GR4JUN,=GR4JUW,=GR4OGO,=GR4SUE,=GR4VSS/P,=GR4XXJ,=GR4ZOM,
#    =GR5PH,=GR6NKG,=GR6SIX,=GR6STK,=GR6UKO,=GR6ZDH,=GR7AAV,=GR7HOC,=GR7NAU,=GR7TKZ,=GR7UNV,=GR7VQD,
#    =GR8BQK,=GR8IQC,=GR8OGI,=GR8TRO,=GV0ANA,=GV0DCK,=GV0DIV,=GV0EME,=GV0FRE,=GV0MNP,=GV0NPL,=GV1FKY,
#    =GV1IOT,=GV1JFV,=GV1NBW,=GV1YQM,=GV3ATZ,=GV3TJE/P,=GV3UOF,=GV3WEZ,=GV3XJQ,=GV4BKG,=GV4BRS,=GV4CQZ,
#    =GV4JKR,=GV4JQP,=GV4NQJ,=GV4PUC,=GV6BRC,=GV6JPC,=GV6NKG,=GV7UNV,=GV7VJK,=GV8IQC,=GW0AWT/2K,
#    =GW0GEI/2K,=GW0GIH/2K,=GW0MNO/2K,=GW0VSW/2K,=GW3JXN/2K,=GW3KJN/2K,=GW4IIL/2K,=GW4VHP/2K,
#    =M2000Y/97A,=MO0AQZ,=MO0ATI,=MO0COE,=MO0CVT,=MO0EQL,=MO0EZQ,=MO0GXE,=MO0HCX,=MO0IBZ,=MO0IML,
#    =MO0KLW,=MO0LDJ,=MO0LLK,=MO0LUK,=MO0LZZ,=MO0MAU,=MO0MUM,=MO0MWZ,=MO0OWW,=MO0SGD,=MO0SGR,=MO0TBB,
#    =MO0TMI,=MO0TTU,=MO0UPH,=MO0VVO,=MO1CFA,=MO1CFN,=MO3DAO,=MO3DQB,=MO3GKI,=MO3OJA,=MO3PUU,=MO3RNI,
#    =MO3UEZ,=MO3WPH,=MO3YVO,=MO3ZCO,=MO6DVP,=MO6GWK,=MO6GWR,=MO6GWR/P,=MO6MAU,=MO6PAM,=MO6PLC,=MO6PUT,
#    =MO6SEF,=MO6TBD,=MO6TBP,=MO6WLB,=MQ0AQZ,=MQ0ATI,=MQ0AWW,=MQ0CDO,=MQ0CNA,=MQ0CVT,=MQ0DHF,=MQ0EQL,
#    =MQ0GXE,=MQ0GYV,=MQ0HCX,=MQ0IBZ,=MQ0IML,=MQ0LDJ,=MQ0LLK,=MQ0LUK,=MQ0LZZ,=MQ0MAU,=MQ0MUM,=MQ0MWA,
#    =MQ0MWZ,=MQ0OWW,=MQ0PAD,=MQ0RHD,=MQ0SGD,=MQ0SGR,=MQ0TBB,=MQ0TMI,=MQ0TTU,=MQ0UPH,=MQ0UPH/P,=MQ0VVO,
#    =MQ0XMC/P,=MQ1CFA,=MQ1CFN,=MQ1EYO/P,=MQ1LCR,=MQ3DAO,=MQ3EPA,=MQ3GKI,=MQ3JAT,=MQ3NDB,=MQ3OJA,
#    =MQ3USK,=MQ3WPH,=MQ3ZCB/P,=MQ5AND,=MQ5EPA,=MQ5VZW,=MQ6DVP,=MQ6KLL,=MQ6MAU,=MQ6PAM,=MQ6PLC,=MQ6RHD,
#    =MQ6SEF,=MQ6TBD,=MQ6TBP,=MR0AQZ,=MR0BXJ,=MR0CVT,=MR0GUK,=MR0GXE,=MR0IDX,=MR0JGE,=MR0LAO,=MR0LDJ,
#    =MR0MAU,=MR0RLD,=MR0TTR,=MR0TTU,=MR0YAD,=MR0ZAP,=MR1CFN,=MR1EAA,=MR1LCR,=MR1MAJ/P,=MR1MDH,=MR3AVB,
#    =MR3AVC,=MR3CBF,=MR3NYR,=MR3OBL,=MR3SET/P,=MR3UFN,=MR3XZP,=MR3YKL,=MR3YLO,=MR3YVO,=MR3ZCB/P,
#    =MR5HOC,=MR6ADZ,=MR6KDA,=MR6VHF,=MR6YDP,=MV0AEL,=MV0BLM,=MV0EDX,=MV0GWT,=MV0GXE,=MV0HGY/P,=MV0IML,
#    =MV0LLK,=MV0PJJ,=MV0PJJ/P,=MV0RRD,=MV0SGD,=MV0SGR,=MV0TBB,=MV0TDQ,=MV0UAA,=MV0USK,=MV0VRQ,=MV0WYN,
#    =MV1CFA,=MV1CFN,=MV1EYP/P,=MV3RNI,=MV6CQN,=MV6GWR,=MV6GWR/P,=MV6URC,=MV6ZOL,=MW0CND/2K,=MW0DHF/LH,
#    =MW5AAM/2K,=MW5GOL/LH;
#Solomon Islands:          28:  51:  OC:   -9.00:  -160.00:   -11.0:  H4:
#    H4,=H40/H44RK;
#Temotu Province:          32:  51:  OC:  -10.72:  -165.80:   -11.0:  H40:
#    H40;
#Hungary:                  15:  28:  EU:   47.12:   -19.28:    -1.0:  HA:
#    HA,HG,
#    =HA3FPI/YL,
#    =HA5BA/YL,=HA5FQ/J,=HA5FQ/JOTA,=HA5YA/YL,=HA5YG/YL,=HG4I/LH;
#Switzerland:              14:  28:  EU:   46.87:    -8.12:    -1.0:  HB:
#    HB,HE,=4U0G,=4U1AIDS,=4U1G,=HB9DAR/LH,=HB9DDZ/LH,=HB9DLO/LH,=HB9DWR/LH,=HB9OMI/LH,=HE1G/LGT;
#Liechtenstein:            14:  28:  EU:   47.13:    -9.57:    -1.0:  HB0:
#    HB0,HE0;
#Ecuador:                  10:  12:  SA:   -1.40:    78.40:     5.0:  HC:
#    HC,HD,
#    =HC8GET/2;
#Galapagos Islands:        10:  12:  SA:   -0.78:    91.03:     6.0:  HC8:
#    HC8,HD8,=HC1HC/8,=HC2ANT/8,=HC2AO/8,=HC2AQ/8,=HC2IWM/8,=HC2OGT/8,=HC2RAT/8,=HC2RCT/8,=HC2RMT/8,
#    =HC2WAT/8,=HD9IWH/8;
#Haiti:                    08:  11:  NA:   19.02:    72.18:     5.0:  HH:
#    4V,HH;
#Dominican Republic:       08:  11:  NA:   19.13:    70.68:     4.0:  HI:
#    HI;
#Colombia:                 09:  12:  SA:    5.00:    74.00:     5.0:  HK:
#    5J,5K,HJ,HK,
#    =HK0GU/1,
#    =HK0GU/3;
#San Andres & Providencia: 07:  11:  NA:   12.55:    81.72:     5.0:  HK0/a:
#    5J0,5K0,HJ0,HK0,=HK3ARR/0,=HK3OSA/0,
#    =HK3JJH/0,
#    =HK3JJH/0A(8),=HK3JJH/HK0A(8),
#    =HK3JJH/0B;
#Malpelo Island:           09:  12:  SA:    3.98:    81.58:     5.0:  HK0/m:
#    HJ0M,HK0M,=HK0NA,=HK0TU,=HK3JJH/0M,=HK5MQZ/0,=HK5MQZ/0M,=HK5QGX/0,=HK5QGX/0M;
#Republic of Korea:        25:  44:  AS:   36.23:  -127.90:    -9.0:  HL:
#    6K,6L,6M,6N,D7,D8,D9,DS,DT,HL,KL9K,=6K50ACS/C,=DS50ARN/C,=DS50CYI/C,=DS50DBF/H,=DS50EXX/E,
#    =DS50GOO/C,=DS50HWS/E,=DS50KJR/L;
#Panama:                   07:  11:  NA:    9.00:    80.00:     5.0:  HP:
#    3E,3F,H3,H8,H9,HO,HP,
#    =HP2TP/LH;
#Honduras:                 07:  11:  NA:   15.00:    87.00:     6.0:  HR:
#    HQ,HR;
#Thailand:                 26:  49:  AS:   12.60:   -99.70:    -7.0:  HS:
#    E2,HS;
#Vatican City:             15:  28:  EU:   41.90:   -12.47:    -1.0:  HV:
#    HV,=HV50VR/IMD;
#Saudi Arabia:             21:  39:  AS:   24.20:   -43.83:    -3.0:  HZ:
#    7Z,8Z,HZ,=7Z1AL/ND,=7Z1AQ/ND,=7Z1BL/ND,=7Z1CQ/ND,=7Z1SJ/ND,=7Z1SS/M/ND,=7Z1TT/ND,=7Z1UG/ND,
#    =HZ1AN/ND,=HZ1BH/ND,=HZ1BL/ND,=HZ1BO/ND,=HZ1BT/ND,=HZ1BW/ND,=HZ1BW/ND/M,=HZ1CH/ND,=HZ1DG/ND,
#    =HZ1EA/ND,=HZ1FL/ND,=HZ1HN/M/ND,=HZ1HN/ND,=HZ1MD/ND,=HZ1MX/ND,=HZ1SBS/J,=HZ1SBS/JOTA,=HZ1SBS/ND,
#    =HZ1SK/ND,=HZ1TL/ND,=HZ1TT/ND,=HZ1XB/ND,=HZ1ZH/ND;
#Italy:                    15:  28:  EU:   42.82:   -12.58:    -1.0:  I:
#    I,=II0PN/MM(40),=II1RT/N,
#    =4U0WFP,=4U4F,=4U5F,=4U6F,=4U7F,=4U7FOC,=4U80FOC,=4U8F,=4U8FOC,=II0IDR/NAVY,=IK0ATK/N,=IK0CNA/LH,
#    =IK0JFS/N,=IK0XFD/N,=IQ0AP/J,=IQ0CV/LH,=IQ0FM/LH,=IQ0FR/LH,=IQ0GV/AAW,=IR0BP/J,=IU0FSC/LH,
#    =IW0HP/N,=IW9GSH/0,=IZ0BXZ/N,=IZ0DBA/N,=IZ0EGC/N,=IZ0FVD/N,=IZ0HTW/PS,=IZ0HTW/SP,=IZ0IAT/LH,
#    =IZ0IJC/FF,=IZ0IJC/N,
#    =I1MQ/N,=I1ULJ/N,=I1XSG/N,=I1YRL/GRA,=II1PV/LH,=IK1RED/N,=IK1VDN/N,=IP1T/LH,=IQ1L/LH,=IQ1NM/REX,
#    =IQ1SP/N,=IU1LCI/EMG,=IY1SP/ASB,=IY1SP/MTN,=IZ0IJC/BSM,=IZ1CLA/N,=IZ1ESH/EMG,=IZ1FCF/N,
#    =IZ1GDB/EMG,=IZ1POA/N,=IZ1RGI/ECO,=IZ5GST/1/LH,
#    =I2AZ/CA,=I2AZ/N,=I2CZQ/N,=IK2CZQ/N,=IK2FIQ/N,=IK2MKM/EXPO,=IK2SOE/CA,=IK2SOE/N,=IQ2LB/EXPO,
#    =IQ2MI/J,=IW2NUY/N,=IZ2MYA/EXPO,
#    =I3GJJ/J,=I3TXQ/N,=IK3TZB/N,=IQ3DD/MCC,=IQ3FL/J,=IQ3TS/LH,=IW3BSQ/LH,=IZ3DBA/N,=IZ3GHP/N,
#    =IZ3QCH/N,=IZ3SZQ/N,
#    =I4CQO/N,=II4CPG/LH,=II4GOR/LH,=IQ4FA/J,=IQ4FJ/J,=IQ4RA/LH,=IQ4RN/LGT,=IQ4RN/LH,=IT9RGY/4,
#    =IW4EGX/LH,=IZ4AIH/J,
#    =I5OYY/N,=II5BP/J,=IK5IWU/N,=IK5TSZ/N,=IP5P/LH,=IQ5AA/J,=IQ5AE/J,=IQ5LI/J,=IQ5LV/J,=IU5JHK/J,
#    =IW5DAX/J,=IZ5AHB/N,
#    =I6DHY/CASA,=I6FDJ/LH,=I6FDJ/N,=I6HWD/CA,=I6HWD/LH,=I6KIU/6/LH,=IK6FAW/J,=IK6XOU/LH,=IK6XUL/LH,
#    =IK6YXM/N,=IQ6FU/LH,=IQ6PS/LH,=IQ6SB/LGH,=IQ6SB/LGT,=IQ6SB/LH,=IQ6VP/J,=IZ6ASI/LH,=IZ6ASI/N,
#    =IZ6CDI/O,=IZ6RWD/O,=IZ6TGS/LH,=IZ6TGS/N,
#    =4U13FEB,=4U1GSC,=4U20B,=4U24OCT,=4U25B,=4U29MAY,=4U73B,=I7PXV/LH,=I7PXV/P/LH,=I7XUW/MI/224,
#    =II7IAOI/N,=II7PT/C,=II7PT/D,=II7PT/E,=II7PT/F,=II7PT/G,=II7PT/H,=II7PT/L,=II8ICN/NAVY,=IK7JWX/LH,
#    =IK7SHC/MT,=IQ7ML/J,=IQ7ML/LH,=IQ7QK/LH,=IU7SCT/J,=IZ2DPX/7/LH,=IZ7DKA/YL,=IZ7KDX/LH,=IZ7LDC/LH,
#    =IK2RLS/8/LH,=IK8IJN/I/US,=IK8TEO/N,=IQ8OM/N,=IQ8PC/BWL,=IQ8XS/CEU,=IT9AAK/8,=IU8CEU/8CZ,
#    =IW8FFG/J,=IZ8AJQ/LGT,=IZ8AJQ/LH,=IZ8DBJ/LGT,=IZ8DBJ/LH,=IZ8FMU/KR,=IZ8IZK/YL,=IZ8JPV/N,=IZ8QNX/N,
#    =IA5/IW3ILP/L,
#    =IC8/DJ5AA/LH,
#    =IN3IKF/J,=IN3TJK/YL,
#    =II3T/LH,=IQ3TS/LGT,=IQ3V/LH,=IV3TRK/N;
#African Italy:            33:  37:  AF:   35.67:   -12.67:    -1.0:  *IG9:
#    IG9,IH9,=IO9Y,=IY9A;
#Sardinia:                 15:  28:  EU:   40.15:    -9.27:    -1.0:  IS:
#    IM0,IS,IW0U,IW0V,IW0W,IW0X,IW0Y,IW0Z,=II0C,=II0EUDX,=II0FDR,=II0IAML,=II0ICH,=II0IDP,=II0M,
#    =II0MQP,=II0P,=II0PAX,=II0RSB,=II0SB,=II0SB/MM,=II0SRE,=II0SRT/P,=II3EUDX,=IQ0AG,=IQ0AG/P,=IQ0AH,
#    =IQ0AH/P,=IQ0AI,=IQ0AI/P,=IQ0AK,=IQ0AK/P,=IQ0AL,=IQ0AL/P,=IQ0AM,=IQ0AM/P,=IQ0EH,=IQ0EH/P,=IQ0HO,
#    =IQ0ID,=IQ0ID/P,=IQ0NU,=IQ0NU/P,=IQ0NV,=IQ0NV/P,=IQ0OG,=IQ0OH,=IQ0QP,=IQ0QP/LH,=IQ0QP/P,=IQ0SS,
#    =IQ0SS/P,=IQ0US,=IQ0UT,=IQ0XP,=IR0EO,=IR0FOC,=IR0IDP,=IR0IDP/1,=IR0IDP/2,=IR0IDP/3,=IR0LVC,
#    =IR0MDC,=IS0/4Z5KJ/LH,=IS0/DL5SE/LH,=IS0ICE/N,=IS0IGV/N,=IS0PGF/N,=IS0SDX/N,=IW0HRI,=IY0GA,=IY0NV;
#Sicily:                   15:  28:  EU:   37.50:   -14.00:    -1.0:  *IT9:
#    IB9,ID9,IE9,IF9,II9,IJ9,IO9,IQ9,IR9,IT9,IU9,IW9,IY9,=II0GDF/9,=IQ1QQ/9,=IT9CHU/J,=IT9CKA/CA,
#    =IT9CLY/JZK,=IT9DSA/CA,=IT9DTU/N,=IT9GDS/WLK,=IT9HBS/LH,=IT9JZK/WLK,=IT9KKE/JZK,=IT9MRM/N,
#    =IT9MRZ/LH,=IT9NCO/LH,=IT9NCO/N,=IT9OTF/JZK,=IT9RRU/LH,=IT9RYH/J,=IT9RYH/N,=IT9ZSB/LH,=IW0HBY/9;
#Djibouti:                 37:  48:  AF:   11.75:   -42.35:    -3.0:  J2:
#    J2;
#Grenada:                  08:  11:  NA:   12.13:    61.68:     4.0:  J3:
#    J3;
#Guinea-Bissau:            35:  46:  AF:   12.02:    14.80:     0.0:  J5:
#    J5;
#St. Lucia:                08:  11:  NA:   13.87:    61.00:     4.0:  J6:
#    J6,=J69DS/LH;
#Dominica:                 08:  11:  NA:   15.43:    61.35:     4.0:  J7:
#    J7;
#St. Vincent:              08:  11:  NA:   13.23:    61.20:     4.0:  J8:
#    J8;
#Japan:                    25:  45:  AS:   36.40:  -138.38:    -9.0:  JA:
#    7J,7K,7L,7M,7N,8J,8K,8L,8M,8N,JA,JE,JF,JG,JH,JI,JJ,JK,JL,JM,JN,JO,JP,JQ,JR,JS,=7N2DAB/LH,
#    =JO1ZYB/L,
#    =7N4RHO/BM,=JE1LET/AE3RM,=JE1LET/VK3SS,=JE1XUZ/YOTA,=JH1NBN/DF2OO,=JH1NBN/DL1BD,
#    =JQ2UXA/YL,
#    =JD1BHH/6;
#Minami Torishima:         27:  90:  OC:   24.28:  -153.97:   -10.0:  JD/m:
#    =8J1ZIU/JD1,=8N1AQ/JD1,=JA6GXK/JD1,=JD1/8J1ZIU,=JD1/8N1AQ,=JD1/JA6GXK,=JD1/JD1BIC,=JD1/JD1BNA,
#    =JD1/JD1YAB,=JD1/JE6XPF,=JD1/JF3CTR,=JD1/JF8HIQ,=JD1/JG1RHN,=JD1/JG8NQJ,=JD1/JH1EFP,=JD1/JI2AMA,
#    =JD1/JK1PCN,=JD1/JR8XXQ,=JD1BCK,=JD1BIC/JD1,=JD1BME,=JD1BMM,=JD1BNA/JD1,=JD1BND,=JD1M/JI2AMA,
#    =JD1YAA,=JD1YAB/JD1,=JD1YBJ,=JF3CTR/JD1,=JF8HIQ/JD1,=JG1RHN/JD1,=JG8NQJ/JD1,=JH1EFP/JD1,
#    =JI2AMA/JD1,=JK1PCN/JD1,=JR8XXQ/JD1;
#Ogasawara:                27:  45:  AS:   27.05:  -142.20:    -9.0:  JD/o:
#    JD1,=8N1OGA,=JR7ISY/JD1/CM;
#Mongolia:                 23:  32:  AS:   46.77:  -102.17:    -7.0:  JT:
#    JT,JU,JV,
#    JT2[33],JU2[33],JV2[33],
#    JT3[33],JU3[33],JV3[33];
#Svalbard:                 40:  18:  EU:   78.00:   -16.00:    -1.0:  JW:
#    JW;
#Bear Island:              40:  18:  EU:   74.43:   -19.08:    -1.0:  *JW/b:
#    =JW/LB2PG,=JW0BEA,=JW1I,=JW2US,=JW2VOA,=JW3FL,=JW4GHA,=JW4JSA,=JW4LN,=JW5RIA,=JW7VW,=JW9JKA;
#Jan Mayen:                40:  18:  EU:   71.05:     8.28:     1.0:  JX:
#    JX;
#Jordan:                   20:  39:  AS:   31.18:   -36.42:    -2.0:  JY:
#    JY;
#United States:            05:  08:  NA:   37.53:    91.67:     5.0:  K:
#    AA,AB,AC,AD,AE,AF,AG,AI,AJ,AK,K,N,W,=AH3D,=NH7RO/M,
#    AA0(4)[7],AB0(4)[7],AC0(4)[7],AD0(4)[7],AE0(4)[7],AF0(4)[7],AG0(4)[7],AI0(4)[7],AJ0(4)[7],
#    AK0(4)[7],K0(4)[7],KA0(4)[7],KB0(4)[7],KC0(4)[7],KD0(4)[7],KE0(4)[7],KF0(4)[7],KG0(4)[7],
#    KI0(4)[7],KJ0(4)[7],KK0(4)[7],KM0(4)[7],KN0(4)[7],KO0(4)[7],KQ0(4)[7],KR0(4)[7],KS0(4)[7],
#    KT0(4)[7],KU0(4)[7],KV0(4)[7],KW0(4)[7],KX0(4)[7],KY0(4)[7],KZ0(4)[7],N0(4)[7],NA0(4)[7],
#    NB0(4)[7],NC0(4)[7],ND0(4)[7],NE0(4)[7],NF0(4)[7],NG0(4)[7],NI0(4)[7],NJ0(4)[7],NK0(4)[7],
#    NM0(4)[7],NN0(4)[7],NO0(4)[7],NQ0(4)[7],NR0(4)[7],NS0(4)[7],NT0(4)[7],NU0(4)[7],NV0(4)[7],
#    NW0(4)[7],NX0(4)[7],NY0(4)[7],NZ0(4)[7],W0(4)[7],WA0(4)[7],WB0(4)[7],WC0(4)[7],WD0(4)[7],
#    WE0(4)[7],WF0(4)[7],WG0(4)[7],WI0(4)[7],WJ0(4)[7],WK0(4)[7],WM0(4)[7],WN0(4)[7],WO0(4)[7],
#    WQ0(4)[7],WR0(4)[7],WS0(4)[7],WT0(4)[7],WU0(4)[7],WV0(4)[7],WW0(4)[7],WX0(4)[7],WY0(4)[7],
#    WZ0(4)[7],=AH2BW(4)[7],=AH2BY(4)[7],=AH6ES/0(4)[7],=AH6FY(4)[7],=AH6MD(4)[7],=AH6N(4)[7],
#    =AH6N/0(4)[7],=AH6O(4)[7],=AH6OS(4)[7],=AH6PC(4)[7],=AH6RS(4)[7],=AL0G(4)[7],=AL1VE/R(4)[7],
#    =AL3E(4)[7],=AL3V(4)[7],=AL6E(4)[7],=AL7BX(4)[7],=AL7EK(4)[7],=AL7FU(4)[7],=AL7GQ(4)[7],
#    =AL7NY(4)[7],=AL7O/0(4)[7],=AL7OC(4)[7],=AL7OX(4)[7],=AL7QQ(4)[7],=AL7QQ/P(4)[7],=AL9DB(4)[7],
#    =KH0EX(4)[7],=KH2CZ(4)[7],=KH2FM(4)[7],=KH2JK(4)[7],=KH2OP(4)[7],=KH2OP/0(4)[7],=KH2SL(4)[7],
#    =KH6DM(4)[7],=KH6GN(4)[7],=KH6HNL(4)[7],=KH6HTV(4)[7],=KH6HTV/0(4)[7],=KH6JEM(4)[7],=KH6JFH(4)[7],
#    =KH6NM(4)[7],=KH6NR(4)[7],=KH6RON(4)[7],=KH6SB(4)[7],=KH6TL(4)[7],=KH6UC(4)[7],=KH6VHF(4)[7],
#    =KH6VO(4)[7],=KH7AL/M(4)[7],=KH7AL/P(4)[7],=KH7BU(4)[7],=KH7GF(4)[7],=KH7HA(4)[7],=KH7HY(4)[7],
#    =KH7QI(4)[7],=KH7QJ(4)[7],=KH7QT(4)[7],=KH8CW(4)[7],=KL0DW(4)[7],=KL0EQ(4)[7],=KL0FOX(4)[7],
#    =KL0GP(4)[7],=KL0GQ(4)[7],=KL0MW(4)[7],=KL0N(4)[7],=KL0SV(4)[7],=KL0UP(4)[7],=KL0VM(4)[7],
#    =KL0WIZ(4)[7],=KL0XN(4)[7],=KL1HT(4)[7],=KL1IF(4)[7],=KL1IF/M(4)[7],=KL1J(4)[7],=KL1LD(4)[7],
#    =KL1PV(4)[7],=KL1TU(4)[7],=KL1V/M(4)[7],=KL1VN(4)[7],=KL2A/0(4)[7],=KL2FU(4)[7],=KL2GR(4)[7],
#    =KL2QO(4)[7],=KL2SX(4)[7],=KL3LY(4)[7],=KL3MA(4)[7],=KL3MB(4)[7],=KL3MC(4)[7],=KL3MW(4)[7],
#    =KL3QS(4)[7],=KL3SM(4)[7],=KL3VN(4)[7],=KL4IY(4)[7],=KL4JN(4)[7],=KL7DE(4)[7],=KL7DTJ(4)[7],
#    =KL7ED(4)[7],=KL7EP(4)[7],=KL7EP/0(4)[7],=KL7GKY/0(4)[7],=KL7GLK(4)[7],=KL7GLK/0(4)[7],
#    =KL7GLK/B(4)[7],=KL7HR(4)[7],=KL7IXI(4)[7],=KL7JGJ(4)[7],=KL7JIE(4)[7],=KL7JIM(4)[7],
#    =KL7JR/0(4)[7],=KL7MH(4)[7],=KL7MV(4)[7],=KL7NW(4)[7],=KL7PE/M(4)[7],=KL7QW(4)[7],=KL7QW/0(4)[7],
#    =KL7RH(4)[7],=KL7RZ(4)[7],=KL7SB/0(4)[7],=KL7SFD(4)[7],=KL7UV(4)[7],=KL7XH(4)[7],=KL7YL(4)[7],
#    =KL7YY/0(4)[7],=KL7ZD(4)[7],=KL7ZT(4)[7],=KP4ATV(4)[7],=KP4MLF(4)[7],=KP4XZ(4)[7],=NH2LH(4)[7],
#    =NH6CF(4)[7],=NH6WF(4)[7],=NH7CY(4)[7],=NH7FI(4)[7],=NH7XM(4)[7],=NH7ZH(4)[7],=NL7AS(4)[7],
#    =NL7BU(4)[7],=NL7CO/M(4)[7],=NL7CQ(4)[7],=NL7CQ/0(4)[7],=NL7FF(4)[7],=NL7FU(4)[7],=NL7XT(4)[7],
#    =NL7XU(4)[7],=NP4AI(4)[7],=NP4AI/0(4)[7],=VE4AGT/M(4)[7],=VE4XC/M(4)[7],=WH2S(4)[7],=WH2Z(4)[7],
#    =WH6AKZ(4)[7],=WH6ANH(4)[7],=WH6BLT(4)[7],=WH6BUL(4)[7],=WH6BXD(4)[7],=WH6CTU(4)[7],=WH6CUE(4)[7],
#    =WH6CYM(4)[7],=WH6CZI(4)[7],=WH6CZU(4)[7],=WH6DCJ(4)[7],=WH6DUV(4)[7],=WH6EAE(4)[7],=WH6ENX(4)[7],
#    =WH6LR(4)[7],=WH6MS(4)[7],=WH6QS(4)[7],=WH7DA(4)[7],=WH7IR(4)[7],=WH7MZ(4)[7],=WH7PV(4)[7],
#    =WH9AAH(4)[7],=WL0JF(4)[7],=WL1ON(4)[7],=WL7AEC(4)[7],=WL7AJA(4)[7],=WL7ANY(4)[7],=WL7ATK(4)[7],
#    =WL7BRV(4)[7],=WL7BT(4)[7],=WL7CEG(4)[7],=WL7CLI(4)[7],=WL7CPW(4)[7],=WL7CQF(4)[7],=WL7CRT(4)[7],
#    =WL7CY(4)[7],=WL7J(4)[7],=WL7JB(4)[7],=WL7LZ(4)[7],=WL7LZ/M(4)[7],=WL7RV(4)[7],=WL7S(4)[7],
#    =WL7YM(4)[7],=WP2B/0(4)[7],=WP3QH(4)[7],=WP3Y(4)[7],=WP4BTQ(4)[7],=WP4GQR(4)[7],=WP4LC(4)[7],
#    =WP4NPV(4)[7],
#    =AH2V(5)[8],=AH2W(5)[8],=AH6BV(5)[8],=AL0A(5)[8],=AL1O(5)[8],=AL4V(5)[8],=AL6I(5)[8],=AL6L(5)[8],
#    =AL6M(5)[8],=AL7EL(5)[8],=AL7LV(5)[8],=AL7QS(5)[8],=AL8E(5)[8],=KH2AB(5)[8],=KH2BA(5)[8],
#    =KH2EH(5)[8],=KH6GR(5)[8],=KH6HZ(5)[8],=KH6IKI(5)[8],=KH6JKQ(5)[8],=KH6JUK(5)[8],=KH6RF(5)[8],
#    =KH6RF/1(5)[8],=KH6RF/M(5)[8],=KH7CD(5)[8],=KH7CD/1(5)[8],=KH8AC(5)[8],=KH8AC/1(5)[8],
#    =KL1OC(5)[8],=KL1T(5)[8],=KL1WD(5)[8],=KL2A/1(5)[8],=KL2DM(5)[8],=KL2GA(5)[8],=KL2IC(5)[8],
#    =KL2KL(5)[8],=KL3UX(5)[8],=KL3VA(5)[8],=KL7CE/1(5)[8],=KL7IOP(5)[8],=KL7IXX(5)[8],=KL7JHM(5)[8],
#    =KL7JJN(5)[8],=KL7JR/1(5)[8],=KL7JT(5)[8],=KL7LK(5)[8],=KL7USI/1(5)[8],=KL8DX(5)[8],=KP4AMC(5)[8],
#    =KP4ANG(5)[8],=KP4BLS(5)[8],=KP4BPR(5)[8],=KP4DGF(5)[8],=KP4EC/1(5)[8],=KP4G(5)[8],=KP4GVT(5)[8],
#    =KP4KWB(5)[8],=KP4MHG(5)[8],=KP4MR(5)[8],=KP4NBI(5)[8],=KP4NPL(5)[8],=KP4NW(5)[8],=KP4R(5)[8],
#    =KP4RCD(5)[8],=KP4ZEM(5)[8],=NH0H(5)[8],=NH6IH(5)[8],=NH6XW(5)[8],=NH6ZB(5)[8],=NL7AK(5)[8],
#    =NL7FJ(5)[8],=NL7FJ/1(5)[8],=NL7MO(5)[8],=NL7NJ(5)[8],=NL7OI(5)[8],=NL7OT(5)[8],=NL9H(5)[8],
#    =NP2FZ(5)[8],=NP2FZ/1(5)[8],=NP2GG(5)[8],=NP2PN(5)[8],=NP3IV(5)[8],=NP3LN(5)[8],=NP3WX(5)[8],
#    =NP4AO(5)[8],=NP4AZ(5)[8],=NP4ER(5)[8],=VE1BES/M(5)[8],=VE3CMB/M(5)[8],=VE4CCN/M(5)[8],
#    =WH0EWX(5)[8],=WH2B(5)[8],=WH6CT(5)[8],=WH6DSN(5)[8],=WH6EI(5)[8],=WH6FBH(5)[8],=WH6MY(5)[8],
#    =WH6SW(5)[8],=WH6SW/1(5)[8],=WH7TP(5)[8],=WL1B(5)[8],=WL7B(5)[8],=WL7CC(5)[8],=WL7CUP(5)[8],
#    =WL7CVD(5)[8],=WL7WO(5)[8],=WL7WO/1(5)[8],=WL7Z/1(5)[8],=WP2MG(5)[8],=WP3GN(5)[8],=WP3NN(5)[8],
#    =WP3QV(5)[8],=WP3QV/1(5)[8],=WP3WV(5)[8],=WP4AKE(5)[8],=WP4AZJ(5)[8],=WP4BC(5)[8],=WP4BF(5)[8],
#    =WP4CGI(5)[8],=WP4CJH(5)[8],=WP4JF(5)[8],=WP4KQ(5)[8],=WP4MKJ(5)[8],=WP4MMV(5)[8],=WP4MOC(5)[8],
#    =WP4NKW(5)[8],=WP4NUV(5)[8],=WP4NYY(5)[8],=WP4OIG(5)[8],=WP4OJK(5)[8],
#    =AH0BR(5)[8],=AH2AL(5)[8],=AH2O(5)[8],=AH6K(5)[8],=AL0Q(5)[8],=AL0Y(5)[8],=AL2O(5)[8],
#    =AL7RG(5)[8],=KH2CW(5)[8],=KH2P(5)[8],=KH2R(5)[8],=KH4AG(5)[8],=KH6ALN(5)[8],=KH6HFO(5)[8],
#    =KH6HO(5)[8],=KH7GA(5)[8],=KH7JO(5)[8],=KH7JO/2(5)[8],=KH7MX(5)[8],=KH7NE(5)[8],=KH8ZK(5)[8],
#    =KL0TV(5)[8],=KL0VD(5)[8],=KL0VE(5)[8],=KL0WV(5)[8],=KL1A/2(5)[8],=KL1LA(5)[8],=KL2A/2(5)[8],
#    =KL2NP(5)[8],=KL2TP(5)[8],=KL3ET(5)[8],=KL3ZC(5)[8],=KL4T(5)[8],=KL7DL(5)[8],=KL7GB(5)[8],
#    =KL7JCQ(5)[8],=KL7NL/2(5)[8],=KL7TJZ(5)[8],=KL7USI/2(5)[8],=KL7WA(5)[8],=KL9ER(5)[8],=KP2NP(5)[8],
#    =KP3AK(5)[8],=KP3LM(5)[8],=KP3Y(5)[8],=KP4AK(5)[8],=KP4CML(5)[8],=KP4GEG(5)[8],=KP4HR(5)[8],
#    =KP4I(5)[8],=KP4JDR(5)[8],=KP4JMP(5)[8],=NH2DC(5)[8],=NH7NA(5)[8],=NH7TN(5)[8],=NL7CC(5)[8],
#    =NL7JY(5)[8],=NP2AQ(5)[8],=NP2GI(5)[8],=NP3D(5)[8],=NP3E(5)[8],=NP3EU(5)[8],=NP3I(5)[8],
#    =NP3KH(5)[8],=NP3KP(5)[8],=NP4H(5)[8],=NP4IR(5)[8],=NP4IT(5)[8],=NP4JQ(5)[8],=WH0W(5)[8],
#    =WH2C(5)[8],=WH6DLD(5)[8],=WH6DNT(5)[8],=WH6EHT(5)[8],=WH6FRH(5)[8],=WH6UO(5)[8],=WL2NAS(5)[8],
#    =WL7OG(5)[8],=WP2AAO(5)[8],=WP3MD(5)[8],=WP3VU(5)[8],=WP3WZ(5)[8],=WP4AR(5)[8],=WP4BMU(5)[8],
#    =WP4BNI(5)[8],=WP4BZ(5)[8],=WP4CB(5)[8],=WP4DME(5)[8],=WP4DWH(5)[8],=WP4EHY(5)[8],=WP4EYW(5)[8],
#    =WP4HLY(5)[8],=WP4HXS(5)[8],=WP4KXX(5)[8],=WP4LFO(5)[8],=WP4LYI(5)[8],=WP4MQN(5)[8],=WP4MRB(5)[8],
#    =WP4MUJ(5)[8],=WP4MYM(5)[8],=WP4MZO(5)[8],=WP4NBS(5)[8],=WP4NZF(5)[8],=WP4OCO(5)[8],=WP4OPY(5)[8],
#    =WP4PZB(5)[8],=WP4R(5)[8],=XL3TUV/M(5)[8],=XM3CMB/M(5)[8],
#    =4U1WB(5)[8],=AH6AX(5)[8],=AH6FF/3(5)[8],=AH6R(5)[8],=AH6Z(5)[8],=AH7J(5)[8],=AH8P(5)[8],
#    =AL1B(5)[8],=AL1B/M(5)[8],=AL7AB(5)[8],=AL7NN(5)[8],=AL7NN/3(5)[8],=AL7RS(5)[8],=KH2GM(5)[8],
#    =KH2JX(5)[8],=KH2SX(5)[8],=KH6CUJ(5)[8],=KH6ILR/3(5)[8],=KH6JGA(5)[8],=KH6LDO(5)[8],=KH6PX(5)[8],
#    =KH8CN(5)[8],=KL1HA(5)[8],=KL1KM(5)[8],=KL2A(5)[8],=KL2A/3(5)[8],=KL2BV(5)[8],=KL2UR(5)[8],
#    =KL2XF(5)[8],=KL7FD(5)[8],=KL7GLK/3(5)[8],=KL7HR/3(5)[8],=KL7JO(5)[8],=KL7OF/3(5)[8],=KL7OQ(5)[8],
#    =KL9A/3(5)[8],=KP3M(5)[8],=KP3N(5)[8],=KP4BEP(5)[8],=KP4CAM(5)[8],=KP4FCF(5)[8],=KP4GB/3(5)[8],
#    =KP4IP(5)[8],=KP4JB(5)[8],=KP4N(5)[8],=KP4N/3(5)[8],=KP4PRI(5)[8],=KP4UV(5)[8],=KP4WR(5)[8],
#    =KP4XO(5)[8],=KP4XX(5)[8],=KP4YH(5)[8],=NH2CW(5)[8],=NH2LA(5)[8],=NH6BD(5)[8],=NH6BK(5)[8],
#    =NH7C(5)[8],=NH7CC(5)[8],=NH7YK(5)[8],=NL7CK(5)[8],=NL7PJ(5)[8],=NL7V/3(5)[8],=NL7XM(5)[8],
#    =NL7XM/B(5)[8],=NP2EP(5)[8],=NP2G(5)[8],=NP2NC(5)[8],=NP3ES(5)[8],=NP3IP(5)[8],=NP3YN(5)[8],
#    =NP4RH(5)[8],=NP4YZ(5)[8],=WH6ADS(5)[8],=WH6AWO(5)[8],=WH6AZN(5)[8],=WH6CE(5)[8],=WH6CTO(5)[8],
#    =WH6DOA(5)[8],=WH6ECO(5)[8],=WH6EEL(5)[8],=WH6EEN(5)[8],=WH6EIJ(5)[8],=WH6GEU(5)[8],=WH6IO(5)[8],
#    =WH6OB(5)[8],=WH7F(5)[8],=WH7USA(5)[8],=WL7AF(5)[8],=WL7L(5)[8],=WP2XX(5)[8],=WP3BX(5)[8],
#    =WP3CC(5)[8],=WP3EC(5)[8],=WP3FK(5)[8],=WP4DA(5)[8],=WP4DCK(5)[8],=WP4EDM(5)[8],=WP4GJL(5)[8],
#    =WP4HRK(5)[8],=WP4HSZ(5)[8],=WP4KDN(5)[8],=WP4KKX(5)[8],=WP4LEM(5)[8],=WP4LNP(5)[8],=WP4MNV(5)[8],
#    =WP4MSX(5)[8],=WP4MYN(5)[8],=WP4NXG(5)[8],=WP4OSQ(5)[8],=WP4PPH(5)[8],=WP4PQN(5)[8],=WP4PUR(5)[8],
#    =WP4PYL(5)[8],=WP4PYM(5)[8],=WP4PYT(5)[8],=WP4PYU(5)[8],=WP4PYV(5)[8],=WP4PYZ(5)[8],=WP4PZA(5)[8],
#    =AH0BV(5)[8],=AH0BZ(5)[8],=AH0G(5)[8],=AH2AJ(5)[8],=AH2AM(5)[8],=AH2AV/4(5)[8],=AH2DF(5)[8],
#    =AH2EB(5)[8],=AH2X(5)[8],=AH3B(5)[8],=AH6AL(5)[8],=AH6AT(5)[8],=AH6AU(5)[8],=AH6BJ(5)[8],
#    =AH6C(5)[8],=AH6EZ/4(5)[8],=AH6FX(5)[8],=AH6FX/4(5)[8],=AH6IC(5)[8],=AH6IJ(5)[8],=AH6IW(5)[8],
#    =AH6JH(5)[8],=AH6JN/4(5)[8],=AH6JN/M(5)[8],=AH6KS(5)[8],=AH6KT(5)[8],=AH6KT/4(5)[8],=AH6LS(5)[8],
#    =AH6OB(5)[8],=AH6TI(5)[8],=AH7DN(5)[8],=AH7I(5)[8],=AH7I/4(5)[8],=AH7MI(5)[8],=AH8B(5)[8],
#    =AH8M(5)[8],=AH8M/M(5)[8],=AH8T(5)[8],=AL0I(5)[8],=AL1A(5)[8],=AL3G(5)[8],=AL3M(5)[8],=AL4T(5)[8],
#    =AL4T/4(5)[8],=AL4U(5)[8],=AL4X(5)[8],=AL5A(5)[8],=AL7AL(5)[8],=AL7AM(5)[8],=AL7BA(5)[8],
#    =AL7GF(5)[8],=AL7GK(5)[8],=AL7HG(5)[8],=AL7HW(5)[8],=AL7HW/4(5)[8],=AL7IS(5)[8],=AL7KT(5)[8],
#    =AL7LH(5)[8],=AL7NL(5)[8],=AL7NM(5)[8],=AL7NS(5)[8],=AL7NS/140(5)[8],=AL7PL(5)[8],=AL7QI(5)[8],
#    =AL7RE(5)[8],=AL7RL(5)[8],=G8ERJ(5)[8],=GO4AZM(5)[8],=GQ4AZM(5)[8],=GR4AZM(5)[8],=KH0CW(5)[8],
#    =KH0HR(5)[8],=KH0NI(5)[8],=KH0ZZ(5)[8],=KH2BX(5)[8],=KH2D(5)[8],=KH2D/4(5)[8],=KH2GUM/P(5)[8],
#    =KH2HB(5)[8],=KH2KD(5)[8],=KH2N(5)[8],=KH2NC(5)[8],=KH2PM(5)[8],=KH2RL(5)[8],=KH2TI(5)[8],
#    =KH2UG(5)[8],=KH2UV(5)[8],=KH2UZ(5)[8],=KH2VM(5)[8],=KH3AC(5)[8],=KH3AG(5)[8],=KH6AME(5)[8],
#    =KH6CG(5)[8],=KH6CG/4(5)[8],=KH6CT(5)[8],=KH6ED(5)[8],=KH6HHS(5)[8],=KH6HHS/4(5)[8],=KH6HOW(5)[8],
#    =KH6ILR(5)[8],=KH6ILR/4(5)[8],=KH6ITI(5)[8],=KH6JAU(5)[8],=KH6JIM(5)[8],=KH6JJD(5)[8],
#    =KH6JNW(5)[8],=KH6JUA(5)[8],=KH6KZ(5)[8],=KH6M(5)[8],=KH6M/4(5)[8],=KH6M/M(5)[8],=KH6MT(5)[8],
#    =KH6MT/4(5)[8],=KH6NC(5)[8],=KH6NI(5)[8],=KH6OU(5)[8],=KH6POI(5)[8],=KH6PU(5)[8],=KH6RP(5)[8],
#    =KH6TY(5)[8],=KH6TY/R(5)[8],=KH6UN(5)[8],=KH6XH(5)[8],=KH7DM(5)[8],=KH7DY(5)[8],=KH7FC(5)[8],
#    =KH7FU(5)[8],=KH7GM(5)[8],=KH7GZ(5)[8],=KH7HJ/4(5)[8],=KH7OC(5)[8],=KH7OV(5)[8],=KH7WK(5)[8],
#    =KH7XS/4(5)[8],=KH7XT(5)[8],=KH7ZC(5)[8],=KH8BB(5)[8],=KH8DO(5)[8],=KL0AG(5)[8],=KL0IP(5)[8],
#    =KL0KC(5)[8],=KL0KE/4(5)[8],=KL0L(5)[8],=KL0MG(5)[8],=KL0MP(5)[8],=KL0S(5)[8],=KL0SS(5)[8],
#    =KL0ST(5)[8],=KL0TY(5)[8],=KL0UA(5)[8],=KL0UD(5)[8],=KL0VU(5)[8],=KL0WF(5)[8],=KL1KP(5)[8],
#    =KL1NK(5)[8],=KL1NS(5)[8],=KL1OK(5)[8],=KL1PA(5)[8],=KL1SS(5)[8],=KL2AK(5)[8],=KL2CX(5)[8],
#    =KL2EY(5)[8],=KL2GG(5)[8],=KL2GP(5)[8],=KL2HV(5)[8],=KL2MQ(5)[8],=KL2NN(5)[8],=KL2UQ(5)[8],
#    =KL2XI(5)[8],=KL3EV(5)[8],=KL3HG(5)[8],=KL3IA(5)[8],=KL3KB(5)[8],=KL3KG(5)[8],=KL3NR(5)[8],
#    =KL3WM(5)[8],=KL3X(5)[8],=KL3XB(5)[8],=KL4CO(5)[8],=KL4DD(5)[8],=KL4H(5)[8],=KL4J(5)[8],
#    =KL5X(5)[8],=KL5YJ(5)[8],=KL7A(5)[8],=KL7DA(5)[8],=KL7DA/4(5)[8],=KL7FO(5)[8],=KL7GLL(5)[8],
#    =KL7H(5)[8],=KL7HIM(5)[8],=KL7HNY(5)[8],=KL7HOT(5)[8],=KL7HQW(5)[8],=KL7HX(5)[8],=KL7I(5)[8],
#    =KL7IEK(5)[8],=KL7IKZ(5)[8],=KL7IV(5)[8],=KL7IVY(5)[8],=KL7IWF(5)[8],=KL7JDS(5)[8],=KL7JR(5)[8],
#    =KL7LS(5)[8],=KL7MJ(5)[8],=KL7NCO(5)[8],=KL7NL(5)[8],=KL7NL/4(5)[8],=KL7NT(5)[8],=KL7P/4(5)[8],
#    =KL7PS(5)[8],=KL7QH(5)[8],=KL7QU(5)[8],=KL7SR(5)[8],=KL7USI/4(5)[8],=KL7XA(5)[8],=KL9A/1(5)[8],
#    =KP2AF(5)[8],=KP2AV(5)[8],=KP2AV/4(5)[8],=KP2CH(5)[8],=KP2CR(5)[8],=KP2L(5)[8],=KP2L/4(5)[8],
#    =KP2N(5)[8],=KP2R(5)[8],=KP2U(5)[8],=KP2US(5)[8],=KP2V(5)[8],=KP3AMG(5)[8],=KP3BL(5)[8],
#    =KP3BP(5)[8],=KP3J(5)[8],=KP3SK(5)[8],=KP3U(5)[8],=KP4AD(5)[8],=KP4AOD(5)[8],=KP4AOD/4(5)[8],
#    =KP4AYI(5)[8],=KP4BBN(5)[8],=KP4BEC(5)[8],=KP4BM(5)[8],=KP4BOB(5)[8],=KP4CBP(5)[8],=KP4CEL(5)[8],
#    =KP4CH(5)[8],=KP4CPP(5)[8],=KP4CSJ(5)[8],=KP4CSZ(5)[8],=KP4CW(5)[8],=KP4CZ(5)[8],=KP4DAC(5)[8],
#    =KP4DDS(5)[8],=KP4DPQ(5)[8],=KP4DQS(5)[8],=KP4EDL(5)[8],=KP4EIA(5)[8],=KP4EMY(5)[8],=KP4ENK(5)[8],
#    =KP4EOR(5)[8],=KP4EOR/4(5)[8],=KP4ERT(5)[8],=KP4ESC(5)[8],=KP4FBS(5)[8],=KP4FGI(5)[8],
#    =KP4FIR(5)[8],=KP4FJE(5)[8],=KP4FLP(5)[8],=KP4FOF(5)[8],=KP4HE(5)[8],=KP4HN(5)[8],=KP4II(5)[8],
#    =KP4IRI(5)[8],=KP4IT(5)[8],=KP4JC(5)[8],=KP4JCC(5)[8],=KP4JOS(5)[8],=KP4JWR(5)[8],=KP4KA(5)[8],
#    =KP4KD(5)[8],=KP4KD/4(5)[8],=KP4KE/4(5)[8],=KP4LEU(5)[8],=KP4LF(5)[8],=KP4LUV(5)[8],=KP4LX(5)[8],
#    =KP4MA(5)[8],=KP4MHC(5)[8],=KP4MPR(5)[8],=KP4MSP(5)[8],=KP4NI(5)[8],=KP4OO(5)[8],=KP4PC(5)[8],
#    =KP4PF(5)[8],=KP4PMD(5)[8],=KP4Q(5)[8],=KP4QT(5)[8],=KP4QT/4(5)[8],=KP4REY(5)[8],=KP4RGT(5)[8],
#    =KP4ROP(5)[8],=KP4RRC(5)[8],=KP4RT(5)[8],=KP4RZ(5)[8],=KP4SU(5)[8],=KP4TL(5)[8],=KP4TR(5)[8],
#    =KP4UFO(5)[8],=KP4USA(5)[8],=KP4WK(5)[8],=KP4WW(5)[8],=KP4WY(5)[8],=KP4XP(5)[8],=KP4Y(5)[8],
#    =KP4YLV(5)[8],=KP4ZV(5)[8],=KP4ZX(5)[8],=NH2A(5)[8],=NH2BQ(5)[8],=NH2DB(5)[8],=NH2F(5)[8],
#    =NH6AU(5)[8],=NH6BD/4(5)[8],=NH6E(5)[8],=NH6GE(5)[8],=NH6GR(5)[8],=NH6HX(5)[8],=NH6HX/4(5)[8],
#    =NH6JX(5)[8],=NH6KI(5)[8],=NH6QR(5)[8],=NH6SR(5)[8],=NH6T(5)[8],=NH6TL(5)[8],=NH7AA(5)[8],
#    =NH7AQ(5)[8],=NH7AR(5)[8],=NH7FG(5)[8],=NH7OI(5)[8],=NH7T/4(5)[8],=NH7UN(5)[8],=NH7XN(5)[8],
#    =NL5L(5)[8],=NL7AJ(5)[8],=NL7AU(5)[8],=NL7AU/4(5)[8],=NL7BV(5)[8],=NL7KL(5)[8],=NL7KX(5)[8],
#    =NL7LO(5)[8],=NL7LR(5)[8],=NL7LY(5)[8],=NL7MD(5)[8],=NL7MR(5)[8],=NL7OB(5)[8],=NL7OS(5)[8],
#    =NL7P(5)[8],=NL7PV(5)[8],=NL7U(5)[8],=NL7VV(5)[8],=NL7VX(5)[8],=NL7VX/4(5)[8],=NL7VX/M(5)[8],
#    =NL7YZ(5)[8],=NP2B(5)[8],=NP2B/4(5)[8],=NP2BB(5)[8],=NP2BW(5)[8],=NP2C(5)[8],=NP2C/4(5)[8],
#    =NP2CB(5)[8],=NP2D(5)[8],=NP2DJ(5)[8],=NP2EI(5)[8],=NP2FJ(5)[8],=NP2FT(5)[8],=NP2GN(5)[8],
#    =NP2GW(5)[8],=NP2HQ(5)[8],=NP2HS(5)[8],=NP2HW(5)[8],=NP2IE(5)[8],=NP2IF(5)[8],=NP2IJ(5)[8],
#    =NP2IS(5)[8],=NP2IW(5)[8],=NP2IX(5)[8],=NP2JA(5)[8],=NP2JS(5)[8],=NP2JV(5)[8],=NP2L(5)[8],
#    =NP2LC(5)[8],=NP2MM(5)[8],=NP2MN(5)[8],=NP2MP(5)[8],=NP2MR(5)[8],=NP2MR/4(5)[8],=NP2O(5)[8],
#    =NP2OL(5)[8],=NP2OO(5)[8],=NP2OR(5)[8],=NP2PA(5)[8],=NP2R(5)[8],=NP2T(5)[8],=NP2W(5)[8],
#    =NP3AX(5)[8],=NP3BL(5)[8],=NP3CC(5)[8],=NP3CI(5)[8],=NP3CM(5)[8],=NP3CT(5)[8],=NP3FR(5)[8],
#    =NP3G(5)[8],=NP3HD(5)[8],=NP3HG(5)[8],=NP3HN(5)[8],=NP3HP(5)[8],=NP3HU(5)[8],=NP3IL(5)[8],
#    =NP3IU(5)[8],=NP3K(5)[8],=NP3KM(5)[8],=NP3MM(5)[8],=NP3MX(5)[8],=NP3NC(5)[8],=NP3OW(5)[8],
#    =NP3QT(5)[8],=NP3R(5)[8],=NP3ST(5)[8],=NP3TM(5)[8],=NP3UM(5)[8],=NP3VJ(5)[8],=NP4AS(5)[8],
#    =NP4AV(5)[8],=NP4CC(5)[8],=NP4CK(5)[8],=NP4CV(5)[8],=NP4DM(5)[8],=NP4EM(5)[8],=NP4GH(5)[8],
#    =NP4GW(5)[8],=NP4J(5)[8],=NP4JL(5)[8],=NP4JU(5)[8],=NP4KV(5)[8],=NP4M(5)[8],=NP4ND(5)[8],
#    =NP4PF(5)[8],=NP4RJ(5)[8],=NP4SY(5)[8],=NP4TR(5)[8],=NP4WT(5)[8],=NP4XB(5)[8],=WH2AAT(5)[8],
#    =WH2ABJ(5)[8],=WH2G(5)[8],=WH6A(5)[8],=WH6ACF(5)[8],=WH6AJS(5)[8],=WH6AQ(5)[8],=WH6AVU(5)[8],
#    =WH6AX(5)[8],=WH6BRQ(5)[8],=WH6CEF(5)[8],=WH6CMT(5)[8],=WH6CNC(5)[8],=WH6CTC(5)[8],=WH6CXA(5)[8],
#    =WH6CXT(5)[8],=WH6DBX(5)[8],=WH6DMJ(5)[8],=WH6DNF(5)[8],=WH6DOL(5)[8],=WH6DUJ(5)[8],=WH6DXT(5)[8],
#    =WH6ECQ(5)[8],=WH6EFI(5)[8],=WH6EIK(5)[8],=WH6EIR(5)[8],=WH6EKW(5)[8],=WH6ELG(5)[8],=WH6ELM(5)[8],
#    =WH6ETE(5)[8],=WH6ETF(5)[8],=WH6FCP(5)[8],=WH6FGK(5)[8],=WH6HA(5)[8],=WH6IF(5)[8],=WH6IZ(5)[8],
#    =WH6J(5)[8],=WH6L(5)[8],=WH6LE(5)[8],=WH6LE/4(5)[8],=WH6LE/M(5)[8],=WH6LE/P(5)[8],=WH6NE(5)[8],
#    =WH6WX(5)[8],=WH6YH(5)[8],=WH6YH/4(5)[8],=WH6YM(5)[8],=WH6ZF(5)[8],=WH7GD(5)[8],=WH7HX(5)[8],
#    =WH7NI(5)[8],=WH7XK(5)[8],=WH7XU(5)[8],=WH7YL(5)[8],=WH7YV(5)[8],=WH7ZM(5)[8],=WH9AAF(5)[8],
#    =WL7AUL(5)[8],=WL7AX(5)[8],=WL7BAL(5)[8],=WL7CHA(5)[8],=WL7CIB(5)[8],=WL7CKJ(5)[8],=WL7COL(5)[8],
#    =WL7CQT(5)[8],=WL7CUY(5)[8],=WL7E/4(5)[8],=WL7GV(5)[8],=WL7SR(5)[8],=WL7UN(5)[8],=WL7YX(5)[8],
#    =WP2AGD(5)[8],=WP2AGO(5)[8],=WP2AHC(5)[8],=WP2AIG(5)[8],=WP2BB(5)[8],=WP2C(5)[8],=WP2L(5)[8],
#    =WP2MA(5)[8],=WP2P(5)[8],=WP3AY(5)[8],=WP3BC(5)[8],=WP3DW(5)[8],=WP3JE(5)[8],=WP3JQ(5)[8],
#    =WP3JU(5)[8],=WP3K(5)[8],=WP3LE(5)[8],=WP3MB(5)[8],=WP3ME(5)[8],=WP3NIS(5)[8],=WP3O(5)[8],
#    =WP3QE(5)[8],=WP3ZA(5)[8],=WP4AIE(5)[8],=WP4AIL(5)[8],=WP4AIZ(5)[8],=WP4ALH(5)[8],=WP4AQK(5)[8],
#    =WP4AVW(5)[8],=WP4B(5)[8],=WP4BFP(5)[8],=WP4BGM(5)[8],=WP4BIN(5)[8],=WP4BJS(5)[8],=WP4BK(5)[8],
#    =WP4BOC(5)[8],=WP4BQV(5)[8],=WP4BXS(5)[8],=WP4CKW(5)[8],=WP4CLS(5)[8],=WP4CMH(5)[8],=WP4DC(5)[8],
#    =WP4DCB(5)[8],=WP4DFK(5)[8],=WP4DNE(5)[8],=WP4DPX(5)[8],=WP4ENX(5)[8],=WP4EXH(5)[8],=WP4FEI(5)[8],
#    =WP4FRK(5)[8],=WP4FS(5)[8],=WP4GAK(5)[8],=WP4GFH(5)[8],=WP4GX(5)[8],=WP4GYA(5)[8],=WP4HFZ(5)[8],
#    =WP4HNN(5)[8],=WP4HOX(5)[8],=WP4IF(5)[8],=WP4IJ(5)[8],=WP4IK(5)[8],=WP4ILP(5)[8],=WP4JC(5)[8],
#    =WP4JKO(5)[8],=WP4JQJ(5)[8],=WP4JSR(5)[8],=WP4JT(5)[8],=WP4KCJ(5)[8],=WP4KDH(5)[8],=WP4KFP(5)[8],
#    =WP4KGI(5)[8],=WP4KI(5)[8],=WP4KJV(5)[8],=WP4KPK(5)[8],=WP4KSK(5)[8],=WP4KTD(5)[8],=WP4LBK(5)[8],
#    =WP4LDG(5)[8],=WP4LDL(5)[8],=WP4LDP(5)[8],=WP4LE(5)[8],=WP4LHA(5)[8],=WP4LTA(5)[8],=WP4MAE(5)[8],
#    =WP4MD(5)[8],=WP4MO(5)[8],=WP4MQF(5)[8],=WP4MWE(5)[8],=WP4MXE(5)[8],=WP4MYG(5)[8],=WP4MYK(5)[8],
#    =WP4NAI(5)[8],=WP4NAQ(5)[8],=WP4NBF(5)[8],=WP4NBG(5)[8],=WP4NFU(5)[8],=WP4NKU(5)[8],=WP4NLQ(5)[8],
#    =WP4NQA(5)[8],=WP4NVL(5)[8],=WP4NWW(5)[8],=WP4O/4(5)[8],=WP4O/M(5)[8],=WP4OAT(5)[8],=WP4OBD(5)[8],
#    =WP4OBH(5)[8],=WP4ODR(5)[8],=WP4OFA(5)[8],=WP4OHJ(5)[8],=WP4OLM(5)[8],=WP4OMG(5)[8],=WP4OMV(5)[8],
#    =WP4ONR(5)[8],=WP4OOI(5)[8],=WP4OPD(5)[8],=WP4OPF(5)[8],=WP4OPG(5)[8],=WP4OTP(5)[8],=WP4OXA(5)[8],
#    =WP4P(5)[8],=WP4PR(5)[8],=WP4PUV(5)[8],=WP4PWV(5)[8],=WP4PXG(5)[8],=WP4QER(5)[8],=WP4QHU(5)[8],
#    =WP4SW(5)[8],=WP4TD(5)[8],=WP4TX(5)[8],=WP4UC(5)[8],=WP4UM(5)[8],=WP4VL(5)[8],=WP4YG(5)[8],
#    AA5(4)[7],AB5(4)[7],AC5(4)[7],AD5(4)[7],AE5(4)[7],AF5(4)[7],AG5(4)[7],AI5(4)[7],AJ5(4)[7],
#    AK5(4)[7],K5(4)[7],KA5(4)[7],KB5(4)[7],KC5(4)[7],KD5(4)[7],KE5(4)[7],KF5(4)[7],KG5(4)[7],
#    KI5(4)[7],KJ5(4)[7],KK5(4)[7],KM5(4)[7],KN5(4)[7],KO5(4)[7],KQ5(4)[7],KR5(4)[7],KS5(4)[7],
#    KT5(4)[7],KU5(4)[7],KV5(4)[7],KW5(4)[7],KX5(4)[7],KY5(4)[7],KZ5(4)[7],N5(4)[7],NA5(4)[7],
#    NB5(4)[7],NC5(4)[7],ND5(4)[7],NE5(4)[7],NF5(4)[7],NG5(4)[7],NI5(4)[7],NJ5(4)[7],NK5(4)[7],
#    NM5(4)[7],NN5(4)[7],NO5(4)[7],NQ5(4)[7],NR5(4)[7],NS5(4)[7],NT5(4)[7],NU5(4)[7],NV5(4)[7],
#    NW5(4)[7],NX5(4)[7],NY5(4)[7],NZ5(4)[7],W5(4)[7],WA5(4)[7],WB5(4)[7],WC5(4)[7],WD5(4)[7],
#    WE5(4)[7],WF5(4)[7],WG5(4)[7],WI5(4)[7],WJ5(4)[7],WK5(4)[7],WM5(4)[7],WN5(4)[7],WO5(4)[7],
#    WQ5(4)[7],WR5(4)[7],WS5(4)[7],WT5(4)[7],WU5(4)[7],WV5(4)[7],WW5(4)[7],WX5(4)[7],WY5(4)[7],
#    WZ5(4)[7],=AH2AQ(4)[7],=AH2AQ/5(4)[7],=AH2DG(4)[7],=AH2DR(4)[7],=AH2EH(4)[7],=AH2H(4)[7],
#    =AH2T(4)[7],=AH6AF(4)[7],=AH6DZ(4)[7],=AH6FV(4)[7],=AH6HT(4)[7],=AH6OU(4)[7],=AH6RB(4)[7],
#    =AH6TD(4)[7],=AH6TS(4)[7],=AH6UD(4)[7],=AH8O(4)[7],=AH9B(4)[7],=AL1F(4)[7],=AL2K(4)[7],
#    =AL2S(4)[7],=AL4F(4)[7],=AL5J(4)[7],=AL7C(4)[7],=AL7CJ(4)[7],=AL7CQ(4)[7],=AL7DF(4)[7],
#    =AL7DR(4)[7],=AL7GY(4)[7],=AL7HH(4)[7],=AL7HU(4)[7],=AL7IH(4)[7],=AL7II/5(4)[7],=AL7IM(4)[7],
#    =AL7J(4)[7],=AL7JP(4)[7],=AL7L/5(4)[7],=AL7PB(4)[7],=AL7RD(4)[7],=AL7RI(4)[7],=AL7V(4)[7],
#    =KH0BZ(4)[7],=KH0CE(4)[7],=KH0CU(4)[7],=KH0DW(4)[7],=KH2AI(4)[7],=KH2BH(4)[7],=KH2DF(4)[7],
#    =KH2DF/5(4)[7],=KH2TB(4)[7],=KH2XD(4)[7],=KH2XO(4)[7],=KH2YO(4)[7],=KH6ABA(4)[7],=KH6DAN(4)[7],
#    =KH6GGC(4)[7],=KH6HPQ(4)[7],=KH6IDF(4)[7],=KH6II(4)[7],=KH6ITY/M(4)[7],=KH6JCV(4)[7],
#    =KH6JIQ(4)[7],=KH6JTM(4)[7],=KH6JVL(4)[7],=KH6KG/5(4)[7],=KH6LL(4)[7],=KH6LX(4)[7],=KH6MB/5(4)[7],
#    =KH6SP/5(4)[7],=KH6SZ(4)[7],=KH6UW(4)[7],=KH7CF(4)[7],=KH7FB(4)[7],=KH7IC(4)[7],=KH7JE(4)[7],
#    =KH7QL(4)[7],=KH7QO(4)[7],=KH8CG(4)[7],=KH9AE(4)[7],=KL0EX(4)[7],=KL0HU(4)[7],=KL0PG(4)[7],
#    =KL1DA(4)[7],=KL1DJ(4)[7],=KL1DY(4)[7],=KL1MM(4)[7],=KL1RX(4)[7],=KL1TS(4)[7],=KL1UR(4)[7],
#    =KL1WG(4)[7],=KL1WO(4)[7],=KL1XK(4)[7],=KL1Y(4)[7],=KL1ZW(4)[7],=KL2AX(4)[7],=KL2AX/5(4)[7],
#    =KL2CD(4)[7],=KL2HC(4)[7],=KL2HN(4)[7],=KL2MI(4)[7],=KL2RA(4)[7],=KL2RB(4)[7],=KL2TV(4)[7],
#    =KL2UO(4)[7],=KL2UP(4)[7],=KL2VA(4)[7],=KL3DB(4)[7],=KL3DP(4)[7],=KL3HK(4)[7],=KL3HZ(4)[7],
#    =KL3JL(4)[7],=KL3KH(4)[7],=KL3KI(4)[7],=KL3TB(4)[7],=KL4JQ(4)[7],=KL5L(4)[7],=KL5Z(4)[7],
#    =KL7AH(4)[7],=KL7AU(4)[7],=KL7AX(4)[7],=KL7BCD(4)[7],=KL7BL(4)[7],=KL7BX(4)[7],=KL7BZ/5(4)[7],
#    =KL7BZL(4)[7],=KL7CD(4)[7],=KL7DB(4)[7],=KL7EBE(4)[7],=KL7EMH(4)[7],=KL7EMH/M(4)[7],=KL7EQQ(4)[7],
#    =KL7F(4)[7],=KL7FB(4)[7],=KL7FHX(4)[7],=KL7FLY(4)[7],=KL7FQQ(4)[7],=KL7FQR(4)[7],=KL7GNW(4)[7],
#    =KL7HH(4)[7],=KL7HJZ(4)[7],=KL7IDM(4)[7],=KL7IK(4)[7],=KL7ITF(4)[7],=KL7IWU(4)[7],=KL7IZW(4)[7],
#    =KL7JAR(4)[7],=KL7JEX(4)[7],=KL7JIU(4)[7],=KL7JR/5(4)[7],=KL7JW(4)[7],=KL7LJ(4)[7],=KL7LY(4)[7],
#    =KL7MA(4)[7],=KL7ME(4)[7],=KL7ML(4)[7],=KL7NE(4)[7],=KL7NI(4)[7],=KL7OI(4)[7],=KL7PZ(4)[7],
#    =KL7QC(4)[7],=KL7SG(4)[7],=KL7TN/5(4)[7],=KL7UHF(4)[7],=KL7USI/5(4)[7],=KL7XP(4)[7],=KL7XS(4)[7],
#    =KL7YY/5(4)[7],=KP2AZ(4)[7],=KP4CV(4)[7],=KP4DJT(4)[7],=KP4FF(4)[7],=KP4FFW(4)[7],=KP4GMC(4)[7],
#    =KP4JE(4)[7],=KP4JG(4)[7],=KP4JY(4)[7],=KP4YP(4)[7],=NH0V/5(4)[7],=NH2LP(4)[7],=NH6AZ(4)[7],
#    =NH6CJ(4)[7],=NH6EF(4)[7],=NH6FA(4)[7],=NH6L(4)[7],=NH6MG(4)[7],=NH6TD(4)[7],=NH6VB(4)[7],
#    =NH6VJ(4)[7],=NH6WL(4)[7],=NH6WL/5(4)[7],=NH7FO(4)[7],=NH7MV(4)[7],=NH7PZ(4)[7],=NH7R(4)[7],
#    =NH7RO(4)[7],=NH7RO/5(4)[7],=NH7TR(4)[7],=NH7VA(4)[7],=NL5J(4)[7],=NL7AX(4)[7],=NL7C(4)[7],
#    =NL7CO(4)[7],=NL7CO/5(4)[7],=NL7DC(4)[7],=NL7HB(4)[7],=NL7IE(4)[7],=NL7JH(4)[7],=NL7JI(4)[7],
#    =NL7K/5(4)[7],=NL7KB(4)[7],=NL7NP(4)[7],=NL7OM(4)[7],=NL7PD(4)[7],=NL7RQ(4)[7],=NL7RQ/5(4)[7],
#    =NL7SI(4)[7],=NL7TO(4)[7],=NL7ZL(4)[7],=NP2EE(4)[7],=NP2PR(4)[7],=NP2RA(4)[7],=NP3BA(4)[7],
#    =NP3CV(4)[7],=NP3NT(4)[7],=NP3PG(4)[7],=NP3RG(4)[7],=NP3SU(4)[7],=NP3TY(4)[7],=NP4EA(4)[7],
#    =NP4NQ(4)[7],=NP4NQ/5(4)[7],=NP4RW(4)[7],=NP4RZ(4)[7],=WH2ACT(4)[7],=WH2ACT/5(4)[7],=WH6ARN(4)[7],
#    =WH6BYJ(4)[7],=WH6BYP(4)[7],=WH6CCQ(4)[7],=WH6CDU(4)[7],=WH6CUL(4)[7],=WH6DZU(4)[7],=WH6ECJ(4)[7],
#    =WH6EMW(4)[7],=WH6EOF(4)[7],=WH6ERS(4)[7],=WH6EUA(4)[7],=WH6EXQ(4)[7],=WH6FAD(4)[7],=WH6FGM(4)[7],
#    =WH6FZ/5(4)[7],=WH6GBC(4)[7],=WH6KK(4)[7],=WH6L/5(4)[7],=WH7DC(4)[7],=WH7DW(4)[7],=WH7OK(4)[7],
#    =WH7R(4)[7],=WH7YQ(4)[7],=WH7YR(4)[7],=WL3WX(4)[7],=WL5H(4)[7],=WL7AIU(4)[7],=WL7AWC(4)[7],
#    =WL7BBV(4)[7],=WL7BKF(4)[7],=WL7BPY(4)[7],=WL7CA(4)[7],=WL7CJA(4)[7],=WL7CJC(4)[7],=WL7CQE(4)[7],
#    =WL7CTP(4)[7],=WL7CTQ(4)[7],=WL7D(4)[7],=WL7FC(4)[7],=WL7FE(4)[7],=WL7FT(4)[7],=WL7FT/5(4)[7],
#    =WL7K/5(4)[7],=WL7ME(4)[7],=WL7MQ/5(4)[7],=WL7OP(4)[7],=WL7OU(4)[7],=WL7SG(4)[7],=WL7W(4)[7],
#    =WL7WN(4)[7],=WL7XI(4)[7],=WL7XR(4)[7],=WP2AHG(4)[7],=WP2U(4)[7],=WP2WP(4)[7],=WP3AL(4)[7],
#    =WP4A(4)[7],=WP4ADA(4)[7],=WP4APJ(4)[7],=WP4BAB(4)[7],=WP4BAT(4)[7],=WP4CJY(4)[7],=WP4EVA(4)[7],
#    =WP4EVL(4)[7],=WP4IXT(4)[7],=WP4KSP(4)[7],=WP4KTF(4)[7],=WP4KUW(4)[7],=WP4LKA(4)[7],=WP4MJP(4)[7],
#    =WP4MWS(4)[7],=WP4MYI(4)[7],=WP4MZR(4)[7],=WP4NAK(4)[7],=WP4NEP(4)[7],=WP4NQL(4)[7],=WP4OUE(4)[7],
#    =WP4QLB(4)[7],=WP4RON(4)[7],
#    AA6(3)[6],AB6(3)[6],AC6(3)[6],AD6(3)[6],AE6(3)[6],AF6(3)[6],AG6(3)[6],AI6(3)[6],AJ6(3)[6],
#    AK6(3)[6],K6(3)[6],KA6(3)[6],KB6(3)[6],KC6(3)[6],KD6(3)[6],KE6(3)[6],KF6(3)[6],KG6(3)[6],
#    KI6(3)[6],KJ6(3)[6],KK6(3)[6],KM6(3)[6],KN6(3)[6],KO6(3)[6],KQ6(3)[6],KR6(3)[6],KS6(3)[6],
#    KT6(3)[6],KU6(3)[6],KV6(3)[6],KW6(3)[6],KX6(3)[6],KY6(3)[6],KZ6(3)[6],N6(3)[6],NA6(3)[6],
#    NB6(3)[6],NC6(3)[6],ND6(3)[6],NE6(3)[6],NF6(3)[6],NG6(3)[6],NI6(3)[6],NJ6(3)[6],NK6(3)[6],
#    NM6(3)[6],NN6(3)[6],NO6(3)[6],NQ6(3)[6],NR6(3)[6],NS6(3)[6],NT6(3)[6],NU6(3)[6],NV6(3)[6],
#    NW6(3)[6],NX6(3)[6],NY6(3)[6],NZ6(3)[6],W6(3)[6],WA6(3)[6],WB6(3)[6],WC6(3)[6],WD6(3)[6],
#    WE6(3)[6],WF6(3)[6],WG6(3)[6],WI6(3)[6],WJ6(3)[6],WK6(3)[6],WM6(3)[6],WN6(3)[6],WO6(3)[6],
#    WQ6(3)[6],WR6(3)[6],WS6(3)[6],WT6(3)[6],WU6(3)[6],WV6(3)[6],WW6(3)[6],WX6(3)[6],WY6(3)[6],
#    WZ6(3)[6],=AH0C(3)[6],=AH0CS(3)[6],=AH0U(3)[6],=AH0U/6(3)[6],=AH2AP(3)[6],=AH2DY(3)[6],
#    =AH6BS(3)[6],=AH6CY(3)[6],=AH6CY/P(3)[6],=AH6EI(3)[6],=AH6HE(3)[6],=AH6KG(3)[6],=AH6ML(3)[6],
#    =AH6NL(3)[6],=AH6NP(3)[6],=AH6PD(3)[6],=AH6RI(3)[6],=AH6S(3)[6],=AH6SU(3)[6],=AH6TX(3)[6],
#    =AH6UK(3)[6],=AH6UN(3)[6],=AH6UX(3)[6],=AH7A(3)[6],=AH7D(3)[6],=AH7F(3)[6],=AH8C(3)[6],
#    =AL3A(3)[6],=AL5ET(3)[6],=AL6A(3)[6],=AL7DQ(3)[6],=AL7EM(3)[6],=AL7EP(3)[6],=AL7EW(3)[6],
#    =AL7FN(3)[6],=AL7GS(3)[6],=AL7HO/6(3)[6],=AL7L/6(3)[6],=AL7PS(3)[6],=AL7QR(3)[6],=KH0BR(3)[6],
#    =KH0BU(3)[6],=KH0CA(3)[6],=KH0CG(3)[6],=KH0DH(3)[6],=KH0DJ(3)[6],=KH0HQ(3)[6],=KH0JJ(3)[6],
#    =KH0V(3)[6],=KH0XD(3)[6],=KH2BD(3)[6],=KH2BI(3)[6],=KH2BR(3)[6],=KH2BR/6(3)[6],=KH2C(3)[6],
#    =KH2EE(3)[6],=KH2FI(3)[6],=KH2FI/6(3)[6],=KH2H(3)[6],=KH2IW(3)[6],=KH2LU(3)[6],=KH2LW(3)[6],
#    =KH2LZ(3)[6],=KH2OJ(3)[6],=KH2QE(3)[6],=KH2QL(3)[6],=KH2QY(3)[6],=KH2TJ(3)[6],=KH2TJ/6(3)[6],
#    =KH2XW(3)[6],=KH2YJ(3)[6],=KH2Z(3)[6],=KH2ZM(3)[6],=KH4AB(3)[6],=KH6ARA(3)[6],=KH6AS(3)[6],
#    =KH6BMD(3)[6],=KH6BRY(3)[6],=KH6COL(3)[6],=KH6DDW(3)[6],=KH6DX/M(3)[6],=KH6DX/M6(3)[6],
#    =KH6DZ(3)[6],=KH6EHF(3)[6],=KH6FH(3)[6],=KH6FL(3)[6],=KH6FOX(3)[6],=KH6FQR(3)[6],=KH6FQY(3)[6],
#    =KH6GBQ(3)[6],=KH6GC(3)[6],=KH6GJV(3)[6],=KH6GJV/6(3)[6],=KH6GK(3)[6],=KH6GKR(3)[6],=KH6HH(3)[6],
#    =KH6HJE(3)[6],=KH6HOU(3)[6],=KH6IKH(3)[6],=KH6IKL(3)[6],=KH6IP(3)[6],=KH6IPJ(3)[6],=KH6JCT(3)[6],
#    =KH6JGD(3)[6],=KH6JJN(3)[6],=KH6JJN/P(3)[6],=KH6JN(3)[6],=KH6JNK(3)[6],=KH6JR(3)[6],=KH6JRB(3)[6],
#    =KH6JRC(3)[6],=KH6JS(3)[6],=KH6JUZ(3)[6],=KH6JVS(3)[6],=KH6JWG(3)[6],=KH6KT(3)[6],=KH6LO(3)[6],
#    =KH6MV(3)[6],=KH6N(3)[6],=KH6NG(3)[6],=KH6O(3)[6],=KH6PGA/6(3)[6],=KH6PM(3)[6],=KH6PW(3)[6],
#    =KH6SC(3)[6],=KH6TO(3)[6],=KH6UQ(3)[6],=KH6USA(3)[6],=KH6VC(3)[6],=KH6VC/6(3)[6],=KH6VZ(3)[6],
#    =KH6WL(3)[6],=KH6WZ(3)[6],=KH7CD/6(3)[6],=KH7CO(3)[6],=KH7CS(3)[6],=KH7EM(3)[6],=KH7I(3)[6],
#    =KH7IZ(3)[6],=KH7JR(3)[6],=KH7NS(3)[6],=KH7QS(3)[6],=KH7QU(3)[6],=KH7RB(3)[6],=KH7TJ(3)[6],
#    =KH7TJ/6(3)[6],=KH7TR(3)[6],=KH7TW(3)[6],=KH7VD(3)[6],=KH7VE(3)[6],=KH7WN(3)[6],=KH7WO(3)[6],
#    =KH7WR(3)[6],=KH7WS(3)[6],=KH7XX/6(3)[6],=KH7Y(3)[6],=KH7Y/6(3)[6],=KH8A(3)[6],=KH8AF(3)[6],
#    =KH8FL(3)[6],=KL0AA(3)[6],=KL0AF(3)[6],=KL0AL(3)[6],=KL0HZ(3)[6],=KL0IF(3)[6],=KL1NER(3)[6],
#    =KL1WE/6(3)[6],=KL2CQ(3)[6],=KL2WL(3)[6],=KL3IM(3)[6],=KL3JY/6(3)[6],=KL3YH(3)[6],=KL4GW(3)[6],
#    =KL4LV(3)[6],=KL4NZ(3)[6],=KL4QW(3)[6],=KL4UZ(3)[6],=KL7AK(3)[6],=KL7CE/6(3)[6],=KL7CM(3)[6],
#    =KL7CN(3)[6],=KL7CW/6(3)[6],=KL7CX(3)[6],=KL7DJ(3)[6],=KL7EAE(3)[6],=KL7EAL(3)[6],=KL7HQR(3)[6],
#    =KL7HQR/6(3)[6],=KL7HSY(3)[6],=KL7ID(3)[6],=KL7IDY/6(3)[6],=KL7ISB(3)[6],=KL7ISN(3)[6],
#    =KL7JBE(3)[6],=KL7KNP(3)[6],=KL7KX(3)[6],=KL7MF(3)[6],=KL7MF/6(3)[6],=KL7MF/M(3)[6],=KL7OO(3)[6],
#    =KL7RT(3)[6],=KL7SL(3)[6],=KL7SY(3)[6],=KL7VU(3)[6],=KL7VU/6(3)[6],=KP2BK(3)[6],=KP3BN(3)[6],
#    =KP3YL(3)[6],=KP4BR(3)[6],=KP4DSO(3)[6],=KP4DX/6(3)[6],=KP4ENM(3)[6],=KP4ERR(3)[6],=KP4FBT(3)[6],
#    =KP4MD(3)[6],=KP4UB(3)[6],=NH0C(3)[6],=NH0X(3)[6],=NH2AR(3)[6],=NH2BD(3)[6],=NH2BV(3)[6],
#    =NH2CM(3)[6],=NH2FT(3)[6],=NH2FX(3)[6],=NH2R(3)[6],=NH2S(3)[6],=NH6AC(3)[6],=NH6AE(3)[6],
#    =NH6AF(3)[6],=NH6FV(3)[6],=NH6FX(3)[6],=NH6NG(3)[6],=NH6RG(3)[6],=NH6SF(3)[6],=NH6ST(3)[6],
#    =NH6WR(3)[6],=NH7AG(3)[6],=NH7EM(3)[6],=NH7FW(3)[6],=NH7G(3)[6],=NH7IG(3)[6],=NH7IH(3)[6],
#    =NH7PM(3)[6],=NH7QV(3)[6],=NH7RT(3)[6],=NH7ST(3)[6],=NH7SU(3)[6],=NH7WE(3)[6],=NH7WG(3)[6],
#    =NH7ZE(3)[6],=NL7GE(3)[6],=NL7IB(3)[6],=NL7LC(3)[6],=NL7OP(3)[6],=NL7RO(3)[6],=NL7YB(3)[6],
#    =NP2KY(3)[6],=NP4AB(3)[6],=NP4AI/6(3)[6],=NP4IW(3)[6],=NP4IW/6(3)[6],=NP4MV(3)[6],=NP4XE(3)[6],
#    =WH0AAZ(3)[6],=WH0M(3)[6],=WH2ABS(3)[6],=WH2ALN(3)[6],=WH2K(3)[6],=WH6AAJ(3)[6],=WH6AFM(3)[6],
#    =WH6ANA(3)[6],=WH6ASW/M(3)[6],=WH6BYT(3)[6],=WH6CIL(3)[6],=WH6CK(3)[6],=WH6CO(3)[6],=WH6CPO(3)[6],
#    =WH6CPT(3)[6],=WH6CRE(3)[6],=WH6CSG(3)[6],=WH6CUF(3)[6],=WH6CUU(3)[6],=WH6CUX(3)[6],=WH6CVJ(3)[6],
#    =WH6CWS(3)[6],=WH6CZF(3)[6],=WH6CZH(3)[6],=WH6DHN(3)[6],=WH6DSK(3)[6],=WH6DVM(3)[6],=WH6DVN(3)[6],
#    =WH6DVX(3)[6],=WH6DYA(3)[6],=WH6DZV(3)[6],=WH6DZY(3)[6],=WH6EAR(3)[6],=WH6EEZ(3)[6],=WH6EHY(3)[6],
#    =WH6EKB(3)[6],=WH6ENG(3)[6],=WH6EUH(3)[6],=WH6EZW(3)[6],=WH6FTF(3)[6],=WH6JO(3)[6],=WH6LZ(3)[6],
#    =WH6MC(3)[6],=WH6OI(3)[6],=WH6PX(3)[6],=WH6QA(3)[6],=WH6RF(3)[6],=WH6TD(3)[6],=WH6TK(3)[6],
#    =WH6USA(3)[6],=WH6VM(3)[6],=WH6VN(3)[6],=WH6XI(3)[6],=WH6XX(3)[6],=WH6YJ(3)[6],=WH7DG(3)[6],
#    =WH7DH(3)[6],=WH7HQ(3)[6],=WH7IN(3)[6],=WH7IV(3)[6],=WH7IZ(3)[6],=WH7LP(3)[6],=WH7OO(3)[6],
#    =WH7PM(3)[6],=WH7QC(3)[6],=WH7RU(3)[6],=WH7TT(3)[6],=WH7UZ(3)[6],=WH7VM(3)[6],=WH7VU(3)[6],
#    =WH7XR(3)[6],=WL3AF(3)[6],=WL3DZ(3)[6],=WL4JC(3)[6],=WL7ACO(3)[6],=WL7BA(3)[6],=WL7BGF(3)[6],
#    =WL7CPL(3)[6],=WL7CSD(3)[6],=WL7DN/6(3)[6],=WL7EA(3)[6],=WL7EKK(3)[6],=WL7RA(3)[6],=WL7SE(3)[6],
#    =WL7TG(3)[6],=WL7WL(3)[6],=WL7YQ(3)[6],=WL7YQ/6(3)[6],=WP2N(3)[6],=WP4CUJ(3)[6],=WP4CW(3)[6],
#    =WP4KSU(3)[6],=WP4MVE(3)[6],=WP4OBB(3)[6],=WP4OBC(3)[6],
#    AA7(3)[6],AB7(3)[6],AC7(3)[6],AD7(3)[6],AE7(3)[6],AF7(3)[6],AG7(3)[6],AI7(3)[6],AJ7(3)[6],
#    AK7(3)[6],K7(3)[6],KA7(3)[6],KB7(3)[6],KC7(3)[6],KD7(3)[6],KE7(3)[6],KF7(3)[6],KG7(3)[6],
#    KI7(3)[6],KJ7(3)[6],KK7(3)[6],KM7(3)[6],KN7(3)[6],KO7(3)[6],KQ7(3)[6],KR7(3)[6],KS7(3)[6],
#    KT7(3)[6],KU7(3)[6],KV7(3)[6],KW7(3)[6],KX7(3)[6],KY7(3)[6],KZ7(3)[6],N7(3)[6],NA7(3)[6],
#    NB7(3)[6],NC7(3)[6],ND7(3)[6],NE7(3)[6],NF7(3)[6],NG7(3)[6],NI7(3)[6],NJ7(3)[6],NK7(3)[6],
#    NM7(3)[6],NN7(3)[6],NO7(3)[6],NQ7(3)[6],NR7(3)[6],NS7(3)[6],NT7(3)[6],NU7(3)[6],NV7(3)[6],
#    NW7(3)[6],NX7(3)[6],NY7(3)[6],NZ7(3)[6],W7(3)[6],WA7(3)[6],WB7(3)[6],WC7(3)[6],WD7(3)[6],
#    WE7(3)[6],WF7(3)[6],WG7(3)[6],WI7(3)[6],WJ7(3)[6],WK7(3)[6],WM7(3)[6],WN7(3)[6],WO7(3)[6],
#    WQ7(3)[6],WR7(3)[6],WS7(3)[6],WT7(3)[6],WU7(3)[6],WV7(3)[6],WW7(3)[6],WX7(3)[6],WY7(3)[6],
#    WZ7(3)[6],=AH0AB(3)[6],=AH0CN(3)[6],=AH0W(3)[6],=AH0W/7(3)[6],=AH2A(3)[6],=AH2AK(3)[6],
#    =AH2DP(3)[6],=AH2DS(3)[6],=AH2S(3)[6],=AH6B/7(3)[6],=AH6D(3)[6],=AH6ET(3)[6],=AH6EZ(3)[6],
#    =AH6EZ/7(3)[6],=AH6FC/7(3)[6],=AH6GA(3)[6],=AH6HK(3)[6],=AH6HS(3)[6],=AH6HX(3)[6],=AH6I(3)[6],
#    =AH6IP(3)[6],=AH6LE(3)[6],=AH6LE/7(3)[6],=AH6NJ(3)[6],=AH6NR(3)[6],=AH6OD(3)[6],=AH6PJ(3)[6],
#    =AH6PW(3)[6],=AH6QW(3)[6],=AH6RI/7(3)[6],=AH6SV(3)[6],=AH6VM(3)[6],=AH6VP(3)[6],=AH6Y(3)[6],
#    =AH7MP(3)[6],=AH8AC(3)[6],=AH8DX(3)[6],=AH8K(3)[6],=AH9A(3)[6],=AH9AC(3)[6],=AH9C(3)[6],
#    =AL0AA(3)[6],=AL0F(3)[6],=AL0FT(3)[6],=AL0H(3)[6],=AL0X(3)[6],=AL1N(3)[6],=AL1P(3)[6],
#    =AL1VE(3)[6],=AL2B(3)[6],=AL2N(3)[6],=AL3L(3)[6],=AL4Q/7(3)[6],=AL5B(3)[6],=AL5W(3)[6],
#    =AL7A(3)[6],=AL7AA(3)[6],=AL7AN(3)[6],=AL7AW(3)[6],=AL7BN(3)[6],=AL7BQ(3)[6],=AL7CC(3)[6],
#    =AL7CG(3)[6],=AL7CM(3)[6],=AL7CM/7(3)[6],=AL7CR(3)[6],=AL7CS(3)[6],=AL7D(3)[6],=AL7D/7(3)[6],
#    =AL7D/P(3)[6],=AL7D/R(3)[6],=AL7DD(3)[6],=AL7DU(3)[6],=AL7EI(3)[6],=AL7EJ(3)[6],=AL7FA(3)[6],
#    =AL7FB(3)[6],=AL7FZ(3)[6],=AL7HS(3)[6],=AL7HY(3)[6],=AL7IG(3)[6],=AL7IT(3)[6],=AL7JF(3)[6],
#    =AL7JJ(3)[6],=AL7JS(3)[6],=AL7JV(3)[6],=AL7JW(3)[6],=AL7JY(3)[6],=AL7KE(3)[6],=AL7KF(3)[6],
#    =AL7KG(3)[6],=AL7KK(3)[6],=AL7KL(3)[6],=AL7KV(3)[6],=AL7L/7(3)[6],=AL7LI(3)[6],=AL7LL(3)[6],
#    =AL7MH(3)[6],=AL7MQ(3)[6],=AL7ND(3)[6],=AL7NK(3)[6],=AL7NZ(3)[6],=AL7OK(3)[6],=AL7OW(3)[6],
#    =AL7PR(3)[6],=AL7PV(3)[6],=AL7QL(3)[6],=AL7R(3)[6],=AL7R/7(3)[6],=AL7RF(3)[6],=AL7RF/7(3)[6],
#    =AL7RM(3)[6],=AL7RR(3)[6],=AL7W(3)[6],=G4KHG/M(3)[6],=KH0AS(3)[6],=KH0H(3)[6],=KH0K(3)[6],
#    =KH0SH(3)[6],=KH0TL(3)[6],=KH0X(3)[6],=KH2CH(3)[6],=KH2G(3)[6],=KH2GG(3)[6],=KH2JA(3)[6],
#    =KH2QH(3)[6],=KH2RK(3)[6],=KH2SK(3)[6],=KH2SR(3)[6],=KH2TJ/7(3)[6],=KH2TJ/P(3)[6],=KH2XP(3)[6],
#    =KH2YL(3)[6],=KH3AD(3)[6],=KH6AB(3)[6],=KH6AHQ(3)[6],=KH6BXZ(3)[6],=KH6CN(3)[6],=KH6CN/7(3)[6],
#    =KH6COY(3)[6],=KH6CQG(3)[6],=KH6CQH(3)[6],=KH6CQH/7(3)[6],=KH6DB(3)[6],=KH6DE(3)[6],=KH6DOT(3)[6],
#    =KH6DUT(3)[6],=KH6EE(3)[6],=KH6EE/7(3)[6],=KH6FKA/7(3)[6],=KH6FU(3)[6],=KH6GB(3)[6],=KH6GDN(3)[6],
#    =KH6HU(3)[6],=KH6HWK(3)[6],=KH6IA(3)[6],=KH6ICQ(3)[6],=KH6IKC(3)[6],=KH6IMN(3)[6],=KH6IQX(3)[6],
#    =KH6ITY(3)[6],=KH6JFL(3)[6],=KH6JIM/7(3)[6],=KH6JJS(3)[6],=KH6JPJ(3)[6],=KH6JPO(3)[6],
#    =KH6JRW(3)[6],=KH6JT(3)[6],=KH6JUQ(3)[6],=KH6KS(3)[6],=KH6KW(3)[6],=KH6LEM(3)[6],=KH6ME(3)[6],
#    =KH6MF(3)[6],=KH6NA(3)[6],=KH6NO/7(3)[6],=KH6NO/M(3)[6],=KH6NU(3)[6],=KH6OV(3)[6],=KH6PG(3)[6],
#    =KH6PR(3)[6],=KH6QAI(3)[6],=KH6QAI/7(3)[6],=KH6QAJ(3)[6],=KH6RW(3)[6],=KH6RY(3)[6],=KH6SAT(3)[6],
#    =KH6SS(3)[6],=KH6TG(3)[6],=KH6TX(3)[6],=KH6VM(3)[6],=KH6VM/7(3)[6],=KH6VT(3)[6],=KH6WX(3)[6],
#    =KH6XG(3)[6],=KH6XS(3)[6],=KH6XT(3)[6],=KH6YL(3)[6],=KH7AL(3)[6],=KH7AR(3)[6],=KH7AX(3)[6],
#    =KH7CB(3)[6],=KH7CM(3)[6],=KH7CZ(3)[6],=KH7FJ(3)[6],=KH7FR(3)[6],=KH7HH(3)[6],=KH7HWK(3)[6],
#    =KH7IP(3)[6],=KH7LE(3)[6],=KH7ME(3)[6],=KH7MR(3)[6],=KH7NI(3)[6],=KH7NP(3)[6],=KH7R(3)[6],
#    =KH7RD(3)[6],=KH7RT(3)[6],=KH7SQ(3)[6],=KH7SR(3)[6],=KH7V(3)[6],=KH7VB(3)[6],=KH7VC(3)[6],
#    =KH7WW(3)[6],=KH7WW/7(3)[6],=KH7X/7(3)[6],=KH7YD(3)[6],=KH7YD/7(3)[6],=KH8AB(3)[6],=KH8AH(3)[6],
#    =KH8AZ(3)[6],=KH8BG(3)[6],=KH8D(3)[6],=KH8E(3)[6],=KH8K(3)[6],=KH9AA(3)[6],=KL0AI(3)[6],
#    =KL0AN(3)[6],=KL0AP(3)[6],=KL0CA(3)[6],=KL0CM(3)[6],=KL0CW(3)[6],=KL0DF(3)[6],=KL0DG(3)[6],
#    =KL0DR(3)[6],=KL0DT(3)[6],=KL0EU(3)[6],=KL0IR(3)[6],=KL0IS(3)[6],=KL0IW(3)[6],=KL0IX(3)[6],
#    =KL0LF(3)[6],=KL0MO(3)[6],=KL0NM(3)[6],=KL0NP(3)[6],=KL0NP/P(3)[6],=KL0PC(3)[6],=KL0PP(3)[6],
#    =KL0QD(3)[6],=KL0RA(3)[6],=KL0SA(3)[6],=KL0SZ(3)[6],=KL0TR(3)[6],=KL0TU(3)[6],=KL0VB(3)[6],
#    =KL0ZL(3)[6],=KL1AA(3)[6],=KL1AE(3)[6],=KL1AK(3)[6],=KL1DO(3)[6],=KL1DW(3)[6],=KL1ED(3)[6],
#    =KL1JF(3)[6],=KL1K(3)[6],=KL1KU(3)[6],=KL1LE(3)[6],=KL1LZ(3)[6],=KL1MF(3)[6],=KL1OH(3)[6],
#    =KL1QL(3)[6],=KL1RH(3)[6],=KL1RV(3)[6],=KL1SF/7(3)[6],=KL1SO(3)[6],=KL1U(3)[6],=KL1UA(3)[6],
#    =KL1UM(3)[6],=KL1XI(3)[6],=KL1YO(3)[6],=KL1YY/7(3)[6],=KL1ZN(3)[6],=KL1ZP(3)[6],=KL1ZR(3)[6],
#    =KL2A/7(3)[6],=KL2BG(3)[6],=KL2BO(3)[6],=KL2BW(3)[6],=KL2BY(3)[6],=KL2BZ(3)[6],=KL2FD(3)[6],
#    =KL2FL(3)[6],=KL2JY(3)[6],=KL2K(3)[6],=KL2KY(3)[6],=KL2LA(3)[6],=KL2LN(3)[6],=KL2LT(3)[6],
#    =KL2MA(3)[6],=KL2MP(3)[6],=KL2NJ(3)[6],=KL2NU(3)[6],=KL2NW(3)[6],=KL2OH(3)[6],=KL2OJ(3)[6],
#    =KL2P(3)[6],=KL2QE(3)[6],=KL2TR(3)[6],=KL2TZ(3)[6],=KL2VK(3)[6],=KL2YH(3)[6],=KL3DL(3)[6],
#    =KL3EZ(3)[6],=KL3FE(3)[6],=KL3IC(3)[6],=KL3IO(3)[6],=KL3IW(3)[6],=KL3MZ(3)[6],=KL3NE(3)[6],
#    =KL3NO(3)[6],=KL3OQ(3)[6],=KL3PD(3)[6],=KL3TW(3)[6],=KL3TY(3)[6],=KL3VJ(3)[6],=KL3XS(3)[6],
#    =KL4BQ(3)[6],=KL4BS(3)[6],=KL4E(3)[6],=KL4NG(3)[6],=KL4QJ(3)[6],=KL4RKH(3)[6],=KL4YFD(3)[6],
#    =KL7AB(3)[6],=KL7AD(3)[6],=KL7AW(3)[6],=KL7BD(3)[6],=KL7BDC(3)[6],=KL7BH(3)[6],=KL7BR(3)[6],
#    =KL7BS(3)[6],=KL7BT(3)[6],=KL7BUR(3)[6],=KL7BXP(3)[6],=KL7C(3)[6],=KL7CPO(3)[6],=KL7CT(3)[6],
#    =KL7CY(3)[6],=KL7DC(3)[6],=KL7DF(3)[6],=KL7DI(3)[6],=KL7DK(3)[6],=KL7DLG(3)[6],=KL7EBN(3)[6],
#    =KL7EF(3)[6],=KL7EFL(3)[6],=KL7EH(3)[6],=KL7EIN(3)[6],=KL7EU(3)[6],=KL7FDQ(3)[6],=KL7FDQ/7(3)[6],
#    =KL7FOZ(3)[6],=KL7FRQ(3)[6],=KL7FS(3)[6],=KL7GA(3)[6],=KL7GCS(3)[6],=KL7GKY(3)[6],=KL7GRF(3)[6],
#    =KL7GT(3)[6],=KL7HB(3)[6],=KL7HBV(3)[6],=KL7HFI/7(3)[6],=KL7HFV(3)[6],=KL7HI(3)[6],=KL7HJR(3)[6],
#    =KL7HLF(3)[6],=KL7HM(3)[6],=KL7HMK(3)[6],=KL7HQL(3)[6],=KL7HSR(3)[6],=KL7IAL(3)[6],=KL7IBT(3)[6],
#    =KL7IDY(3)[6],=KL7IEI(3)[6],=KL7IFK(3)[6],=KL7IGB(3)[6],=KL7IHK(3)[6],=KL7IIK(3)[6],=KL7IKV(3)[6],
#    =KL7IL(3)[6],=KL7IME(3)[6],=KL7IOW(3)[6],=KL7IPV(3)[6],=KL7ISE(3)[6],=KL7IUX(3)[6],
#    =KL7IWC/7(3)[6],=KL7IZC(3)[6],=KL7IZH(3)[6],=KL7JBB(3)[6],=KL7JDQ(3)[6],=KL7JES(3)[6],
#    =KL7JIJ(3)[6],=KL7JJE(3)[6],=KL7JKV(3)[6],=KL7KA(3)[6],=KL7KG/7(3)[6],=KL7LG(3)[6],=KL7LI(3)[6],
#    =KL7LX(3)[6],=KL7LZ(3)[6],=KL7M(3)[6],=KL7MY(3)[6],=KL7MZ(3)[6],=KL7NA(3)[6],=KL7NP(3)[6],
#    =KL7NP/7(3)[6],=KL7OA(3)[6],=KL7OF(3)[6],=KL7OL(3)[6],=KL7OR(3)[6],=KL7OR/7(3)[6],=KL7OS(3)[6],
#    =KL7OY(3)[6],=KL7PC(3)[6],=KL7PO(3)[6],=KL7QA(3)[6],=KL7QK(3)[6],=KL7QK/140(3)[6],=KL7QK/7(3)[6],
#    =KL7QR(3)[6],=KL7QR/7(3)[6],=KL7R(3)[6],=KL7RC(3)[6],=KL7RK(3)[6],=KL7RM(3)[6],=KL7RS(3)[6],
#    =KL7S(3)[6],=KL7SK(3)[6],=KL7SP(3)[6],=KL7T(3)[6],=KL7TU(3)[6],=KL7UP(3)[6],=KL7UT(3)[6],
#    =KL7VK(3)[6],=KL7VL(3)[6],=KL7VN(3)[6],=KL7VQ(3)[6],=KL7W(3)[6],=KL7WC(3)[6],=KL7WM(3)[6],
#    =KL7WN(3)[6],=KL7WP(3)[6],=KL7WP/7(3)[6],=KL7WT(3)[6],=KL7XL(3)[6],=KL7YJ(3)[6],=KL7YQ(3)[6],
#    =KL7YY/M(3)[6],=KL7ZH(3)[6],=KL7ZW(3)[6],=KL8RV(3)[6],=KL8SU(3)[6],=KL9PC(3)[6],=KP2BX(3)[6],
#    =KP2CB(3)[6],=KP2CT(3)[6],=KP2X(3)[6],=KP2Y(3)[6],=KP4EFZ(3)[6],=KP4ND(3)[6],=KP4UZ(3)[6],
#    =KP4X(3)[6],=NH0F(3)[6],=NH0K(3)[6],=NH0O(3)[6],=NH2DM(3)[6],=NH2JE(3)[6],=NH2KR(3)[6],
#    =NH6B(3)[6],=NH6BF(3)[6],=NH6CI(3)[6],=NH6DQ(3)[6],=NH6DX(3)[6],=NH6F(3)[6],=NH6FF(3)[6],
#    =NH6GZ(3)[6],=NH6HE(3)[6],=NH6HZ(3)[6],=NH6LF(3)[6],=NH6LM(3)[6],=NH6NS(3)[6],=NH6U(3)[6],
#    =NH6XN(3)[6],=NH6XP(3)[6],=NH6Z(3)[6],=NH6ZA(3)[6],=NH6ZE(3)[6],=NH7FZ(3)[6],=NH7L(3)[6],
#    =NH7M(3)[6],=NH7MY(3)[6],=NH7N(3)[6],=NH7ND(3)[6],=NH7NJ/7(3)[6],=NH7OC(3)[6],=NH7PL(3)[6],
#    =NH7RS(3)[6],=NH7S(3)[6],=NH7SH(3)[6],=NH7TG(3)[6],=NH7VZ(3)[6],=NH7W(3)[6],=NH7WT(3)[6],
#    =NH7WU(3)[6],=NH7YE(3)[6],=NH7YI(3)[6],=NL7AH(3)[6],=NL7AR(3)[6],=NL7AZ(3)[6],=NL7CH(3)[6],
#    =NL7D(3)[6],=NL7D/7(3)[6],=NL7DH(3)[6],=NL7DY(3)[6],=NL7EO(3)[6],=NL7FQ(3)[6],=NL7FX(3)[6],
#    =NL7GM(3)[6],=NL7GO(3)[6],=NL7GU(3)[6],=NL7GW(3)[6],=NL7HH(3)[6],=NL7HK(3)[6],=NL7HQ(3)[6],
#    =NL7HU(3)[6],=NL7IN(3)[6],=NL7JJ(3)[6],=NL7JN(3)[6],=NL7KV(3)[6],=NL7LI(3)[6],=NL7MS(3)[6],
#    =NL7MT(3)[6],=NL7NL(3)[6],=NL7OF(3)[6],=NL7PN(3)[6],=NL7QI(3)[6],=NL7RL(3)[6],=NL7RN(3)[6],
#    =NL7TK(3)[6],=NL7UE(3)[6],=NL7US(3)[6],=NL7WD(3)[6],=NL7WJ(3)[6],=NL7XX(3)[6],=NL7ZM(3)[6],
#    =NL7ZN(3)[6],=NL7ZP(3)[6],=NP2CT(3)[6],=NP2KL(3)[6],=NP2X/7(3)[6],=NP3PH(3)[6],=NP4AI/M(3)[6],
#    =NP4ES(3)[6],=NP4FP(3)[6],=NP4I(3)[6],=NP4JV(3)[6],=NP4JV/7(3)[6],=VA2GLB/P(3)[6],=WH0AAM(3)[6],
#    =WH0J(3)[6],=WH2ACV(3)[6],=WH2AJF(3)[6],=WH6ARU(3)[6],=WH6ASB(3)[6],=WH6B(3)[6],=WH6BDR(3)[6],
#    =WH6BLM(3)[6],=WH6BPL(3)[6],=WH6BPU(3)[6],=WH6CF(3)[6],=WH6CMS(3)[6],=WH6CN(3)[6],=WH6CUS(3)[6],
#    =WH6CWD(3)[6],=WH6CXB(3)[6],=WH6CXE(3)[6],=WH6CXN(3)[6],=WH6CYB(3)[6],=WH6CZ(3)[6],=WH6DAY(3)[6],
#    =WH6DJO(3)[6],=WH6DKC(3)[6],=WH6DLQ(3)[6],=WH6DMP(3)[6],=WH6DQ(3)[6],=WH6DST(3)[6],=WH6EEC(3)[6],
#    =WH6EEG(3)[6],=WH6EGM(3)[6],=WH6EHW(3)[6],=WH6EJV(3)[6],=WH6EQB(3)[6],=WH6ESS(3)[6],=WH6ETO(3)[6],
#    =WH6EWE(3)[6],=WH6FCT(3)[6],=WH6FEU(3)[6],=WH6FL(3)[6],=WH6FOJ(3)[6],=WH6FPS(3)[6],=WH6OL(3)[6],
#    =WH6OY(3)[6],=WH6QV(3)[6],=WH6SD(3)[6],=WH6SR(3)[6],=WH6TI(3)[6],=WH6U(3)[6],=WH6XV(3)[6],
#    =WH6YT(3)[6],=WH6ZR(3)[6],=WH6ZV(3)[6],=WH7A(3)[6],=WH7CY(3)[6],=WH7DB(3)[6],=WH7DE(3)[6],
#    =WH7G(3)[6],=WH7GC(3)[6],=WH7GY(3)[6],=WH7HU(3)[6],=WH7LB(3)[6],=WH7NS(3)[6],=WH7P(3)[6],
#    =WH7RG(3)[6],=WH7TC(3)[6],=WH7U(3)[6],=WH7UP(3)[6],=WH7WP(3)[6],=WH7WT(3)[6],=WH7XP(3)[6],
#    =WL7AAW(3)[6],=WL7AL(3)[6],=WL7AP(3)[6],=WL7AQ(3)[6],=WL7AUY(3)[6],=WL7AWD(3)[6],=WL7AZG(3)[6],
#    =WL7AZL(3)[6],=WL7BCR(3)[6],=WL7BHR(3)[6],=WL7BLM(3)[6],=WL7BM(3)[6],=WL7BNQ(3)[6],=WL7BON(3)[6],
#    =WL7BOO(3)[6],=WL7BSW(3)[6],=WL7BUI(3)[6],=WL7BVN(3)[6],=WL7BVS(3)[6],=WL7CAZ(3)[6],=WL7CBF(3)[6],
#    =WL7CES(3)[6],=WL7COQ(3)[6],=WL7CPE(3)[6],=WL7CPI(3)[6],=WL7CQX(3)[6],=WL7CRJ(3)[6],=WL7CSL(3)[6],
#    =WL7CTB(3)[6],=WL7CTC(3)[6],=WL7CTE(3)[6],=WL7DD(3)[6],=WL7FA(3)[6],=WL7FR(3)[6],=WL7FU(3)[6],
#    =WL7H(3)[6],=WL7HE(3)[6],=WL7HK(3)[6],=WL7HL(3)[6],=WL7IQ(3)[6],=WL7IS(3)[6],=WL7JM(3)[6],
#    =WL7K(3)[6],=WL7K/7(3)[6],=WL7K/M(3)[6],=WL7LB(3)[6],=WL7LK(3)[6],=WL7OA(3)[6],=WL7P(3)[6],
#    =WL7PJ(3)[6],=WL7QC(3)[6],=WL7QX(3)[6],=WL7RV/140(3)[6],=WL7SD(3)[6],=WL7SO(3)[6],=WL7SV(3)[6],
#    =WL7T(3)[6],=WL7VK(3)[6],=WL7WB(3)[6],=WL7WF(3)[6],=WL7WG(3)[6],=WL7WU(3)[6],=WL7XE(3)[6],
#    =WL7XJ(3)[6],=WL7XN(3)[6],=WL7XW(3)[6],=WL7Z(3)[6],=WL7ZM(3)[6],=WP2ADG(3)[6],=WP4BZG(3)[6],
#    =WP4DYP(3)[6],=WP4NBP(3)[6],
#    AA8(4)[8],AB8(4)[8],AC8(4)[8],AD8(4)[8],AE8(4)[8],AF8(4)[8],AG8(4)[8],AI8(4)[8],AJ8(4)[8],
#    AK8(4)[8],K8(4)[8],KA8(4)[8],KB8(4)[8],KC8(4)[8],KD8(4)[8],KE8(4)[8],KF8(4)[8],KG8(4)[8],
#    KI8(4)[8],KJ8(4)[8],KK8(4)[8],KM8(4)[8],KN8(4)[8],KO8(4)[8],KQ8(4)[8],KR8(4)[8],KS8(4)[8],
#    KT8(4)[8],KU8(4)[8],KV8(4)[8],KW8(4)[8],KX8(4)[8],KY8(4)[8],KZ8(4)[8],N8(4)[8],NA8(4)[8],
#    NB8(4)[8],NC8(4)[8],ND8(4)[8],NE8(4)[8],NF8(4)[8],NG8(4)[8],NI8(4)[8],NJ8(4)[8],NK8(4)[8],
#    NM8(4)[8],NN8(4)[8],NO8(4)[8],NQ8(4)[8],NR8(4)[8],NS8(4)[8],NT8(4)[8],NU8(4)[8],NV8(4)[8],
#    NW8(4)[8],NX8(4)[8],NY8(4)[8],NZ8(4)[8],W8(4)[8],WA8(4)[8],WB8(4)[8],WC8(4)[8],WD8(4)[8],
#    WE8(4)[8],WF8(4)[8],WG8(4)[8],WI8(4)[8],WJ8(4)[8],WK8(4)[8],WM8(4)[8],WN8(4)[8],WO8(4)[8],
#    WQ8(4)[8],WR8(4)[8],WS8(4)[8],WT8(4)[8],WU8(4)[8],WV8(4)[8],WW8(4)[8],WX8(4)[8],WY8(4)[8],
#    WZ8(4)[8],=AH2AR(4)[8],=AH2AV(4)[8],=AH2JD(4)[8],=AH6AO(4)[8],=AH6MQ(4)[8],=AL4E(4)[8],
#    =AL7AH(4)[8],=AL7BA/8(4)[8],=AL7GI(4)[8],=AL7GI/8(4)[8],=AL7J/8(4)[8],=AL7OP(4)[8],=KH2AP(4)[8],
#    =KH6BZF/8(4)[8],=KH6DHK(4)[8],=KH6IK(4)[8],=KH6ILT(4)[8],=KH6SM(4)[8],=KH7DK(4)[8],=KH7SP(4)[8],
#    =KL0DN(4)[8],=KL0NR(4)[8],=KL0PD(4)[8],=KL0PE(4)[8],=KL2NI(4)[8],=KL2PS(4)[8],=KL2YU(4)[8],
#    =KL3HQ(4)[8],=KL4PQ(4)[8],=KL5A(4)[8],=KL7DS(4)[8],=KL7FHI(4)[8],=KL7FHK(4)[8],=KL7GF(4)[8],
#    =KL7IKR(4)[8],=KL7OG(4)[8],=KL7RF(4)[8],=KL7RF/8(4)[8],=KL7SW(4)[8],=KL8X(4)[8],=KL9A/8(4)[8],
#    =KP2RF(4)[8],=KP4AKB(4)[8],=KP4AMZ(4)[8],=KP4AQI(4)[8],=KP4E(4)[8],=KP4MAS(4)[8],=KP4VZ(4)[8],
#    =KP4ZD(4)[8],=NH6CN(4)[8],=NH6CN/8(4)[8],=NL7CF(4)[8],=NL7FK(4)[8],=NP2AK(4)[8],=NP2F(4)[8],
#    =NP3NA(4)[8],=NP4C/8(4)[8],=VE3ACW/M(4)[8],=WH2U(4)[8],=WH6CYR(4)[8],=WH6E(4)[8],=WH6E/8(4)[8],
#    =WH6EBA(4)[8],=WH6EJD(4)[8],=WH6EWB(4)[8],=WH6TB(4)[8],=WL7AGO(4)[8],=WL7AM(4)[8],=WL7BKR(4)[8],
#    =WL7CMV(4)[8],=WL7GG(4)[8],=WL7OS(4)[8],=WL7OT(4)[8],=WP3KU(4)[8],=WP3S(4)[8],=WP4HJF(4)[8],
#    =WP4MWB(4)[8],=WP4NAE(4)[8],=WP4NYQ(4)[8],=WP4PLR(4)[8],
#    AA9(4)[8],AB9(4)[8],AC9(4)[8],AD9(4)[8],AE9(4)[8],AF9(4)[8],AG9(4)[8],AI9(4)[8],AJ9(4)[8],
#    AK9(4)[8],K9(4)[8],KA9(4)[8],KB9(4)[8],KC9(4)[8],KD9(4)[8],KE9(4)[8],KF9(4)[8],KG9(4)[8],
#    KI9(4)[8],KJ9(4)[8],KK9(4)[8],KM9(4)[8],KN9(4)[8],KO9(4)[8],KQ9(4)[8],KR9(4)[8],KS9(4)[8],
#    KT9(4)[8],KU9(4)[8],KV9(4)[8],KW9(4)[8],KX9(4)[8],KY9(4)[8],KZ9(4)[8],N9(4)[8],NA9(4)[8],
#    NB9(4)[8],NC9(4)[8],ND9(4)[8],NE9(4)[8],NF9(4)[8],NG9(4)[8],NI9(4)[8],NJ9(4)[8],NK9(4)[8],
#    NM9(4)[8],NN9(4)[8],NO9(4)[8],NQ9(4)[8],NR9(4)[8],NS9(4)[8],NT9(4)[8],NU9(4)[8],NV9(4)[8],
#    NW9(4)[8],NX9(4)[8],NY9(4)[8],NZ9(4)[8],W9(4)[8],WA9(4)[8],WB9(4)[8],WC9(4)[8],WD9(4)[8],
#    WE9(4)[8],WF9(4)[8],WG9(4)[8],WI9(4)[8],WJ9(4)[8],WK9(4)[8],WM9(4)[8],WN9(4)[8],WO9(4)[8],
#    WQ9(4)[8],WR9(4)[8],WS9(4)[8],WT9(4)[8],WU9(4)[8],WV9(4)[8],WW9(4)[8],WX9(4)[8],WY9(4)[8],
#    WZ9(4)[8],=AH0AJ(4)[8],=AH6DA(4)[8],=AH6EZ/9(4)[8],=AH6OM(4)[8],=AH6YL(4)[8],=AL1CE(4)[8],
#    =AL7AK(4)[8],=AL7AK/9(4)[8],=AL7BT(4)[8],=AL7CV(4)[8],=AL7DS(4)[8],=AL7II/9(4)[8],=AL7OL(4)[8],
#    =AL7PM(4)[8],=KH0BE(4)[8],=KH2RP(4)[8],=KH6JNY(4)[8],=KH6KI(4)[8],=KH6UX(4)[8],=KH7DR(4)[8],
#    =KH7EI(4)[8],=KL0LB(4)[8],=KL0NY(4)[8],=KL1NO(4)[8],=KL1NR(4)[8],=KL1QN(4)[8],=KL1US(4)[8],
#    =KL2A/9(4)[8],=KL2KP(4)[8],=KL2NQ(4)[8],=KL2UY(4)[8],=KL2YD(4)[8],=KL2ZL(4)[8],=KL4CX(4)[8],
#    =KL7AL(4)[8],=KL7AL/9(4)[8],=KL7BGR(4)[8],=KL7CE(4)[8],=KL7CE/9(4)[8],=KL7IBV(4)[8],=KL7IKP(4)[8],
#    =KL7IPS(4)[8],=KL7IVK(4)[8],=KL7JAB(4)[8],=KL7MU(4)[8],=KL7TD(4)[8],=KP2XX(4)[8],=KP3JOS(4)[8],
#    =KP3VA/M(4)[8],=KP4CI(4)[8],=KP4GE/9(4)[8],=KP4SL(4)[8],=KP4WG(4)[8],=NH2W(4)[8],=NH2W/9(4)[8],
#    =NH6R(4)[8],=NH7TK(4)[8],=NL7CM(4)[8],=NL7KD(4)[8],=NL7NK(4)[8],=NL7QC(4)[8],=NL7QC/9(4)[8],
#    =NL7RC(4)[8],=NL7UH(4)[8],=NL7YI(4)[8],=NP2AV(4)[8],=NP2GM(4)[8],=NP2L/9(4)[8],=NP2MU(4)[8],
#    =NP3QC(4)[8],=NP4ZI(4)[8],=WH0AI(4)[8],=WH2T(4)[8],=WH6ERQ(4)[8],=WH6FBA(4)[8],=WH6SB(4)[8],
#    =WL7AHP(4)[8],=WL7AIT(4)[8],=WL7BEV(4)[8],=WL7CTA(4)[8],=WL7FJ(4)[8],=WL7JAN(4)[8],=WL7NP(4)[8],
#    =WL7UU(4)[8],=WP2B(4)[8],=WP4JSP(4)[8],=WP4KGF(4)[8],=WP4LKY(4)[8],=WP4LSQ(4)[8],=WP4MQX(4)[8],
#    =WP4MSD(4)[8],=WP4MTN(4)[8],=WP4MVQ(4)[8],=WP4MXP(4)[8],=WP4MYL(4)[8],=WP4OCZ(4)[8],
#    =AH2BG(4)[8],=AH2CF(4)[8],=AH6ES(4)[8],=AH6FF(4)[8],=AH6HR(4)[8],=AH6HR/4(4)[8],=AH6KB(4)[8],
#    =AL0P(4)[8],=AL2C(4)[8],=AL2F(4)[8],=AL2F/4(4)[8],=AL4B(4)[8],=AL7CX(4)[8],=AL7EU(4)[8],
#    =AL7JN(4)[8],=AL7KN(4)[8],=AL7LP(4)[8],=AL7MR(4)[8],=AL7QO(4)[8],=KH0UN(4)[8],=KH2AR(4)[8],
#    =KH2AR/4(4)[8],=KH2DN(4)[8],=KH4AF(4)[8],=KH6EO(4)[8],=KH6JQW(4)[8],=KH6KM(4)[8],=KH6OE(4)[8],
#    =KH6RD(4)[8],=KH6RD/4(4)[8],=KH6SKY(4)[8],=KH6SKY/4(4)[8],=KH7JM(4)[8],=KH7UB(4)[8],=KL0AH(4)[8],
#    =KL0BX(4)[8],=KL0CP(4)[8],=KL0ET(4)[8],=KL0ET/M(4)[8],=KL0EY(4)[8],=KL0FF(4)[8],=KL0GI(4)[8],
#    =KL0LN(4)[8],=KL0PM(4)[8],=KL0VH(4)[8],=KL1DN(4)[8],=KL1IG(4)[8],=KL1LV(4)[8],=KL1SE(4)[8],
#    =KL1SE/4(4)[8],=KL1ZA(4)[8],=KL2GB(4)[8],=KL2HK(4)[8],=KL2LK(4)[8],=KL2LU(4)[8],=KL2MU(4)[8],
#    =KL2TD(4)[8],=KL3PG(4)[8],=KL3PV(4)[8],=KL4KA(4)[8],=KL7DT/4(4)[8],=KL7FO/P(4)[8],=KL7GN/M(4)[8],
#    =KL7IUQ(4)[8],=KL7JKC(4)[8],=KL7LT(4)[8],=KL7WW(4)[8],=KL7YN(4)[8],=KL7YT(4)[8],=KL9MEK(4)[8],
#    =KP3RC(4)[8],=KP4TOM(4)[8],=NH2E(4)[8],=NH6T/4(4)[8],=NH7FK(4)[8],=NH7FL(4)[8],=NH7H(4)[8],
#    =NL7OE(4)[8],=NL7YU(4)[8],=NP3FB(4)[8],=NP4AC(4)[8],=NP4AC/4(4)[8],=WH6AUL(4)[8],=WH6BPL/4(4)[8],
#    =WH6DM(4)[8],=WH6EOG(4)[8],=WH6EQW(4)[8],=WH6FEJ(4)[8],=WH6LAK(4)[8],=WH6OR(4)[8],=WH6Q/4(4)[8],
#    =WL4B(4)[8],=WL7BHI(4)[8],=WL7BHJ(4)[8],=WL7CQH(4)[8],=WL7CQK(4)[8],=WL7IP(4)[8],=WL7PC(4)[8],
#    =WL7SF(4)[8],=WL7TD(4)[8],=WL7XZ(4)[8],=WP4CNA(4)[8],
#    =AL7AU(4)[7],=AL7NI(4)[7],=AL7RT(4)[7],=AL7RT/7(4)[7],=KH2BR/7(4)[7],=KH6JVF(4)[7],=KH6OZ(4)[7],
#    =KH7SS(4)[7],=KL0NT(4)[7],=KL0NV(4)[7],=KL0RN(4)[7],=KL0TF(4)[7],=KL1HE(4)[7],=KL1MW(4)[7],
#    =KL1TV(4)[7],=KL2NZ(4)[7],=KL4CZ(4)[7],=KL7AR(4)[7],=KL7HF(4)[7],=KL7HSG(4)[7],=KL7JGS(4)[7],
#    =KL7JGS/M(4)[7],=KL7JM(4)[7],=KL7JUL(4)[7],=KL7LH(4)[7],=KL7MVX(4)[7],=KL7YY/7(4)[7],=KL9A(4)[7],
#    =KL9A/7(4)[7],=NH0E(4)[7],=NH6HW(4)[7],=NL7IH(4)[7],=NL7MW(4)[7],=NL7UI(4)[7],=WH2M(4)[7],
#    =WH6COM(4)[7],=WH6ETU(4)[7],=WH6EVP(4)[7],=WL7A(4)[7],=WL7DP(4)[7],=WL7HP/7(4)[7],=WL7I(4)[7],
#    =AL7LU(5)[8],=KL7JFR(5)[8],=WL7HC(5)[8],=WP4GR(5)[8];
#Guantanamo Bay:           08:  11:  NA:   20.00:    75.00:     5.0:  KG4:
#    KG4,=KG44WW,=KG4AC,=KG4AS,=KG4AW,=KG4AY,=KG4BP,=KG4DY,=KG4EM,=KG4EU,=KG4HF,=KG4HH,=KG4LA,=KG4LB,
#    =KG4SC,=KG4SS,=KG4WH,=KG4WV,=KG4XP,=KG4ZK,=W1AW/KG4;
#Mariana Islands:          27:  64:  OC:   15.18:  -145.72:   -10.0:  KH0:
#    AH0,KH0,NH0,WH0,=AB2HV,=AB2QH,=AB9HF,=AB9OQ,=AC8CP,=AD5KT,=AD6YP,=AE6OG,=AF4IN,=AF4KH,=AF6EO,
#    =AH2U,=AJ6K,=AK1JA,=K0FRI,=K8KH,=K8RN,=KB5UAB,=KB9LQG,=KC2WIK,=KC5SPG,=KC7SDC,=KC9GQX,=KD7GJX,
#    =KF7COQ,=KG2QH,=KG6GQ,=KG6SB,=KG7DCN,=KH0EN/KT,=KH2GV,=KH2O,=KH2VL,=KL7QOL,=KW2X,=N0J,=N3QD,
#    =N6EAX,=N7NVX,=N8CS,=NA1M,=NH2B,=NH2FG,=NO3V,=NS0C,=NU2A,=W1FPU,=W3FM,=W3NL,=W3STX,=W7KFS,=WA6AC,
#    =WE1J,=WH6ZW,=WO2G;
#Baker & Howland Islands:  31:  61:  OC:    0.00:   176.00:    12.0:  KH1:
#    AH1,KH1,NH1,WH1;
#Guam:                     27:  64:  OC:   13.37:  -144.70:   -10.0:  KH2:
#    AH2,KH2,NH2,WH2,=AB2AB,=AB8EW,=AC0FG,=AC7WL,=AE6QZ,=AE7CA,=AH0AX,=AH0F,=AH0FM,=AH0S,=AI6ID,=AJ6JF,
#    =K1IWD,=K2QGC,=K4QFS,=K5GUA,=K5GUM,=KA0RU,=KA1I,=KA6BEG,=KB5OXR,=KB7OVT,=KB7PQU,=KC2OOX,=KD7IRV,
#    =KE4YSP,=KE7GMC,=KE7IPG,=KF4UFC,=KF5ULC,=KF7BMU,=KG4BKW,=KG6AGT,=KG6ARL,=KG6DX,=KG6FJG,=KG6JDX,
#    =KG6JKR,=KG6JKT,=KG6TWZ,=KH0C,=KH0DX,=KH0ES,=KH0TF,=KH0UM,=KH6KK,=KI4KKH,=KI4KKI,=KI7SSW,=KJ6AYQ,
#    =KJ6KCJ,=KK6GVF,=KK7AV,=KM4NVB,=N0RY,=N2MI,=NH0A,=NH0B,=NH0Q,=NH7TL,=NH7WC,=NP3EZ,=W5LFA,=W6KV,
#    =W7GVC,=W9MRE,=WA3KNB,=WB7AXZ,=WD6DGS,=WH0AC;
#Johnston Island:          31:  61:  OC:   16.72:   169.53:    10.0:  KH3:
#    AH3,KH3,NH3,WH3,=KJ6BZ;
#Midway Island:            31:  61:  OC:   28.20:   177.37:    11.0:  KH4:
#    AH4,KH4,NH4,WH4;
#Palmyra & Jarvis Islands: 31:  61:  OC:    5.87:   162.07:    11.0:  KH5:
#    AH5,KH5,NH5,WH5;
#Hawaii:                   31:  61:  OC:   21.12:   157.48:    10.0:  KH6:
#    AH6,AH7,KH6,KH7,NH6,NH7,WH6,WH7,=AA7LE,=AA8JA,=AB0JM,=AB3WS,=AB6AP,=AB8VQ,=AC4PJ,=AC4TJ,=AC9PT,
#    =AE3TT,=AE5AB,=AE5LR,=AG4FH,=AH0A,=AH0AG,=AH2CN,=AJ0M,=AJ8HT,=AK0P,=AK2J,=AL3U,=AL7RQ,=K0BAD,
#    =K0LAS,=K0LIH,=K0LUC,=K0OUS,=K1ENT,=K1HZM,=K1OSP,=K1OWL,=K1RJ,=K1VAN,=K2FFT,=K2GT,=K3NW,=K3QHP,
#    =K3UNS,=K4AJQ,=K4EVR,=K4RAC,=K4UAI,=K4UHL,=K4XS,=K4XSS,=K4XV,=K5HQM,=K5ZAI,=K5ZYO,=K6AMA,=K6APP,
#    =K6BU,=K6CEE,=K6GJS,=K6GUY,=K6HI,=K6HNL,=K6IJ,=K6JAE,=K6KKW,=K6MIO,=K6NLF,=K6RSB,=K7ALH,=K7ASH,
#    =K7FAR,=K7FR,=K7NRJ,=K7QAS,=K8EUT,=K9AGI,=K9FD,=K9UBS,=KA0FOR,=KA0VHP,=KA1ICJ,=KA1YJ,=KA2IXG,
#    =KA2WXU,=KA3HIZ,=KA3TUA,=KA4INK,=KA4SBE,=KA6QOD,=KA6SVW,=KA7APU,=KA7BSK,=KA7RKW,=KA8EBL,=KA8KND,
#    =KA9DMP,=KB0DJR,=KB0PXK,=KB0ZKZ,=KB1EUJ,=KB1GC,=KB1PCX,=KB1UHL,=KB2MRY,=KB3DMT,=KB3IOC,=KB3OXU,
#    =KB3PJS,=KB3SEV,=KB4NGN,=KB5HVJ,=KB5NNY,=KB5OWT,=KB6CNU,=KB6EGA,=KB6INB,=KB6PKF,=KB6SWL,=KB7AKH,
#    =KB7AKQ,=KB7DDX,=KB7EA,=KB7G,=KB7JB,=KB7MEU,=KB7QKJ,=KB7UQH,=KB7UVR,=KB7WDC,=KB7WUP,=KB8SKX,
#    =KC0WQU,=KC0YIH,=KC0ZER,=KC1DBY,=KC2GSU,=KC2HL,=KC2MIU,=KC2PGW,=KC2SRW,=KC2YL,=KC2ZSG,=KC2ZSH,
#    =KC2ZSI,=KC3GZT,=KC4HHS,=KC5GAX,=KC6HOX,=KC6QQI,=KC6RYQ,=KC6SHT,=KC6SWR,=KC6YIO,=KC7ASJ,=KC7AXX,
#    =KC7DUT,=KC7EJC,=KC7HNC,=KC7KAT,=KC7KAW,=KC7KBA,=KC7KHW,=KC7KJT,=KC7LFM,=KC7NZ,=KC7PLG,=KC7USA,
#    =KC7VHF,=KC7VWU,=KC7YXO,=KC8EFI,=KC8EJ,=KC9AUA,=KC9EQS,=KC9KEX,=KC9NJG,=KC9SBG,=KD0OXU,=KD0QLQ,
#    =KD0QLR,=KD0RPD,=KD0WVZ,=KD0ZSP,=KD3FZ,=KD4GVR,=KD4GW,=KD4ML,=KD4NFW,=KD4QWO,=KD5BSK,=KD5HDA,
#    =KD5HX,=KD5TBQ,=KD6CVU,=KD6CWF,=KD6EPD,=KD6IPX,=KD6LRA,=KD6NVX,=KD6VTU,=KD7GWI,=KD7GWM,=KD7HTG,
#    =KD7KFT,=KD7LMP,=KD7SME,=KD7SMV,=KD7TZ,=KD7UV,=KD7UZG,=KD7WJM,=KD8GVO,=KD8LYB,=KE0JSB,=KE0TU,
#    =KE2CX,=KE4DYE,=KE4RNU,=KE4UXQ,=KE4ZXQ,=KE5CGA,=KE5FJM,=KE5UZN,=KE5VQB,=KE6AHX,=KE6AXN,=KE6AXP,
#    =KE6AYZ,=KE6CQE,=KE6EDJ,=KE6EVT,=KE6JXO,=KE6MKW,=KE6RAW,=KE6TFR,=KE6TIS,=KE6TIX,=KE6TKQ,=KE7FJA,
#    =KE7FSK,=KE7HEW,=KE7IZS,=KE7JTX,=KE7KRQ,=KE7LWN,=KE7MW,=KE7PEQ,=KE7PIZ,=KE7QML,=KE7RCT,=KE7UAJ,
#    =KE7UV,=KE7UW,=KF4DWA,=KF4FQR,=KF4IBW,=KF4JLZ,=KF4OOB,=KF4URD,=KF4VHS,=KF5AHW,=KF5MXM,=KF5MXP,
#    =KF6BS,=KF6FDG,=KF6IVV,=KF6LWN,=KF6LYU,=KF6MQT,=KF6OSA,=KF6PJ,=KF6PQE,=KF6QZD,=KF6RLP,=KF6YZR,
#    =KF6ZAL,=KF6ZVS,=KF7GNP,=KF7IJL,=KF7LRS,=KF7OJR,=KF7TUU,=KF7VUK,=KG0XR,=KG4CAN,=KG4FJB,=KG4HZF,
#    =KG4SGC,=KG4SGV,=KG4TZD,=KG6DV,=KG6EFD,=KG6HRX,=KG6IGY,=KG6JJP,=KG6LFX,=KG6MZJ,=KG6NNF,=KG6NQI,
#    =KG6OOB,=KG6RJI,=KG6SDD,=KG6TFI,=KG6WZD,=KG6ZRY,=KG7AYU,=KG7CJI,=KG7CVR,=KG7EUP,=KG9MDR,=KH0AI,
#    =KH0HL,=KH0WJ,=KH2MD,=KH2TD,=KH2TE,=KH2YI,=KH3AE,=KH3AE/M,=KH3AF,=KH8Z,=KI4CAU,=KI4HCZ,=KI4NOH,
#    =KI4YAF,=KI4YOG,=KI6CRL,=KI6DVJ,=KI6EFY,=KI6FTE,=KI6HBZ,=KI6JEC,=KI6LPT,=KI6NOC,=KI6QDQ,=KI6QQJ,
#    =KI6SNP,=KI6VYB,=KI6WOJ,=KI6ZRV,=KI7AUZ,=KI7EZG,=KI7FJW,=KI7FJX,=KI7FUT,=KI7OS,=KI7QZQ,=KJ4BHO,
#    =KJ4EYV,=KJ4KND,=KJ4WOI,=KJ6COM,=KJ6GYD,=KJ6LAW,=KJ6LAX,=KJ6LBI,=KJ6NZH,=KJ6QQT,=KJ6RGW,=KJ6SKC,
#    =KJ6TJZ,=KK4EEC,=KK4RNF,=KK6BRW,=KK6EJ,=KK6GM,=KK6OMX,=KK6PGA,=KK6QAI,=KK6RM,=KK6VJN,=KK6ZQ,
#    =KK6ZZE,=KK7WR,=KL0TK,=KL1TP,=KL3FN,=KL3JC,=KL7PN,=KL7UB,=KL7XT,=KM4IP,=KM6IK,=KM6RM,=KM6UVP,
#    =KN6BE,=KN6ZU,=KN8AQR,=KO6KW,=KO6QT,=KQ6CD,=KQ6M,=KR1LLR,=KU4OY,=KW4JC,=KX6RTG,=KY1I,=N0CAN,
#    =N0DQD,=N0KXY,=N0PJV,=N0RMC,=N0ZSJ,=N1CBF,=N1CFD,=N1CNQ,=N1IDP,=N1SHV,=N1TEE,=N1TLE,=N1VOP,=N1YLH,
#    =N2AL,=N2KJU,=N2KLQ,=N3BQY,=N3DJT,=N3FUR,=N3GWR,=N3HQW,=N3RWD,=N3VDM,=N3ZFY,=N4ERA,=N4ZIW,=N5IWF,
#    =N5JKJ,=N6AI,=N6CGA,=N6DXW,=N6GOZ,=N6IKX,=N6KB,=N6NCT,=N6PJQ,=N6QBK,=N6XIV,=N6ZAB,=N7AMY,=N7BLC,
#    =N7BMD,=N7KZB,=N7NYY,=N7ODC,=N7TSV,=N7WBX,=N9CRQ,=N9GFL,=N9SBL,=NB6R,=ND1A,=NE7SO,=NG1T,=NH2CC,
#    =NH2CD,=NH2CF,=NH2CQ,=NH2CR,=NH2IB,=NH2IF,=NH2II,=NH2IJ,=NH2IO,=NH2JO,=NH2KF,=NH2KH,=NH2YL,=NH2Z,
#    =NI1J,=NL7UW,=NM2B,=NO0H,=NT0DA,=NT4AA,=NZ2F,=W0UNX,=W1BMB,=W2UNS,=W3ZRT,=W4PRO,=W4YQS,=W5FJG,
#    =W6AUS,=W6CAG,=W6CWJ,=W6KEV,=W6KIT,=W6KPI,=W6MQB,=W6MRJ,=W6NBK,=W6ROM,=W6SHH,=W6UNX,=W7EHP,=W7NVQ,
#    =W7NX,=W7RCR,=W7UEA,=W8AYD,=W8JAY,=W8WH,=WA0FUR,=WA0NHD,=WA0TFB,=WA2AUI,=WA3ZEM,=WA6ECX,=WA6IIQ,
#    =WA6JDA,=WA6JJQ,=WA6QDQ,=WA6UVF,=WA7ESE,=WA7HEO,=WA7TFE,=WA7ZK,=WA8JQP,=WB0RUA,=WB0TZQ,=WB2AHM,
#    =WB2SQW,=WB4JTT,=WB4MNF,=WB5ZDH,=WB5ZOV,=WB6CVJ,=WB6PIO,=WB6PJT,=WB6SAA,=WB8NCD,=WB9SMM,=WC6B,
#    =WD0FTF,=WD0LFN,=WD6EZL,=WD6GHJ,=WD8LIB,=WD8OBO,=WH2Y,=WH7K,=WU0H,=WV0Z,=WV6K,=WY6F;
#Kure Island:              31:  61:  OC:   29.00:   178.00:    10.0:  KH7K:
#    AH7K,KH7K,NH7K,WH7K;
#American Samoa:           32:  62:  OC:  -14.32:   170.78:    11.0:  KH8:
#    AH8,KH8,NH8,WH8,=AB9OH,=AF7MN,=KD8TFY,=KH0WF,=KM4YJH,=KS6EL,=KS6FS,=W3HG,=WH6BAR,=WL7BMP;
#Swains Island:            32:  62:  OC:  -11.05:   171.25:    11.0:  KH8/s:
#    =KH6BK/KH8,=KH8/WH7S,=KH8S/K3UY,=KH8S/NA6M,=KH8SI,=NH8S,=W8S;
#Wake Island:              31:  65:  OC:   19.28:  -166.63:   -12.0:  KH9:
#    AH9,KH9,NH9,WH9;
#Alaska:                   01:  01:  NA:   61.40:   148.87:     8.0:  KL:
#    AL,KL,NL,WL,=AA0NN,=AA8FY,=AB0IC,=AB0WK,=AB5JB,=AB7YB,=AB7YO,=AB8XX,=AB9OM,=AC0CW,=AC9QX,=AD0DK,
#    =AD0FQ,=AD0ZL,=AD3BJ,=AD6GC,=AD7MF,=AD7VV,=AE1DJ,=AE4QH,=AE5CP,=AE5EX,=AE5FN,=AE5IR,=AE7ES,=AE7KS,
#    =AE7SB,=AF7FV,=AG5LN,=AG5OF,=AH0AH,=AH0H,=AJ4MY,=AJ4ZI,=AK4CM,=K0AZZ,=K0BHC,=K1BZD,=K1KAO,=K1MAT,
#    =K2ICW,=K2NPS,=K3JMI,=K4DRC,=K4ETC,=K4HOE,=K4PSG,=K4RND,=K4WPK,=K5DOW,=K5HL,=K5RD,=K5RSO,=K5RZW,
#    =K5TDN,=K6ANE,=K6GKW,=K7EJM,=K7GRW,=K7LOP,=K7MVX,=K7OCL,=K7RDR,=K7SGA,=K7UNX,=K7VRK,=K8IEL,=K8OUA,
#    =K9DUG,=KA0SIM,=KA0YPV,=KA1NCN,=KA2TJZ,=KA2ZSD,=KA6UGT,=KA7ETQ,=KA7HOX,=KA7JOR,=KA7TMU,=KA7TOM,
#    =KA7UKN,=KA7VCR,=KA7YEY,=KA9GYQ,=KB0APK,=KB0LOW,=KB0TSU,=KB0UGE,=KB0UVK,=KB1CRT,=KB1FCX,=KB1KLH,
#    =KB1PHP,=KB1QCD,=KB1QCE,=KB1SYV,=KB1WQL,=KB2JWV,=KB2ZME,=KB3CYB,=KB3JFK,=KB3NCR,=KB3VQE,=KB4DX,
#    =KB5DNT,=KB5HEV,=KB5UWU,=KB6DKJ,=KB7AMA,=KB7BNG,=KB7BUF,=KB7DEL,=KB7FXJ,=KB7IBI,=KB7JA,=KB7LJZ,
#    =KB7LON,=KB7PHT,=KB7QLB,=KB7RXZ,=KB7SIQ,=KB7UBH,=KB7VFZ,=KB7YEC,=KB7ZVZ,=KB8QKR,=KB8SBG,=KB8TEW,
#    =KB8VYJ,=KB9MWG,=KB9RWE,=KB9RWJ,=KB9YGR,=KC0ATI,=KC0CWG,=KC0CYR,=KC0EF,=KC0GDH,=KC0GHH,=KC0GLN,
#    =KC0LLL,=KC0NSV,=KC0OKQ,=KC0PSZ,=KC0TK,=KC0TZL,=KC0UYK,=KC0VDN,=KC0WSG,=KC0YSW,=KC1DL,=KC1KPL,
#    =KC2BYX,=KC2GVS,=KC2HRV,=KC2KMU,=KC2OJP,=KC2PCV,=KC2PIO,=KC3DBK,=KC4MXQ,=KC4MXR,=KC5BNN,=KC5CHO,
#    =KC5DJA,=KC5KIG,=KC5LKF,=KC5LKG,=KC5QPJ,=KC5THY,=KC5YIB,=KC5YOX,=KC5ZAA,=KC6RJW,=KC7BUL,=KC7COW,
#    =KC7ENM,=KC7FWK,=KC7GSO,=KC7HJM,=KC7HPF,=KC7IKE,=KC7IKF,=KC7INC,=KC7MIJ,=KC7MPY,=KC7MRO,=KC7OQZ,
#    =KC7PLJ,=KC7PLQ,=KC7RCP,=KC7TYT,=KC7UZY,=KC7WOA,=KC7YZR,=KC8GKK,=KC8MVW,=KC8NOY,=KC8WWS,=KC8YIV,
#    =KC9CMY,=KC9HIK,=KC9VLD,=KD0CLU,=KD0CZC,=KD0DHU,=KD0FJG,=KD0IXU,=KD0JJB,=KD0NSG,=KD0ONB,=KD0VAK,
#    =KD0VAL,=KD0ZOD,=KD2CTE,=KD2GKT,=KD2NPD,=KD2SKJ,=KD4EYW,=KD4MEY,=KD4QJL,=KD5DNA,=KD5DWV,=KD5GAL,
#    =KD5QPD,=KD5RVD,=KD5WCF,=KD5WEV,=KD5WYP,=KD6DLB,=KD6RVY,=KD6YKS,=KD7APU,=KD7AWK,=KD7BBX,=KD7BGP,
#    =KD7DIG,=KD7DUQ,=KD7FGL,=KD7FUL,=KD7GFG,=KD7HXF,=KD7KRK,=KD7MGO,=KD7OOS,=KD7QAR,=KD7SIX,=KD7TWB,
#    =KD7UAG,=KD7VOI,=KD7VXE,=KD7ZTJ,=KD8DDY,=KD8GEL,=KD8GMS,=KD8JOU,=KD8LNA,=KD8WMX,=KD9TK,=KE0DYM,
#    =KE0KKI,=KE4DGR,=KE4MQD,=KE4YEI,=KE4YLG,=KE5CVD,=KE5CVT,=KE5DQV,=KE5FOC,=KE5GEB,=KE5HHR,=KE5JHS,
#    =KE5JTB,=KE5NLG,=KE5QDI,=KE5QDJ,=KE5QDK,=KE5VPO,=KE5ZRK,=KE5ZUM,=KE6DLM,=KE6DUJ,=KE6DXH,=KE6IPM,
#    =KE6SYD,=KE6TCE,=KE6VUB,=KE7DFO,=KE7ELL,=KE7EOP,=KE7EPZ,=KE7FNC,=KE7FXM,=KE7GOE,=KE7HMJ,=KE7KYU,
#    =KE7PXV,=KE7TRX,=KE8RO,=KF3L,=KF4JET,=KF4PLR,=KF4TBD,=KF4YFD,=KF5CVM,=KF5ETW,=KF5FJQ,=KF5HFB,
#    =KF5HJC,=KF5NDT,=KF5UBP,=KF5YYK,=KF6AWG,=KF6AXS,=KF6BMF,=KF6BOV,=KF6EJR,=KF6GNM,=KF6IAO,=KF6ILC,
#    =KF6IOT,=KF6LGK,=KF6MFK,=KF6QOJ,=KF6RMG,=KF6RPC,=KF6SHS,=KF6TGR,=KF6UWT,=KF7CXJ,=KF7FLL,=KF7FLM,
#    =KF7GKY,=KF7KTH,=KF7LEX,=KF7LUA,=KF7PCJ,=KF7PFT,=KF7PSS,=KF7PUQ,=KF7UFY,=KF7VBO,=KF8ZB,=KG2IA,
#    =KG4BBX,=KG4NBL/P,=KG4TJS,=KG4WNZ,=KG5EQN,=KG5GDF,=KG5GTD,=KG5JQC,=KG5MIB,=KG5MIO,=KG6DTI,=KG6MBC,
#    =KG6RJE,=KG6TAL,=KG7CUR,=KG7DVI,=KG7GJL,=KG7JVJ,=KG7OQC,=KG7OUF,=KG7SEQ,=KG7TGE,=KH0NF,=KH0NG,
#    =KH0RF,=KH2YN,=KH7BW,=KH7DA,=KI4COG,=KI4ERC,=KI4GAG,=KI4GCF,=KI4GDI,=KI4NGY,=KI4NVI,=KI4SET,
#    =KI4SOM,=KI6BGR,=KI6DES,=KI6HGW,=KI6YXZ,=KI7COR,=KI7PZ,=KI8JT,=KJ4HEW,=KJ4IAQ,=KJ4PSV,=KJ4WDI,
#    =KJ4WIQ,=KJ4YOY,=KJ4ZWI,=KJ6DCH,=KJ6KRG,=KJ6ZSX,=KJ7IR,=KJ7MY,=KK4AMV,=KK4CLS,=KK4LRE,=KK4QXE,
#    =KK4RYG,=KK4WWH,=KK4WWI,=KK6IUY,=KK6PGV,=KK7I,=KK7IV,=KK7STL,=KL7D/M,=KL7NC/IMD,=KM4AGL,=KM4KWS,
#    =KM4KX,=KM4NIC,=KM4OE,=KM4PJH,=KM4TJI,=KM6NOL,=KN4HGD,=KN4RXC,=KN8IVE,=KR4WV,=KV3X,=KW1W,=KY7J,
#    =KZ6HJC,=N0GDT,=N0GDU,=N0GLI,=N0HJT,=N0HYI,=N0HZF,=N0JEN,=N0LHN,=N0SN,=N0SUB,=N0WXJ,=N0XKY,=N0XS,
#    =N0ZKV,=N1HEN,=N1HUT,=N1KDQ,=N1KTI,=N1NDA,=N1NJS,=N1QFE,=N1TX,=N2CXH,=N2SHO,=N2TJY,=N2YZW,=N3QEH,
#    =N4AVX,=N4CM,=N4HCJ,=N4HZU,=N4NAV,=N5CSO,=N5UKX,=N5WPR,=N6BSC,=N6CVV,=N6CZU,=N6JM,=N6PU,=N6QEK,
#    =N6ZZX,=N7BUO,=N7DBN,=N7DKL,=N7FCT,=N7HER,=N7HQK,=N7HRO,=N7IA,=N7JUX,=N7MGT,=N7MTG,=N7PHB,=N7QAN,
#    =N7TBU,=N7UTV,=N7UWT,=N7XEA,=N7XNM,=N7YKY,=N7YQS,=N8DDY,=N8EX,=N8JKB,=N8KCJ,=N8SUG,=N9AIG,=N9YD,
#    =NA7WM,=NC4OI,=NE7EK,=NH2GZ,=NH7UO,=NJ7H,=NM0H,=NN4NN,=NP4FU,=NU9Q,=NW7F,=W0EZM,=W0FJN,=W0RWS,
#    =W0UZJ,=W0ZEE,=W1JM,=W1LYD,=W1RSC,=W1ZKA,=W2DLS,=W2KRZ,=W3JPN,=W3MKG,=W4AUL,=W4BMR,=W4RSB,=W5JKT,
#    =W6DDP,=W6GTE,=W6ROW,=W7APM,=W7DDG,=W7EIK,=W7JMR,=W7PWA,=W7RAZ,=W7ROS,=W7WEZ,=W7ZWT,=W8MDD,=W8PVZ,
#    =W8TCX,=W9ITU,=W9JMC,=WA0JS,=WA1FVJ,=WA2BGL,=WA2BIW,=WA6GFS,=WA7B,=WA7PXH,=WA7USX,=WA7YXF,=WB0CMZ,
#    =WB1GZL,=WB1ILS,=WB6COP,=WB7TYK,=WB9JZL,=WD6CET,=WH6CYY,=WH6DPL,=WH6DX,=WH6GBB,=WH6GCO,=WH7AK,
#    =WJ8M,=WP4IYI,=WT5T,=WX1NCC;
#Navassa Island:           08:  11:  NA:   18.40:    75.00:     5.0:  KP1:
#    KP1,NP1,WP1;
#US Virgin Islands:        08:  11:  NA:   17.73:    64.80:     4.0:  KP2:
#    KP2,NP2,WP2,=AC7FX,=AJ2O,=K5KFL,=K5TP,=K8RF,=KA7KDU,=KB1MDZ,=KB1ZTY,=KB3ZUD,=KB9ALR,=KC9MCN,
#    =KD4SGB,=KD5QJN,=KF2HC,=KF4CGR,=KF4MSI,=KG4SZC,=KG5KHO,=KG6KVR,=KH2XQ,=KH2XR,=KI4FOE,=KI4FZD,
#    =KI6BLD,=KJ6IR,=KL7NZ,=KR7O/R,=KV4/W2KW,=KV4AD,=KV4BA,=KV4BT,=KV4BW,=KV4CF,=KV4CQ/P,=KV4DN,=KV4EY,
#    =KV4FZ,=KV4HR,=KV4IH,=KV4JC,=KV4KW,=N1TKK,=N1VKI,=W0AIH/KV4,=W0YNY,=W2AZK,=W2KW/KV4,=W3K/KD2CLB,
#    =W4LIS,=WA4HLB,=WB2KQW,=WB4WFU,=WD8AHQ,=WI7C;
#Puerto Rico:              08:  11:  NA:   18.18:    66.55:     4.0:  KP4:
#    KP3,KP4,NP3,NP4,WP3,WP4,=AA2ZN,=AB2DR,=AF4OU,=AF5IZ,=AG4CD,=AI4EZ,=K1NDN,=K4C/LH,=K4LCR,=K4PFH,
#    =K5YJR,=K6BOT,=K9JOS,=KA2GNG,=KA2MBR,=KA2UCX,=KA2YGB,=KA3ZGQ,=KA7URH,=KA9UTY,=KB0AQB,=KB0TEP,
#    =KB1CKX,=KB1IJU,=KB1KDP,=KB1RUQ,=KB1TUA,=KB1UEK,=KB1UZV,=KB1ZKF,=KB2ALR,=KB2CIE,=KB2KWB,=KB2MMX,
#    =KB2NMT,=KB2NYN,=KB2OIF,=KB2OMN,=KB2OPM,=KB2QQK,=KB2RYP,=KB2TID,=KB2VHY,=KB2WKT,=KB2YKJ,=KB3BPK,
#    =KB3BTN,=KB3LUV,=KB3SBO,=KB8ZVP,=KB9OWX,=KB9RZD,=KB9YVE,=KB9YVF,=KC1CRV,=KC1CUF,=KC1DRV,=KC1IHB,
#    =KC1IHO,=KC1JLY,=KC1KZI,=KC2BZZ,=KC2CJL,=KC2CTM,=KC2DUO,=KC2EMM,=KC2ERU,=KC2JNE,=KC2LET,=KC2TE,
#    =KC2UXP,=KC2VCR,=KC3GEO,=KC5DKT,=KC8BFN,=KC8IRI,=KD2KPC,=KD2VQ,=KD4TVS,=KD5DVV,=KD5PKH,=KD9GIZ,
#    =KD9MRY,=KE0AYJ,=KE0GFK,=KE0SH,=KE1MA,=KE3WW,=KE4GGD,=KE4GYA,=KE4SKH,=KE4THL,=KE4WUE,=KE5LNG,
#    =KF4KPO,=KF4ZDB,=KF6OGJ,=KG4EEG,=KG4EEL,=KG4GYO,=KG4IRC,=KG4IVO,=KG4VCC,=KG5AFY,=KH2RU,=KH4AA,
#    =KI4LRJ,=KI4RGF,=KI4WOA,=KI4WOB,=KJ4KZN,=KJ4LOZ,=KJ4UPN,=KJ6OV,=KK4AOZ,=KK4DCX,=KK4EBE,=KK4PHB,
#    =KM4VDZ,=KM4WGI,=KM4YBN,=KM4YSR,=KM4ZJW,=KM6CTO,=KN4AWH,=KN4GNO,=KN4IBD,=KN4IDV,=KN4IGP,=KN4ILO,
#    =KN4INP,=KN4JCC,=KN4KPX,=KN4KPY,=KN4MNT,=KN4NLZ,=KN4ODN,=KN4QBT,=KN4QZZ,=KN4REC,=KN4SKZ,=KN4TNC,
#    =KN4UAN,=KP2H,=KP2Z,=KP3CW/SKP,=KP3RE/LGT,=KP3RE/LH,=KP3RE/LT,=KP4ES/L,=KP4ES/LGT,=KP4ES/LH,
#    =KP4FD/IARU,=KP4FRD/LH,=KP4MD/P,=KP4VP/LH,=KR4SQ,=N0XAR,=N1CN,=N1HRV,=N1JFL,=N1QVU,=N1SCD,=N1SZM,
#    =N1VCW,=N1YAY,=N1ZJC,=N2IBR,=N2KKN,=N2KUE,=N2OUS,=N2PGO,=N3JAM,=N3VIJ,=N3YUB,=N3ZII,=N4CIE,=N4JZD,
#    =N4LER,=N4UK,=N6NVD,=N6RHF,=NB0G,=NP3M/LH,=NP4VO/LH,=W1AW/PR,=W6WAW,=W9JS,=WA2RVA,=WB2HMY,=WB5YOF,
#    =WB7ADC,=WB7VVV,=WD4LOL,=WP4L/TP,=WR8Z;
#Desecheo Island:          08:  11:  NA:   18.08:    67.88:     4.0:  KP5:
#    KP5,NP5,WP5;
#Norway:                   14:  18:  EU:   61.00:    -9.00:    -1.0:  LA:
#    LA,LB,LC,LD,LE,LF,LG,LH,LI,LJ,LK,LL,LM,LN,=LA1BFA/U,=LA1EK/E,=LA1ENA/H,=LA1G/H,=LA1IO/L,=LA1K/U,
#    =LA1LO/H,=LA1MFA/X,=LA1RSA/X,=LA1TV/F,=LA1U/X,=LA1YE/C,=LA2AB/C,=LA2D/F,=LA2DS/C,=LA2HFA/C,
#    =LA2OJ/Z,=LA2SM/X,=LA2T/U,=LA3BO/Z,=LA3CC/C,=LA3F/C,=LA3F/E,=LA3TK/E,=LA4AAA/U,=LA4CIA/H,=LA4EJ/W,
#    =LA4KF/K,=LA4KQ/X,=LA4NE/X,=LA4NE/Y,=LA4NL/X,=LA4PM/U,=LA4RI/Y,=LA4RT/U,=LA4XX/U,=LA4YW/U,=LA5A/Y,
#    =LA5FH/Z,=LA5G/E,=LA5HE/H,=LA5MT/D,=LA5SAA/L,=LA5UF/H,=LA5UF/Z,=LA5UH/Z,=LA5YE/F,=LA5YI/F,
#    =LA6DW/C,=LA6DW/S,=LA6FJA/E,=LA6GX/X,=LA6M/X,=LA6MT/D,=LA6OM/C,=LA6QT/X,=LA6TPA/V,=LA6XI/F,
#    =LA6XI/Z,=LA7AK/L,=LA7DHA/C,=LA7FF/F,=LA7HAA/W,=LA7HJ/W,=LA7IM/X,=LA7QI/L,=LA7TO/L,=LA7VK/C,
#    =LA8G/U,=LA8NHA/F,=LA8NSA/F,=LA8OM/K,=LA8OM/L,=LA8QI/L,=LA8TIA/C,=LA8UL/X,=LA8WG/V,=LA9BM/F,
#    =LA9DFA/D,=LA9DK/S,=LA9FG/P,=LA9GY/U,=LA9IX/U,=LA9JM/Z,=LA9OI/C,=LA9YBA/W,=LA9ZL/I,=LB1JG/C,
#    =LB7FA/F,=LI3C/D,=LI7HJ/W,=LI7VK/C,=LJ3RE/E,=LJ6BG/L;
#Argentina:                13:  14:  SA:  -34.80:    65.92:     3.0:  LU:
#    AY,AZ,L1,L2,L3,L4,L5,L6,L7,L8,L9,LO,LP,LQ,LR,LS,LT,LU,LV,LW,=LU8AEU/MM,
#    =AY3DR/D,=AY4EJ/D,=AY5E/D,=AY7DSY/D,=L21ESC/LH,=L25E/D,=L30DIM/D,=L30EY/D,=L30EY/E,=L40E/D,
#    =L44D/D,=L50DVA/D,=L50DVB/D,=L80AA/D,=L82D/D,=L84VI/D,=LO0D/D,=LO7E/D,=LS4AA/D,=LT5D/LH,=LU1AAE/D,
#    =LU1AAS/D,=LU1ACX/D,=LU1AEE/D,=LU1AET/D,=LU1AGP/D,=LU1AIM/D,=LU1ALF/D,=LU1AM/D,=LU1APR/D,
#    =LU1ARG/D,=LU1ASP/D,=LU1BCE/D,=LU1CHD/D,=LU1CL/D,=LU1COA/D,=LU1DAR/D,=LU1DAS/D,=LU1DBI/D,
#    =LU1DCB/D,=LU1DDK/D,=LU1DDO/D,=LU1DHO/D,=LU1DI/D,=LU1DK/D,=LU1DKD/D,=LU1DLB/D,=LU1DMA/E,=LU1DMK/D,
#    =LU1DNQ/D,=LU1DP/D,=LU1DQ/D,=LU1DS/D,=LU1DSO/D,=LU1DU/D,=LU1DVE/D,=LU1DYP/D,=LU1DZ/D,=LU1DZ/E,
#    =LU1DZR/D,=LU1EEE/D,=LU1EEZ/D,=LU1EFF/D,=LU1EJ/LH,=LU1EJ/YL,=LU1ELP/D,=LU1ELY/D,=LU1EPC/D,
#    =LU1EPF/D,=LU1EQ/D,=LU1EQU/D,=LU1ERA/D,=LU1EST/D,=LU1EUU/D,=LU1EW/D,=LU1EXU/D,=LU1EY/D,=LU1HBD/D,
#    =LU1HLH/D,=LU1KCQ/D,=LU1UAG/D,=LU1VDF/D,=LU1VOF/D,=LU1XWC/E,=LU1XZ/D,=LU1YY/D,=LU2AAS/D,=LU2AEZ/D,
#    =LU2AFE/D,=LU2AGQ/D,=LU2AHB/D,=LU2ALE/D,=LU2AMM/D,=LU2AOZ/D,=LU2AVG/D,=LU2AVW/D,=LU2BN/D,
#    =LU2BOE/D,=LU2BPM/D,=LU2CDE/D,=LU2CDO/D,=LU2CHP/D,=LU2CM/D,=LU2CRV/D,=LU2DAR/D,=LU2DB/D,=LU2DG/D,
#    =LU2DHM/D,=LU2DJB/D,=LU2DJC/D,=LU2DJL/D,=LU2DKN/D,=LU2DPW/D,=LU2DRT/D,=LU2DT/D,=LU2DT/D/LH,
#    =LU2DT/LGT,=LU2DT/LH,=LU2DVF/D,=LU2ED/D,=LU2EDC/D,=LU2EE/D,=LU2EE/E,=LU2EGA/D,=LU2EGI/D,=LU2EGP/D,
#    =LU2EHA/D,=LU2EIT/D,=LU2EJL/D,=LU2EK/D,=LU2ELT/D,=LU2EMQ/D,=LU2ENG/D,=LU2ENH/D,=LU2EPL/D,
#    =LU2EPP/D,=LU2ERC/D,=LU2FGD/D,=LU2FNH/D,=LU2HOD/D,=LU2JFC/D,=LU2VDV/D,=LU2YF/D,=LU3AAL/D,
#    =LU3ADC/D,=LU3AJL/D,=LU3AOI/D,=LU3ARE/D,=LU3ARM/D,=LU3AYE/D,=LU3CA/D,=LU3CM/D,=LU3CRA/D,=LU3CT/D,
#    =LU3DAR/D,=LU3DAT/D,=LU3DAT/E,=LU3DC/D,=LU3DEY/D,=LU3DFD/D,=LU3DH/D,=LU3DHF/D,=LU3DJA/D,=LU3DJI/D,
#    =LU3DJT/D,=LU3DK/D,=LU3DLF/D,=LU3DMZ/D,=LU3DO/D,=LU3DOC/D,=LU3DP/D,=LU3DPH/D,=LU3DQJ/D,=LU3DR/D,
#    =LU3DRP/D,=LU3DRP/E,=LU3DXG/D,=LU3DXI/D,=LU3DY/D,=LU3DYN/D,=LU3DZO/D,=LU3EBS/D,=LU3ED/D,=LU3EDU/D,
#    =LU3EFL/D,=LU3EJ/L,=LU3EJD/D,=LU3ELR/D,=LU3EMB/D,=LU3EOU/D,=LU3EP/D,=LU3ERU/D,=LU3ES/D,=LU3ESY/D,
#    =LU3EZA/D,=LU3FCI/D,=LU3HKA/D,=LU4AA/D,=LU4AAO/D,=LU4AAO/E,=LU4ACA/D,=LU4ADE/D,=LU4AJC/D,
#    =LU4BAN/D,=LU4BFP/D,=LU4BR/D,=LU4CMF/D,=LU4DBL/D,=LU4DBP/D,=LU4DBT/D,=LU4DBV/D,=LU4DCE/D,
#    =LU4DCY/D,=LU4DGC/D,=LU4DHA/D,=LU4DHC/D,=LU4DHE/D,=LU4DIS/D,=LU4DK/D,=LU4DLJ/D,=LU4DLL/D,
#    =LU4DLN/D,=LU4DMI/D,=LU4DPB/D,=LU4DQ/D,=LU4DRC/D,=LU4DRH/D,=LU4DRH/E,=LU4DVD/D,=LU4EAE/D,
#    =LU4EET/D,=LU4EGP/D,=LU4EHP/D,=LU4EJ/D,=LU4EL/D,=LU4ELE/D,=LU4EOU/D,=LU4ERS/D,=LU4ESP/D,=LU4ETD/D,
#    =LU4ETN/D,=LU4EV/D,=LU4HSA/D,=LU4HTD/D,=LU4MA/D,=LU4UWZ/D,=LU4UZW/D,=LU4VEN/D,=LU4VSD/D,=LU4WAP/D,
#    =LU5AHN/D,=LU5ALS/D,=LU5AM/D,=LU5ANL/D,=LU5AQV/D,=LU5ARS/D,=LU5ASA/D,=LU5AVD/D,=LU5BDS/D,=LU5BE/D,
#    =LU5BTL/D,=LU5CBA/D,=LU5CRE/D,=LU5DA/D,=LU5DA/E,=LU5DAS/D,=LU5DCO/D,=LU5DDH/D,=LU5DEM/D,=LU5DF/D,
#    =LU5DFR/D,=LU5DFT/D,=LU5DGG/D,=LU5DGR/D,=LU5DHE/D,=LU5DIT/D,=LU5DJE/D,=LU5DKE/D,=LU5DLH/D,
#    =LU5DLT/D,=LU5DLZ/D,=LU5DMI/D,=LU5DMP/D,=LU5DMR/D,=LU5DQ/D,=LU5DRV/D,=LU5DSH/D,=LU5DSM/D,=LU5DT/D,
#    =LU5DTB/D,=LU5DTF/D,=LU5DUC/D,=LU5DVB/D,=LU5DWS/D,=LU5DYT/D,=LU5EAO/D,=LU5EC/D,=LU5ED/D,=LU5EDS/D,
#    =LU5EFG/D,=LU5EH/D,=LU5EHC/D,=LU5EJL/D,=LU5EM/D,=LU5EP/D,=LU5EW/D,=LU5FZ/D,=LU5FZ/E,=LU5JAH/D,
#    =LU5JIB/D,=LU5OD/D,=LU5VAS/D,=LU5VAT/D,=LU5XP/D,=LU6AER/D,=LU6CN/D,=LU6DAX/D,=LU6DBL/D,=LU6DC/D,
#    =LU6DCT/D,=LU6DDC/D,=LU6DG/D,=LU6DIE/D,=LU6DIO/D,=LU6DK/D,=LU6DKT/D,=LU6DL/D,=LU6DM/D,=LU6DO/D,
#    =LU6DRD/D,=LU6DRD/E,=LU6DRN/D,=LU6DRR/D,=LU6DSA/D,=LU6DTB/D,=LU6EAG/D,=LU6EC/D,=LU6EDC/D,=LU6EE/D,
#    =LU6EEG/D,=LU6EGO/D,=LU6EI/D,=LU6EJJ/D,=LU6EKL/D,=LU6ELP/D,=LU6EMM/D,=LU6ENA/D,=LU6EPE/D,
#    =LU6EPR/D,=LU6EPR/E,=LU6EQV/D,=LU6EU/D,=LU6EVD/D,=LU6EWR/D,=LU6EXD/D,=LU6HBB/D,=LU6JJ/D,=LU6UAL/D,
#    =LU6UO/D,=LU6UVI/D,=LU6XQ/D,=LU7AA/D,=LU7AC/D,=LU7ADC/D,=LU7ADN/D,=LU7ART/D,=LU7AVW/D,=LU7BSN/D,
#    =LU7BTO/D,=LU7BTO/E,=LU7CAW/D,=LU7CP/D,=LU7DAC/D,=LU7DAF/D,=LU7DAR/D,=LU7DBA/D,=LU7DBL/D,
#    =LU7DCE/D,=LU7DD/D,=LU7DDC/D,=LU7DDO/D,=LU7DHE/D,=LU7DHG/D,=LU7DJH/D,=LU7DLN/D,=LU7DNM/D,
#    =LU7DOT/D,=LU7DP/D,=LU7DR/D,=LU7DS/D,=LU7DSC/D,=LU7DSS/D,=LU7DSU/D,=LU7DSY/D,=LU7DTC/D,=LU7DW/D,
#    =LU7DZL/D,=LU7DZL/E,=LU7DZV/D,=LU7ECZ/D,=LU7EGY/D,=LU7EHL/D,=LU7EIA/D,=LU7EJC/D,=LU7ELY/D,
#    =LU7EMA/D,=LU7EMM/D,=LU7ENP/D,=LU7EO/D,=LU7EON/D,=LU7EPC/D,=LU7ETR/D,=LU7EXX/D,=LU7HBL/D,=LU7HW/D,
#    =LU7HZ/D,=LU7VCH/D,=LU8ABR/D,=LU8ACH/D,=LU8ADX/D,=LU8AE/D,=LU8ARI/D,=LU8ATM/D,=LU8DAF/D,=LU8DCF/D,
#    =LU8DCH/D,=LU8DCK/D,=LU8DCM/D,=LU8DIP/D,=LU8DIW/D,=LU8DJR/D,=LU8DLD/D,=LU8DLT/D,=LU8DMD/D,
#    =LU8DQ/D,=LU8DR/D,=LU8DRA/D,=LU8DRH/D,=LU8DRQ/D,=LU8DSJ/D,=LU8DTF/D,=LU8DUJ/D,=LU8DVQ/D,=LU8DW/D,
#    =LU8DWR/D,=LU8DX/D,=LU8DY/D,=LU8DZE/D,=LU8DZH/D,=LU8EAG/D,=LU8EAJ/D,=LU8EBJ/D,=LU8EBJ/E,=LU8EBK/D,
#    =LU8EBK/E,=LU8EC/D,=LU8ECF/D,=LU8ECF/E,=LU8EEM/D,=LU8EFF/D,=LU8EGC/D,=LU8EGS/D,=LU8EHQ/D,
#    =LU8EHQ/E,=LU8EHS/D,=LU8EHV/D,=LU8EKC/D,=LU8EMC/D,=LU8ERH/D,=LU8ETC/D,=LU8EU/D,=LU8EXJ/D,
#    =LU8EXN/D,=LU8FAU/D,=LU8VCC/D,=LU8VER/D,=LU9ACJ/D,=LU9AEA/D,=LU9AOS/D,=LU9AUC/D,=LU9BGN/D,
#    =LU9BRC/D,=LU9BSA/D,=LU9CGN/D,=LU9CLH/D,=LU9DA/D,=LU9DAA/D,=LU9DAD/D,=LU9DB/D,=LU9DE/D,=LU9DEQ/D,
#    =LU9DF/D,=LU9DGE/D,=LU9DHL/D,=LU9DJS/D,=LU9DKO/D,=LU9DMG/D,=LU9DNV/D,=LU9DO/D,=LU9DPD/D,=LU9DPI/D,
#    =LU9DPZ/E,=LU9DSD/D,=LU9DVO/D,=LU9EAG/D,=LU9ECE/D,=LU9EI/D,=LU9EIM/D,=LU9EJM/D,=LU9EJS/E,
#    =LU9EJZ/D,=LU9ENH/D,=LU9EOE/D,=LU9ERA/D,=LU9ESD/D,=LU9ESD/E,=LU9ESD/LH,=LU9EV/D,=LU9EV/E,
#    =LU9EV/LH,=LU9EY/D,=LU9EYE/D,=LU9EZX/D,=LU9HDR/D,=LU9HJV/D,=LU9HVR/D,=LU9USD/D,=LU9WM/D,=LV7E/D,
#    =LW1DAL/D,=LW1DDX/D,=LW1DE/D,=LW1DEN/D,=LW1DEW/D,=LW1DG/D,=LW1DJ/D,=LW1DOG/D,=LW1DQQ/D,=LW1DVB/D,
#    =LW1DXH/D,=LW1DXP/D,=LW1DYN/D,=LW1DYP/D,=LW1ECE/D,=LW1ECO/D,=LW1ELI/D,=LW1EQI/D,=LW1EQZ/D,
#    =LW1EVO/D,=LW1EXU/D,=LW2DAF/D,=LW2DAW/D,=LW2DET/D,=LW2DJM/D,=LW2DKF/D,=LW2DNC/D,=LW2DOD/D,
#    =LW2DOM/D,=LW2DSM/D,=LW2DX/E,=LW2DYA/D,=LW2ECK/D,=LW2ECM/D,=LW2EFS/D,=LW2EHD/D,=LW2ENB/D,
#    =LW2EQS/D,=LW2EUA/D,=LW3DAB/D,=LW3DBM/D,=LW3DC/D,=LW3DED/D,=LW3DER/D,=LW3DFP/D,=LW3DG/D,=LW3DGC/D,
#    =LW3DJC/D,=LW3DKC/D,=LW3DKC/E,=LW3DKO/D,=LW3DKO/E,=LW3DN/D,=LW3DRW/D,=LW3DSR/D,=LW3DTD/D,=LW3EB/D,
#    =LW3EIH/D,=LW3EK/D,=LW3EMP/D,=LW4DAF/D,=LW4DBE/D,=LW4DBM/D,=LW4DCV/D,=LW4DKI/D,=LW4DOR/D,
#    =LW4DRH/D,=LW4DRH/E,=LW4DRV/D,=LW4DTM/D,=LW4DTR/D,=LW4DWV/D,=LW4DXH/D,=LW4ECV/D,=LW4EIN/D,
#    =LW4EM/D,=LW4EM/E,=LW4EM/LH,=LW4ERO/D,=LW4ESY/D,=LW4ETG/D,=LW4EZT/D,=LW4HCL/D,=LW5DAD/D,=LW5DD/D,
#    =LW5DFR/D,=LW5DHG/D,=LW5DIE/D,=LW5DLY/D,=LW5DNN/D,=LW5DOG/D,=LW5DQ/D,=LW5DR/D,=LW5DR/LH,=LW5DTD/D,
#    =LW5DTQ/D,=LW5DUS/D,=LW5DWX/D,=LW5EE/D,=LW5EO/D,=LW5EOL/D,=LW6DLS/D,=LW6DTM/D,=LW6DW/D,=LW6DYZ/D,
#    =LW6EAK/D,=LW6EEA/D,=LW6EFR/D,=LW6EGE/D,=LW6EHD/D,=LW6EXM/D,=LW7DAF/D,=LW7DAG/D,=LW7DAJ/D,
#    =LW7DAR/D,=LW7DFD/D,=LW7DGT/D,=LW7DJ/D,=LW7DKB/D,=LW7DLY/D,=LW7DNS/E,=LW7DPJ/D,=LW7DVC/D,
#    =LW7DWX/D,=LW7ECZ/D,=LW7EDH/D,=LW7EJV/D,=LW7ELR/D,=LW7EOJ/D,=LW7HA/D,=LW8DAL/D,=LW8DCM/D,
#    =LW8DIP/D,=LW8DMC/D,=LW8DMK/D,=LW8DPZ/E,=LW8DRU/D,=LW8DYT/D,=LW8EAG/D,=LW8ECQ/D,=LW8EFR/D,
#    =LW8EGA/D,=LW8EJ/D,=LW8ELR/D,=LW8EU/D,=LW8EVB/D,=LW8EXF/D,=LW9DAD/D,=LW9DAE/D,=LW9DIH/D,=LW9DMM/D,
#    =LW9DRD/D,=LW9DRT/D,=LW9DSP/D,=LW9DTP/D,=LW9DTQ/D,=LW9DTR/D,=LW9DX/D,=LW9EAG/D,=LW9ECR/D,
#    =LW9EDX/D,=LW9EGQ/D,=LW9ENF/D,=LW9ESY/D,=LW9EUE/D,=LW9EUU/D,=LW9EVA/D,=LW9EVA/E,=LW9EVE/D,
#    =LW9EYP/D,=LW9EZV/D,=LW9EZW/D,=LW9EZX/D,=LW9EZY/D,
#    =LS4AA/F,=LT2F/F,=LU1FFF/F,=LU1FHE/F,=LU1FMC/F,=LU1FMS/F,=LU1FSE/F,=LU1FVG/F,=LU2FDA/F,=LU2FGD/F,
#    =LU2FLB/F,=LU2FNA/F,=LU2FP/F,=LU3FCA/F,=LU3FCI/F,=LU3FLG/F,=LU3FV/F,=LU3FVH/F,=LU4AA/F,=LU4ETN/F,
#    =LU4FKS/F,=LU4FM/F,=LU4FNO/F,=LU4FNP/F,=LU4FOO/F,=LU4HOD/F,=LU5ASA/F,=LU5FB/F,=LU5FBM/F,=LU5FES/F,
#    =LU5FHD/F,=LU5FJ/F,=LU5FJO/F,=LU5FYX/F,=LU5FZ/F,=LU6FE/F,=LU6FHO/F,=LU6FLZ/F,=LU7FAS/F,=LU7FCU/F,
#    =LU7FFF/F,=LU7FIA/F,=LU7FJ/F,=LU7FJF/F,=LU7FM/F,=LU7FOE/F,=LU7FRE/F,=LU7FYX/F,=LU7HBL/F,=LU7YG/F,
#    =LU8FAB/F,=LU8FC/F,=LU8FGB/F,=LU8FMA/F,=LU8SAN/F,=LU9EI/F,=LU9ESD/F,=LU9FBA/F,=LU9FNI/F,=LU9FQR/F,
#    =LU9RBI/F,
#    =LU1ACG/GP,=LU1GQQ/GP,=LU1GR/GP,=LU3AAL/GR,=LU4FM/G,=LU4FM/GP,=LU4GF/GA,=LU4GO/GA,=LU5BE/GR,
#    =LU5FZ/GA,=LU8EFF/GR,=LU8GCJ/GA,=LU9GOO/GA,=LU9GOX/GA,=LU9GOY/GA,=LU9GRE/GP,
#    =LS4AA/H,=LU1DZ/H,=LU1EZ/H,=LU1HBD/H,=LU1HCG/H,=LU1HCP/H,=LU1HH/H,=LU1HK/H,=LU1HLH/H,=LU1HPW/H,
#    =LU1HRA/H,=LU1HYW/H,=LU1XZ/H,=LU2DVI/H,=LU2HAE/H,=LU2HC/H,=LU2HCG/H,=LU2HEA/H,=LU2HEQ/H,=LU2HJ/H,
#    =LU2HNV/H,=LU2MAA/H,=LU3AJL/H,=LU3FCR/H,=LU3FN/H,=LU3HAT/H,=LU3HAZ/H,=LU3HE/H,=LU3HKA/H,=LU3HL/H,
#    =LU3HPW/H,=LU3HU/H,=LU3HZK/H,=LU4AA/H,=LU4DPL/H,=LU4EG/H,=LU4ETN/H,=LU4FM/H,=LU4HAP/H,=LU4HK/H,
#    =LU4HOQ/H,=LU4HSA/H,=LU4HSA/LGH,=LU4HTD/H,=LU4MA/H,=LU5DGG/H,=LU5DX/H,=LU5DZ/H,=LU5FYX/H,=LU5HA/H,
#    =LU5HAZ/H,=LU5HCB/H,=LU5HCW/H,=LU5HFW/H,=LU5HGR/H,=LU5HIO/H,=LU5HPM/H,=LU5HR/H,=LU5HTA/H,
#    =LU5WTE/H,=LU5YUS/H,=LU6FE/H,=LU6HAS/H,=LU6HBB/H,=LU6HCA/H,=LU6HGH/H,=LU6HQH/H,=LU6HTR/H,
#    =LU6HWT/H,=LU6XQ/H,=LU7ADC/H,=LU7DZ/H,=LU7FBG/H,=LU7FTF/H,=LU7HA/H,=LU7HBC/H,=LU7HBL/H,=LU7HBV/H,
#    =LU7HCS/H,=LU7HEO/H,=LU7HOM/H,=LU7HOS/H,=LU7HSG/H,=LU7HW/H,=LU7HWB/H,=LU7HZ/H,=LU8FF/H,=LU8HAR/H,
#    =LU8HBX/H,=LU8HH/H,=LU8HJ/H,=LU8HOR/H,=LU9BSA/H,=LU9DPD/H,=LU9ERA/H,=LU9HCF/H,=LU9HJV/H,=LU9HVR/H,
#    =LW1HBD/H,=LW1HCM/H,=LW1HDI/H,=LW2EIY/H,=LW3HBS/H,=LW3HOH/H,=LW4HCL/H,=LW4HTA/H,=LW4HTD/H,
#    =LW6ENV/H,=LW6HAM/H,=LW7EIY/H,=LW7HA/H,=LW8EUA/H,=LW9HCF/H,
#    =LU1IAL/I,=LU1IBM/I,=LU1IG/I,=LU1II/I,=LU2IP/I,=LU3EP/I,=LU5FZ/I,=LU5IAL/I,=LU5IAO/I,=LU5ILA/I,
#    =LU7IEI/I,=LU7IPI/I,=LU7ITR/I,=LU7IUE/I,=LU8IEZ/I,=LU9DPI/I,=LU9IBJ/I,=LW8DRU/I,
#    =LU1JAO/J,=LU1JAR/J,=LU1JCE/J,=LU1JCO/J,=LU1JEF/J,=LU1JEO/J,=LU1JES/J,=LU1JHF/J,=LU1JHP/J,
#    =LU1JKN/J,=LU1JMA/J,=LU1JMV/J,=LU1JN/J,=LU1JP/J,=LU1JPC/J,=LU2DJB/J,=LU2FGD/J,=LU2FQ/J,=LU2JCI/J,
#    =LU2JLC/J,=LU2JNV/J,=LU2JPE/J,=LU2JS/J,=LU3DYN/J,=LU3JFB/J,=LU3JVO/J,=LU4AA/J,=LU4FM/J,=LU4JEA/J,
#    =LU4JHF/J,=LU4JJ/J,=LU4JLX/J,=LU4JMO/J,=LU5JAH/J,=LU5JB/J,=LU5JCL/J,=LU5JI/J,=LU5JJF/J,=LU5JKI/J,
#    =LU5JLA/J,=LU5JLX/J,=LU5JNC/J,=LU5JOL/J,=LU5JU/J,=LU5JZZ/J,=LU6JAF/J,=LU6JRA/J,=LU7DAC/J,=LU7JI/J,
#    =LU7JLB/J,=LU7JMS/J,=LU7JR/J,=LU7JRM/J,=LU8JOP/J,=LU9CYV/J,=LU9JLV/J,=LU9JMG/J,=LU9JPR/J,=LU9YB/J,
#    =LW2DRJ/J,=LW3EMP/J,
#    =LU1KWC/K,=LU2KLC/K,=LU4KC/K,=LU5OM/K,=LU6KAQ/K,=LU7KHB/K,=LU7KT/K,=LU8KE/K,=LW1EVO/K,=LW3DFP/K,
#    =LU1AAS/L,=LU1DZ/L,=LU1LAA/L,=LU1LT/L,=LU1LTL/L,=LU2LDB/L,=LU3AYE/L,=LU4AGC/L,=LU4EFC/L,=LU4LAD/L,
#    =LU4LBU/L,=LU4LMA/L,=LU5FZ/L,=LU5ILA/L,=LU5LAE/L,=LU5LBV/L,=LU6JRA/L,=LU8IEZ/L,=LU8LFV/L,
#    =LU9GOO/L,=LU9GOY/L,=LU9JX/L,=LU9LEW/L,=LU9LOP/L,=LU9LZY/L,=LU9LZZ/L,=LU9XPA/L,=LW3EMP/L,
#    =LW8DTO/L,
#    =LU3PCJ/MA,=LW4DBE/MA,
#    =LS71N/N,=LU2DSV/N,=LU3AAL/N,=LU5BE/N,=LU5FZ/N,=LU8EFF/N,=LW5DR/N,
#    =LU1HZY/O,=LU1XS/O,=LU2HON/O,=LU3HL/O,=LU4AA/O,=LU5BOJ/O,=LU5OD/O,=LU6FEC/O,=LU6HWT/O,=LU7DW/O,
#    =LU7KGB/O,=LU8OAH/O,
#    =LU1DZ/Q,=LU1QA/Q,=LU1QAH/Q,=LU1QHC/Q,=LU1QR/Q,=LU1QRA/Q,=LU3QH/Q,=LU4EV/Q,=LU4QQ/Q,=LU5QAG/Q,
#    =LU5QAJ/Q,=LU5QR/Q,=LU6HBB/Q,=LU6QAN/Q,=LU6QB/Q,=LU6QER/Q,=LU6QI/Q,=LU6UO/Q,=LU7CG/Q,=LU7DJH/Q,
#    =LU7FCL/Q,=LU7QBE/Q,=LU7QN/Q,=LU8DCH/Q,=LU8QRD/Q,=LU8WFT/Q,=LU9QAW/Q,=LU9QRV/Q,=LW2DX/Q,=LW4HCL/Q,
#    =LU/DH4PB/S,=LU1DZ/S,=LU1SF/S,=LU6UO/S,=LW2DX/S,=LW4HCL/S,
#    =LU1UG/U,=LU1UM/U,=LU1UP/U,=LU3DAB/U,=LU3UU/U,=LU4UWZ/U,=LU5UBI/YL,=LU5UEA/U,=LU5UFM/U,=LU6UBM/U,
#    =LU6UO/U,=LU7AA/U,=LU7VB/U,=LU8UU/U,=LU8VCC/U,=LU9MHH/U,
#    AY0V[16],AY1V[16],AY2V[16],AY3V[16],AY4V[16],AY5V[16],AY6V[16],AY7V[16],AY8V[16],AY9V[16],
#    AZ0V[16],AZ1V[16],AZ2V[16],AZ3V[16],AZ4V[16],AZ5V[16],AZ6V[16],AZ7V[16],AZ8V[16],AZ9V[16],
#    L20V[16],L21V[16],L22V[16],L23V[16],L24V[16],L25V[16],L26V[16],L27V[16],L28V[16],L29V[16],
#    L30V[16],L31V[16],L32V[16],L33V[16],L34V[16],L35V[16],L36V[16],L37V[16],L38V[16],L39V[16],
#    L40V[16],L41V[16],L42V[16],L43V[16],L44V[16],L45V[16],L46V[16],L47V[16],L48V[16],L49V[16],
#    L50V[16],L51V[16],L52V[16],L53V[16],L54V[16],L55V[16],L56V[16],L57V[16],L58V[16],L59V[16],
#    L60V[16],L61V[16],L62V[16],L63V[16],L64V[16],L65V[16],L66V[16],L67V[16],L68V[16],L69V[16],
#    L70V[16],L71V[16],L72V[16],L73V[16],L74V[16],L75V[16],L76V[16],L77V[16],L78V[16],L79V[16],
#    L80V[16],L81V[16],L82V[16],L83V[16],L84V[16],L85V[16],L86V[16],L87V[16],L88V[16],L89V[16],
#    L90V[16],L91V[16],L92V[16],L93V[16],L94V[16],L95V[16],L96V[16],L97V[16],L98V[16],L99V[16],
#    LO0V[16],LO1V[16],LO2V[16],LO3V[16],LO4V[16],LO5V[16],LO6V[16],LO7V[16],LO8V[16],LO9V[16],
#    LP0V[16],LP1V[16],LP2V[16],LP3V[16],LP4V[16],LP5V[16],LP6V[16],LP7V[16],LP8V[16],LP9V[16],
#    LQ0V[16],LQ1V[16],LQ2V[16],LQ3V[16],LQ4V[16],LQ5V[16],LQ6V[16],LQ7V[16],LQ8V[16],LQ9V[16],
#    LR0V[16],LR1V[16],LR2V[16],LR3V[16],LR4V[16],LR5V[16],LR6V[16],LR7V[16],LR8V[16],LR9V[16],
#    LS0V[16],LS1V[16],LS2V[16],LS3V[16],LS4V[16],LS5V[16],LS6V[16],LS7V[16],LS8V[16],LS9V[16],
#    LT0V[16],LT1V[16],LT2V[16],LT3V[16],LT4V[16],LT5V[16],LT6V[16],LT7V[16],LT8V[16],LT9V[16],
#    LU0V[16],LU1V[16],LU2V[16],LU3V[16],LU4V[16],LU5V[16],LU6V[16],LU7V[16],LU8V[16],LU9V[16],
#    LV0V[16],LV1V[16],LV2V[16],LV3V[16],LV4V[16],LV5V[16],LV6V[16],LV7V[16],LV8V[16],LV9V[16],
#    LW0V[16],LW1V[16],LW2V[16],LW3V[16],LW4V[16],LW5V[16],LW6V[16],LW7V[16],LW8V[16],LW9V[16],
#    =L30EY/V[16],=LU1EDX/V[16],=LU1QR/V[16],=LU1VBC/V[16],=LU1VCK/V[16],=LU1VCS/V[16],=LU1VDF/V[16],
#    =LU1VEG/V[16],=LU1VFP/V[16],=LU1VOF/LH[16],=LU1VOF/V[16],=LU1VPH/V[16],=LU1VYL/V[16],=LU1VZ/V[16],
#    =LU1WJV/V[16],=LU1WJY/V[16],=LU1XAB/V[16],=LU1YJG/V[16],=LU1YY/V[16],=LU2DB/V[16],=LU2VA/V[16],
#    =LU2VCD/V[16],=LU2VCR/V[16],=LU2VCS/V[16],=LU2VDV/V[16],=LU2VJU/V[16],=LU2VV/V[16],=LU3AIY/V[16],
#    =LU3DC/V[16],=LU3DR/V[16],=LU3ES/V[16],=LU3VAL/V[16],=LU3VE/V[16],=LU3VHE/V[16],=LU3VMB/V[16],
#    =LU3VSE/V[16],=LU3VSM/V[16],=LU3XQN/V[16],=LU3YA/V[16],=LU3YLF/V[16],=LU4AA/V[16],=LU4DBP/V[16],
#    =LU4DBT/V[16],=LU4DDL/V[16],=LU4EHP/V[16],=LU4EJS/V[16],=LU4VAU/V[16],=LU4VBW/V[16],=LU4VDG/V[16],
#    =LU4VEN/V[16],=LU4VMB/V[16],=LU4VMG/V[16],=LU4VV/V[16],=LU5AJX/V[16],=LU5BDS/V[16],=LU5DEM/V[16],
#    =LU5DIT/V[16],=LU5DRV/V[16],=LU5FYX/V[16],=LU5VAI/V[16],=LU5VAS/V[16],=LU5VAT/V[16],=LU5VFL/V[16],
#    =LU5VIE/V[16],=LU5VLB/V[16],=LU5YBR/V[16],=LU5YEC/V[16],=LU5YF/V[16],=LU6DAI/V[16],=LU6DBL/V[16],
#    =LU6DKT/V[16],=LU6DO/V[16],=LU6VA/V[16],=LU6VAC/V[16],=LU6VDT/V[16],=LU6VEO/V[16],=LU6VFL/V[16],
#    =LU6VM/V[16],=LU6VR/V[16],=LU7DSY/V[16],=LU7DW/V[16],=LU7EGH/V[16],=LU7EHL/V[16],=LU7VBT/V[16],
#    =LU7VFG/V[16],=LU7YZ/V[16],=LU8BV/V[16],=LU8DWR/V[16],=LU8EB/M/V[16],=LU8EHQ/V[16],=LU8VCC/V[16],
#    =LU8VER/V[16],=LU9AEA/V[16],=LU9DR/V[16],=LU9ESD/V[16],=LU9EY/V[16],=LU9VEA/V[16],=LU9VRC/V[16],
#    =LUVES/V[16],=LW1ECO/V[16],=LW2DVM/V[16],=LW2DYA/V[16],=LW5EE/V[16],=LW6EQQ/V[16],=LW9EAG/V[16],
#    AY0W[16],AY1W[16],AY2W[16],AY3W[16],AY4W[16],AY5W[16],AY6W[16],AY7W[16],AY8W[16],AY9W[16],
#    AZ0W[16],AZ1W[16],AZ2W[16],AZ3W[16],AZ4W[16],AZ5W[16],AZ6W[16],AZ7W[16],AZ8W[16],AZ9W[16],
#    L20W[16],L21W[16],L22W[16],L23W[16],L24W[16],L25W[16],L26W[16],L27W[16],L28W[16],L29W[16],
#    L30W[16],L31W[16],L32W[16],L33W[16],L34W[16],L35W[16],L36W[16],L37W[16],L38W[16],L39W[16],
#    L40W[16],L41W[16],L42W[16],L43W[16],L44W[16],L45W[16],L46W[16],L47W[16],L48W[16],L49W[16],
#    L50W[16],L51W[16],L52W[16],L53W[16],L54W[16],L55W[16],L56W[16],L57W[16],L58W[16],L59W[16],
#    L60W[16],L61W[16],L62W[16],L63W[16],L64W[16],L65W[16],L66W[16],L67W[16],L68W[16],L69W[16],
#    L70W[16],L71W[16],L72W[16],L73W[16],L74W[16],L75W[16],L76W[16],L77W[16],L78W[16],L79W[16],
#    L80W[16],L81W[16],L82W[16],L83W[16],L84W[16],L85W[16],L86W[16],L87W[16],L88W[16],L89W[16],
#    L90W[16],L91W[16],L92W[16],L93W[16],L94W[16],L95W[16],L96W[16],L97W[16],L98W[16],L99W[16],
#    LO0W[16],LO1W[16],LO2W[16],LO3W[16],LO4W[16],LO5W[16],LO6W[16],LO7W[16],LO8W[16],LO9W[16],
#    LP0W[16],LP1W[16],LP2W[16],LP3W[16],LP4W[16],LP5W[16],LP6W[16],LP7W[16],LP8W[16],LP9W[16],
#    LQ0W[16],LQ1W[16],LQ2W[16],LQ3W[16],LQ4W[16],LQ5W[16],LQ6W[16],LQ7W[16],LQ8W[16],LQ9W[16],
#    LR0W[16],LR1W[16],LR2W[16],LR3W[16],LR4W[16],LR5W[16],LR6W[16],LR7W[16],LR8W[16],LR9W[16],
#    LS0W[16],LS1W[16],LS2W[16],LS3W[16],LS4W[16],LS5W[16],LS6W[16],LS7W[16],LS8W[16],LS9W[16],
#    LT0W[16],LT1W[16],LT2W[16],LT3W[16],LT4W[16],LT5W[16],LT6W[16],LT7W[16],LT8W[16],LT9W[16],
#    LU0W[16],LU1W[16],LU2W[16],LU3W[16],LU4W[16],LU5W[16],LU6W[16],LU7W[16],LU8W[16],LU9W[16],
#    LV0W[16],LV1W[16],LV2W[16],LV3W[16],LV4W[16],LV5W[16],LV6W[16],LV7W[16],LV8W[16],LV9W[16],
#    LW0W[16],LW1W[16],LW2W[16],LW3W[16],LW4W[16],LW5W[16],LW6W[16],LW7W[16],LW8W[16],LW9W[16],
#    =LT7W/LGT[16],=LT7W/LH[16],=LU1EJ/W[16],=LU1EUU/W[16],=LU1WBM/W[16],=LU1WCR/V[16],=LU1WCR/W[16],
#    =LU1WF/W[16],=LU1WFU/W[16],=LU1WIY/W[16],=LU1WJF/W[16],=LU1WJY/W[16],=LU1WL/W[16],=LU1WM/W[16],
#    =LU1WP/W[16],=LU1WRV/W[16],=LU2VJ/W[16],=LU2WA/LGT[16],=LU2WA/W[16],=LU2WC/W[16],=LU2WGG/W[16],
#    =LU3CW/W[16],=LU3DJI/W[16],=LU3DR/W[16],=LU3DXG/W[16],=LU3EGC/W[16],=LU3ES/W[16],=LU3HKA/W[16],
#    =LU3WAM/W[16],=LU3WDT/W[16],=LU3YK/W[16],=LU4DBP/W[16],=LU4DBT/W[16],=LU4DQ/W[16],=LU4DRC/W[16],
#    =LU4ETN/W[16],=LU4HMA/W[16],=LU4WCD/W[16],=LU4WFE/W[16],=LU4WG/W[16],=LU4WSM/W[16],=LU5DEM/W[16],
#    =LU5DGI/W[16],=LU5DIT/W[16],=LU5MFD/W[16],=LU5WOT/W[16],=LU5WQF/W[16],=LU5WSA/W[16],=LU5WT/W[16],
#    =LU6DBL/W[16],=LU6EC/W[16],=LU6VEK/W[16],=LU6WAZ/W[16],=LU6WFV/W[16],=LU6WG/LH[16],=LU6WG/W[16],
#    =LU7DD/W[16],=LU7DJJ/W[16],=LU7DSY/W[16],=LU7DW/W[16],=LU7EHL/W[16],=LU7EPC/W[16],=LU7EUZ/W[16],
#    =LU7HA/W[16],=LU7WAH/W[16],=LU7WFM/W[16],=LU7WW/LH[16],=LU7WW/W[16],=LU8DRA/W[16],=LU8DWR/W[16],
#    =LU8EHQ/W[16],=LU8EKB/W[16],=LU8WDG/W[16],=LU9DLM/W[16],=LU9ESD/W[16],=LU9LEC/W[16],=LU9VEA/W[16],
#    =LW1WJY/W[16],=LW3DKC/W[16],=LW7DAF/W[16],=LW7WFM/W[16],=LW8DMK/W[16],=LW9DAE/W[16],=LW9EAG/W[16],
#    AY0X[16],AY1X[16],AY2X[16],AY3X[16],AY4X[16],AY5X[16],AY6X[16],AY7X[16],AY8X[16],AY9X[16],
#    AZ0X[16],AZ1X[16],AZ2X[16],AZ3X[16],AZ4X[16],AZ5X[16],AZ6X[16],AZ7X[16],AZ8X[16],AZ9X[16],
#    L20X[16],L21X[16],L22X[16],L23X[16],L24X[16],L25X[16],L26X[16],L27X[16],L28X[16],L29X[16],
#    L30X[16],L31X[16],L32X[16],L33X[16],L34X[16],L35X[16],L36X[16],L37X[16],L38X[16],L39X[16],
#    L40X[16],L41X[16],L42X[16],L43X[16],L44X[16],L45X[16],L46X[16],L47X[16],L48X[16],L49X[16],
#    L50X[16],L51X[16],L52X[16],L53X[16],L54X[16],L55X[16],L56X[16],L57X[16],L58X[16],L59X[16],
#    L60X[16],L61X[16],L62X[16],L63X[16],L64X[16],L65X[16],L66X[16],L67X[16],L68X[16],L69X[16],
#    L70X[16],L71X[16],L72X[16],L73X[16],L74X[16],L75X[16],L76X[16],L77X[16],L78X[16],L79X[16],
#    L80X[16],L81X[16],L82X[16],L83X[16],L84X[16],L85X[16],L86X[16],L87X[16],L88X[16],L89X[16],
#    L90X[16],L91X[16],L92X[16],L93X[16],L94X[16],L95X[16],L96X[16],L97X[16],L98X[16],L99X[16],
#    LO0X[16],LO1X[16],LO2X[16],LO3X[16],LO4X[16],LO5X[16],LO6X[16],LO7X[16],LO8X[16],LO9X[16],
#    LP0X[16],LP1X[16],LP2X[16],LP3X[16],LP4X[16],LP5X[16],LP6X[16],LP7X[16],LP8X[16],LP9X[16],
#    LQ0X[16],LQ1X[16],LQ2X[16],LQ3X[16],LQ4X[16],LQ5X[16],LQ6X[16],LQ7X[16],LQ8X[16],LQ9X[16],
#    LR0X[16],LR1X[16],LR2X[16],LR3X[16],LR4X[16],LR5X[16],LR6X[16],LR7X[16],LR8X[16],LR9X[16],
#    LS0X[16],LS1X[16],LS2X[16],LS3X[16],LS4X[16],LS5X[16],LS6X[16],LS7X[16],LS8X[16],LS9X[16],
#    LT0X[16],LT1X[16],LT2X[16],LT3X[16],LT4X[16],LT5X[16],LT6X[16],LT7X[16],LT8X[16],LT9X[16],
#    LU0X[16],LU1X[16],LU2X[16],LU3X[16],LU4X[16],LU5X[16],LU6X[16],LU7X[16],LU8X[16],LU9X[16],
#    LV0X[16],LV1X[16],LV2X[16],LV3X[16],LV4X[16],LV5X[16],LV6X[16],LV7X[16],LV8X[16],LV9X[16],
#    LW0X[16],LW1X[16],LW2X[16],LW3X[16],LW4X[16],LW5X[16],LW6X[16],LW7X[16],LW8X[16],LW9X[16],
#    =AY0N/X[16],=AY7X/X[16],=L20X/LH[16],=LP0B/XP[16],=LR1AW/X[16],=LU/UA4WHX/X[16],=LU1AW/X[16],
#    =LU1DNC/X[16],=LU1DZ/X[16],=LU1XA/XA[16],=LU1XAW/X[16],=LU1XB/X[16],=LU1XB/XA[16],=LU1XBR/XA[16],
#    =LU1XP/XP[16],=LU1XPD/XP[16],=LU1XY/X[16],=LU1YY/XA[16],=LU1ZA/XA[16],=LU2CRM/XA[16],
#    =LU2CRM/XB[16],=LU2WA/XA[16],=LU2WBA/XA[16],=LU2XBI/XA[16],=LU2XBI/XB[16],=LU2XWL/XP[16],
#    =LU2XX/X[16],=LU2XX/XA[16],=LU2XX/XP[16],=LU3DVN/X[16],=LU3DVN/XP[16],=LU3XEI/X[16],
#    =LU3XEI/XA[16],=LU3XEM/X[16],=LU3XUC/XP[16],=LU3XUJ/XP[16],=LU3XYL/XP[16],=LU4DBT/XA[16],
#    =LU4XAP/XA[16],=LU4XFN/XA[16],=LU4XPE/XP[16],=LU5BE/XA[16],=LU5BE/XC[16],=LU5DF/X[16],
#    =LU5EMB/X[16],=LU5HJC/X[16],=LU5HJC/XP[16],=LU5HJK/XP[16],=LU5XC/X[16],=LU5XP/X[16],
#    =LU5XWA/XP[16],=LU6EE/XA[16],=LU6XAH/X[16],=LU7DSY/XA[16],=LU7EUI/XP[16],=LU7XDY/X[16],
#    =LU7XDY/XA[16],=LU7XSC/XP[16],=LU8DLD/XA[16],=LU8DRA/XA[16],=LU8EOT/X[16],=LU8XC/X[16],
#    =LU8XUU/XP[16],=LU8XW/X[16],=LU8XW/XP[16],=LU9DPD/XA[16],=LU9HUP/X[16],=LW3DKO/XA[16],
#    =LW3ET/XP[16],
#    AY0Y[16],AY1Y[16],AY2Y[16],AY3Y[16],AY4Y[16],AY5Y[16],AY6Y[16],AY7Y[16],AY8Y[16],AY9Y[16],
#    AZ0Y[16],AZ1Y[16],AZ2Y[16],AZ3Y[16],AZ4Y[16],AZ5Y[16],AZ6Y[16],AZ7Y[16],AZ8Y[16],AZ9Y[16],
#    L20Y[16],L21Y[16],L22Y[16],L23Y[16],L24Y[16],L25Y[16],L26Y[16],L27Y[16],L28Y[16],L29Y[16],
#    L30Y[16],L31Y[16],L32Y[16],L33Y[16],L34Y[16],L35Y[16],L36Y[16],L37Y[16],L38Y[16],L39Y[16],
#    L40Y[16],L41Y[16],L42Y[16],L43Y[16],L44Y[16],L45Y[16],L46Y[16],L47Y[16],L48Y[16],L49Y[16],
#    L50Y[16],L51Y[16],L52Y[16],L53Y[16],L54Y[16],L55Y[16],L56Y[16],L57Y[16],L58Y[16],L59Y[16],
#    L60Y[16],L61Y[16],L62Y[16],L63Y[16],L64Y[16],L65Y[16],L66Y[16],L67Y[16],L68Y[16],L69Y[16],
#    L70Y[16],L71Y[16],L72Y[16],L73Y[16],L74Y[16],L75Y[16],L76Y[16],L77Y[16],L78Y[16],L79Y[16],
#    L80Y[16],L81Y[16],L82Y[16],L83Y[16],L84Y[16],L85Y[16],L86Y[16],L87Y[16],L88Y[16],L89Y[16],
#    L90Y[16],L91Y[16],L92Y[16],L93Y[16],L94Y[16],L95Y[16],L96Y[16],L97Y[16],L98Y[16],L99Y[16],
#    LO0Y[16],LO1Y[16],LO2Y[16],LO3Y[16],LO4Y[16],LO5Y[16],LO6Y[16],LO7Y[16],LO8Y[16],LO9Y[16],
#    LP0Y[16],LP1Y[16],LP2Y[16],LP3Y[16],LP4Y[16],LP5Y[16],LP6Y[16],LP7Y[16],LP8Y[16],LP9Y[16],
#    LQ0Y[16],LQ1Y[16],LQ2Y[16],LQ3Y[16],LQ4Y[16],LQ5Y[16],LQ6Y[16],LQ7Y[16],LQ8Y[16],LQ9Y[16],
#    LR0Y[16],LR1Y[16],LR2Y[16],LR3Y[16],LR4Y[16],LR5Y[16],LR6Y[16],LR7Y[16],LR8Y[16],LR9Y[16],
#    LS0Y[16],LS1Y[16],LS2Y[16],LS3Y[16],LS4Y[16],LS5Y[16],LS6Y[16],LS7Y[16],LS8Y[16],LS9Y[16],
#    LT0Y[16],LT1Y[16],LT2Y[16],LT3Y[16],LT4Y[16],LT5Y[16],LT6Y[16],LT7Y[16],LT8Y[16],LT9Y[16],
#    LU0Y[16],LU1Y[16],LU2Y[16],LU3Y[16],LU4Y[16],LU5Y[16],LU6Y[16],LU7Y[16],LU8Y[16],LU9Y[16],
#    LV0Y[16],LV1Y[16],LV2Y[16],LV3Y[16],LV4Y[16],LV5Y[16],LV6Y[16],LV7Y[16],LV8Y[16],LV9Y[16],
#    LW0Y[16],LW1Y[16],LW2Y[16],LW3Y[16],LW4Y[16],LW5Y[16],LW6Y[16],LW7Y[16],LW8Y[16],LW9Y[16],
#    =LU1DZ/Y[16],=LU1YDC/Y[16],=LU1YY/Y[16],=LU2VA/Y[16],=LU2VDQ/Y[16],=LU2XAN/Y[16],=LU2YMG/Y[16],
#    =LU3XAP/XA[16],=LU3YEP/Y[16],=LU4AA/Y[16],=LU4DRC/Y[16],=LU4XEG/XA[16],=LU4YAB/Y[16],
#    =LU4YAD/Y[16],=LU4YAL/Y[16],=LU5HLR/Y[16],=LU5YF/Y[16],=LU6VEO/Y[16],=LU6VM/Y[16],=LU6YAB/Y[16],
#    =LU6YBK/Y[16],=LU6YSG/Y[16],=LU7XBX/XA[16],=LU7YCL/Y[16],=LU7YG/Y[16],=LU7YP/Y[16],=LU8DQ/Y[16],
#    =LU8DRA/Y[16],=LU8EB/Y[16],=LU8EOT/Y[16],=LU8IEZ/Y[16],=LU8VCC/Y[16],=LU8XBC/XA[16],
#    =LU8XBS/XA[16],=LU8YAH/Y[16],=LU8YD/Y[16],=LU8YE/Y[16],=LU8YMP/Y[16],=LU8YSF/Y[16],=LU9BSA/Y[16],
#    =LU9ESD/Y[16],=LU9XCC/XA[16],=LW1EXU/Y[16],=LW2DX/Y[16],=LW7DLY/Y[16],=LW7DQQ/Y[16],=LW9DCF/Y[16];
#Luxembourg:               14:  27:  EU:   50.00:    -6.00:    -1.0:  LX:
#    LX,=LX9S/J;
#Lithuania:                15:  29:  EU:   55.45:   -23.63:    -2.0:  LY:
#    LY,=LY/4X4FC/LH,=LY/4Z5KJ/LH,=LY1CM/A/LH,=LY1CM/LH,=LY1CM/P/LGT,=LY1CM/P/LH,=LY1DF/LH,=LY1DR/LGT,
#    =LY1DS/LH,=LY1FW/LH,=LY2BIG/LH,=LY2DX/LGT,=LY2DX/LH,=LY2FN/LGT,=LY2FN/LH,=LY2UF/LGT,=LY2UF/LH,
#    =LY3BW/LH,=LY3MU/LH,=LY3TT/LH,=LY4Y/LH,=LY5O/P/LH,=LY5W/P/LH;
#Bulgaria:                 20:  28:  EU:   42.83:   -25.08:    -2.0:  LZ:
#    LZ,=LZ/G0SGB/LH,=LZ2NU/LH,=LZ4HWF/LH;
#Peru:                     10:  12:  SA:  -10.00:    76.00:     5.0:  OA:
#    4T,OA,OB,OC;
#Lebanon:                  20:  39:  AS:   33.83:   -35.83:    -2.0:  OD:
#    OD,=OD5NJ/ID,=OD5QB/ID,=OD5RI/YOTA;
#Austria:                  15:  28:  EU:   47.33:   -13.33:    -1.0:  OE:
#    OE,=4U0R,=4U10NPT,=4U18FIFA,=4U1A,=4U1VIC,=4U1WED,=4U1XMAS,=4U2U,=4U30VIC,=4U500M,=4U70VIC,=4Y1A,
#    =C7A,=OE2015XHQ/SC,
#    =OE3AIS/ANT,
#    =OE3AGA/AAW,=OE3AIS/AAW,=OE3HM/AAW,=OE3KKA/AAW,=OE3KKA/ANT,=OE3KTA/ANT,=OE3MWS/Y2K,=OE3RPB/AAW,
#    =OE3RPB/ANT,=OE3SGA/AAW,=OE3SGA/ANT,=OE3WWB/AAW,=OE3WWB/ANT,=OE4VIE/ANT,
#    =OE4PFU/Y2K,=OE6XMF/4/LH,
#    =OE5BJN/Y2K,=OE5OHO/Y2K,
#    =OE6XMF/FM,=OE6XMF/NOE,=OE6XMF/U20,
#    =OE3XHA/VFW06,=OE7AJT/Y2K,=OE7XBH/WM05;
#Finland:                  15:  18:  EU:   63.78:   -27.08:    -2.0:  OH:
#    OF,OG,OH,OI,OJ,=OH/RX3AMI/LH,
#    =OF100FI/1/LH,=OF1AD/S,=OF1LD/S,=OF1TX/S,=OH0HG/1,=OH0J/1,=OH0JJS/1,=OH0MDR/1,=OH0MRR/1,=OH1AD/S,
#    =OH1AF/LH,=OH1AH/LH,=OH1AH/LT,=OH1AM/LH,=OH1BGG/S,=OH1BGG/SA,=OH1CM/S,=OH1F/LGT,=OH1F/LH,=OH1FJ/S,
#    =OH1FJ/SA,=OH1KW/S,=OH1KW/SA,=OH1LD/S,=OH1LEO/S,=OH1MLZ/SA,=OH1NR/S,=OH1OD/S,=OH1PP/S,=OH1PV/S,
#    =OH1S/S,=OH1SJ/S,=OH1SJ/SA,=OH1SM/S,=OH1TX/S,=OH1TX/SA,=OH1UH/S,=OH1XW/S,=OI1AXA/S,=OI1AY/S,
#    =OF2BNX/SA,=OG2O/YL,=OH0AM/2,=OH0BT/2,=OH0HG/2,=OH2AAF/S,=OH2AAF/SA,=OH2AAV/S,=OH2AN/SUB,
#    =OH2AUE/S,=OH2AUE/SA,=OH2AY/S,=OH2BAX/S,=OH2BMB/S,=OH2BMB/SA,=OH2BNX/S,=OH2BNX/SA,=OH2BQP/S,
#    =OH2BXT/S,=OH2C/S,=OH2EO/S,=OH2ET/LH,=OH2ET/LS,=OH2ET/S,=OH2FBX/S,=OH2FBX/SA,=OH2HK/S,=OH2HZ/S,
#    =OH2MEE/S,=OH2MEE/SA,=OH2MH/S,=OH2MO/S,=OH2MO/SA,=OH2NAS/S,=OH2NAS/SA,=OH2NM/LH,=OH2PO/S,
#    =OH2PO/SA,=OH2S/S,=OH2S/SA,=OH2XL/S,=OH2XMP/S,=OH2ZL/SA,=OH2ZY/S,=OI2ABG/S,
#    =OF3HHO/S,=OF3KRB/S,=OG3X/LH,=OH3A/LH,=OH3ABN/S,=OH3ACA/S,=OH3AG/LH,=OH3CT/S,=OH3CT/SA,=OH3FJQ/S,
#    =OH3FJQ/SA,=OH3GDO/LH,=OH3GQM/S,=OH3HB/S,=OH3HB/SA,=OH3HHO/S,=OH3HHO/SA,=OH3IH/S,=OH3IH/SA,
#    =OH3IS/S,=OH3KRB/S,=OH3KRB/SA,=OH3LB/S,=OH3LB/SA,=OH3LS/S,=OH3MY/S,=OH3MY/SA,=OH3N/S,=OH3NOB/S,
#    =OH3NVK/S,=OH3R/SA,=OH3SUF/JOTA,=OH3TAM/LH,=OH3VV/S,=OH3W/S,=OH3WR/SA,=OI3SVM/S,=OI3SVM/SA,
#    =OI3V/LH,=OI3V/S,=OI3V/SA,=OI3W/LGT,=OI3W/LH,
#    =OG0V/4,=OH0I/4,=OH0V/4,=OH4FSL/SA,=OH4N/S,=OH4SG/S,=OI4JM/S,=OI4JM/SA,=OI4PM/S,
#    =OF200AD/LS,=OF200AD/S,=OF5AD/S,=OG5A/LS,=OG5A/S,=OH0AW/5,=OH5A/S,=OH5AA/LS,=OH5AD/LS,=OH5AD/S,
#    =OH5B/LH,=OH5EAB/S,=OH5EAB/SA,=OH5GOE/S,=OH5J/S,=OH5J/SA,=OH5JJL/S,=OH5K/S,=OH5LP/S,=OH5LP/SA,
#    =OH5R/S,=OH5ZB/S,=OI5AY/LH,=OI5AY/SA,=OI5PRM/SA,
#    =OF6FSQ/S,=OF6NL/SA,=OF6QR/S,=OG6M/S,=OH0Y/6,=OH2Y/6/LH,=OH6AC/LH,=OH6ADHD/LH,=OH6AG/S,=OH6AR/LH,
#    =OH6CT/S,=OH6CT/SA,=OH6EFH/SA,=OH6EOG/SA,=OH6FA/S,=OH6FA/SA,=OH6FMG/LH,=OH6FSQ/S,=OH6G/S,
#    =OH6GSR/S,=OH6K/S,=OH6MH/S,=OH6NL/S,=OH6NL/SA,=OH6NR/LGT,=OH6NR/LH,=OH6NZ/SA,=OH6OT/S,=OH6PA/S,
#    =OH6QR/S,=OH6QR/SA,=OH6RJ/S,=OH6VM/S,=OI6AY/LH,=OI6SP/S,=OI6SP/SA,
#    =OH7AB/S,=OH7AX/S,=OH7BD/S,=OH7ND/S,=OH7NE/S,=OH7QA/S,=OH7QA/SA,=OH7SV/SA,=OH7UE/S,=OH7VL/S,
#    =OH7XI/S,=OI7AX/S,
#    =OH8AAU/LH,=OH8FCK/S,=OH8FCK/SA,=OH8KN/S,=OH8KN/SA,=OI8VK/S,
#    =OH0KAG/9,=OH9AR/S,=OH9TM/S,=OH9TO/S;
#Aland Islands:            15:  18:  EU:   60.13:   -20.37:    -2.0:  OH0:
#    OF0,OG0,OH0,OI0,=OF100FI/0,=OG2K/0,=OG2M/0,=OG3M/0,=OH1LWZ/0,=OH2FTJ/0,=OH6ZZ/0,=OH8K/0;
#Market Reef:              15:  18:  EU:   60.00:   -19.00:    -2.0:  OJ0:
#    OJ0;
#Czech Republic:           15:  28:  EU:   50.00:   -16.00:    -1.0:  OK:
#    OK,OL,=OK6RA/APF,=OK9BAR/YL,=OL0R/J,
#    =OK1KCR/J,=OK1KI/YL;
#Slovak Republic:          15:  28:  EU:   49.00:   -20.00:    -1.0:  OM:
#    OM;
#Belgium:                  14:  27:  EU:   50.70:    -4.85:    -1.0:  ON:
#    ON,OO,OP,OQ,OR,OS,OT,=ON3BLB/YL,=ON3TC/YL,=ON4BRC/J,=ON4BRN/LGT,=ON4BRN/LH,=ON4BRN/LS,=ON4BRN/SUB,
#    =ON4CCC/LGT,=ON4CCC/LH,=ON4CEL/LGT,=ON4CEL/LH,=ON4CIS/LGT,=ON4CIS/LH,=ON4CJK/LH,=ON4CKZ/LH,
#    =ON4CP/JOTA,=ON4LO/LH,=ON4MCL/LH,=ON4OS/LH,=ON4OSA/LH,=ON4OSLN/LH,=ON6UJ/LH,=ON7PP/LH,=ON7RU/LGT,
#    =ON7RU/LH,=ON9BD/LH,=ON9BD/LS,=OO4BRN/LGT,=OO4BRN/LS,=OO4BRN/SUB,=OP5K/LGT,=OP5K/LH,=OP5K/LT,
#    =OR0OST/LGT,=OR0OST/LH,=OR0OST/SUB,=OR4BRN/SAIL,=OS4OSA/LH;
#Greenland:                40:  05:  NA:   74.00:    42.78:     3.0:  OX:
#    OX,XP,=OX/ON6JUN/LH;
#Faroe Islands:            14:  18:  EU:   62.07:     6.93:     0.0:  OY:
#    OW,OY,=OY1CT/HQ;
#Denmark:                  14:  18:  EU:   56.00:   -10.00:    -1.0:  OZ:
#    5P,5Q,OU,OV,OZ,=5P0MF/LH,=5P2X/LH,=5P5CW/LH,=OU7LH/LH,=OV4JAM/J,=OZ/DG1EHM/LH,=OZ/DG2RON/LH,
#    =OZ/DJ5AA/LH,=OZ/DJ7AO/LGT,=OZ/DJ7AO/LH,=OZ/DL1BWU/LH,=OZ/DL3JJ/LH,=OZ/DL4AM/LH,=OZ/DL4ZZ/LH,
#    =OZ/DL5SE/LH,=OZ/DL7RSM/LH,=OZ/DR4X/LH,=OZ/ON6JUN/LH,=OZ/PH7Y/LH,=OZ0IL/LH,=OZ0MF/LH,=OZ0Q/LH,
#    =OZ0Y/LS,=OZ13LH/LH,=OZ1CF/LH,=OZ1IIL/LH,=OZ1KAH/LH,=OZ1KR/J,=OZ1SDB/LH,=OZ1SKA/LH,=OZ2F/LH,
#    =OZ2FG/LH,=OZ2GBW/LGT,=OZ2GBW/LH,=OZ2NYB/LGT,=OZ2NYB/LH,=OZ2ZB/LH,=OZ3EDR/LH,=OZ3EVA/LH,
#    =OZ3FYN/LH,=OZ3TL/JOTA,=OZ4EL/LH,=OZ4HAM/LH,=OZ50RN/LH,=OZ5ESB/LH,=OZ7AEI/LH,=OZ7DAL/LH,
#    =OZ7DAL/LS,=OZ7EA/YL,=OZ7HAM/LH,=OZ7LH/LH,=OZ7RJ/LGT,=OZ7RJ/LH,=OZ7SP/JOTA,=OZ7TOM/LH,=OZ8KV/LH,
#    =OZ8SMA/LGT,=OZ8SMA/LH,=OZ9HBO/JOTA,=OZ9HBO/LH,=OZ9WSR/J;
#Papua New Guinea:         28:  51:  OC:   -9.50:  -147.12:   -10.0:  P2:
#    P2;
#Aruba:                    09:  11:  SA:   12.53:    69.98:     4.0:  P4:
#    P4,=P40YL/YL;
#DPR of Korea:             25:  44:  AS:   39.78:  -126.30:    -9.0:  P5:
#    P5,P6,P7,P8,P9;
#Netherlands:              14:  27:  EU:   52.28:    -5.47:    -1.0:  PA:
#    PA,PB,PC,PD,PE,PF,PG,PH,PI,=PA/DF8WA/LH,=PA/DL0IGA/LH,=PA/DL1KVN/LH,=PA/DL2GW/LH,=PA/DL2KSB/LH,
#    =PA/DL5SE/LH,=PA/ON4NOK/LH,=PA/ON6EF/LH,=PA0GOR/J,=PA0TLM/J,=PA0XAW/LH,=PA100J/J,=PA100SH/J,
#    =PA110HL/LH,=PA110LL/LH,=PA14NAWAKA/J,=PA1AW/J,=PA1BDO/LH,=PA1BP/J,=PA1EDL/J,=PA1ET/J,=PA1FJ/J,
#    =PA1FR/LH,=PA1VLD/LH,=PA2008NJ/J,=PA25SCH/LH,=PA2DK/J,=PA2LS/YL,=PA2RO/J,=PA3AAF/LH,=PA3AFG/J,
#    =PA3BDQ/LH,=PA3BIC/LH,=PA3BXR/MILL,=PA3CNI/LH,=PA3CNI/LT,=PA3CPI/J,=PA3CPI/JOTA,=PA3DEW/J,
#    =PA3EEQ/LH,=PA3EFR/J,=PA3ESO/J,=PA3EWG/J,=PA3FBO/LH,=PA3FYE/J,=PA3GAG/LH,=PA3GQS/J,=PA3GWN/J,
#    =PA3HFJ/J,=PA3WSK/JOTA,=PA40LAB/J,=PA4AGO/J,=PA4RVS/MILL,=PA4WK/J,=PA5CA/LH,=PA65DUIN/J,
#    =PA65URK/LH,=PA6ADZ/MILL,=PA6ARC/LH,=PA6FUN/LGT,=PA6FUN/LH,=PA6FUN/LS,=PA6HOOP/MILL,=PA6HYG/J,
#    =PA6JAM/J,=PA6KMS/MILL,=PA6LH/LH,=PA6LL/LH,=PA6LST/LH,=PA6LST/LS,=PA6MZD/MILL,=PA6OP/MILL,
#    =PA6RCG/J,=PA6SB/L,=PA6SB/LH,=PA6SCH/LH,=PA6SHB/J,=PA6SJB/J,=PA6SJS/J,=PA6STAR/MILL,=PA6URK/LH,
#    =PA6VEN/LH,=PA6VLD/LH,=PA6WAD/LGT,=PA70HYG/JOTA,=PA75SM/J,=PA7AL/LH,=PA7HPH/J,=PA7JWC/J,
#    =PA99HYG/JOTA,=PA9JAS/J,=PA9M/LH,=PB6F/LH,=PB6KW/LH,=PB88XYL/YL,=PB9ZR/J,=PC2D/LH,=PC5D/J,
#    =PC6RH/J,=PD0ARI/MILL,=PD0FSB/LH,=PD1JL/MILL,=PD1JSH/J,=PD2C/LH,=PD2GCM/LH,=PD5CW/LH,=PD5MVH/P/LH,
#    =PD7DX/J,=PE18KA/J,=PE1NCS/LGT,=PE1NCS/LH,=PE1NZJ/J,=PE1OPM/LH,=PE1ORG/J,=PE1OXI/J,=PE1PEX/J,
#    =PE1RBG/J,=PE1RBR/J,=PE2MC/J,=PE2MGA/J,=PE7M/J,=PF100ROVER/J,=PF18NAWAKA/J,=PF4R/LH,=PG150N/LH,
#    =PG64HOOP/MIL,=PG6HK/LH,=PG6N/LH,=PH4RTM/MILL,=PH4RTM/WHE,=PH50GFB/J,=PH6BB/J,=PH6WAL/LH,=PH75S/J,
#    =PH9GFB/J,=PI4ADH/LGT,=PI4ADH/LH,=PI4ADH/LS,=PI4ALK/LH,=PI4AZL/J,=PI4BG/J,=PI4BOZ/LH,=PI4CQ/J,
#    =PI4DHG/DM,=PI4DHG/MILL,=PI4ET/MILL,=PI4ETL/MILL,=PI4F/LH,=PI4LDN/L,=PI4LDN/LH,=PI4RCK/LGT,
#    =PI4RCK/LH,=PI4RIS/J,=PI4S/J,=PI4SHV/J,=PI4SRN/LH,=PI4SRN/MILL,=PI4VHW/J,=PI4VNW/LGT,=PI4VNW/LH,
#    =PI4VPO/LH,=PI4VPO/LT,=PI4WAL/LGT,=PI4WAL/LH,=PI4WBR/LH,=PI4WFL/MILL,=PI4YLC/LH,=PI4ZHE/LH,
#    =PI4ZHE/LS,=PI4ZHE/MILL,=PI4ZVL/FD,=PI4ZVL/LGT,=PI4ZVL/LH,=PI4ZWN/MILL,=PI9NHL/LH,=PI9SRS/LH,
#    =PI9TP/J;
#Curacao:                  09:  11:  SA:   12.17:    69.00:     4.0:  PJ2:
#    PJ2;
#Bonaire:                  09:  11:  SA:   12.20:    68.25:     4.0:  PJ4:
#    PJ4;
#Saba & St. Eustatius:     08:  11:  NA:   17.57:    63.10:     4.0:  PJ5:
#    PJ5,
#    PJ6;
#Sint Maarten:             08:  11:  NA:   18.07:    63.07:     4.0:  PJ7:
#    PJ0,PJ7,PJ8;
#Brazil:                   11:  15:  SA:  -10.00:    53.00:     3.0:  PY:
#    PP,PQ,PR,PS,PT,PU,PV,PW,PX,PY,ZV,ZW,ZX,ZY,ZZ,=PQ5P/C,=PU1NEZ/LH,=ZW1BC/SD,
#    =PP5AA/SD,=PP5GFM/C,=PP5GFM/SD,=PP5VB/LH,=ZY5BI/SD,
#    PP6[13],
#    PP7[13],=PP7AA/LH[13],
#    PP8[12],
#    PQ2[13],
#    PQ8[13],
#    PR7[13],
#    PR8[13],
#    PS7[13],=PS7AA/SD[13],
#    PS8[13],=PS8AA/SD[13],
#    PT2[13],=ZW50CVA/SD[13],
#    PT7[13],=PT7AAC/SD[13],=PT7CB/J[13],=ZY7C/SD[13],
#    PT8[12],
#    =PT9AA/SD,
#    PV8[12],=PV8DX/SD[12],=PV8IG/SD[12],
#    PW8[12],=PW8AA/SD[12],
#    =PY1AA/LH,=PY1AA/SD,=PY1CML/SD,=PY1CRN/LH,=PY1DCS/SD,=PY1DCX/SD,=PY1WC/SD,
#    =PU2AIL/YL,=PY2ASS/C,=PY2DS/Q,=PY2NDX/SD,=PY2TDP/SD,=ZX2T/SD,=ZY2CPC/SD,
#    =PU3KIT/YL,=PY3AA/LH,=PY3AA/SD,=PY3COM/SD,=PY3CQ/LH,=PY3CRA/SD,=PY3MHZ/SD,=PY3MSS/YL,=PY3RCA/SD,
#    =PY3RT/SD,=PY3UGR/SD,=PY3UR/SD,=PY3UU/SD,=ZW3RS/LH,
#    =PY4CEL/SD,=PY4CLK/SD,=PY4MAB/BNC,=PY4VL/SD,=PY4XX/SD,=ZW4CPC/SD,
#    =PY5AA/SD,
#    PY6[13],=ZY6BI/SD[13],=ZY6MP/SD[13],
#    PY7[13],=PY7AA/SD[13],=PY7COM/SD[13],=ZV7AA/LGT[13],=ZW7CTA/SD[13],
#    PY8[13],=PY3TEN/PY8/SD[13],=PY8ELO/SD[13],
#    PY9[13];
#Fernando de Noronha:      11:  13:  SA:   -3.85:    32.43:     2.0:  PY0F:
#    PP0F,PP0ZF,PQ0F,PQ0ZF,PR0F,PR0ZF,PS0F,PS0ZF,PT0F,PT0ZF,PU0F,PU0ZF,PV0F,PV0ZF,PW0F,PW0ZF,PX0F,
#    PX0ZF,PY0F,PY0Z,ZV0F,ZV0ZF,ZW0F,ZW0ZF,ZX0F,ZX0ZF,ZY0F,ZY0Z,ZZ0F,ZZ0ZF,=PY0NY,=ZY0K,
#    PP0R,PP0ZR,PQ0R,PQ0ZR,PR0R,PR0ZR,PS0R,PS0ZR,PT0R,PT0ZR,PU0R,PU0ZR,PV0R,PV0ZR,PW0R,PW0ZR,PX0R,
#    PX0ZR,PY0R,ZV0R,ZV0ZR,ZW0R,ZW0ZR,ZX0R,ZX0ZR,ZY0R,ZZ0R,ZZ0ZR;
#St. Peter & St. Paul:     11:  13:  SA:    0.00:    29.00:     2.0:  PY0S:
#    PP0S,PP0ZS,PQ0S,PQ0ZS,PR0S,PR0ZS,PS0S,PS0ZS,PT0S,PT0ZS,PU0S,PU0ZS,PV0S,PV0ZS,PW0S,PW0ZS,PX0S,
#    PX0ZS,PY0S,PY0ZS,ZV0S,ZV0ZS,ZW0S,ZW0ZS,ZX0S,ZX0ZS,ZY0S,ZY0ZS,ZZ0S,ZZ0ZS;
#Trindade & Martim Vaz:    11:  15:  SA:  -20.50:    29.32:     2.0:  PY0T:
#    PP0T,PP0ZT,PQ0T,PQ0ZT,PR0T,PR0ZT,PS0T,PS0ZT,PT0T,PT0ZT,PU0T,PU0ZT,PV0T,PV0ZT,PW0T,PW0ZT,PX0T,
#    PX0ZT,PY0T,PY0ZT,ZV0T,ZV0ZT,ZW0T,ZW0ZT,ZX0T,ZX0ZT,ZY0T,ZY0ZT,ZZ0T,ZZ0ZT;
#Suriname:                 09:  12:  SA:    4.00:    56.00:     3.0:  PZ:
#    PZ;
#Franz Josef Land:         40:  75:  EU:   80.68:   -49.92:    -3.0:  R1FJ:
#    RI1F,=R1FJL,=R1FJM,=UA1PBN/1,=UA4RX/1;
#Western Sahara:           33:  46:  AF:   24.82:    13.85:     0.0:  S0:
#    S0;
#Bangladesh:               22:  41:  AS:   24.12:   -89.65:    -6.0:  S2:
#    S2,S3;
#Slovenia:                 15:  28:  EU:   46.00:   -14.00:    -1.0:  S5:
#    S5,=S51LGT/LH,=S52AL/YL,=S52L/LH,=S58U/LH,=S59HIJ/LH;
#Seychelles:               39:  53:  AF:   -4.67:   -55.47:    -4.0:  S7:
#    S7,=S79EC/F,=S79NAN/F,=S79RRC/C,=S79RRC/F;
#Sao Tome & Principe:      36:  47:  AF:    0.22:    -6.57:     0.0:  S9:
#    S9;
#Sweden:                   14:  18:  EU:   61.20:   -14.57:    -1.0:  SM:
#    7S,8S,SA,SB,SC,SD,SE,SF,SG,SH,SI,SJ,SK,SL,SM,=8S8ODEN(40),=8S8ODEN/MM(40),=SM/DL6II/LH,
#    =SM/RX3AMI/LS,=SM7DAY/LH,
#    =7S0SFJ/LGT,=7S0SFJ/LH,=7S0SFJ/LS,=8S0UN/LH,=SK0BJ/LH,=SM0SVI/LGT,
#    =SF1B/LH,=SM1YRA/LH,
#    =SA2YLM/YL,=SI2SSA/LH,=SK2AU/LGT,=SK2AU/LH,=SM2JKI/S,
#    =SE3TLG/LH,=SK3BG/LH,=SK3GK/LGT,=SK3GK/LH,=SK3GK/LT,=SK3LH/LH,=SM/RX3AMI/LH,=SM3BDZ/2M,=SM3DMP/2M,
#    =SM3TLG/LGT,=SM3TLG/LH,
#    =7S5LH/LH,=SB5RAFS/LH,=SH5FEM/LH,=SK5BB/LS,=SK5UM/JOTA,=SK5WB/LH,=SM5EUG/2M,=SM5FAN/2M,
#    =8S6NAV/LH,=8S6VAN/LH,=SA6AJK/2M,=SB6HL/LH,=SH6HUL/LH,=SK6FL/LS,=SK6MA/LH,=SK6QA/LH,=SK6RM/IMD,
#    =SM6AAL/S,
#    =7S7KUL/LH,=7S7SAN/LH,=7S7V/LH,=8S7GL/LH,=8S7L/LH,=8S7LHJ/LH,=SA7SM/LH,=SA7SM/LT,=SE7M/LH,
#    =SF7KUL/LH,=SK7DX/LH,=SK7FK/LGT,=SK7FK/LH,=SK7FK/LHT,=SK7L/LH,=SK7RN/LH,=SM7AAL/S;
#Poland:                   15:  28:  EU:   52.28:   -18.67:    -1.0:  SP:
#    3Z,HF,SN,SO,SP,SQ,SR,=3Z50KPN/FF,=SP0PGC/FF,=SP1NY/MM(34),
#    =3Z1EE/LH,=SN1D/LH,=SO1WE/LH,=SO1ZV/LH,=SP1/DM3VA/LH,=SP1KBK/LH,=SP1KNM/LH,=SP1RWK/LH,=SP1ZZ/1/LH,
#    =SP1ZZ/LH,=SP3VT/1/LH,=SQ1KSL/YL,
#    =SN2NP/LH,=SP2AYC/LH,=SP2BNJ/LH,=SP2FAP/FF,=SP2HHC/LH,=SP2KAC/LH,=SP2KDS/LH,=SP2KJF/FF,=SP2MHC/LH,
#    =SP2PHA/LH,=SP2PMW/LH,=SP2PZH/LH,=SP2QCR/LH,=SP2WGZ/LH,=SP5PB/2/LH,=SQ2PHG/LH,=SQ2PHI/LH,
#    =SQ3PMM/FF,
#    =SP4KDX/FF,=SQ4G/FF,
#    =HF25NHV/FF,=HF80BUJ/FF,=SP5EZJ/LH,=SP5G/FF,=SP5KAB/LH,=SP5VYI/FF,=SP5X/FF,=SQ5AWR/FF,=SQ5Q/FF,
#    =SP6HFT/FF,=SP6NIO/FF,
#    =SQ8VPS/YOTA,
#    =SP9EWM/FF,=SP9KJU/FF;
#Sudan:                    34:  48:  AF:   14.47:   -28.62:    -3.0:  ST:
#    6T,6U,ST;
#Egypt:                    34:  38:  AF:   26.28:   -28.60:    -2.0:  SU:
#    6A,6B,SS,SU;
#Greece:                   20:  28:  EU:   39.78:   -21.78:    -2.0:  SV:
#    J4,SV,SW,SX,SY,SZ,=J42004/DH1NA,=J42004/DH1PS,=J42004/HA3NU,=J42004/N3JWJ,=J42004/OE5ER,=SV54FF,
#    =SX90IARU,
#    =SV1/LY1DF/LGT,=SV1EOS/JOTA,=SV1EQU/J,=SV5FRI/1,=SV5FRQ/1,=SV9AWF/1,=SV9CUF/1,=SV9DRU/1,=SV9TJ/1,
#    =SV2AEL/J,=SV2CLJ/J,=SV2JAO/J,=SV2KBB/J,=SV2RNY/J,=SV94MIKIS,=SV94THEO,=SX100TSL/J,=SX94MIKIS,
#    =SY2AEI/J,=SY2WT/LH,=SZ2TSL/J,
#    =SV5CJK/3,=SV5FRK/3,=SV5FRP/3,=SV9ION/3,
#    =SV9OFL/4,=SZ4SRM/J,
#    =SV9DJO/7,=SZ7KAM/LH,
#    =SV5KJQ/8,=SV8/DJ5AA/LH,=SV8/LY1DF/LGT,=SV9GPM/8,=SW8SW/LH,=SX8DI/LH,=SZ8LES/LH,=SZ8XIO/J,
#    =SZ8XIO/P/JOTA;
#Mount Athos:              20:  28:  EU:   40.00:   -24.00:    -2.0:  SV/a:
#    =SV2/SV1RP/T,=SV2ASP,=SV2ASP/A,=SV2ASP/P,=SV2RSG/A,=SY2A;
#Dodecanese:               20:  28:  EU:   36.17:   -27.93:    -2.0:  SV5:
#    J45,SV5,SW5,SX5,SY5,SZ5,=J42004/SP5MXZ,=J45FRE/J,=SV0XAN,=SV0XAN/5,=SV0XAN/P,=SV0XBZ/5,=SV0XCA/5,
#    =SV0XCA/P,=SV1BJY/P,=SV1ENJ/5,=SV1GSX/5,=SV5/DJ5AA/LH,=SV5/LY1DF/LGT,=SV5CJQ/LH,=SV9DJO/5,
#    =SV9GPV/5,=SV9JI/5,=SV9OFS/5,=SX100SEP/5,=SX65AP,=SX65AP/5;
#Crete:                    20:  28:  EU:   35.23:   -24.78:    -2.0:  SV9:
#    J49,SV9,SW9,SX9,SY9,SZ9,=J42004/HB9IQB,=J42004/M0WTD,=J42004Q,=J42004ZFG,=SV0IG/9,=SV0LB,=SV0LB/9,
#    =SV0LK,=SV0LK/9,=SV0XAI,=SV0XAI/9,=SV0XAZ,=SV0XBJ,=SV0XBM/9,=SV0XBN,=SV0XBN/9,=SV0XBQ,=SV0XBQ/9,
#    =SV0XBR,=SV0XBW,=SV0XBZ/9,=SV0XCC,=SV0XCC/9,=SV0XCC/P,=SV1BJW/9,=SV1EIJ/9,=SV2KBS/9,=SV5FRP/9,
#    =SV9/LY1DF/LGT;
#Tuvalu:                   31:  65:  OC:   -8.50:  -179.20:   -12.0:  T2:
#    T2;
#Western Kiribati:         31:  65:  OC:    1.42:  -173.00:   -12.0:  T30:
#    T30,=T3AJ;
#Central Kiribati:         31:  62:  OC:   -2.83:   171.72:   -13.0:  T31:
#    T31;
#Eastern Kiribati:         31:  61:  OC:    1.80:   157.35:   -14.0:  T32:
#    T32;
#Banaba Island:            31:  65:  OC:   -0.88:  -169.53:   -12.0:  T33:
#    T33;
#Somalia:                  37:  48:  AF:    2.03:   -45.35:    -3.0:  T5:
#    6O,T5;
#San Marino:               15:  28:  EU:   43.95:   -12.45:    -1.0:  T7:
#    T7;
#Palau:                    27:  64:  OC:    7.45:  -134.53:    -9.0:  T8:
#    T8;
#Asiatic Turkey:           20:  39:  AS:   39.18:   -35.65:    -2.0:  TA:
#    TA,TB,TC,YM,=TC50TRAC/01K,=TC50TRAC/17B,=TC50TRAC/18E,=TC50TRAC/28GR,=TC50TRAC/41KF,
#    =TA1AD/0,=TA1E/0,=TA1ED/0,=TA1FL/0,=TA1ZK/0,=TC0SV/LH,
#    =TA1AJJ/2,=TA1BX/2,=TA1BZ/2,=TA1C/2,=TA1CM/2,=TA1FA/2,=TA1FM/2,=TA1HZ/2,=TA2IJ/YOM,=TC2ELH/LH,
#    =TC50TRAC/34K,=TC50TRAC/41G,=TC50TRAC/41K,=TC50TRAC/67E,=TC50TRAC/67Z,=YM1SIZ/2,
#    =TA1BM/3,=TA1BX/3,=TA1BX/3/M,=TA1D/3,=TA3J/LH,=TC50TRAC/10B,=TC50TRAC/16M,=TC50TRAC/35I,
#    =TC50TRAC/35K,
#    =TA1AO/4,=TA1D/4,=TA1HZ/4,=TA3J/4/LGT,=TA4/DJ5AA/LH,=TC50TRAC/03D,=TC50TRAC/15B,
#    =TC50TRAC/01A,=TC50TRAC/80K,=TC50TRAC/80O,
#    =TA1AYR/6,=TC50TRAC/18C,
#    =TA7KB/LGT,=TA7KB/LH,=TC50TRAC/28G,=TC50TRAC/29T,=TC50TRAC/38D,=TC50TRAC/38K,=TC7YLH/LH,=YM7KA/LH,
#    =TA1O/8,
#    =TA9J/LH;
#European Turkey:          20:  39:  EU:   41.02:   -28.97:    -2.0:  *TA1:
#    TA1,TB1,TC1,YM1,=TA2AKG/1,=TA2LZ/1,=TA2ZF/1,=TA3CQ/1,=TA3HM/1,=TA5CT/1,=TA6CQ/1,=TC100A,=TC100GLB,
#    =TC100GP,=TC100GS,=TC100KT,=TC100VKZL,=TC101GLB,=TC101GP,=TC101GS,=TC101KT,=TC18MART,=TC2ISAF/1,
#    =TC50TRAC/17G,=TC50TRAC/34I,=TC9SAM/1;
#Iceland:                  40:  17:  EU:   64.80:    18.73:     0.0:  TF:
#    TF,=TF1IRA/LGT,=TF1IRA/LH,=TF1IRA/LT,=TF8IRA/LH,=TF8RX/LGT,=TF8RX/LH;
#Guatemala:                07:  11:  NA:   15.50:    90.30:     6.0:  TG:
#    TD,TG;
#Costa Rica:               07:  11:  NA:   10.00:    84.00:     6.0:  TI:
#    TE,TI,=TI90IARU;
#Cocos Island:             07:  11:  NA:    5.52:    87.05:     6.0:  TI9:
#    TE9,TI9;
#Cameroon:                 36:  47:  AF:    5.38:   -11.87:    -1.0:  TJ:
#    TJ;
#Corsica:                  15:  28:  EU:   42.00:    -9.00:    -1.0:  TK:
#    TK,=TK/F4FET/LH;
#Central African Republic: 36:  47:  AF:    6.75:   -20.33:    -1.0:  TL:
#    TL;
#Republic of the Congo:    36:  52:  AF:   -1.02:   -15.37:    -1.0:  TN:
#    TN;
#Gabon:                    36:  52:  AF:   -0.37:   -11.73:    -1.0:  TR:
#    TR;
#Chad:                     36:  47:  AF:   15.80:   -18.17:    -1.0:  TT:
#    TT;
#Cote d'Ivoire:            35:  46:  AF:    7.58:     5.80:     0.0:  TU:
#    TU;
#Benin:                    35:  46:  AF:    9.87:    -2.25:    -1.0:  TY:
#    TY;
#Mali:                     35:  46:  AF:   18.00:     2.58:     0.0:  TZ:
#    TZ;
#European Russia:          16:  29:  EU:   53.65:   -41.37:    -4.0:  UA:
#    R,U,=R0AGD/6,=R0CAF/1,=R0XAD/6/P,=R25EMW(17)[19],=R80PSP,=R80UPOL,=R8CT/4/P,=R8FF/3/M,=R90DOSAAF,
#    =R9AV/6,=R9FCH/6,=R9JBF/1,=R9JI/1,=R9KC/6/M,=R9WR/1,=R9XAU/6,=RA0AM/6,=RA0BM/6,=RA0ZZ/3,
#    =RA3CQ/9/M(17)[20],=RA80SP,=RA9JR/3,=RA9JX/3,=RA9P/4,=RA9RT/3,=RA9UUY/6,=RA9YA/6,=RC80SP,=RG0F/5,
#    =RG50P(17),=RG50P/9(17)[30],=RJ80SP,=RK80X(17)[19],=RK8O/4,=RL9AA/6,=RM80SP,=RM8A/4/M,=RM94AE,
#    =RN9M/4,=RN9OI/3,=RO80RO,=RP61XX(17)[19],=RP62X(17)[19],=RP63X(17)[19],=RP63XO(17)[19],
#    =RP64X(17)[19],=RP65FPP(17)[30],=RP8X(17)[30],=RQ80SP,=RU0ZW/6,=RU2FB/3,=RU2FB/3/P,
#    =RU4SS/9(17)[30],=RU4WA/9(17)[30],=RV9LM/3,=RV9XX/3,=RW0IM/1,=RW0QE/6,=RW2F/6,=RW9FF/3,=RW9W/3,
#    =RW9W/4,=RX2FS/3,=RX9TC/1,=RX9UL/1,=RZ9AWN/6,=UA0AK/3,=UA0FQ/6,=UA0KBG/3,=UA0KBG/6,=UA0KCX/3/P,
#    =UA0KT/4,=UA0QNE/3,=UA0QNU/3,=UA0QQJ/3,=UA0UV/6,=UA0XAK/3,=UA0XAK/6,=UA9CCO/6,=UA9CDC/3,=UA9CTT/3,
#    =UA9FFS/1/MM,=UE23DKA,=UE6MAC/9(17),=UE95AE,=UE95E,=UE95ME,=UE96ME,=UE99PS,
#    =R900BL,=R9J/1,=RA2FN/1,=RA9KU/1,=RA9KU/1/M,=RA9MC/1,=RA9SGI/1,=RK9XWV/1,=RL1O,=RM0L/1,=RM80DZ,
#    =RN85AM,=RN85KN,=RU2FB/1,=RU9YT/1,=RU9YT/1/P,=RW1AI/ANT,=RW8W/1,=RW9QA/1,=RX3AMI/1/LH,=UA1ADQ/ANT,
#    =UA1BJ/ANT,=UA1JJ/ANT,=UA2FFX/1,=UA9B/1,=UA9KG/1,=UA9KGH/1,=UA9KK/1,=UA9UDX/1,=UB9YUW/1,=UE21A,
#    =UE21B,=UE21M,=UE22A,=UE25AC,=UE25AQ,=UE2AT/1,
#    =R0XAC/1,=R8XF/1,=R900DM,=R90LPU,=R9JNO/1,=RA0FU/1,=RA9FNV/1,=RN9N/1,=RU9MU/1,=RV0CA/1,=RV1CC/1,
#    =RV2FW/1,=RV9JD/1,=RX9TN/1,=UA0BDS/1,=UA0SIK/1,=UA1CDA/LH,=UA1CIO/LH,=UA9MA/1,=UA9MQR/1,=UB5O/1,
#    R1N[19],RA1N[19],RC1N[19],RD1N[19],RE1N[19],RF1N[19],RG1N[19],RJ1N[19],RK1N[19],RL1N[19],RM1N[19],
#    RN1N[19],RO1N[19],RQ1N[19],RT1N[19],RU1N[19],RV1N[19],RW1N[19],RX1N[19],RY1N[19],RZ1N[19],U1N[19],
#    UA1N[19],UB1N[19],UC1N[19],UD1N[19],UE1N[19],UF1N[19],UG1N[19],UH1N[19],UI1N[19],=R01DTV/1[19],
#    =R85KFF[19],=R90K[19],=RK75OP[19],=RN1NA/ANT[19],=RO25KL[19],=RO75RK[19],=RP72PT[19],=RP72RK[19],
#    =RP73PT[19],=RP73RK[19],=RP74PT[19],=RP74RK[19],=RV9JD/1/M[19],
#    R1O[19],RA1O[19],RC1O[19],RD1O[19],RE1O[19],RF1O[19],RG1O[19],RJ1O[19],RK1O[19],RL1O[19],RM1O[19],
#    RN1O[19],RO1O[19],RQ1O[19],RT1O[19],RU1O[19],RV1O[19],RW1O[19],RX1O[19],RY1O[19],RZ1O[19],U1O[19],
#    UA1O[19],UB1O[19],UC1O[19],UD1O[19],UE1O[19],UF1O[19],UG1O[19],UH1O[19],UI1O[19],=R0000O[19],
#    =R100K[19],=R20ARRS[19],=R25ILIM[19],=R8FF/1[19],=R9LI/1[19],=R9MCM/1[19],=RA0NN/1[19],
#    =RA9XA/1[19],=RA9XA/1/P[19],=RK0SE/1[19],=RM9X/1[19],=RO80KEDR[19],=RP72A[19],=RP73A[19],
#    =RP73AU[19],=RP74A[19],=RP74AU[19],=UA1PAC/ANT[19],=UA9UAX/1[19],=UA9UAX/1/M[19],=UA9XK/1[19],
#    =UA9XMC/1[19],=UA9XRK/1[19],=UE25IK[19],=UE80AR[19],=UE80AR/M[19],=UE80AR/P[19],=UE90PR[19],
#    R1P[20],RA1P[20],RC1P[20],RD1P[20],RE1P[20],RF1P[20],RG1P[20],RJ1P[20],RK1P[20],RL1P[20],RM1P[20],
#    RN1P[20],RO1P[20],RQ1P[20],RT1P[20],RU1P[20],RV1P[20],RW1P[20],RX1P[20],RY1P[20],RZ1P[20],U1P[20],
#    UA1P[20],UB1P[20],UC1P[20],UD1P[20],UE1P[20],UF1P[20],UG1P[20],UH1P[20],UI1P[20],=R8XW/1[20],
#    =R9SAO/1[20],=R9XC/1[20],=R9XT/1[20],=RA2FW/1[20],=RA9JG/1[20],=RA9LI/1[20],=RC9XM/1[20],
#    =RK1PWA/ANT[20],=RL1P[20],=RN2FA/1[20],=UA1PAC/1/ANT[20],=UA9FOJ/1[20],=UA9MRY/1[20],
#    =UA9XRP/1[20],
#    =R9FM/1,=RA0BM/1,=RA0BM/1/P,=RA1QQ/LH,=RU9MX/1,=RW9XC/1,=UA1QV/ANT,=UA9XC/1,=UE80GS,
#    =R88EPC,=R95NRL,=RA9FBV/1,=RA9SC/1,=RA9XY/1,=RV2FW/1/M,=RZ0IWW/1,=UA9XF/1,=UE9WFF/1,
#    =RA0ZD/1,=RP9X/1,=RP9XWM/1,=UE25WDW,=UE9XBW/1,=UF2F/1/M,
#    R1Z[19],RA1Z[19],RC1Z[19],RD1Z[19],RE1Z[19],RF1Z[19],RG1Z[19],RJ1Z[19],RK1Z[19],RL1Z[19],RM1Z[19],
#    RN1Z[19],RO1Z[19],RQ1Z[19],RT1Z[19],RU1Z[19],RV1Z[19],RW1Z[19],RX1Z[19],RY1Z[19],RZ1Z[19],U1Z[19],
#    UA1Z[19],UB1Z[19],UC1Z[19],UD1Z[19],UE1Z[19],UF1Z[19],UG1Z[19],UH1Z[19],UI1Z[19],=R25RRA[19],
#    =RA9CFH/1[19],=RA9CFH/1/P[19],=RK21Z[19],=RK3DZJ/1/LH[19],=RM9WN/1[19],=RP72MU[19],=RP73MU[19],
#    =RP73ZP[19],=RP74ZP[19],=RT9T/1[19],=RU1ZC/ANT[19],=RW1ZQ/LH[19],=RY83HN[19],=UB1ZBD/N[19],
#    =R01DTV/3,=R85PAR,=R870B,=R870C,=R870K,=R870M,=R870O,=R9FM/3,=RA2AT,=RA2FDX/3,=RA9CO/3,=RA9USU/3,
#    =RC85MP,=RL3AB/FF,=RT2F/3/M,=RT9K/3,=RW0LF/3,=RX9UL/3,=RX9WN/3,=RZ9UA/3,=UA0KCX/3,=UA3AV/ANT,
#    =UA8AA/3,=UA8AA/5,=UA9KHD/3,=UA9MA/3,=UA9MDU/3,=UA9MRX/3,=UA9QCP/3,=UA9UAX/3,=UE24SU,
#    =R85AAL,=R85QMR,=R85WDW,=R8B,=R8FF/M,=R90DNF,=R99FSB,=R9YU/3,=RA0BY/3,=RA80KEDR,=RA9KV/3,=RA9SB/3,
#    =RA9XY/3,=RK3DSW/ANT,=RK3DWA/3/N,=RN9MD/3,=RT80KEDR,=RU0LM/3,=RU2FA/3,=RU3HD/ANT,=RV0AO/3,
#    =RV9LM/3/P,=RW0IM/3,=RW3DU/N,=RW9UEW/3,=RX9SN/3,=RZ9SZ/3,=RZ9W/3,=UA0JAD/3,=UA0KCL/3,=UA0ZAZ/3,
#    =UA3LMR/P,=UA9AJ/3/M,=UA9DD/3,=UA9HSI/3,=UA9ONJ/3,=UA9XGD/3,=UA9XMC/3,=UE23DSA,=UE25FO,=UE95GA,
#    =UE96WS,
#    =R80ORL,=UA0QGM/3,=UE80O,=UE80OL,
#    =R0CAF/3,=R3GO/FF,=RM0L/3,=RN3GL/FF,=RN3GW/FF,=RT5G/P/FF,=RW0IW/3,=UA3GM/ANT,=UE90FL,
#    =RA9KT/3,=RZ9SZ/3/M,=UA0FHC/3,=UF2F/3/M,
#    =R0IA/3,=R863LC,=R863LK,=R863LX,=R875R,=R9XZ/3,=RG80KEDR,=RL80KEDR,=RN0CF/3,=RU9QRP/3,=RZ90W/3,
#    =UA9JFM/3,=UA9XZ/3,=UE80G,=UE80V,=UE80YG,
#    =RK3MXT/FF,=RV9AZ/3,=UA0AD/3,
#    =R870T,=RT90PK,=RU0ZW/3,=RW0UM/3,=RW9JV/3,
#    =R0AIB/3,=RA0CCV/3,=RA0QA/3,=RC9YA/3/P,=RM8X/3,=RV9LC/3,=UA0QJE/3,=UA0QQO/3,=UA9CGL/3,=UA9JLY/3,
#    =UA9XLE/3,=UB0AJJ/3,=UC0LAF/3,=UE25AFG,=UE25R,=UE27AFG,=UE28AFG,=UE96SN,
#    =R80RTL,=R90IARU,=R9CZ/3,=RU80TO,=RZ9HK/3/P,
#    =R920RZ,=R95DOD,=RA0QQ/3,=UA0KBA/3,=UE80S,=UE85NKN,=UE85WDW,
#    =R3TT/FF,=R8FF/P,=R8TA/4/P,=R8TR/3,=R90NOR,=R9KW/3,=R9KW/4,=R9PA/4,=RA9AP/3,=RA9CKQ/4,=RA9KW/3,
#    =RA9KW/3/M,=RA9ST/3/P,=RG9A/3/P,=RM9T/4/P,=RN0CT/4,=RT9S/3,=RT9S/3/P,=RT9S/4,=RT9S/P,=RU9LA/4,
#    =RV9FQ/3,=RV9FQ/3/M,=RV9WB/4,=RV9WLE/3/P,=RV9WZ/3,=RW9KW/3,=RW9WA/3,=RX9SN/P,=UA0ADX/3,=UA0DM/4,
#    =UA0S/4,=UA0SC/4,=UA9APA/3/P,=UA9CTT/4,=UA9PM/4,=UA9SSR/3,=UE200TARS,=UE25TF,=UE9FDA/3,
#    =UE9FDA/3/M,=UE9WDA/3,=UI8W/3/P,
#    =R5VAJ/N,=R850G,=R850PN,=RD0L/3,=RT9T/3,=RU0BW/3,=RU9MU/3,=RV80KEDR,=RX9TL/3,=UA0FM/3,
#    =R110A/P,=R80PVB,
#    =RA9XF/3,=RC80KEDR,=RK0BWW/3,=RN80KEDR,=RW9XC/3/M,=RX3XX/N,=UA0KBA/3/P,=UA9SIV/3,=UE0ZOO/3,
#    =R85WTA,=R8FF/3,=R8FF/3/P,=R98KPM,=R99KPM,=RA3YV/ANT,=RK0UT/3,=RW0LX/3,=UA3YH/ANT,=UA9KZ/3,
#    =UB8JAF/3,=UE91L,=UE95K,=UE95RA,
#    =R3ZK/FF,=RA3ZZ/ANT,=RA9AK/3,=RA9KD/3,=RU3ZK/FF,=RW0BG/3,=UA0QBC/3,
#    =RA07DR,=RA9DF/4/P,=RA9ODR/4/M,=RC4AF/FF,=RN4ACA/FF,=RV9CX/6/M,=UA4ASE/FF,=UA4ATL/FF,=UA8WAA/6,
#    =UA9FGR/4,=UE00S,=UE00S/P,=UE09VG,=UE80RWW,
#    =R4CDX/FF,=R8FF/4,=R8FR/4/M,=RA9KO/4,=RL96WS,=RL97WS,=RU80KEDR,=RU80KEDR/P,=RU9SO/4/M,=RV4CC/FF,
#    =RW0UZ/4,=RW9AW/4/M,=RZ0SB/4,=UA0KAT/4,=UA8WAA/4,=UA9AGR/4/M,=UA9JPX/4,=UA9OC/4,=UE23DZO,=UE95MS,
#    =UE95WS,=UE98WS,=UE99PW,
#    =R9CMA/4,=R9JBN/4,
#    R4H[30],R4I[30],RA4H[30],RA4I[30],RC4H[30],RC4I[30],RD4H[30],RD4I[30],RE4H[30],RE4I[30],RF4H[30],
#    RF4I[30],RG4H[30],RG4I[30],RJ4H[30],RJ4I[30],RK4H[30],RK4I[30],RL4H[30],RL4I[30],RM4H[30],
#    RM4I[30],RN4H[30],RN4I[30],RO4H[30],RO4I[30],RQ4H[30],RQ4I[30],RT4H[30],RT4I[30],RU4H[30],
#    RU4I[30],RV4H[30],RV4I[30],RW4H[30],RW4I[30],RX4H[30],RX4I[30],RY4H[30],RY4I[30],RZ4H[30],
#    RZ4I[30],U4H[30],U4I[30],UA4H[30],UA4I[30],UB4H[30],UB4I[30],UC4H[30],UC4I[30],UD4H[30],UD4I[30],
#    UE4H[30],UE4I[30],UF4H[30],UF4I[30],UG4H[30],UG4I[30],UH4H[30],UH4I[30],UI4H[30],UI4I[30],
#    =R20SAM[30],=R280TLT[30],=R3ARS/4[30],=R4HAT[29],=R4HC[29],=R4HCE[29],=R4HCZ[29],=R4HD[29],
#    =R4HDC[29],=R4HDR[29],=R4HL[29],=R4IC[29],=R4ID[29],=R4II[29],=R4IK[29],=R4IM[29],=R4IN[29],
#    =R4IO[29],=R4IT[29],=R9DA/4[30],=RA4HL[29],=RA9FAA/4/M[30],=RA9SC/4[30],=RA9SC/4/P[30],
#    =RC18SA[30],=RC20HZ[30],=RC4HT[29],=RC4I[29],=RC9YA/4/M[30],=RJ4I[29],=RK4HM[29],=RM4I[29],
#    =RN4HFJ[29],=RN4HIF[29],=RP72AG[30],=RP72I[30],=RP72MF[30],=RP72WO[30],=RP73DD[30],=RP73I[30],
#    =RP73PM[30],=RP74DD[30],=RP74I[30],=RT9K/4[30],=RU4HD[29],=RU4HP[29],=RU4I[29],=RV9JD/4/M[30],
#    =RW4HM[29],=RW4HTK[29],=RW4HW[29],=RW4HZ[29],=RW9SW/4[30],=RW9TP/4[30],=RW9WJ/4[30],
#    =RW9WJ/4/P[30],=RW9WJ/P[30],=RZ4HWF/LH[30],=RZ4HZW/FF[30],=RZ9WU/4/M[30],=UA0KAO/4[30],
#    =UA0QJA/4[30],=UA4H[29],=UA4HBM[29],=UA4HGL[29],=UA4HIP[29],=UA4HIP/M[30],=UA4HRZ[29],=UA4HY[29],
#    =UA9JGX/4[30],=UA9LAO/4[30],=UA9SQG/4/P[30],=UA9SY/4[30],=UC4I[29],=UI4I[29],
#    =R01DTV/4,=R9XC/4,=RA9XAF/4,=UA4HIP/4,=UA9JFE/4,
#    =R8XF/4,=RA4NCC[30],=RA9FR/4/P,=RA9XSM/4,=RD9CX/4,=RD9CX/4/P,=RU0LM/4,=RW9XC/4/M,=UA4NE/M,
#    =UA4NF[30],=UA4NF/M,=UA9APA/4/P,=UA9FIT/4,=UA9XI/4,=UE9FDA/4,=UE9FDA/4/M,=UE9GDA/4,
#    =R95PW,=R9WI/4/P,=RA9CKM/4/M,=RA9FR/4/M,=RJ4P[30],=RK4P[30],=RK4PK[30],=RM4P[30],=RM4R[30],
#    =RM8W/4/M,=RN9WWW/4,=RN9WWW/4/M,=RT05RO,=RV9FQ/4/M,=RV9WKI/4/M,=RV9WKI/4/P,=RV9WMZ/4/M,=RV9WZ/4,
#    =RW9TP/4/P,=RW9WA/4,=RW9WA/4/M,=RZ9WM/4,=UA2FM/4,=UA3AKO/4,=UA4PN[30],=UA4RF[30],=UA4RW[30],
#    =UA9AJ/4/M,=UA9JFN/4/M,=UA9JNQ/4,=UA9SG/4,=UE96MP,=UE9WDA/4,=UE9WDA/4/M,
#    =R8UT/4/P,=RX9WN/4,
#    =RQ0C/4,=RZ5D/4,=UA9XX/4,=UE9WFF/4,
#    R4W[30],RA4W[30],RC4W[30],RD4W[30],RE4W[30],RF4W[30],RG4W[30],RJ4W[30],RK4W[30],RL4W[30],RM4W[30],
#    RN4W[30],RO4W[30],RQ4W[30],RT4W[30],RU4W[30],RV4W[30],RW4W[30],RX4W[30],RY4W[30],RZ4W[30],U4W[30],
#    UA4W[30],UB4W[30],UC4W[30],UD4W[30],UE4W[30],UF4W[30],UG4W[30],UH4W[30],UI4W[30],=R0CM/4[30],
#    =R100MTK[30],=R9GM/4[30],=R9UT/4[30],=RA9FDR/4/P[30],=RA9KV/4/M[30],=RA9WU/4[30],=RA9WU/4/M[30],
#    =RA9WU/4/P[30],=RP72IZ[30],=RP73IZ[30],=RP74IZ[30],=RW9FWB/4[30],=RW9FWR/4[30],=RW9FWR/4/M[30],
#    =RX9FW/4[30],=UA9UAX/4/M[30],
#    =RT9T/4,=RV9MD/4,=UA4PCM/M,=UE04YCS,=UE85AGN,=UE90AGN,
#    =R01DTV,=R01DTV/7,=R0IT/6,=R80TV,=R8XW/6,=R9JO/6,=R9KD/6,=R9OM/6,=R9WGM/6/M,=RA0APW/6,=RA0FW/6,
#    =RA0LIF/6,=RA0LLW/6,=RA0QR/6,=RA9ODR/6,=RA9ODR/6/M,=RA9SAS/6,=RA9UWD/6,=RA9WW/6,=RD9CX/6,
#    =RD9CX/6/P,=RK6AH/LH,=RK9JA/6,=RN0CF/6,=RN0JT/6,=RQ0C/6,=RT9K/6,=RT9K/6/P,=RT9K/6/QRP,=RU2FB/6,
#    =RU9MX/6,=RU9QRP/6/M,=RU9QRP/6/P,=RU9SO/6,=RV9FQ/6,=RW0LIF/6,=RW0LIF/6/LH,=RW6AWW/LH,=RW9JZ/6,
#    =RW9WA/6,=RX6AA/ANT,=RX6AAP/ANT,=RX9TX/6,=RZ9HG/6,=RZ9HT/6,=RZ9UF/6,=RZ9UZV/6,=UA0AGE/6,=UA0IT/6,
#    =UA0JL/6,=UA0LQQ/6/P,=UA0SEP/6,=UA2FT/6,=UA6ADC/N,=UA9COO/6,=UA9CTT/6,=UA9JON/6,=UA9JPX/6,
#    =UA9KB/6,=UA9KJ/6,=UA9KW/6,=UA9MQR/6,=UA9UAX/6,=UA9VR/6,=UA9XC/6,=UA9XCI/6,=UE9WDA/6,=UE9WFF/6,
#    =UF0W/6,
#    =RA6EE/FF,=RN7G/FF,=UA0LEC/6,=UA9KAS/6,=UA9KAS/6/P,
#    =R9XV/6,=RA0ZG/6,=RA9CHS/6,=RA9CHS/7,=RK7G/FF,=RM8A/6/M,=RT9K/7,=RU9CK/7,=RU9ZA/7,=RZ7G/FF,
#    =RZ9ON/6,=UA0ZDA/6,=UA0ZS/6,=UA6HBO/N,=UA6HBO/ST30,=UA6IC/6/FF,=UA9CE/6,=UA9UAX/7/M,=UE80HS,
#    =R7AB/P,=UA6IC/FF,
#    =RU2FB/6/P,=UA9UAX/7,
#    =R6LCA/J,=R7AB/M,=R8WC/6,=R8WC/6/P,=RV9CMT/6,=RV9DC/6/P,=RV9LC/6,=RW9XC/6/M,=UA0QBR/6,=UA0ZED/6,
#    =UA6LP/P/LH,=UA6LV/ANT,=UA6MM/LH,=UE28DX,=UE92L,
#    =RV0ANH/6,=RV0APR/6,=RW0AF/6,
#    =R8FF/6,=R9DA/6,=R9MAV/6,=RA9DF/6/M,=RA9DF/6/P,=RU9CK/6/M,=RU9CK/6/P,=RV9CX/6/P,=UA9CES/6,
#    =UA9FGR/6,=UA9WQK/6,
#    =RU9CK/7/M,=RU9CK/7/P,=RV9CX/7/P,=UA9JFN/6/M,
#    =RT9K/7/P,=RZ7G/6/FF,
#    =R01DTV/6,=RV1CC/M,=RV9AB/6,
#    =R9FAZ/6/M,=R9MJ/6,=R9OM/5/P,=R9XT/6,=RA9KD/6,=RA9WU/6,=RN9N/6,=RN9N/M,=RT9T/6,=RT9T/6/M,=RU2FB/5,
#    =RU9WW/5/M,=RW9AW/5,=UA0LLM/5,=UA8WAA/5,=UA9CDC/6,=UA9UAX/5,=UE2KR,=UE98PW,
#    =R8AEU/6,=R9MJ/6/M,=RN9N/6/M,=UA0ZL/6,=UB8ADI/5,=UB8ADI/6,=UE2SE,
#    R8F(17)[30],R8G(17)[30],R9F(17)[30],R9G(17)[30],RA8F(17)[30],RA8G(17)[30],RA9F(17)[30],
#    RA9G(17)[30],RC8F(17)[30],RC8G(17)[30],RC9F(17)[30],RC9G(17)[30],RD8F(17)[30],RD8G(17)[30],
#    RD9F(17)[30],RD9G(17)[30],RE8F(17)[30],RE8G(17)[30],RE9F(17)[30],RE9G(17)[30],RF8F(17)[30],
#    RF8G(17)[30],RF9F(17)[30],RF9G(17)[30],RG8F(17)[30],RG8G(17)[30],RG9F(17)[30],RG9G(17)[30],
#    RJ8F(17)[30],RJ8G(17)[30],RJ9F(17)[30],RJ9G(17)[30],RK8F(17)[30],RK8G(17)[30],RK9F(17)[30],
#    RK9G(17)[30],RL8F(17)[30],RL8G(17)[30],RL9F(17)[30],RL9G(17)[30],RM8F(17)[30],RM8G(17)[30],
#    RM9F(17)[30],RM9G(17)[30],RN8F(17)[30],RN8G(17)[30],RN9F(17)[30],RN9G(17)[30],RO8F(17)[30],
#    RO8G(17)[30],RO9F(17)[30],RO9G(17)[30],RQ8F(17)[30],RQ8G(17)[30],RQ9F(17)[30],RQ9G(17)[30],
#    RT8F(17)[30],RT8G(17)[30],RT9F(17)[30],RT9G(17)[30],RU8F(17)[30],RU8G(17)[30],RU9F(17)[30],
#    RU9G(17)[30],RV8F(17)[30],RV8G(17)[30],RV9F(17)[30],RV9G(17)[30],RW8F(17)[30],RW8G(17)[30],
#    RW9F(17)[30],RW9G(17)[30],RX8F(17)[30],RX8G(17)[30],RX9F(17)[30],RX9G(17)[30],RY8F(17)[30],
#    RY8G(17)[30],RY9F(17)[30],RY9G(17)[30],RZ8F(17)[30],RZ8G(17)[30],RZ9F(17)[30],RZ9G(17)[30],
#    U8F(17)[30],U8G(17)[30],U9F(17)[30],U9G(17)[30],UA8F(17)[30],UA8G(17)[30],UA9F(17)[30],
#    UA9G(17)[30],UB8F(17)[30],UB8G(17)[30],UB9F(17)[30],UB9G(17)[30],UC8F(17)[30],UC8G(17)[30],
#    UC9F(17)[30],UC9G(17)[30],UD8F(17)[30],UD8G(17)[30],UD9F(17)[30],UD9G(17)[30],UE8F(17)[30],
#    UE8G(17)[30],UE9F(17)[30],UE9G(17)[30],UF8F(17)[30],UF8G(17)[30],UF9F(17)[30],UF9G(17)[30],
#    UG8F(17)[30],UG8G(17)[30],UG9F(17)[30],UG9G(17)[30],UH8F(17)[30],UH8G(17)[30],UH9F(17)[30],
#    UH9G(17)[30],UI8F(17)[30],UI8G(17)[30],UI9F(17)[30],UI9G(17)[30],=R120RP(17)[30],=R155PM(17)[30],
#    =R160PM(17)[30],=R18PER(17)[30],=R2011UFO(17)[30],=R2011UFO/M(17)[30],=R2011UFO/P(17)[30],
#    =R2014WOG(17)[30],=R20PRM(17)[30],=R290PM(17)[30],=R2AG/9(17)[30],=R34CZF(17)[30],
#    =R6DAB/9(17)[30],=R8CZ/4(17)[30],=R8CZ/4/M(17)[30],=R8CZ/M(17)[30],=R95FR(17)[30],=R9CZ/4(17)[30],
#    =R9CZ/4/M(17)[30],=R9CZ/M(17)[30],=R9GM/P(17)[30],=R9KC/4/M(17)[30],=R9KC/8/M(17)[30],
#    =RA27FM(17)[30],=RA9XAI/4(17)[30],=RC20FM(17)[30],=RD4M/9(17)[30],=RG50P/M(17)[30],
#    =RN9N/4(17)[30],=RP70PK(17)[30],=RP9FKU(17)[30],=RP9FTK(17)[30],=RU27FQ(17)[30],=RU27FW(17)[30],
#    =RU4W/9(17)[30],=RV22PM(17)[30],=RX9TX/9(17)[30],=RZ16FM(17)[30],=RZ9WM/9(17)[30],
#    =UA1ZQO/9(17)[30],=UA3FQ/4(17)[30],=UA3FQ/4/P(17)[30],=UA3FQ/P(17)[30],=UA4NF/4/M(17)[30],
#    =UA4WA/9(17)[30],=UA9CGL/4/M(17)[30],=UA9CUA/4/M(17)[30],=UA9UAX/4(17)[30],=UE16SA(17)[30],
#    =UE55PM(17)[30],
#    =RW3TN/9(17)[30],=UE10SK(17)[30],
#    R1I(17)[20],R8X(17)[20],R9X(17)[20],RA1I(17)[20],RA8X(17)[20],RA9X(17)[20],RC1I(17)[20],
#    RC8X(17)[20],RC9X(17)[20],RD1I(17)[20],RD8X(17)[20],RD9X(17)[20],RE1I(17)[20],RE8X(17)[20],
#    RE9X(17)[20],RF1I(17)[20],RF8X(17)[20],RF9X(17)[20],RG1I(17)[20],RG8X(17)[20],RG9X(17)[20],
#    RI8X(17)[20],RI9X(17)[20],RJ1I(17)[20],RJ8X(17)[20],RJ9X(17)[20],RK1I(17)[20],RK8X(17)[20],
#    RK9X(17)[20],RL1I(17)[20],RL8X(17)[20],RL9X(17)[20],RM1I(17)[20],RM8X(17)[20],RM9X(17)[20],
#    RN1I(17)[20],RN8X(17)[20],RN9X(17)[20],RO1I(17)[20],RO8X(17)[20],RO9X(17)[20],RQ1I(17)[20],
#    RQ8X(17)[20],RQ9X(17)[20],RT1I(17)[20],RT8X(17)[20],RT9X(17)[20],RU1I(17)[20],RU8X(17)[20],
#    RU9X(17)[20],RV1I(17)[20],RV8X(17)[20],RV9X(17)[20],RW1I(17)[20],RW8X(17)[20],RW9X(17)[20],
#    RX1I(17)[20],RX8X(17)[20],RX9X(17)[20],RY1I(17)[20],RY8X(17)[20],RY9X(17)[20],RZ1I(17)[20],
#    RZ8X(17)[20],RZ9X(17)[20],U1I(17)[20],U8X(17)[20],U9X(17)[20],UA1I(17)[20],UA8X(17)[20],
#    UA9X(17)[20],UB1I(17)[20],UB8X(17)[20],UB9X(17)[20],UC1I(17)[20],UC8X(17)[20],UC9X(17)[20],
#    UD1I(17)[20],UD8X(17)[20],UD9X(17)[20],UE1I(17)[20],UE8X(17)[20],UE9X(17)[20],UF1I(17)[20],
#    UF8X(17)[20],UF9X(17)[20],UG1I(17)[20],UG8X(17)[20],UG9X(17)[20],UH1I(17)[20],UH8X(17)[20],
#    UH9X(17)[20],UI1I(17)[20],UI8X(17)[20],UI9X(17)[20],=R100AP(17)[20],=R120RK(17)[20],
#    =R16NOR(17)[20],=R18ISL(17)[20],=R1II/P(17)[20],=R2014I(17)[20],=R20SZO(17)[20],=R35MWC(17)[20],
#    =R3RRC/9(17)[20],=R5QA/1(17)[20],=R5QQ/1(17)[20],=R6DGL/9/M(17)[20],=R70SRC(17)[20],
#    =R7BA/1(17)[20],=R7BA/9(17)[20],=R7BA/9/M(17)[20],=R8MB/1(17)[20],=R8MB/1/P(17)[20],
#    =R9/UR7IMG(17)[20],=R95KOMI(17)[20],=R9KD/9(17)[20],=R9XAK/1/P(17)[20],=RA/DK5JI(17)[20],
#    =RA/UR5MKH(17)[20],=RA22KO(17)[20],=RA22XA(17)[20],=RA22XF(17)[20],=RA22XU(17)[20],
#    =RA3AMG/9/M(17)[20],=RA3OM/9(17)[20],=RA3X/1(17)[20],=RA4NH/9(17)[20],=RA4NV/9(17)[20],
#    =RA6ACI/9(17)[20],=RD4CBQ/9(17)[20],=RK1OWZ/9(17)[20],=RK1OWZ/9/M(17)[20],=RK30DR(17)[20],
#    =RK6K/9(17)[20],=RK90DR(17)[20],=RN22OG(17)[20],=RN22OV(17)[20],=RN4ACZ/9(17)[20],=RO25KO(17)[20],
#    =RP67KR(17)[20],=RP68KR(17)[20],=RP70KW(17)[20],=RP71KW(17)[20],=RP72X(17)[20],=RP73X(17)[20],
#    =RP74X(17)[20],=RT73LF(17)[20],=RV3UI/9(17)[20],=RW1QN/9(17)[20],=RW1QN/9/M(17)[20],
#    =RW1QN/9/P(17)[20],=RW4NJ/9/M(17)[20],=RY110RAEM(17)[20],=UA1OOX/9(17)[20],=UA1QV/9(17)[20],
#    =UA4WP/9/M(17)[20],=UA6LTO/9(17)[20],=UB1OAD/1/P(17)[20],=UB1OAD/9/P(17)[20],=UB5O/1/M(17)[20],
#    =UE16ST(17)[20],=UE1RDA/9(17)[20],=UE85DRK(17)[20],=UE90K(17)[20];
#Kaliningrad:              15:  29:  EU:   54.72:   -20.52:    -3.0:  UA2:
#    R2F,R2K,RA2,RC2F,RC2K,RD2F,RD2K,RE2F,RE2K,RF2F,RF2K,RG2F,RG2K,RJ2F,RJ2K,RK2F,RK2K,RL2F,RL2K,RM2F,
#    RM2K,RN2F,RN2K,RO2F,RO2K,RQ2F,RQ2K,RT2F,RT2K,RU2F,RU2K,RV2F,RV2K,RW2F,RW2K,RX2F,RX2K,RY2F,RY2K,
#    RZ2F,RZ2K,U2F,U2K,UA2,UB2,UC2,UD2,UE2,UF2,UG2,UH2,UI2,=R01DTV/2,=R10RLHA/2,=R10RTRS/2,=R1255F,
#    =R1336FO,=R14CWC/2,=R15CWC/2,=R15CWC/2/QRP,=R18SRB,=R1NW/2,=R1QAP/2,=R2/DK2AI,=R2/DL1YMK,
#    =R2/N6TCZ,=R2/R6AF,=R2/UA6LV,=R2/UR0MC,=R21GGGR,=R22GGGR,=R22GGR,=R25ARCK/2,=R2MWO,=R310A/2,
#    =R3SRR/2,=R3XA/2,=R5K/2,=R5QA/2,=R60A,=R680FBO,=R6AF/2,=R777AN,=R7LV/2,=R900BL/2,=RA/DL6KV,
#    =RA/EU1FY/P,=RA/SP7VC,=RA2FDX/FF,=RA2FN/RP,=RA2FO/N,=RA3ATX/2,=RA3XM/2,=RA4LW/2,=RC18KA,=RD22FU,
#    =RD3FG/2,=RJ22DX,=RK3QS/2,=RM9I/2,=RM9IX/2,=RN3GM/2,=RP2F,=RP2K,=RP70KB,=RP70KG,=RP70MW,=RP70WB,
#    =RT9T/2,=RU3FS/2,=RU5A/2,=RV3FF/2,=RV3MA/2,=RV3UK/2,=RV9WZ/2,=RW9QA/2,=RY1AAA/2,=RZ3FA/2,=RZ6HB/2,
#    =UA0SIK/2,=UA1AAE/2,=UA1AFT/2,=UA2DC/RP,=UA2FM/MM(13),=UA3DJG/2,=UA4RC/2,=UA4WHX/2,=UA9UAX/2,
#    =UB5O/2,=UB5O/2/M,=UB9KAA/2,=UE08F,=UE1RLH/2,=UE3QRP/2,=UE6MAC/2,=UF1M/2;
#Asiatic Russia:           17:  30:  AS:   55.88:   -84.08:    -7.0:  UA9:
#    R0(19)[33],R8,R9,RA0(19)[33],RA8,RA9,RC0(19)[33],RC8,RC9,RD0(19)[33],RD8,RD9,RE0(19)[33],RE8,RE9,
#    RF0(19)[33],RF8,RF9,RG0(19)[33],RG8,RG9,RI0(19)[33],RI8,RI9,RJ0(19)[33],RJ8,RJ9,RK0(19)[33],RK8,
#    RK9,RL0(19)[33],RL8,RL9,RM0(19)[33],RM8,RM9,RN0(19)[33],RN8,RN9,RO0(19)[33],RO8,RO9,RQ0(19)[33],
#    RQ8,RQ9,RT0(19)[33],RT8,RT9,RU0(19)[33],RU8,RU9,RV0(19)[33],RV8,RV9,RW0(19)[33],RW8,RW9,
#    RX0(19)[33],RX8,RX9,RY0(19)[33],RY8,RY9,RZ0(19)[33],RZ8,RZ9,U0(19)[33],U8,U9,UA0(19)[33],UA8,UA9,
#    UB0(19)[33],UB8,UB9,UC0(19)[33],UC8,UC9,UD0(19)[33],UD8,UD9,UE0(19)[33],UE8,UE9,UF0(19)[33],UF8,
#    UF9,UG0(19)[33],UG8,UG9,UH0(19)[33],UH8,UH9,UI0(19)[33],UI8,UI9,=R0FK(40)[75],=R0PA(40)[75],
#    =R0POL(40)[75],=R0UPOL(40)[75],=R14CWC/0(19),=R16KAZ(18),=R18KDR/0(19),=R18KDR/8,=R2AKM/0(19),
#    =R34SP(40)[75],=R35NP,=R4CDO/9/M(18),=RA0CCK/8,=RA1WS/9,=RA3TND/0(19),=RA3TND/9(18),=RA4AAJ/9(18),
#    =RD17CW(19),=RD1AL/0(40)[75],=RD3ARX/0/P(19),=RF1A/9(18),=RI18POL(40)[75],=RJ17WG,=RL19WF,=RM17NY,
#    =RM19WF(18),=RN17CW,=RO19WF(19),=RQ17CW(18),=RQ17WG,=RQ4D/9(18),=RU17NY(18),=RV3PZ/9,=RW1AI/0(19),
#    =RW55YG,=RX17WG(19),=RX55YG(18),=RX80SP(18),=RY1AAB/0/M(19),=RY80SP(19),=RZ17NY(19),=RZ6A/9,
#    =RZ9YI/9,=UA0ZDA/MM(29),=UA3DND/8,=UA3TT/8,=UD6AOP/0(19),=UE18M,=UE18U(18),=UE18Z(19),
#    =R100RG,=R120RG,=R2014Y,=R2015TL,=R20UFO,=R22SKE,=R280A,=R280B,=R3HD/9,=R3RRC/8,=R55TV,=R6RA/9,
#    =R70PW,=R70PW/P,=R9SRR,=RA0QK/8,=RA1AIP/9/P,=RA1AR/9,=RA1QR/9,=RA3WJ/9,=RA3XBN/9,=RA3ZM/8,
#    =RA4FSC/9,=RA4HGN/9,=RA9SC/9,=RA9WJV/8/P,=RC20AB,=RC20AC,=RD3BN/9,=RD4CAQ/9,=RG110RAEM,=RJ17CW,
#    =RK9SZZ/9,=RL5G/8,=RL9AA/P,=RN4WA/9,=RN9O/8,=RP67TG,=RP68MZ,=RP70AZ,=RP70PM,=RP70TG,=RP71AZ,
#    =RP71TG,=RP72AZ,=RP72MS,=RP72TG,=RP73AZ,=RP73TG,=RP73U,=RP74AZ,=RP74TG,=RP74U,=RQ4D/8,=RT60RT,
#    =RT73AB,=RU22AZ,=RV1AQ/9,=RV1CC/8,=RV1CC/9,=RV3BA/9,=RV9WB/9/M,=RV9WMZ/9/P,=RV9WMZ/P,=RX3RC/9,
#    =RX9WN/9/M,=RX9WT/8,=RZ0OO/9,=RZ6DR/9/M,=RZ9OO/9/M,=UA0MF/9,=UA3AKO/8,=UA4RC/9,=UA6A/9,=UA6CW/9,
#    =UA6YGY/8,=UA6YGY/9,=UA8WAA/9,=UA8WAA/9/P,=UA8WAA/M,=UA9CGL/9/M,=UA9SG/9,=UA9TO/9/M,=UA9WMN/9/P,
#    =UE45AWT,=UE70AAA,=UE9WDA/9,
#    =R01DTV/8,=R105WWS,=R14CWC/8,=R14CWC/9,=R150DMP,=R155AP,=R15CWC/8,=R15CWC/8/QRP,=R160DMP,=R16SVK,
#    =R170GS/8,=R2015BP,=R2015R,=R2016DR,=R20EKB,=R22SKJ,=R27EKB,=R30ZF,=R35CZF,=R375I,=R44YETI/8,
#    =R4WAB/9/P,=R55EPC,=R55EPC/P,=R6UAE/9,=R70NIK,=R7LZ/8,=R8FF/8,=R9GM/8,=R9GM/8/M,=RA/DL6XK,
#    =RA/US5ETV,=RA0BA/8,=RA0BA/9,=RA27AA,=RA27EK,=RA36GS,=RA36ZF,=RA4YW/9,=RA4YW/9/M,=RA9FW/9,
#    =RA9WU/9,=RC18EK,=RD0B/8,=RK9AD/9/M,=RK9DR/N,=RL4R/8,=RM0B/9,=RM19NY,=RN16CW,=RN3QBG/9,=RP68DT,
#    =RP68RG,=RP68TG,=RP68TK,=RP69GR,=RP70DT,=RP70G,=RP70GB,=RP70GR,=RP70MA,=RP70SA,=RP70UH,=RP71DT,
#    =RP71GA,=RP71GA/M,=RP71GB,=RP71GR,=RP71LT,=RP71MO,=RP71SA,=RP72DT,=RP72FI,=RP72GB,=RP72GR,=RP72IM,
#    =RP72KB,=RP72SA,=RP73DT,=RP73GB,=RP73GR,=RP73IM,=RP73SA,=RP74DT,=RP74GB,=RP74GR,=RP74IM,=RT4C/8,
#    =RT4W/9,=RT73BR,=RT73EB,=RT73FL,=RT73HE,=RT73KB,=RT73SK,=RU22CR,=RU5D/8,=RU5D/9,=RV6LGY/9,
#    =RV6LGY/9/M,=RV6LGY/9/P,=RV6MD/9,=RV9WB/8,=RW4NX/9,=RW9C[20],=RX0SD/9,=RX3Q/8,=RX3Q/9,=RX9UL/9,
#    =RY9C/P,=RZ1CWC/8,=RZ37ZF,=RZ38ZF,=RZ39ZF,=UA0BA/8,=UA3FQ/8,=UA3IHJ/8,=UA4WHX/9,=UA8WAA/8,
#    =UA9MW/9,=UA9UAX/8,=UA9UAX/8/M,=UE16SR,=UE25F,=UE40CZF,=UE4NFF/9,=UE56S,=UE64RWA,=UE70SL,=UE75DT,
#    R8H(18)[31],R8I(18)[31],R9H(18)[31],R9I(18)[31],RA8H(18)[31],RA8I(18)[31],RA9H(18)[31],
#    RA9I(18)[31],RC8H(18)[31],RC8I(18)[31],RC9H(18)[31],RC9I(18)[31],RD8H(18)[31],RD8I(18)[31],
#    RD9H(18)[31],RD9I(18)[31],RE8H(18)[31],RE8I(18)[31],RE9H(18)[31],RE9I(18)[31],RF8H(18)[31],
#    RF8I(18)[31],RF9H(18)[31],RF9I(18)[31],RG8H(18)[31],RG8I(18)[31],RG9H(18)[31],RG9I(18)[31],
#    RJ8H(18)[31],RJ8I(18)[31],RJ9H(18)[31],RJ9I(18)[31],RK8H(18)[31],RK8I(18)[31],RK9H(18)[31],
#    RK9I(18)[31],RL8H(18)[31],RL8I(18)[31],RL9H(18)[31],RL9I(18)[31],RM8H(18)[31],RM8I(18)[31],
#    RM9H(18)[31],RM9I(18)[31],RN8H(18)[31],RN8I(18)[31],RN9H(18)[31],RN9I(18)[31],RO8H(18)[31],
#    RO8I(18)[31],RO9H(18)[31],RO9I(18)[31],RQ8H(18)[31],RQ8I(18)[31],RQ9H(18)[31],RQ9I(18)[31],
#    RT8H(18)[31],RT8I(18)[31],RT9H(18)[31],RT9I(18)[31],RU8H(18)[31],RU8I(18)[31],RU9H(18)[31],
#    RU9I(18)[31],RV8H(18)[31],RV8I(18)[31],RV9H(18)[31],RV9I(18)[31],RW8H(18)[31],RW8I(18)[31],
#    RW9H(18)[31],RW9I(18)[31],RX8H(18)[31],RX8I(18)[31],RX9H(18)[31],RX9I(18)[31],RY8H(18)[31],
#    RY8I(18)[31],RY9H(18)[31],RY9I(18)[31],RZ8H(18)[31],RZ8I(18)[31],RZ9H(18)[31],RZ9I(18)[31],
#    U8H(18)[31],U8I(18)[31],U9H(18)[31],U9I(18)[31],UA8H(18)[31],UA8I(18)[31],UA9H(18)[31],
#    UA9I(18)[31],UB8H(18)[31],UB8I(18)[31],UB9H(18)[31],UB9I(18)[31],UC8H(18)[31],UC8I(18)[31],
#    UC9H(18)[31],UC9I(18)[31],UD8H(18)[31],UD8I(18)[31],UD9H(18)[31],UD9I(18)[31],UE8H(18)[31],
#    UE8I(18)[31],UE9H(18)[31],UE9I(18)[31],UF8H(18)[31],UF8I(18)[31],UF9H(18)[31],UF9I(18)[31],
#    UG8H(18)[31],UG8I(18)[31],UG9H(18)[31],UG9I(18)[31],UH8H(18)[31],UH8I(18)[31],UH9H(18)[31],
#    UH9I(18)[31],UI8H(18)[31],UI8I(18)[31],UI9H(18)[31],UI9I(18)[31],=R135TU(18)[31],=R140TU(18)[31],
#    =R2DA/9(18)[31],=R9/UN0C(18)[31],=R9MJ/9(18)[31],=RA0LH/9(18)[31],=RA9JG/9/P(18)[31],
#    =RA9ODR/9/M(18)[31],=RM9H(18)[31],=RN9HM/A(18)[31],=RN9HM/P(18)[31],=RP73TP(18)[31],=RP9H(18)[31],
#    =RQ110RAEM(18)[31],=RQ9I(18)[31],=RU9AZ/9(18)[31],=RV3LO/9(18)[31],=RZ9HK/FF(18)[31],
#    =RZ9HX/FF(18)[31],=UA9JFN/9/M(18)[31],=UA9MUY/9(18)[31],=UA9OAP/9/P(18)[31],=UA9UAX/9/M(18)[31],
#    =UE14TS(18)[31],=UE9FDA/9(18)[31],
#    R8J[20],R9J[20],RA8J[20],RA9J[20],RC8J[20],RC9J[20],RD8J[20],RD9J[20],RE8J[20],RE9J[20],RF8J[20],
#    RF9J[20],RG8J[20],RG9J[20],RJ8J[20],RJ9J[20],RK8J[20],RK9J[20],RL8J[20],RL9J[20],RM8J[20],
#    RM9J[20],RN8J[20],RN9J[20],RO8J[20],RO9J[20],RQ8J[20],RQ9J[20],RT8J[20],RT9J[20],RU8J[20],
#    RU9J[20],RV8J[20],RV9J[20],RW8J[20],RW9J[20],RX8J[20],RX9J[20],RY8J[20],RY9J[20],RZ8J[20],
#    RZ9J[20],U8J[20],U9J[20],UA8J[20],UA9J[20],UB8J[20],UB9J[20],UC8J[20],UC9J[20],UD8J[20],UD9J[20],
#    UE8J[20],UE9J[20],UF8J[20],UF9J[20],UG8J[20],UG9J[20],UH8J[20],UH9J[20],UI8J[20],UI9J[20],
#    =R11UND[20],=R120RJ[20],=R123JDR[20],=R15UGRA[20],=R16UGRA[20],=R18KSA[20],=R25ARCK/8[20],
#    =R2AEA/9[20],=R4YA/8[20],=R4YAC/9[20],=R8JAJ/M[20],=RA/UR8IF[20],=RA/UT2LA[20],=RA1QBH/9[20],
#    =RA3ARS/9[20],=RA3ARS/9/M[20],=RA3QQI/8[20],=RA4FCJ/9[20],=RA4HRM/9[20],=RA60PD[20],=RA9WN/9[20],
#    =RD4HM/9[20],=RJ9J[20],=RK4PA/9[20],=RK6ANP/9[20],=RK6YM/8[20],=RK6YM/9[20],=RP67GS[20],
#    =RP68GS[20],=RP68J[20],=RP68LK[20],=RP69GS[20],=RP69SF[20],=RP70GS[20],=RP70LF[20],=RP70SF[20],
#    =RP70SU[20],=RP70YF[20],=RP71GS[20],=RP71LF[20],=RP71SF[20],=RP72DS[20],=RP72GS[20],=RP72SF[20],
#    =RP72YF[20],=RP73GS[20],=RP73SF[20],=RP74GS[20],=RQ0C/8[20],=RU6YD/9[20],=RV6YM/9[20],
#    =RW4HOH/9[20],=RW4LX/9[20],=RW6AHV/9[20],=RW9WX/9[20],=RX3BP/9[20],=RX3BP/9/MM[20],=RZ5D/8[20],
#    =RZ9WF/8[20],=RZ9WF/9[20],=UA3ZAF/9[20],=UA6WIO/9[20],=UA9JFN/M[20],
#    R8K[20],R9K[20],RA8K[20],RA9K[20],RC8K[20],RC9K[20],RD8K[20],RD9K[20],RE8K[20],RE9K[20],RF8K[20],
#    RF9K[20],RG8K[20],RG9K[20],RI9K[20],RJ8K[20],RJ9K[20],RK8K[20],RK9K[20],RL8K[20],RL9K[20],
#    RM8K[20],RM9K[20],RN8K[20],RN9K[20],RO8K[20],RO9K[20],RQ8K[20],RQ9K[20],RT8K[20],RT9K[20],
#    RU8K[20],RU9K[20],RV8K[20],RV9K[20],RW8K[20],RW9K[20],RX8K[20],RX9K[20],RY8K[20],RY9K[20],
#    RZ8K[20],RZ9K[20],U8K[20],U9K[20],UA8K[20],UA9K[20],UB8K[20],UB9K[20],UC8K[20],UC9K[20],UD8K[20],
#    UD9K[20],UE8K[20],UE9K[20],UF8K[20],UF9K[20],UG8K[20],UG9K[20],UH8K[20],UH9K[20],UI8K[20],
#    UI9K[20],=R120RU[20],=R16LEV[20],=R1DA/8/M[20],=R1DA/9/M[20],=R1ZY/8[20],=R1ZY/9[20],
#    =R20RRC/8[20],=R3CA/8[20],=R3CG/8[20],=R8XW/8[20],=R9XC/9[20],=R9XT/9[20],=RA/EW1RR[20],
#    =RA/EW2R[20],=RA1ALA/8[20],=RA3III/8[20],=RA4RU/9[20],=RA4RU/9/P[20],=RC8X/9[20],=RC9XM/8[20],
#    =RI9K[20],=RK6CT/9[20],=RN0CF/9[20],=RN3OF/9[20],=RU6UR/9[20],=RV1CC/8/M[20],=RV6ARQ/9[20],
#    =RV6LFE/9[20],=RV7B/9[20],=RW0BB/9[20],=RW0BB/9/LH[20],=RW0BG/9[20],=RW4AA/9[20],=RW4HIF/9[20],
#    =RW4HIH/9[20],=RW6BA/9[20],=RW9XU/9[20],=RX6CP/8[20],=RX6LMA/9[20],=RX9SN/8[20],=UA0KY/9[20],
#    =UA0QMU/0[20],=UA0QQO/9/P[20],=UA1FBP/9[20],=UA1PBA/9[20],=UA1PBP/9[20],=UA3DFM/8[20],
#    =UA3DFM/9[20],=UA3MGA/9[20],=UA6BTN/9[20],=UA9SUV/8[20],
#    =R11QRP/8,=R11QRP/8/P,=R120RL,=R18POR,=R2015EP,=R2015LY,=R2015LY/8,=R22BIA,=R30STM,=R430LT,
#    =R4FAA/8,=R8MC/9,=R8MD/9,=RA/EW8ADX,=RA0UAC/8,=RA0UF/8,=RA3AL/M,=RA3CW/9,=RA9JG/9,=RC1M/8/M,
#    =RO25TN,=RP67JH,=RP67LK,=RP67LL,=RP67TT,=RP68LS,=RP68TT,=RP69CM,=RP69DK,=RP69GP,=RP69LK,=RP69LL,
#    =RP69LS,=RP69MM,=RP69P,=RP69YN,=RP70GP,=RP70LL,=RP70LM,=RP70P,=RP70TM,=RP71GP,=RP71LL,=RP71P,
#    =RP72GP,=RP72LL,=RP72P,=RP72PJ,=RP73LL,=RP73P,=RP74LL,=RP74P,=RR110RAEM,=RU22LR,=RW0QJ/9,=RX4W/8,
#    =RX6DL/8,=RX6DL/8/P,=RX6DL/8/P/QRP,=RX6DL/9/P,=RZ9MXM/9/M,=UB5O/8/P,=UE44Y/8,=UE9FDA/9/M,
#    =UE9MDA/9,
#    =R16CAN,=R1716K,=R1716M,=R1716O,=R1716S,=R9MJ/M,=RA/DK2AI/M,=RA22MX,=RA4CQ/9/M,=RA9MR/0,=RA9MX/P,
#    =RC20MX,=RK6YYA/9,=RN0SZ/9,=RN9N/9,=RP65MOH,=RP67MC,=RP67MD,=RP68MC,=RP68MD,=RP69MC,=RP69MD,
#    =RP70GK,=RP70MC,=RP70MD,=RP70OB,=RP70OF,=RP70OS,=RP71GK,=RP71MJ,=RP71OB,=RP72GK,=RP72MJ,=RP72OB,
#    =RP72ZW,=RP73GK,=RP73OB,=RP74PO,=RP8M,=RT22MC,=RT22MD,=RV0SR/9,=RW22MW,=RY22MC,=UA1ZGD/9,
#    =UA3AKO/9,=UA9MA/M,=UB5O/8,=UE55OM,=UE70KRM/9,=UE70KRM/9/M,=UE9OFF/9,
#    R8O(18)[31],R8P(18)[31],R9O(18)[31],R9P(18)[31],RA8O(18)[31],RA8P(18)[31],RA9O(18)[31],
#    RA9P(18)[31],RC8O(18)[31],RC8P(18)[31],RC9O(18)[31],RC9P(18)[31],RD8O(18)[31],RD8P(18)[31],
#    RD9O(18)[31],RD9P(18)[31],RE8O(18)[31],RE8P(18)[31],RE9O(18)[31],RE9P(18)[31],RF8O(18)[31],
#    RF8P(18)[31],RF9O(18)[31],RF9P(18)[31],RG8O(18)[31],RG8P(18)[31],RG9O(18)[31],RG9P(18)[31],
#    RJ8O(18)[31],RJ8P(18)[31],RJ9O(18)[31],RJ9P(18)[31],RK8O(18)[31],RK8P(18)[31],RK9O(18)[31],
#    RK9P(18)[31],RL8O(18)[31],RL8P(18)[31],RL9O(18)[31],RL9P(18)[31],RM8O(18)[31],RM8P(18)[31],
#    RM9O(18)[31],RM9P(18)[31],RN8O(18)[31],RN8P(18)[31],RN9O(18)[31],RN9P(18)[31],RO8O(18)[31],
#    RO8P(18)[31],RO9O(18)[31],RO9P(18)[31],RQ8O(18)[31],RQ8P(18)[31],RQ9O(18)[31],RQ9P(18)[31],
#    RT8O(18)[31],RT8P(18)[31],RT9O(18)[31],RT9P(18)[31],RU8O(18)[31],RU8P(18)[31],RU9O(18)[31],
#    RU9P(18)[31],RV8O(18)[31],RV8P(18)[31],RV9O(18)[31],RV9P(18)[31],RW8O(18)[31],RW8P(18)[31],
#    RW9O(18)[31],RW9P(18)[31],RX8O(18)[31],RX8P(18)[31],RX9O(18)[31],RX9P(18)[31],RY8O(18)[31],
#    RY8P(18)[31],RY9O(18)[31],RY9P(18)[31],RZ8O(18)[31],RZ8P(18)[31],RZ9O(18)[31],RZ9P(18)[31],
#    U8O(18)[31],U8P(18)[31],U9O(18)[31],U9P(18)[31],UA8O(18)[31],UA8P(18)[31],UA9O(18)[31],
#    UA9P(18)[31],UB8O(18)[31],UB8P(18)[31],UB9O(18)[31],UB9P(18)[31],UC8O(18)[31],UC8P(18)[31],
#    UC9O(18)[31],UC9P(18)[31],UD8O(18)[31],UD8P(18)[31],UD9O(18)[31],UD9P(18)[31],UE8O(18)[31],
#    UE8P(18)[31],UE9O(18)[31],UE9P(18)[31],UF8O(18)[31],UF8P(18)[31],UF9O(18)[31],UF9P(18)[31],
#    UG8O(18)[31],UG8P(18)[31],UG9O(18)[31],UG9P(18)[31],UH8O(18)[31],UH8P(18)[31],UH9O(18)[31],
#    UH9P(18)[31],UI8O(18)[31],UI8P(18)[31],UI9O(18)[31],UI9P(18)[31],=R0LY/9(18)[31],=R0QA/9(18)[31],
#    =R100MP(18)[31],=R110RAEM(18)[31],=R111EK(18)[31],=R120RW(18)[31],=R125NSK(18)[31],
#    =R15CWC/9(18)[31],=R18CRO(18)[31],=R2013T(18)[31],=R2013TP(18)[31],=R2017T(18)[31],
#    =R20NSK(18)[31],=R27ODR(18)[31],=R27ODR/M(18)[31],=R27ODW(18)[31],=R27OGA(18)[31],=R27OGF(18)[31],
#    =R27OSN(18)[31],=R27OUO(18)[31],=R2ET/9(18)[31],=R30SIB(18)[31],=R8OA/9/P(18)[31],=R8SRR(18)[31],
#    =R9/TA1FL(18)[31],=RA/DF8DX(18)[31],=RA/N3QQ(18)[31],=RA0LMC/9(18)[31],=RA27OA(18)[31],
#    =RA27OM(18)[31],=RA3DH/9(18)[31],=RA3ET/9(18)[31],=RA4FRH/0/P(18)[31],=RA9JJ/9/M(18)[31],
#    =RA9MX/9(18)[31],=RC1M/9(18)[31],=RC1M/9/M(18)[31],=RD0L/9(18)[31],=RG9O(18)[31],
#    =RN9N/9/M(18)[31],=RO9O(18)[31],=RP67MP(18)[31],=RP68MP(18)[31],=RP70MP(18)[31],=RP71MP(18)[31],
#    =RP72MP(18)[31],=RP73MP(18)[31],=RP74MP(18)[31],=RP9OMP(18)[31],=RP9OW(18)[31],=RQ16CW(18)[31],
#    =RR9O(18)[31],=RS9O(18)[31],=RU0ZM/9(18)[31],=RU27OZ(18)[31],=RU6LA/9(18)[31],=RV0CJ/9(18)[31],
#    =RW1AC/9(18)[31],=RW9MD/9/M(18)[31],=RZ9MXM/9(18)[31],=UA0KDR/9(18)[31],=UA0ZAY/9(18)[31],
#    =UA6WFO/9(18)[31],=UA9MA/9(18)[31],=UA9MA/9/M(18)[31],=UA9MRA/9(18)[31],=UE80NSO(18)[31],
#    =R110RP,=R120RDP,=R120RZ,=R120TM,=R150RP,=R155RP,=R160RP,=R18URU,=RA22QF,=RC20QA,=RC20QC,=RC20QF,
#    =RM20CC,=RM9RZ/A,=RM9RZ/P,=RP65R,=RP67KE,=RP67R,=RP68KE,=RP68R,=RP69KE,=RP69R,=RP70KE,=RP70R,
#    =RP71R,=RP72KE,=RP72R,=RT73CW,=RT73JH,=RV3MN/9,=RW22QA,=RW22QA/8,=RW22QC,=RW22QC/8,=RW4NW/9,
#    =RY22RZ,=RZ9WM/9/M,=UE4WFF/9,=UE4WFF/9/P,=UE70KRM/8/M,
#    R8S(16),R8T(16),R9S(16),R9T(16),RA8S(16),RA8T(16),RA9S(16),RA9T(16),RC8S(16),RC8T(16),RC9S(16),
#    RC9T(16),RD8S(16),RD8T(16),RD9S(16),RD9T(16),RE8S(16),RE8T(16),RE9S(16),RE9T(16),RF8S(16),
#    RF8T(16),RF9S(16),RF9T(16),RG8S(16),RG8T(16),RG9S(16),RG9T(16),RJ8S(16),RJ8T(16),RJ9S(16),
#    RJ9T(16),RK8S(16),RK8T(16),RK9S(16),RK9T(16),RL8S(16),RL8T(16),RL9S(16),RL9T(16),RM8S(16),
#    RM8T(16),RM9S(16),RM9T(16),RN8S(16),RN8T(16),RN9S(16),RN9T(16),RO8S(16),RO8T(16),RO9S(16),
#    RO9T(16),RQ8S(16),RQ8T(16),RQ9S(16),RQ9T(16),RT8S(16),RT8T(16),RT9S(16),RT9T(16),RU8S(16),
#    RU8T(16),RU9S(16),RU9T(16),RV8S(16),RV8T(16),RV9S(16),RV9T(16),RW8S(16),RW8T(16),RW9S(16),
#    RW9T(16),RX8S(16),RX8T(16),RX9S(16),RX9T(16),RY8S(16),RY8T(16),RY9S(16),RY9T(16),RZ8S(16),
#    RZ8T(16),RZ9S(16),RZ9T(16),U8S(16),U8T(16),U9S(16),U9T(16),UA8S(16),UA8T(16),UA9S(16),UA9T(16),
#    UB8S(16),UB8T(16),UB9S(16),UB9T(16),UC8S(16),UC8T(16),UC9S(16),UC9T(16),UD8S(16),UD8T(16),
#    UD9S(16),UD9T(16),UE8S(16),UE8T(16),UE9S(16),UE9T(16),UF8S(16),UF8T(16),UF9S(16),UF9T(16),
#    UG8S(16),UG8T(16),UG9S(16),UG9T(16),UH8S(16),UH8T(16),UH9S(16),UH9T(16),UI8S(16),UI8T(16),
#    UI9S(16),UI9T(16),=R2014FX(16),=R2015DM(16),=R270A(16),=R270E(16),=R270SR(16),=R3ARS/9(16),
#    =R40WK(16),=R9HQ(16),=R9JBN/8/M(16),=RA/UY7IQ(16),=RA27TR(16),=RA4HMT/9/M(16),=RA4HT/9(16),
#    =RA4PKR/9(16),=RA9CS/P(16),=RC20OB(16),=RC20TT(16),=RK3AW/4(16),=RN3DHB/9(16),=RN3DHB/9/P(16),
#    =RN3GW/8(16),=RN3GW/8/QRP(16),=RN3GW/9(16),=RN3GW/9/QRP(16),=RN3QOP/9(16),=RN9S(16),=RN9SM/P(16),
#    =RN9WWW/9(16),=RO9S(16),=RP65TT(16),=RP68GR(16),=RP69NB(16),=RP71TK(16),=RP9SBO(16),=RP9SBR(16),
#    =RP9SNK(16),=RT22TK(16),=RT73OA(16),=RT8T(16),=RT9S(16),=RT9T(16),=RU22TU(16),=RU9SO/M(16),
#    =RV1CC/4/M(16),=RV9WGF/4/M(16),=RV9WMZ/9/M(16),=RW4PJZ/9(16),=RW4PJZ/9/M(16),=RW4PP/9(16),
#    =RW9WA/9(16),=RW9WA/9/M(16),=RY4W/9(16),=RZ4HZW/9/M(16),=UA0AGA/9/P(16),=UA0KBA/9(16),
#    =UA3WB/9(16),=UA4LCQ/9(16),=UA9SIV/9(16),=UB5O/4(16),=UB9JBN/9/M(16),=UE1RFF/9(16),=UE25ST(16),
#    =UE55OB(16),=UE60TDP(16),=UE60TDP/P(16),=UE9WDA/9/M(16),
#    R8U(18)[31],R8V(18)[31],R9U(18)[31],R9V(18)[31],RA8U(18)[31],RA8V(18)[31],RA9U(18)[31],
#    RA9V(18)[31],RC8U(18)[31],RC8V(18)[31],RC9U(18)[31],RC9V(18)[31],RD8U(18)[31],RD8V(18)[31],
#    RD9U(18)[31],RD9V(18)[31],RE8U(18)[31],RE8V(18)[31],RE9U(18)[31],RE9V(18)[31],RF8U(18)[31],
#    RF8V(18)[31],RF9U(18)[31],RF9V(18)[31],RG8U(18)[31],RG8V(18)[31],RG9U(18)[31],RG9V(18)[31],
#    RJ8U(18)[31],RJ8V(18)[31],RJ9U(18)[31],RJ9V(18)[31],RK8U(18)[31],RK8V(18)[31],RK9U(18)[31],
#    RK9V(18)[31],RL8U(18)[31],RL8V(18)[31],RL9U(18)[31],RL9V(18)[31],RM8U(18)[31],RM8V(18)[31],
#    RM9U(18)[31],RM9V(18)[31],RN8U(18)[31],RN8V(18)[31],RN9U(18)[31],RN9V(18)[31],RO8U(18)[31],
#    RO8V(18)[31],RO9U(18)[31],RO9V(18)[31],RQ8U(18)[31],RQ8V(18)[31],RQ9U(18)[31],RQ9V(18)[31],
#    RT8U(18)[31],RT8V(18)[31],RT9U(18)[31],RT9V(18)[31],RU8U(18)[31],RU8V(18)[31],RU9U(18)[31],
#    RU9V(18)[31],RV8U(18)[31],RV8V(18)[31],RV9U(18)[31],RV9V(18)[31],RW8U(18)[31],RW8V(18)[31],
#    RW9U(18)[31],RW9V(18)[31],RX8U(18)[31],RX8V(18)[31],RX9U(18)[31],RX9V(18)[31],RY8U(18)[31],
#    RY8V(18)[31],RY9U(18)[31],RY9V(18)[31],RZ8U(18)[31],RZ8V(18)[31],RZ9U(18)[31],RZ9V(18)[31],
#    U8U(18)[31],U8V(18)[31],U9U(18)[31],U9V(18)[31],UA8U(18)[31],UA8V(18)[31],UA9U(18)[31],
#    UA9V(18)[31],UB8U(18)[31],UB8V(18)[31],UB9U(18)[31],UB9V(18)[31],UC8U(18)[31],UC8V(18)[31],
#    UC9U(18)[31],UC9V(18)[31],UD8U(18)[31],UD8V(18)[31],UD9U(18)[31],UD9V(18)[31],UE8U(18)[31],
#    UE8V(18)[31],UE9U(18)[31],UE9V(18)[31],UF8U(18)[31],UF8V(18)[31],UF9U(18)[31],UF9V(18)[31],
#    UG8U(18)[31],UG8V(18)[31],UG9U(18)[31],UG9V(18)[31],UH8U(18)[31],UH8V(18)[31],UH9U(18)[31],
#    UH9V(18)[31],UI8U(18)[31],UI8V(18)[31],UI9U(18)[31],UI9V(18)[31],=R10NRC(18)[31],=R1991A(18)[31],
#    =R22ULM(18)[31],=R400N(18)[31],=R70B(18)[31],=R9/EW1TM(18)[31],=R9UAG/N(18)[31],=RA4CQ/9(18)[31],
#    =RC4W/9(18)[31],=RK6CG/9(18)[31],=RP65UMF(18)[31],=RP67KM(18)[31],=RP68KM(18)[31],=RP69KM(18)[31],
#    =RP70KM(18)[31],=RP70NM(18)[31],=RP70UK(18)[31],=RP70ZF(18)[31],=RP71KM(18)[31],=RP72KM(18)[31],
#    =RP72NM(18)[31],=RP73KM(18)[31],=RP73NZ(18)[31],=RP73ZF(18)[31],=RP74KM(18)[31],=RT22UA(18)[31],
#    =RT77VV(18)[31],=RW4CG/9(18)[31],=UA9JFE/9/P(18)[31],=UA9UAX/M(18)[31],=UE3ATV/9(18)[31],
#    R8W(16),R9W(16),RA8W(16),RA9W(16),RC8W(16),RC9W(16),RD8W(16),RD9W(16),RE8W(16),RE9W(16),RF8W(16),
#    RF9W(16),RG8W(16),RG9W(16),RJ8W(16),RJ9W(16),RK8W(16),RK9W(16),RL8W(16),RL9W(16),RM8W(16),
#    RM9W(16),RN8W(16),RN9W(16),RO8W(16),RO9W(16),RQ8W(16),RQ9W(16),RT8W(16),RT9W(16),RU8W(16),
#    RU9W(16),RV8W(16),RV9W(16),RW8W(16),RW9W(16),RX8W(16),RX9W(16),RY8W(16),RY9W(16),RZ8W(16),
#    RZ9W(16),U8W(16),U9W(16),UA8W(16),UA9W(16),UB8W(16),UB9W(16),UC8W(16),UC9W(16),UD8W(16),UD9W(16),
#    UE8W(16),UE9W(16),UF8W(16),UF9W(16),UG8W(16),UG9W(16),UH8W(16),UH9W(16),UI8W(16),UI9W(16),
#    =R100W(16),=R10RTRS/9(16),=R18KDR/4(16),=R2013CG(16),=R2015AS(16),=R2015DS(16),=R2015KM(16),
#    =R2017F/P(16),=R2019CG(16),=R20BIS(16),=R20UFA(16),=R25ARCK/4(16),=R25MSB(16),=R25WPW(16),
#    =R27UFA(16),=R3XX/9(16),=R44WFF(16),=R53ICGA(16),=R53ICGB(16),=R53ICGC(16),=R53ICGF(16),
#    =R53ICGJ(16),=R53ICGS(16),=R53ICGV(16),=R53ICGW(16),=R7378TM(16),=R8JAJ/4(16),=R8JAJ/4/P(16),
#    =R8JAJ/9(16),=R90WGM(16),=R90WJV(16),=R90WOB(16),=R90WXK(16),=R9LY/4(16),=RA0R/4(16),
#    =RA1ZPC/9(16),=RA3AUU/9(16),=RA4POX/9(16),=RA8JA/4(16),=RA8JA/4/P(16),=RA9KDX/8/M(16),=RF9W(16),
#    =RG5A/8(16),=RK3PWJ/9(16),=RK6YYA/9/M(16),=RK9KWI/9(16),=RK9KWI/9/P(16),=RL3DX/9(16),=RM90WF(16),
#    =RM9RZ/9/P(16),=RN9S/M(16),=RN9WWW/9/M(16),=RN9WWW/P(16),=RO17CW(16),=RP67GI(16),=RP67MG(16),
#    =RP67NG(16),=RP67RK(16),=RP67SW(16),=RP67UF(16),=RP68GM(16),=RP68NK(16),=RP68UF(16),=RP69GI(16),
#    =RP69PW(16),=RP69UF(16),=RP70GI(16),=RP70GM(16),=RP70LS(16),=RP70NK(16),=RP70UF(16),=RP70ZO(16),
#    =RP71GI(16),=RP71GM(16),=RP71UF(16),=RP72AR(16),=RP72GI(16),=RP72GM(16),=RP72UF(16),=RP72WU(16),
#    =RP73AR(16),=RP73GI(16),=RP73UF(16),=RP73WU(16),=RP74GI(16),=RP74UF(16),=RT22WF(16),=RT2F/4(16),
#    =RT2F/4/M(16),=RT2F/9/M(16),=RT73EA(16),=RT73EL(16),=RT8A/4(16),=RT9W(16),=RT9W/P(16),
#    =RU110RAEM(16),=RU20WC(16),=RU22WZ(16),=RU27WB(16),=RU27WF(16),=RU27WN(16),=RU27WO(16),
#    =RU3HD/9/P(16),=RU90WZ(16),=RU9CK/4/M(16),=RU9KC/4/M(16),=RU9SO/4(16),=RU9SO/4/P(16),=RV22WB(16),
#    =RV2FZ/9(16),=RV90WB(16),=RV9CHB/4(16),=RV9CX/4/M(16),=RW3SN/9(16),=RW3XX/9(16),=RW4WA/9/P(16),
#    =RW90WC(16),=RW9FWR/9/M(16),=RW9JZ/4(16),=RW9JZ/9(16),=RX22WN(16),=RZ16WF(16),=RZ90W(16),
#    =RZ90WU(16),=UA0AZA/9(16),=UA1AAE/9(16),=UA1ZPC/9(16),=UA4LU/9/P(16),=UA4PIE/9(16),
#    =UA4PIE/9/M(16),=UA4PIE/9/P(16),=UA4PJM/9(16),=UA4PJM/9/M(16),=UA4PJM/9/P(16),=UA4PXR/9/M(16),
#    =UA9KAA/4(16),=UA9KAA/9(16),=UB5O/4/M(16),=UE10RFF/4(16),=UE90W(16),
#    R8Y(18)[31],R9Y(18)[31],RA8Y(18)[31],RA9Y(18)[31],RC8Y(18)[31],RC9Y(18)[31],RD8Y(18)[31],
#    RD9Y(18)[31],RE8Y(18)[31],RE9Y(18)[31],RF8Y(18)[31],RF9Y(18)[31],RG8Y(18)[31],RG9Y(18)[31],
#    RJ8Y(18)[31],RJ9Y(18)[31],RK8Y(18)[31],RK9Y(18)[31],RL8Y(18)[31],RL9Y(18)[31],RM8Y(18)[31],
#    RM9Y(18)[31],RN8Y(18)[31],RN9Y(18)[31],RO8Y(18)[31],RO9Y(18)[31],RQ8Y(18)[31],RQ9Y(18)[31],
#    RT8Y(18)[31],RT9Y(18)[31],RU8Y(18)[31],RU9Y(18)[31],RV8Y(18)[31],RV9Y(18)[31],RW8Y(18)[31],
#    RW9Y(18)[31],RX8Y(18)[31],RX9Y(18)[31],RY8Y(18)[31],RY9Y(18)[31],RZ8Y(18)[31],RZ9Y(18)[31],
#    U8Y(18)[31],U9Y(18)[31],UA8Y(18)[31],UA9Y(18)[31],UB8Y(18)[31],UB9Y(18)[31],UC8Y(18)[31],
#    UC9Y(18)[31],UD8Y(18)[31],UD9Y(18)[31],UE8Y(18)[31],UE9Y(18)[31],UF8Y(18)[31],UF9Y(18)[31],
#    UG8Y(18)[31],UG9Y(18)[31],UH8Y(18)[31],UH9Y(18)[31],UI8Y(18)[31],UI9Y(18)[31],=R100KM(18)[31],
#    =R2015RR(18)[31],=R2015SV(18)[31],=R6XBA/9(18)[31],=R9/UN7JHC(18)[31],=R9/UN7JMO(18)[31],
#    =RA/IK5MIC(18)[31],=RA/IK5MIC/M(18)[31],=RA0CCJ/9(18)[31],=RA50VT(18)[31],=RK1B/9(18)[31],
#    =RP68BP(18)[31],=RP68TZ(18)[31],=RP70AF(18)[31],=RP70BP(18)[31],=RP70GA(18)[31],=RP71BP(18)[31],
#    =RP72BP(18)[31],=RP73BP(18)[31],=RP9Y(18)[31],=RP9YAF(18)[31],=RP9YTZ(18)[31],=RT73GM(18)[31],
#    =RW22WG(18)[31],=RX6AY/9(18)[31],=UA0LLW/9(18)[31],=UA0ZDY/9(18)[31],=UA9UAX/9/P(18)[31],
#    =UB5O/9(18)[31],=UB5O/M(18)[31],=UE0ZOO/9(18)[31],=UE44R/9(18)[31],=UE80AL(18)[31],
#    R8Z(18)[31],R9Z(18)[31],RA8Z(18)[31],RA9Z(18)[31],RC8Z(18)[31],RC9Z(18)[31],RD8Z(18)[31],
#    RD9Z(18)[31],RE8Z(18)[31],RE9Z(18)[31],RF8Z(18)[31],RF9Z(18)[31],RG8Z(18)[31],RG9Z(18)[31],
#    RJ8Z(18)[31],RJ9Z(18)[31],RK8Z(18)[31],RK9Z(18)[31],RL8Z(18)[31],RL9Z(18)[31],RM8Z(18)[31],
#    RM9Z(18)[31],RN8Z(18)[31],RN9Z(18)[31],RO8Z(18)[31],RO9Z(18)[31],RQ8Z(18)[31],RQ9Z(18)[31],
#    RT8Z(18)[31],RT9Z(18)[31],RU8Z(18)[31],RU9Z(18)[31],RV8Z(18)[31],RV9Z(18)[31],RW8Z(18)[31],
#    RW9Z(18)[31],RX8Z(18)[31],RX9Z(18)[31],RY8Z(18)[31],RY9Z(18)[31],RZ8Z(18)[31],RZ9Z(18)[31],
#    U8Z(18)[31],U9Z(18)[31],UA8Z(18)[31],UA9Z(18)[31],UB8Z(18)[31],UB9Z(18)[31],UC8Z(18)[31],
#    UC9Z(18)[31],UD8Z(18)[31],UD9Z(18)[31],UE8Z(18)[31],UE9Z(18)[31],UF8Z(18)[31],UF9Z(18)[31],
#    UG8Z(18)[31],UG9Z(18)[31],UH8Z(18)[31],UH9Z(18)[31],UI8Z(18)[31],UI9Z(18)[31],
#    =RA/IK5MIC/P(18)[31],=RA3DS/P(18)[31],=RC9YA/9/M(18)[31],=RW9MD/9/P(18)[31],=UA0KBG/9/P(18)[31],
#    =UA3A/P(18)[31],=UA9MAC/9(18)[31],
#    R0A(18)[32],R0B(18)[32],R0H(18)[32],RA0A(18)[32],RA0B(18)[32],RA0H(18)[32],RC0A(18)[32],
#    RC0B(18)[32],RC0H(18)[32],RD0A(18)[32],RD0B(18)[32],RD0H(18)[32],RE0A(18)[32],RE0B(18)[32],
#    RE0H(18)[32],RF0A(18)[32],RF0B(18)[32],RF0H(18)[32],RG0A(18)[32],RG0B(18)[32],RG0H(18)[32],
#    RI0A(18)[32],RI0B(18)[32],RI0H(18)[32],RJ0A(18)[32],RJ0B(18)[32],RJ0H(18)[32],RK0A(18)[32],
#    RK0B(18)[32],RK0H(18)[32],RL0A(18)[32],RL0B(18)[32],RL0H(18)[32],RM0A(18)[32],RM0B(18)[32],
#    RM0H(18)[32],RN0A(18)[32],RN0B(18)[32],RN0H(18)[32],RO0A(18)[32],RO0B(18)[32],RO0H(18)[32],
#    RQ0A(18)[32],RQ0B(18)[32],RQ0H(18)[32],RT0A(18)[32],RT0B(18)[32],RT0H(18)[32],RU0A(18)[32],
#    RU0B(18)[32],RU0H(18)[32],RV0A(18)[32],RV0B(18)[32],RV0H(18)[32],RW0A(18)[32],RW0B(18)[32],
#    RW0H(18)[32],RX0A(18)[32],RX0B(18)[32],RX0H(18)[32],RY0A(18)[32],RY0B(18)[32],RY0H(18)[32],
#    RZ0A(18)[32],RZ0B(18)[32],RZ0H(18)[32],U0A(18)[32],U0B(18)[32],U0H(18)[32],UA0A(18)[32],
#    UA0B(18)[32],UA0H(18)[32],UB0A(18)[32],UB0B(18)[32],UB0H(18)[32],UC0A(18)[32],UC0B(18)[32],
#    UC0H(18)[32],UD0A(18)[32],UD0B(18)[32],UD0H(18)[32],UE0A(18)[32],UE0B(18)[32],UE0H(18)[32],
#    UF0A(18)[32],UF0B(18)[32],UF0H(18)[32],UG0A(18)[32],UG0B(18)[32],UG0H(18)[32],UH0A(18)[32],
#    UH0B(18)[32],UH0H(18)[32],UI0A(18)[32],UI0B(18)[32],UI0H(18)[32],=R00BVB(18)[32],=R100RW(18)[32],
#    =R120RB(18)[32],=R170GS(18)[32],=R18KDR/9(18)[32],=R18RUS(18)[32],=R2016A(18)[32],=R20KRK(18)[32],
#    =R44YETI/9(18)[32],=R50CQM(18)[32],=R63RRC(18)[32],=R7LZ/9(18)[32],=RA/UR5HVR(18)[32],
#    =RA0/UR5HVR(18)[32],=RA1AMW/0(18)[32],=RA3AUU/0(18)[32],=RA3BB/0(18)[32],=RA3DA/0(18)[32],
#    =RA3DA/9(18)[32],=RA4CQ/0(18)[32],=RA4CSX/0(18)[32],=RA4RU/0(18)[32],=RA9UT/0(18)[32],
#    =RAEM(18)[32],=RD110RAEM(18)[32],=RI0B(18)[32],=RI0BV/0(18)[32],=RK3DZJ/9(18)[32],=RK56GC(18)[32],
#    =RK6BBM/9(18)[32],=RK80KEDR(18)[32],=RL5G/9(18)[32],=RM0A(18)[32],=RM2D/9(18)[32],
#    =RM9RZ/0(18)[32],=RN0A(18)[32],=RN110RAEM(18)[32],=RN110RAEM/P(18)[32],=RP70KV(18)[32],
#    =RP70RS(18)[32],=RP73KT(18)[32],=RP74KT(18)[32],=RT22SA(18)[32],=RT9K/9(18)[32],=RU19NY(18)[32],
#    =RU3FF/0(18)[32],=RU4CO/0(18)[32],=RV3DHC/0(18)[32],=RV3DHC/0/P(18)[32],=RV9WP/9(18)[32],
#    =RW3XN/0(18)[32],=RW3YC/0(18)[32],=RW3YC/9(18)[32],=RY1AAB/9(18)[32],=RY1AAB/9/M(18)[32],
#    =RZ3DSA/0(18)[32],=RZ3DZS/0(18)[32],=RZ9ON/9(18)[32],=UA0ACG/0(18)[32],=UA0FCB/0(18)[32],
#    =UA0FCB/0/P(18)[32],=UA0WG/0(18)[32],=UA0WW/0(18)[32],=UA0WW/M(18)[32],=UA0WY/0(18)[32],
#    =UA3ADN/0(18)[32],=UA4LU/0(18)[32],=UA4PT/0(18)[32],=UA6BTN/0(18)[32],=UA9UAX/9(18)[32],
#    =UA9WDK/0(18)[32],=UB1AJQ/0(18)[32],=UE1WFF/0(18)[32],
#    =R100D(18)[22],=R100DI(18)[22],=R3CA/9(18)[22],=RA3XR/0(18)[22],=RA9LI/0(18)[22],=RI0BDI(18)[22],
#    =RS0B(18)[22],=RS0B/P(18)[22],=RV3EFH/0(18)[22],=RW1AI/9(18)[22],=RW3GW/0(18)[22],
#    =RX6LMQ/0(18)[22],=RZ9DX/0(18)[22],=RZ9DX/0/A(18)[22],=RZ9DX/0/P(18)[22],=RZ9DX/9(18)[22],
#    =RZ9DX/9/P(18)[22],=RZ9OO/0(18)[22],=UA1ADQ/0(18)[22],=UA3HY/0(18)[22],=UA3YH/0(18)[22],
#    =UA4RX/0(18)[22],=UA9FL/0(18)[22],=UE0BFF(18)[22],=UE44POL(18)[22],=UE44POL/P(18)[22],
#    =UE73D(18)[22],=UE73DI(18)[22],
#    R0C(19)[34],RA0C(19)[34],RC0C(19)[34],RD0C(19)[34],RE0C(19)[34],RF0C(19)[34],RG0C(19)[34],
#    RI0C(19)[34],RJ0C(19)[34],RK0C(19)[34],RL0C(19)[34],RM0C(19)[34],RN0C(19)[34],RO0C(19)[34],
#    RQ0C(19)[34],RT0C(19)[34],RU0C(19)[34],RV0C(19)[34],RW0C(19)[34],RX0C(19)[34],RY0C(19)[34],
#    RZ0C(19)[34],U0C(19)[34],UA0C(19)[34],UB0C(19)[34],UC0C(19)[34],UD0C(19)[34],UE0C(19)[34],
#    UF0C(19)[34],UG0C(19)[34],UH0C(19)[34],UI0C(19)[34],=R120RN(19)[34],=R150C(19)[34],=R155C(19)[34],
#    =R15CWC/0(19)[34],=R15CWC/0/QRP(19)[34],=R160NA(19)[34],=R170GS/0(19)[34],=R20DFO(19)[34],
#    =R24RRC(19)[34],=R25ARCK/0(19)[34],=R27CGY(19)[34],=R44YETI/0(19)[34],=R7AL/0(19)[34],
#    =R7AL/0/M(19)[34],=R7AL/0/P(19)[34],=R7LZ/0(19)[34],=RA/JA8BMK(19)[34],=RA/N6TR(19)[34],
#    =RA/VE7MID(19)[34],=RA1QD/0(19)[34],=RA1ZZ/0(19)[34],=RA1ZZ/0/M(19)[34],=RA3NAN/0(19)[34],
#    =RA6GW/0(19)[34],=RA6XPL/0(19)[34],=RC110RAEM(19)[34],=RC20CD(19)[34],=RD0C(19)[34],
#    =RD16CW(19)[34],=RL3AA/0(19)[34],=RL5G/0(19)[34],=RM2D/0(19)[34],=RP0CZA(19)[34],=RP68H(19)[34],
#    =RP70H(19)[34],=RP71H(19)[34],=RP72H(19)[34],=RT22CT(19)[34],=RU3DX/0(19)[34],=RW3DTB/0(19)[34],
#    =UA0AOZ/0(19)[34],=UA3DX/0(19)[34],=UA6CW/0(19)[34],=UE150C(19)[34],=UE70VSV(19)[34],
#    =UE80C(19)[34],
#    R0E(19)[34],R0F(19)[34],RA0E(19)[34],RA0F(19)[34],RC0E(19)[34],RC0F(19)[34],RD0E(19)[34],
#    RD0F(19)[34],RE0E(19)[34],RE0F(19)[34],RF0E(19)[34],RF0F(19)[34],RG0E(19)[34],RG0F(19)[34],
#    RI0F(19)[34],RJ0E(19)[34],RJ0F(19)[34],RK0E(19)[34],RK0F(19)[34],RL0E(19)[34],RL0F(19)[34],
#    RM0E(19)[34],RM0F(19)[34],RN0E(19)[34],RN0F(19)[34],RO0E(19)[34],RO0F(19)[34],RQ0E(19)[34],
#    RQ0F(19)[34],RT0E(19)[34],RT0F(19)[34],RU0E(19)[34],RU0F(19)[34],RV0E(19)[34],RV0F(19)[34],
#    RW0E(19)[34],RW0F(19)[34],RX0E(19)[34],RX0F(19)[34],RY0E(19)[34],RY0F(19)[34],RZ0E(19)[34],
#    RZ0F(19)[34],U0E(19)[34],U0F(19)[34],UA0E(19)[34],UA0F(19)[34],UB0E(19)[34],UB0F(19)[34],
#    UC0E(19)[34],UC0F(19)[34],UD0E(19)[34],UD0F(19)[34],UE0E(19)[34],UE0F(19)[34],UF0E(19)[34],
#    UF0F(19)[34],UG0E(19)[34],UG0F(19)[34],UH0E(19)[34],UH0F(19)[34],UI0E(19)[34],UI0F(19)[34],
#    =R10RLHA/0(19)[34],=R1FW/0(19)[34],=R26RRC(19)[34],=R7AA/0(19)[34],=R7LP/0(19)[34],
#    =R7MR/0(19)[34],=RA/KE5JA(19)[34],=RA/OG2K(19)[34],=RA0SS/0(19)[34],=RA1ALA/0(19)[34],
#    =RA4HKM/0(19)[34],=RA4HKM/0/P(19)[34],=RA6ABC/0(19)[34],=RM0F(19)[34],=RN0F(19)[34],
#    =RN1CR/0(19)[34],=RS0F(19)[34],=RT6A/0(19)[34],=RV1CC/0(19)[34],=RZ3DW/0(19)[34],=RZ4HD/0(19)[34],
#    =RZ55YG(19)[34],=RZ9ODD/0(19)[34],=RZ9OWE/0(19)[34],=UA1ANA/0(19)[34],=UA3EDP/0(19)[34],
#    =UB40FSU(19)[34],=UE1AAA/0(19)[34],
#    =RV9WP/0(18)[22],=U0H/UA0AGQ(18)[22],
#    R0I(19)[24],RA0I(19)[24],RC0I(19)[24],RD0I(19)[24],RE0I(19)[24],RF0I(19)[24],RG0I(19)[24],
#    RI0I(19)[24],RJ0I(19)[24],RK0I(19)[24],RL0I(19)[24],RM0I(19)[24],RN0I(19)[24],RO0I(19)[24],
#    RQ0I(19)[24],RT0I(19)[24],RU0I(19)[24],RV0I(19)[24],RW0I(19)[24],RX0I(19)[24],RY0I(19)[24],
#    RZ0I(19)[24],U0I(19)[24],UA0I(19)[24],UB0I(19)[24],UC0I(19)[24],UD0I(19)[24],UE0I(19)[24],
#    UF0I(19)[24],UG0I(19)[24],UH0I(19)[24],UI0I(19)[24],=RA/IK0PRH(19)[24],=RA/IK0PRH/P(19)[24],
#    =RA4CF/0(19)[24],=RM0I(19)[24],=RX6CM/0(19)[24],=RZ9ON/0(19)[24],
#    =R11QRP/0(19)[33],=R2016KW(19)[33],=R4AK/0/P(19)[33],=RA3AN/0(19)[33],=RQ0J/QRP(19)[33],
#    =RU3HD/0(19)[33],=RW80KEDR(19)[33],=RZ5D/0(19)[33],=UA9MUY/0(19)[33],=UE75OJ(19)[33],
#    R0K(19)[25],RA0K(19)[25],RC0K(19)[25],RD0K(19)[25],RE0K(19)[25],RF0K(19)[25],RG0K(19)[25],
#    RI0K(19)[25],RJ0K(19)[25],RK0K(19)[25],RL0K(19)[25],RM0K(19)[25],RN0K(19)[25],RO0K(19)[25],
#    RQ0K(19)[25],RT0K(19)[25],RU0K(19)[25],RV0K(19)[25],RW0K(19)[25],RX0K(19)[25],RY0K(19)[25],
#    RZ0K(19)[25],U0K(19)[25],UA0K(19)[25],UB0K(19)[25],UC0K(19)[25],UD0K(19)[25],UE0K(19)[25],
#    UF0K(19)[25],UG0K(19)[25],UH0K(19)[25],UI0K(19)[25],=R2015RY(19)[25],=R71RRC(19)[25],
#    =RA3AV/0(19)[25],=RA3XV/0(19)[25],=RC85AO(19)[25],=RP70AS(19)[25],=RT65KI(19)[25],=RT92KA(19)[25],
#    =RU9MV/0(19)[25],=RV3MA/0(19)[25],=RZ3EC/0(19)[25],=RZ6LL/0(19)[25],=RZ6MZ/0(19)[25],
#    =UA1ORT/0(19)[25],=UA6LP/0(19)[25],
#    R0L(19)[34],R0M(19)[34],R0N(19)[34],RA0L(19)[34],RA0M(19)[34],RA0N(19)[34],RC0L(19)[34],
#    RC0M(19)[34],RC0N(19)[34],RD0L(19)[34],RD0M(19)[34],RD0N(19)[34],RE0L(19)[34],RE0M(19)[34],
#    RE0N(19)[34],RF0L(19)[34],RF0M(19)[34],RF0N(19)[34],RG0L(19)[34],RG0M(19)[34],RG0N(19)[34],
#    RI0L(19)[34],RJ0L(19)[34],RJ0M(19)[34],RJ0N(19)[34],RK0L(19)[34],RK0M(19)[34],RK0N(19)[34],
#    RL0L(19)[34],RL0M(19)[34],RL0N(19)[34],RM0L(19)[34],RM0M(19)[34],RM0N(19)[34],RN0L(19)[34],
#    RN0M(19)[34],RN0N(19)[34],RO0L(19)[34],RO0M(19)[34],RO0N(19)[34],RQ0L(19)[34],RQ0M(19)[34],
#    RQ0N(19)[34],RT0L(19)[34],RT0M(19)[34],RT0N(19)[34],RU0L(19)[34],RU0M(19)[34],RU0N(19)[34],
#    RV0L(19)[34],RV0M(19)[34],RV0N(19)[34],RW0L(19)[34],RW0M(19)[34],RW0N(19)[34],RX0L(19)[34],
#    RX0M(19)[34],RX0N(19)[34],RY0L(19)[34],RY0M(19)[34],RY0N(19)[34],RZ0L(19)[34],RZ0M(19)[34],
#    RZ0N(19)[34],U0L(19)[34],U0M(19)[34],U0N(19)[34],UA0L(19)[34],UA0M(19)[34],UA0N(19)[34],
#    UB0L(19)[34],UB0M(19)[34],UB0N(19)[34],UC0L(19)[34],UC0M(19)[34],UC0N(19)[34],UD0L(19)[34],
#    UD0M(19)[34],UD0N(19)[34],UE0L(19)[34],UE0M(19)[34],UE0N(19)[34],UF0L(19)[34],UF0M(19)[34],
#    UF0N(19)[34],UG0L(19)[34],UG0M(19)[34],UG0N(19)[34],UH0L(19)[34],UH0M(19)[34],UH0N(19)[34],
#    UI0L(19)[34],UI0M(19)[34],UI0N(19)[34],=R0HQ(19)[34],=R150L(19)[34],=R17CWH(19)[34],
#    =R20RRC/0(19)[34],=R3BY/0(19)[34],=R3HD/0(19)[34],=R66IOTA(19)[34],=R70LWA(19)[34],
#    =R8CW/0(19)[34],=R8XW/0(19)[34],=R9XT/0(19)[34],=RA/IK7YTT(19)[34],=RA/OK1DWF(19)[34],
#    =RD3BN/0(19)[34],=RL5G/0/P(19)[34],=RM0M(19)[34],=RM0M/LH(19)[34],=RM5M/0(19)[34],
#    =RN1NS/0(19)[34],=RP0L(19)[34],=RP0LPK(19)[34],=RP60P(19)[34],=RP66V(19)[34],=RP67SD(19)[34],
#    =RP67V(19)[34],=RP68SD(19)[34],=RP68V(19)[34],=RP69SD(19)[34],=RP69V(19)[34],=RP70DG(19)[34],
#    =RP70SD(19)[34],=RP70V(19)[34],=RP71DG(19)[34],=RP71SD(19)[34],=RP71V(19)[34],=RP72DG(19)[34],
#    =RP72SD(19)[34],=RP72V(19)[34],=RP73DG(19)[34],=RP73SD(19)[34],=RP73V(19)[34],=RP74DG(19)[34],
#    =RP74SD(19)[34],=RP74V(19)[34],=RU3BY/0(19)[34],=RU5D/0(19)[34],=RV1AW/0(19)[34],
#    =RV3DSA/0(19)[34],=RW22GO(19)[34],=RW3LG/0(19)[34],=RX15RX(19)[34],=UA0SDX/0(19)[34],
#    =UA0SIK/0(19)[34],=UA3AHA/0(19)[34],=UA4SBZ/0(19)[34],=UA6MF/0(19)[34],=UA7R/0(19)[34],
#    =UB0LAP/P(19)[34],=UC0LAF/P(19)[34],=UE1RFF/0(19)[34],=UE70MA(19)[34],=UE75L(19)[34],
#    R0O(18)[32],RA0O(18)[32],RC0O(18)[32],RD0O(18)[32],RE0O(18)[32],RF0O(18)[32],RG0O(18)[32],
#    RJ0O(18)[32],RK0O(18)[32],RL0O(18)[32],RM0O(18)[32],RN0O(18)[32],RO0O(18)[32],RQ0O(18)[32],
#    RT0O(18)[32],RU0O(18)[32],RV0O(18)[32],RW0O(18)[32],RX0O(18)[32],RY0O(18)[32],RZ0O(18)[32],
#    U0O(18)[32],UA0O(18)[32],UB0O(18)[32],UC0O(18)[32],UD0O(18)[32],UE0O(18)[32],UF0O(18)[32],
#    UG0O(18)[32],UH0O(18)[32],UI0O(18)[32],=R100FNR(18)[32],=RA0CGI/0(18)[32],=RA9FTM/0(18)[32],
#    =RA9JJ/0(18)[32],=RK3RB/0(18)[32],=RK4HM/0(18)[32],=RU0UA/0(18)[32],=RV3ACA/0(18)[32],
#    =RW4CG/0(18)[32],=RW4CG/0/P(18)[32],
#    R0Q(19)[23],RA0Q(19)[23],RC0Q(19)[23],RD0Q(19)[23],RE0Q(19)[23],RF0Q(19)[23],RG0Q(19)[23],
#    RI0Q(19)[23],RJ0Q(19)[23],RK0Q(19)[23],RL0Q(19)[23],RM0Q(19)[23],RN0Q(19)[23],RO0Q(19)[23],
#    RQ0Q(19)[23],RT0Q(19)[23],RU0Q(19)[23],RV0Q(19)[23],RW0Q(19)[23],RX0Q(19)[23],RY0Q(19)[23],
#    RZ0Q(19)[23],U0Q(19)[23],UA0Q(19)[23],UB0Q(19)[23],UC0Q(19)[23],UD0Q(19)[23],UE0Q(19)[23],
#    UF0Q(19)[23],UG0Q(19)[23],UH0Q(19)[23],UI0Q(19)[23],=R0/UR8LV(19)[23],=R1ZBH/0(19)[23],
#    =R2DG/0(19)[23],=R3CA/0(19)[23],=R3CA/0/M(19)[23],=R3RRC/0(19)[23],=R4AK/0(19)[23],
#    =R70ASIA(19)[23],=R73EPC/P(19)[23],=R9OOO/0(19)[23],=RA/DK2AI/0(19)[23],=RA/UT5IA(19)[23],
#    =RA0STT/0/M(19)[23],=RA6AEW/0(19)[23],=RA6UAH/0(19)[23],=RA9DA/0(19)[23],=RD3QA/0(19)[23],
#    =RF3A/0(19)[23],=RK6YYA/0/P(19)[23],=RN6LFF/0(19)[23],=RP0Q(19)[23],=RP70AY(19)[23],
#    =RP71AS(19)[23],=RT0Q(19)[23],=RW110RAEM(19)[23],=RW22WR(19)[23],=RZ3BY/0(19)[23],
#    =UA0SVD/0(19)[23],=UA1PBA/0(19)[23],=UA9CTT/0(19)[23],=UA9KW/0(19)[23],=UB5O/0(19)[23],
#    =UE60QA(19)[23],=UE6MAC/0(19)[23],
#    R0R(18)[32],R0S(18)[32],R0T(18)[32],RA0R(18)[32],RA0S(18)[32],RA0T(18)[32],RC0R(18)[32],
#    RC0S(18)[32],RC0T(18)[32],RD0R(18)[32],RD0S(18)[32],RD0T(18)[32],RE0R(18)[32],RE0S(18)[32],
#    RE0T(18)[32],RF0R(18)[32],RF0S(18)[32],RF0T(18)[32],RG0R(18)[32],RG0S(18)[32],RG0T(18)[32],
#    RJ0R(18)[32],RJ0S(18)[32],RJ0T(18)[32],RK0R(18)[32],RK0S(18)[32],RK0T(18)[32],RL0R(18)[32],
#    RL0S(18)[32],RL0T(18)[32],RM0R(18)[32],RM0S(18)[32],RM0T(18)[32],RN0R(18)[32],RN0S(18)[32],
#    RN0T(18)[32],RO0R(18)[32],RO0S(18)[32],RO0T(18)[32],RQ0R(18)[32],RQ0S(18)[32],RQ0T(18)[32],
#    RT0R(18)[32],RT0S(18)[32],RT0T(18)[32],RU0R(18)[32],RU0S(18)[32],RU0T(18)[32],RV0R(18)[32],
#    RV0S(18)[32],RV0T(18)[32],RW0R(18)[32],RW0S(18)[32],RW0T(18)[32],RX0R(18)[32],RX0S(18)[32],
#    RX0T(18)[32],RY0R(18)[32],RY0S(18)[32],RY0T(18)[32],RZ0R(18)[32],RZ0S(18)[32],RZ0T(18)[32],
#    U0R(18)[32],U0S(18)[32],U0T(18)[32],UA0R(18)[32],UA0S(18)[32],UA0T(18)[32],UB0R(18)[32],
#    UB0S(18)[32],UB0T(18)[32],UC0R(18)[32],UC0S(18)[32],UC0T(18)[32],UD0R(18)[32],UD0S(18)[32],
#    UD0T(18)[32],UE0R(18)[32],UE0S(18)[32],UE0T(18)[32],UF0R(18)[32],UF0S(18)[32],UF0T(18)[32],
#    UG0R(18)[32],UG0S(18)[32],UG0T(18)[32],UH0R(18)[32],UH0S(18)[32],UH0T(18)[32],UI0R(18)[32],
#    UI0S(18)[32],UI0T(18)[32],=R11QRP/9(18)[32],=R150LA(18)[32],=R150LB(18)[32],=R18SWE(18)[32],
#    =R1BDD/0(18)[32],=R1BDD/0/P(18)[32],=R25ARCK/9(18)[32],=R3RRC/0/MM(18)[32],=R9PS/9(18)[32],
#    =RA0SP/RP(18)[32],=RA0SR/RP(18)[32],=RA110RAEM(18)[32],=RA3TO/0(18)[32],=RA4CSX/0/P(18)[32],
#    =RA9JG/0(18)[32],=RA9JG/0/P(18)[32],=RA9OBG/0(18)[32],=RA9USU/8(18)[32],=RD0L/0(18)[32],
#    =RK17CW(18)[32],=RK9MZZ/0(18)[32],=RN4HIT/0(18)[32],=RP0S(18)[32],=RP0SXR(18)[32],=RP0SZZ(18)[32],
#    =RP67ST(18)[32],=RP70AB(18)[32],=RP72AB(18)[32],=RP73AB(18)[32],=RP74AB(18)[32],=RQ0C/9(18)[32],
#    =RV3ACA/0/M(18)[32],=RV6AJ/0(18)[32],=RV7AD/0(18)[32],=RV9JD/0(18)[32],=RW4YA/0(18)[32],
#    =RW4YA/9(18)[32],=RX3AT/0(18)[32],=RX3DFH/0(18)[32],=RX9WN/0(18)[32],=RX9WN/0/M(18)[32],
#    =RX9WN/0/P(18)[32],=RZ0SO/P(18)[32],=RZ5D/9(18)[32],=UA0KBG/0(18)[32],=UA0KBG/9(18)[32],
#    =UA3EDQ/0(18)[32],=UA3EDQ/0/MM(18)[32],=UA3EDQ/0/P(18)[32],=UA9MBK/0(18)[32],=UA9UAX/0(18)[32],
#    =UA9WOB/0(18)[32],=UA9WOB/0/P(18)[32],=UE105SBM(18)[32],=UE55IR(18)[32],=UE60SWA(18)[32],
#    =UE70SVV(18)[32],=UE80IR(18)[32],=UE80SBR(18)[32],
#    R0W(18)[31],RA0W(18)[31],RC0W(18)[31],RD0W(18)[31],RE0W(18)[31],RF0W(18)[31],RG0W(18)[31],
#    RJ0W(18)[31],RK0W(18)[31],RL0W(18)[31],RM0W(18)[31],RN0W(18)[31],RO0W(18)[31],RQ0W(18)[31],
#    RT0W(18)[31],RU0W(18)[31],RV0W(18)[31],RW0W(18)[31],RX0W(18)[31],RY0W(18)[31],RZ0W(18)[31],
#    U0W(18)[31],UA0W(18)[31],UB0W(18)[31],UC0W(18)[31],UD0W(18)[31],UE0W(18)[31],UF0W(18)[31],
#    UG0W(18)[31],UH0W(18)[31],UI0W(18)[31],=R01DTV/9(18)[31],=R10RTRS/0(18)[31],=R3YAB/9/P(18)[31],
#    =RA0AM/0(18)[31],=RP0W(18)[31],=RP0W/P(18)[31],=RP0WWS(18)[31],=RP70SL(18)[31],=RP72SL(18)[31],
#    =RV0AE/0/FF(18)[31],=RZ0AM/0(18)[31],=RZ22WW(18)[31],=UA0FCB/P(18)[31],=UA9UAX/0/M(18)[31],
#    =UE0ARD/0(18)[31],=UE10RFF/9(18)[31],=UE1RFF/0/P(18)[31],=UE9FDA/0(18)[31],=UE9FDA/0/M(18)[31],
#    =R205NEW(19)[25],=R23RRC(19)[25],=UA6HMC/0(19)[25],
#    R0Y(23)[32],RA0Y(23)[32],RC0Y(23)[32],RD0Y(23)[32],RE0Y(23)[32],RF0Y(23)[32],RG0Y(23)[32],
#    RJ0Y(23)[32],RK0Y(23)[32],RL0Y(23)[32],RM0Y(23)[32],RN0Y(23)[32],RO0Y(23)[32],RQ0Y(23)[32],
#    RT0Y(23)[32],RU0Y(23)[32],RV0Y(23)[32],RW0Y(23)[32],RX0Y(23)[32],RY0Y(23)[32],RZ0Y(23)[32],
#    U0Y(23)[32],UA0Y(23)[32],UB0Y(23)[32],UC0Y(23)[32],UD0Y(23)[32],UE0Y(23)[32],UF0Y(23)[32],
#    UG0Y(23)[32],UH0Y(23)[32],UI0Y(23)[32],=R0WX/P(23)[32],=R9OOO/9/M(23)[32],=R9OOO/9/P(23)[32],
#    =R9OY/9/P(23)[32],=RA0AJ/0/P(23)[32],=RA0WA/0/P(23)[32],=RA9YME/0(23)[32],=RK3BY/0(23)[32],
#    =RP0Y(23)[32],=RX0AE/0(23)[32],=RX0AT/0/P(23)[32],=UA0ADU/0(23)[32],=UA0WGD/0(23)[32],
#    =UA9ZZ/0/P(23)[32],=UE0OFF/0(23)[32],=UE44Y/9(23)[32],=UE70Y(23)[32],
#    R0X(19)[35],R0Z(19)[35],RA0X(19)[35],RA0Z(19)[35],RC0X(19)[35],RC0Z(19)[35],RD0X(19)[35],
#    RD0Z(19)[35],RE0X(19)[35],RE0Z(19)[35],RF0X(19)[35],RF0Z(19)[35],RG0X(19)[35],RG0Z(19)[35],
#    RI0X(19)[35],RI0Z(19)[35],RJ0X(19)[35],RJ0Z(19)[35],RK0X(19)[35],RK0Z(19)[35],RL0X(19)[35],
#    RL0Z(19)[35],RM0X(19)[35],RM0Z(19)[35],RN0X(19)[35],RN0Z(19)[35],RO0X(19)[35],RO0Z(19)[35],
#    RQ0X(19)[35],RQ0Z(19)[35],RT0X(19)[35],RT0Z(19)[35],RU0X(19)[35],RU0Z(19)[35],RV0X(19)[35],
#    RV0Z(19)[35],RW0X(19)[35],RW0Z(19)[35],RX0X(19)[35],RX0Z(19)[35],RY0X(19)[35],RY0Z(19)[35],
#    RZ0X(19)[35],RZ0Z(19)[35],U0X(19)[35],U0Z(19)[35],UA0X(19)[35],UA0Z(19)[35],UB0X(19)[35],
#    UB0Z(19)[35],UC0X(19)[35],UC0Z(19)[35],UD0X(19)[35],UD0Z(19)[35],UE0X(19)[35],UE0Z(19)[35],
#    UF0X(19)[35],UF0Z(19)[35],UG0X(19)[35],UG0Z(19)[35],UH0X(19)[35],UH0Z(19)[35],UI0X(19)[35],
#    UI0Z(19)[35],=R120RI(19)[35],=R6MG/0(19)[35],=R750X(19)[35],=RK1B/0(19)[35],=RM7C/0(19)[35],
#    =RN6HI/0(19)[35],=RN7G/0(19)[35],=RP0Z(19)[35],=RP0ZKD(19)[35],=RP68PK(19)[35],=RT22ZS(19)[35],
#    =RT9K/0(19)[35],=RV2FW/0(19)[35],=RX3F/0(19)[35],=RZ9O/0(19)[35],=UA3AAC/0(19)[35],
#    =UA3AKO/0(19)[35],=UA6ANU/0(19)[35],=UE23RRC(19)[35],=UE23RRC/P(19)[35],=UE3ATV/0(19)[35],
#    =UE44V(19)[35],
#    R0U(18)[32],R0V(18)[32],RA0U(18)[32],RA0V(18)[32],RC0U(18)[32],RC0V(18)[32],RD0U(18)[32],
#    RD0V(18)[32],RE0U(18)[32],RE0V(18)[32],RF0U(18)[32],RF0V(18)[32],RG0U(18)[32],RG0V(18)[32],
#    RJ0U(18)[32],RJ0V(18)[32],RK0U(18)[32],RK0V(18)[32],RL0U(18)[32],RL0V(18)[32],RM0U(18)[32],
#    RM0V(18)[32],RN0U(18)[32],RN0V(18)[32],RO0U(18)[32],RO0V(18)[32],RQ0U(18)[32],RQ0V(18)[32],
#    RT0U(18)[32],RT0V(18)[32],RU0U(18)[32],RU0V(18)[32],RV0U(18)[32],RV0V(18)[32],RW0U(18)[32],
#    RW0V(18)[32],RX0U(18)[32],RX0V(18)[32],RY0U(18)[32],RY0V(18)[32],RZ0U(18)[32],RZ0V(18)[32],
#    U0U(18)[32],U0V(18)[32],UA0U(18)[32],UA0V(18)[32],UB0U(18)[32],UB0V(18)[32],UC0U(18)[32],
#    UC0V(18)[32],UD0U(18)[32],UD0V(18)[32],UE0U(18)[32],UE0V(18)[32],UF0U(18)[32],UF0V(18)[32],
#    UG0U(18)[32],UG0V(18)[32],UH0U(18)[32],UH0V(18)[32],UI0U(18)[32],UI0V(18)[32],=R120RQ(18)[32],
#    =R16FRA(18)[32],=R20RCK(18)[32],=R20RCK/0(18)[32],=R25ARCK(18)[32],=R70BP/0(18)[32],
#    =R7AB/9(18)[32],=RA/UR5WT(18)[32],=RA77VV(18)[32],=RB110RAEM(18)[32],=RK0AXC/0(18)[32],
#    =RK0AXC/0/M(18)[32],=RK6YYA/0(18)[32],=RK6YYA/0/M(18)[32],=RN4CU/0(18)[32],=RN4CU/0/P(18)[32],
#    =RN9A/0(18)[32],=RP0UWZ(18)[32],=RP0UZF(18)[32],=RW0UM/0(18)[32],=RZ19NY(18)[32],
#    =UA3AKO/0/M(18)[32],=UE15UWC(18)[32],=UE70UVV(18)[32],=UE70UWW(18)[32],=UE75VV(18)[32];
#Uzbekistan:               17:  30:  AS:   41.40:   -63.97:    -5.0:  UK:
#    UJ,UK,UL,UM,=U8AG,=U8AH,=U8AI,=UK/DF3DS/Z;
#Kazakhstan:               17:  30:  AS:   48.17:   -65.18:    -5.0:  UN:
#    UN,UO,UP,UQ,=R55SAT,=RG50SK,=U7GL,=UN7ECA/FF,=UN7EDG/FF,=UN7LAN/A/FF,=UN9LU/A/FF,
#    UN0F[31],UN2F[31],UN3F[31],UN4F[31],UN5F[31],UN6F[31],UN7F[31],UN8F[31],UN9F[31],UO0F[31],
#    UO1F[31],UO2F[31],UO3F[31],UO4F[31],UO5F[31],UO6F[31],UO7F[31],UO8F[31],UO9F[31],UP0F[31],
#    UP1F[31],UP2F[31],UP3F[31],UP4F[31],UP5F[31],UP6F[31],UP7F[31],UP8F[31],UP9F[31],UQ0F[31],
#    UQ1F[31],UQ2F[31],UQ3F[31],UQ4F[31],UQ5F[31],UQ6F[31],UQ7F[31],UQ8F[31],UQ9F[31],
#    UN0G[31],UN2G[31],UN3G[31],UN4G[31],UN5G[31],UN6G[31],UN7G[31],UN8G[31],UN9G[31],UO0G[31],
#    UO1G[31],UO2G[31],UO3G[31],UO4G[31],UO5G[31],UO6G[31],UO7G[31],UO8G[31],UO9G[31],UP0G[31],
#    UP1G[31],UP2G[31],UP3G[31],UP4G[31],UP5G[31],UP6G[31],UP7G[31],UP8G[31],UP9G[31],UQ0G[31],
#    UQ1G[31],UQ2G[31],UQ3G[31],UQ4G[31],UQ5G[31],UQ6G[31],UQ7G[31],UQ8G[31],UQ9G[31],
#    UN0J[31],UN2J[31],UN3J[31],UN4J[31],UN5J[31],UN6J[31],UN7J[31],UN8J[31],UN9J[31],UO0J[31],
#    UO1J[31],UO2J[31],UO3J[31],UO4J[31],UO5J[31],UO6J[31],UO7J[31],UO8J[31],UO9J[31],UP0J[31],
#    UP1J[31],UP2J[31],UP3J[31],UP4J[31],UP5J[31],UP6J[31],UP7J[31],UP8J[31],UP9J[31],UQ0J[31],
#    UQ1J[31],UQ2J[31],UQ3J[31],UQ4J[31],UQ5J[31],UQ6J[31],UQ7J[31],UQ8J[31],UQ9J[31],
#    =R50KEDR,=R50SK,=R50YG,
#    UN0Q[31],UN2Q[31],UN3Q[31],UN4Q[31],UN5Q[31],UN6Q[31],UN7Q[31],UN8Q[31],UN9Q[31],UO0Q[31],
#    UO1Q[31],UO2Q[31],UO3Q[31],UO4Q[31],UO5Q[31],UO6Q[31],UO7Q[31],UO8Q[31],UO9Q[31],UP0Q[31],
#    UP1Q[31],UP2Q[31],UP3Q[31],UP4Q[31],UP5Q[31],UP6Q[31],UP7Q[31],UP8Q[31],UP9Q[31],UQ0Q[31],
#    UQ1Q[31],UQ2Q[31],UQ3Q[31],UQ4Q[31],UQ5Q[31],UQ6Q[31],UQ7Q[31],UQ8Q[31],UQ9Q[31],
#    =R80KEDR;
#Ukraine:                  16:  29:  EU:   50.00:   -30.00:    -2.0:  UR:
#    EM,EN,EO,U5,UR,US,UT,UU,UV,UW,UX,UY,UZ,=KT5X/US0Q,=UR3IDD/MM(15),
#    =UU9CW/LH,
#    =UT2EE/YL,=UY5EI/LH,
#    =UR5FCZ/LGT,=UR5FOG/YL,=UT2FA/LH,=UT5FA/MM(9),
#    =UR6GWZ/YL,=UR7GO/LH,=UR7GO/P/LH,=UR7GW/LH,=UR7GW/P/LH,=US0GA/P/LH,=UW1GZ/LH,=UW1GZ/P/LH,
#    =UX2HR/FF,=UY5HC/LH,=UY5HF/LH,
#    =UR8IDX/A/LH,=US8IB/LH,=US8ICM/LH,=US8IM/LH,=UT/RA9JP/LH,=UT4IYZ/FF,=UT8IA/LH,=UT8IO/A/LH,
#    =UT8IO/P/LH,=UT8IV/LH,=UX2IJ/FF,=UX2IQ/P/LH,=UX8IX/LH,
#    =UU4JO/LH,=UU9JWM/LH,
#    =R200A,=UU4JWM/LGT,=UU4JWM/LH,=UU6JJ/LH,=UU7JF/LH,
#    =UR5KCC/WAP,=UR5KGG/WAP,=UT1KY/AAW,=UT1KY/WAP,=UT5KDS/YL,
#    =UR4LJ/LH,=UR4UC/LH,=UR8LV/WAP,=UR9LD/P/LH,=UT2LF/LH,
#    =UT1ML/LH,
#    =EM3QLH/LH,=UR4QI/M/LH,=UR4QKI/M/LH,
#    =EM0UBC/FF,=US5UCC/LH,=UT5UIA/P/LH,=UT7UA/WAP,
#    =UR4VWN/J,
#    =UR2XO/WAP,
#    =UR5ZVJ/LH;
#Antigua & Barbuda:        08:  11:  NA:   17.07:    61.80:     4.0:  V2:
#    V2;
#Belize:                   07:  11:  NA:   16.97:    88.67:     6.0:  V3:
#    V3;
#St. Kitts & Nevis:        08:  11:  NA:   17.37:    62.78:     4.0:  V4:
#    V4;
#Namibia:                  38:  57:  AF:  -22.00:   -17.00:    -1.0:  V5:
#    V5,=V51AS/L,=V51NAM/L,=V51NAM/LH,=V51WW/L,=V51WW/LH,=V55V/LH,=V59PP/L,=V59SWK/L,=V59SWK/LH;
#Micronesia:               27:  65:  OC:    6.88:  -158.20:   -10.0:  V6:
#    V6,=V63JQ/C,=V63JQ/K,=V63JY/C,=V63JY/K,=V63OP/C,=V63OP/K,=V63VE/C,=V63VE/K;
#Marshall Islands:         31:  65:  OC:    9.08:  -167.33:   -12.0:  V7:
#    V7;
#Brunei Darussalam:        28:  54:  OC:    4.50:  -114.60:    -8.0:  V8:
#    V8;
#Canada:                   05:  09:  NA:   44.35:    78.75:     5.0:  VE:
#    CF,CG,CJ,CK,VA,VB,VC,VE,VG,VX,VY9,XL,XM,=VE2EM/M,=VER20191120,
#    =CF7AAW/1,=CK7IG/1,=VA3QSL/1,=VA3WR/1,=VE1REC/LH,=VE1REC/M/LH,=VE3RSA/1,=VE7IG/1,
#    CF2[4],CG2[4],CJ2[4],CK2[4],VA2[4],VB2[4],VC2[4],VE2[4],VG2[4],VX2[4],XL2[4],XM2[4],=4Y1CAO[4],
#    =CY2ZT/2[4],=VA3MPM/2[4],=VA7AQ/P[4],=VE2/G3ZAY/P[4],=VE2/M0BLF/P[4],=VE2FK[9],=VE2HAY/P[4],
#    =VE2KK[9],=VE2MAM/P[4],=VE2OV/P[4],=VE3AP/2[4],=VE3EXY/2[4],=VE3GF/2[4],=VE3GNO/2[4],=VE3IAC/2[4],
#    =VE3ZZ/2[4],=VE6TC/2[4],=VE7IG/2[4],=XO0ICE/2[4],
#    CF3(4)[4],CG3(4)[4],CJ3(4)[4],CK3(4)[4],VA3(4)[4],VB3(4)[4],VC3(4)[4],VE3(4)[4],VG3(4)[4],
#    VX3(4)[4],XL3(4)[4],XM3(4)[4],=CF7EWK/3(4)[4],=CI0XN/P(4)[4],=CJ7EWK/3(4)[4],=VA7EWK/3(4)[4],
#    =VE1RM/3(4)[4],=VE2AEJ/3(4)[4],=VE2MAM/3(4)[4],=VE2MW/3(4)[4],=VE2PK/3(4)[4],=VE2QLF/3(4)[4],
#    =VE2QV/3(4)[4],=VE2XB/3(4)[4],=VE2XZ/3(4)[4],=VE2ZQ/3(4)[4],=VE7APF/3(4)[4],=VE8HI/3(4)[4],
#    =VX9GHD(4)[4],=VX9GHQ(4)[4],=VX9GLC(4)[4],=VX9GLI(4)[4],=VX9SHA(4)[4],=VY2MGY/3(4)[4],
#    =XK0XN(4)[4],=XK0XN/P(4)[4],=XO0XN(4)[4],=XO0XN/P(4)[4],
#    CF4(4)[3],CG4(4)[3],CJ4(4)[3],CK4(4)[3],VA4(4)[3],VB4(4)[3],VC4(4)[3],VE4(4)[3],VG4(4)[3],
#    VX4(4)[3],XL4(4)[3],XM4(4)[3],=VA7MPG/4(4)[3],=VE1RM/4(4)[3],
#    CF5(4)[3],CG5(4)[3],CJ5(4)[3],CK5(4)[3],VA5(4)[3],VB5(4)[3],VC5(4)[3],VE5(4)[3],VG5(4)[3],
#    VX5(4)[3],XL5(4)[3],XM5(4)[3],=VE1CZ/5(4)[3],=VE7LSE/5(4)[3],=VE7XF/5(4)[3],=VE7XF/6(4)[3],
#    =VE9TEN/5(4)[3],=VY0AA(4)[3],=VY0DXA(4)[3],=VY0PW(4)[3],
#    CF6(4)[2],CG6(4)[2],CJ6(4)[2],CK6(4)[2],VA6(4)[2],VB6(4)[2],VC6(4)[2],VE6(4)[2],VG6(4)[2],
#    VX6(4)[2],XL6(4)[2],XM6(4)[2],=VE7HII/6(4)[2],=VE9XX/6(4)[2],=VY0XYL/6(4)[2],
#    CF7(3)[2],CG7(3)[2],CJ7(3)[2],CK7(3)[2],VA7(3)[2],VB7(3)[2],VC7(3)[2],VE7(3)[2],VG7(3)[2],
#    VX7(3)[2],XL7(3)[2],XM7(3)[2],=CY7DP(3)[2],=VA6FUN/7(3)[2],=VA6SS/7(3)[2],=VE3AX/7(3)[2],
#    =VE3DO/7(3)[2],=VE3IKV/7(3)[2],=VE3LLV/7(3)[2],=VE3RSA/7(3)[2],=VE5DX/7(3)[2],=VE6100EMP/7(3)[2],
#    =VE6BIR/7(3)[2],=VE6EZ/7(3)[2],=VE6LK/7(3)[2],=VE6ZC/7(3)[2],=VX9GJD(3)[2],
#    CF8(1)[3],CG8(1)[3],CJ8(1)[3],CK8(1)[3],VA8(1)[3],VB8(1)[3],VC8(1)[3],VE8(1)[3],VG8(1)[3],
#    VX8(1)[3],XL8(1)[3],XM8(1)[3],=VY0M(1)[3],
#    =VE7IG/9,=VO2DX/9,
#    CH1,CY1,VD1,VO1,XJ1,XN1,=VO1BRK/L,=VO1VON/LH,
#    CH2(2),CY2(2),VD2(2),VO2(2),XJ2(2),XN2(2),=VO/DL2GF(2),=VO/DL2GF/P(2),
#    CI0(2)[4],CZ0(2)[4],VF0(2)[4],VY0(2)[4],XK0(2)[4],XO0(2)[4],=CG2NNX/P(2)[4],=VE0NWP(2)[4],
#    =VE8AT(2)[4],=VE8FS(2)[4],=VF0X/M(2)[4],
#    CI1(1)[2],CZ1(1)[2],VF1(1)[2],VY1(1)[2],XK1(1)[2],XO1(1)[2],
#    CI2,CZ2,VF2,VY2,XK2,XO2,
#    =CF2RC(2)[4],=CF2VVV(2)[4],=CJ2BY(2)[4],=CJ2KCE(2)[4],=K3FMQ/VE2(2)[4],=K5YG/VE2(2)[4],
#    =KD3RF/VE2(2)[4],=KD3TB/VE2(2)[4],=N5ZO/VE2(2)[4],=VA1CN/2(2)[4],=VA2BK(2)[4],=VA2BY(2)[4],
#    =VA2KCE(2)[4],=VA2MCJ/VE2(2)[4],=VA2RAG(2)[4],=VA2VFT(2)[4],=VA2VVV(2)[4],=VA3ELE/2(2)[4],
#    =VA3NA/2(2)[4],=VB2C(2)[4],=VB2R(2)[4],=VB2T(2)[4],=VB2V(2)[4],=VB2W(2)[4],=VC2C(2)[4],
#    =VC2EME(2)[4],=VC2Q(2)[4],=VC2R(2)[4],=VC2X(2)[4],=VC3W/2(2)[4],=VE2/JA8BMK(2)[4],=VE2/K5YG(2)[4],
#    =VE2/KD3RF(2)[4],=VE2/KD3RF/M(2)[4],=VE2/N1NK(2)[4],=VE2/UT3UA(2)[4],=VE2/W2NTJ(2)[4],
#    =VE2/W5GED(2)[4],=VE2A(2)[4],=VE2ACP/P(2)[4],=VE2AE(2)[4],=VE2CSI(2)[4],=VE2CVI(2)[4],
#    =VE2DXY(2)[4],=VE2EKA(2)[4],=VE2FDJ/2(2)[4],=VE2GHZ/2(2)[4],=VE2GT/150(2)[4],=VE2HRI(2)[4],
#    =VE2IDX(2)[4],=VE2III(2)[4],=VE2IM(2)[4],=VE2NN(2)[4],=VE2OTT(2)[4],=VE2PRG(2)[4],=VE2QIP/2(2)[4],
#    =VE2TKH(2)[4],=VE2TWO(2)[4],=VE2WDX(2)[4],=VE2XAA/2(2)[4],=VE2XB/2(2)[4],=VE2Z(2)[4],
#    =VE3AXC/2(2)[4],=VE3CWU/2(2)[4],=VE3EY/2(2)[4],=VE3FDX/2(2)[4],=VE3JM/2(2)[4],=VE3NE/2(2)[4],
#    =VE3NWA/2(2)[4],=VE3RHJ/2(2)[4],=VE3ZF/2(2)[4],=VE7ACN/VE2(2)[4],=VE7MID/VE2(2)[4],=VE8DX/2(2)[4],
#    =VY2NA/VE2(2)[4],=W0SD/VE2(2)[4],=W2NTJ/VE2(2)[4],=W4TMO/VE2(2)[4],=W5GED/VE2(2)[4],
#    =WB8YTZ/VE2(2)[4],=XM3NE/2(2)[4],
#    =K8JJ/VY0(4)[4],=K9AJ/VY0(4)[4],=KD6WW/VY0(4)[4],=VY0A(4)[4],=VY0V(4)[4];
#Australia:                30:  59:  OC:  -23.70:  -132.33:   -10.0:  VK:
#    AX,VH,VI,VJ,VK,VL,VM,VN,VZ,=VK9MAV,
#    =VK6MB/1,
#    =AX2000/IMD,=AX2000/LH,=VI90IARU,=VK2IO/8,=VK6AV/2,=VK6AXB/2,=VK6DXI/2,=VK6MB/2,=VK6YB/2,
#    =VK6ZOA/2,=VK8GMT/2,=VK9LX/2,
#    =AX8AA,=VK3DK/LH,=VK6FMON/3,=VK6JON/3,=VK6MB/3,=VK6NX/3,=VK6SX/3,=VK9LA/3,=VK9ZLH/3,
#    AX4[55],VH4[55],VI4[55],VJ4[55],VK4[55],VL4[55],VM4[55],VN4[55],VZ4[55],=VK100WIA[55],
#    =VK4MM/LH[55],=VK4WIA/HQ[55],=VK5MAV/9[55],=VK6AV/4[55],=VK6CN/4[55],=VK6DW/4[55],=VK6DXI/4[55],
#    =VK6JON/4[55],=VK6KM/4[55],=VK6LC/4[55],=VK6MB/5[55],=VK6NAI/4[55],=VK6ZN/4[55],=VK8FUNN/4[55],
#    =VK8GM/4[55],=VK8RC/4[55],=VK9MAV/4[55],
#    =VK60LZ,=VK6ANZ/4,=VK6DW/5,=VK6GIO/5,=VK6GZ/5,=VK6JON/5,=VK6LB/5,=VK6ZG/5,=VK6ZN/5,
#    AX6(29)[58],VH6(29)[58],VI6(29)[58],VJ6(29)[58],VK6(29)[58],VL6(29)[58],VM6(29)[58],VN6(29)[58],
#    VZ6(29)[58],=VI103WIA(29)[58],=VI5RAS/6(29)[58],=VI90ANZAC(29)[58],=VK1FOC/6(29)[58],
#    =VK1LAJ/6(29)[58],=VK2015TDF(29)[58],=VK2BAA/6(29)[58],=VK2CV/6(29)[58],=VK2FDU/6(29)[58],
#    =VK2IA/6(29)[58],=VK2RAS/6(29)[58],=VK3DP/6(29)[58],=VK3DXI/6(29)[58],=VK3FPF/6(29)[58],
#    =VK3FPIL/6(29)[58],=VK3JBL/6(29)[58],=VK3KG/6(29)[58],=VK3MCD/6(29)[58],=VK3NUT/6(29)[58],
#    =VK3OHM/6(29)[58],=VK3TWO/6(29)[58],=VK3YQS/6(29)[58],=VK3ZK/6(29)[58],=VK4FDJL/6(29)[58],
#    =VK4IXU/6(29)[58],=VK4JWG/6(29)[58],=VK4NAI/6(29)[58],=VK4NH/6(29)[58],=VK4SN/6(29)[58],
#    =VK4VXX/6(29)[58],=VK5CC/6(29)[58],=VK5CE/6(29)[58],=VK5CE/9(29)[58],=VK5FLEA/6(29)[58],
#    =VK5FMAZ/6(29)[58],=VK5HYZ/6(29)[58],=VK5MAV/6(29)[58],=VK5NHG/6(29)[58],=VK5PAS/6(29)[58],
#    =VK6BV/AF(29)[58],=VK9AR(29)[58],=VK9AR/6(29)[58],=VK9ZLH/6(29)[58],
#    =VK6JON/7,=VK6KSJ/7,=VK6ZN/7,=VK7NWT/LH,=VK8XX/7,
#    AX8(29)[55],VH8(29)[55],VI8(29)[55],VJ8(29)[55],VK8(29)[55],VL8(29)[55],VM8(29)[55],VN8(29)[55],
#    VZ8(29)[55],=VI5RAS/8(29)[55],=VK1AHS/8(29)[55],=VK1FOC/8(29)[55],=VK2CBD/8(29)[55],
#    =VK2CR/8(29)[55],=VK2GR/8(29)[55],=VK2ZK/8(29)[55],=VK3BYD/8(29)[55],=VK3DHI/8(29)[55],
#    =VK3QB/8(29)[55],=VK3ZK/8(29)[55],=VK4FOC/8(29)[55],=VK4HDG/8(29)[55],=VK4VXX/8(29)[55],
#    =VK4WWI/8(29)[55],=VK5CE/8(29)[55],=VK5HSX/8(29)[55],=VK5MAV/8(29)[55],=VK5UK/8(29)[55],
#    =VK5WTF/8(29)[55],=VK8HLF/J(29)[55];
#Heard Island:             39:  68:  AF:  -53.08:   -73.50:    -5.0:  VK0H:
#    =VK0/K2ARB,=VK0EK,=VK0LD;
#Macquarie Island:         30:  60:  OC:  -54.60:  -158.88:   -10.0:  VK0M:
#    =AX/VK0TH,=AX0LD,=AX0MQI,=AX0MT,=AX0TH,=VK0AI,=VK0AVT,=VK0KEV,=VK0M/ZL4DB/P,=VK0MM,=VK0MQI,=VK0MT,
#    =VK0TH,=ZL4DB/P/VK0M;
#Cocos (Keeling) Islands:  29:  54:  OC:  -12.15:   -96.82:    -6.5:  VK9C:
#    AX9C,AX9Y,VH9C,VH9Y,VI9C,VI9Y,VJ9C,VJ9Y,VK9C,VK9FC,VK9KC,VK9Y,VK9ZY,VL9C,VL9Y,VM9C,VM9Y,VN9C,VN9Y,
#    VZ9C,VZ9Y,=VK6XL/9,=VK8RR/9,=VK9/LB1GB,=VK9AW,=VK9EC,=VK9FISH;
#Lord Howe Island:         30:  60:  OC:  -31.55:  -159.08:   -10.5:  VK9L:
#    AX9L,VH9L,VI9L,VJ9L,VK9FL,VK9L,VK9ZL,VL9L,VM9L,VN9L,VZ9L,=VK2GEL/9,=VK2IAY/9,=VK3AFW/9,=VK3TKB/9,
#    =VK3YQS/9,=VK3YQS/VK9,=VK5CP/9,=VK9/OG1M,=VK9/OH1VR,=VK9/OH3JR,=VK9/OH3X,=VK9ALH,=VK9APX,=VK9CLF,
#    =VK9DJ,=VK9DLX,=VK9EHH,=VK9GLX,=VK9HR,=VK9IR,=VK9OL,=VK9PN,=VK9YL;
#Mellish Reef:             30:  56:  OC:  -17.40:  -155.85:   -10.0:  VK9M:
#    AX9M,VH9M,VI9M,VJ9M,VK9M,VL9M,VM9M,VN9M,VZ9M,=VK9GMW;
#Norfolk Island:           32:  60:  OC:  -29.03:  -167.93:   -11.5:  VK9N:
#    AX9,VH9,VI9,VJ9,VK9,VL9,VM9,VN9,VZ9,=AX9YL,=VK2ACC/9,=VK2CA/9,=VK2FBBB/9,=VK2XSE/9,=VK3CBV/9,
#    =VK3GK/9,=VK3PF/9,=VK3QB/9,=VK3TWO/9,=VK3YB/9,=VK4FSCC/9,=VK4HNS/9,=VK5FMAZ/9,=VK6FMON/9,=VK9CNC,
#    =VK9CNF,=VK9LX/9,=VK9WI,=VK9XIC;
#Willis Island:            30:  55:  OC:  -16.22:  -150.02:   -10.0:  VK9W:
#    AX9W,AX9Z,VH9W,VH9Z,VI9W,VI9Z,VJ9W,VJ9Z,VK9FW,VK9W,VK9Z,VL9W,VL9Z,VM9W,VM9Z,VN9W,VN9Z,VZ9W,VZ9Z,
#    =VK9DWX;
#Christmas Island:         29:  54:  OC:  -10.48:  -105.63:    -7.0:  VK9X:
#    AX9X,VH9X,VI9X,VJ9X,VK9FX,VK9KX,VK9X,VL9X,VM9X,VN9X,VZ9X,=VI9PEACE,=VK3FY/9,=VK3HEX/9,=VK9AA,
#    =VK9AN,=VK9ARH,=VK9ARH/P,=VK9EX,=VK9JD,=VK9VKL;
#Anguilla:                 08:  11:  NA:   18.23:    63.00:     4.0:  VP2E:
#    VP2E;
#Montserrat:               08:  11:  NA:   16.75:    62.18:     4.0:  VP2M:
#    VP2M;
#British Virgin Islands:   08:  11:  NA:   18.33:    64.75:     4.0:  VP2V:
#    VP2V;
#Turks & Caicos Islands:   08:  11:  NA:   21.77:    71.75:     5.0:  VP5:
#    VP5,VQ5;
#Pitcairn Island:          32:  63:  OC:  -25.07:   130.10:     8.0:  VP6:
#    VP6;
#Ducie Island:             32:  63:  OC:  -24.70:   124.80:     8.0:  VP6/d:
#    =VP6D,=VP6DI,=VP6DIA,=VP6DX,=VP6UU,=VP6UU/VP6D;
#Falkland Islands:         13:  16:  SA:  -51.63:    58.72:     4.0:  VP8:
#    VP8;
#South Georgia Island:     13:  73:  SA:  -54.48:    37.08:     2.0:  VP8/g:
#    =VP8CA,=VP8CKB,=VP8DIF,=VP8DKX,=VP8DOZ,=VP8GEO,=VP8GI,=VP8SGB,=VP8SGI,=VP8SGK;
#South Shetland Islands:   13:  73:  SA:  -62.08:    58.67:     4.0:  VP8/h:
#    CE9,XR9,=BY/R1ANF,=CA8WCI/9,=CV0A,=D88S,=DP1ANF,=DT8A,=EA/FT5YK,=EA/FT5YK/P,=EA1CYK/P,=EA1CYK/VP8,
#    =EA4FZR,=EA4FZR/P,=ED3RKL,=HC/FT5YK,=HF0/R1ANF,=HF0ANT,=HF0APAS,=HF0ARC,=HF0POL,=HF0POL/LH,=HF0QF,
#    =HL0KSJ,=HL8KSJ,=I1SR,=KC4/HF0POL,=LU/R1ANF,=LU1ZC,=LU1ZI,=LU1ZI/HF0POL,=LU1ZS,=LU4AA/Z,=LU4CJM/Z,
#    =LU8DIP/Z,=LW8DOH/Z,=LZ0A,=OA0/FT5YJ,=OA0MP,=OL0ANT,=R1/HF0POL,=R1ANF,=R1ANF/A,=R1ANF/B,
#    =R1ANF/HF0POL,=R1ANF/MM,=R1ANF/P,=R1ANF/VP8,=R1ANY,=RI1ANB,=RI1ANF,=RI1ANF/B,=RI1ANF/FF,=RI1ANF/P,
#    =RI1ANO,=RI1ANU,=RI20ANT,=RI44ANT,=RI50ANO,=RI59ANT,=VP8/EA1CYK,=VP8/EA1CYK/P,=VP8/LZ1UQ,
#    =VP8/LZ2UU,=VP8DJK,=ZX0ECF,=ZX0GTI;
#South Orkney Islands:     13:  73:  SA:  -60.60:    45.55:     3.0:  VP8/o:
#    =AY1ZA,=LU1ZA,=LU2ERA/Z,=LU3DO/Z,=LU4ZD,=LW1ZA,=VP8/VP8DXU,=VP8ORK,=VP8PIG,=VP8SIG;
#South Sandwich Islands:   13:  73:  SA:  -58.43:    26.33:     2.0:  VP8/s:
#    =VP8STI,=VP8THU;
#Bermuda:                  05:  11:  NA:   32.32:    64.73:     4.0:  VP9:
#    VP9,=VP400BO,=VP9400/HW;
#Chagos Islands:           39:  41:  AF:   -7.32:   -72.42:    -6.0:  VQ9:
#    VQ9;
#Hong Kong:                24:  44:  AS:   22.28:  -114.18:    -8.0:  VR:
#    VR;
#India:                    22:  41:  AS:   22.50:   -77.58:    -5.5:  VU:
#    8T,8U,8V,8W,8X,8Y,AT,AU,AV,AW,VT,VU,VV,VW,=AT16BSG/BL,=AT16BSG/JMA,=AT16BSG/JOS,=AT16BSG/LMS,
#    =AT16BSG/MCW,=AT16BSG/MY,=AT16BSG/MYH,=AT16BSG/RAT,=AT16BSG/RBI,=AT16BSG/SD,=AT16BSG/YAM,
#    =VU2ARC/FD,=VU2BGS/L,=VU2CBE/KNK,=VU2CDP/F1,=VU2LCI/L,=VU2PAI/F1,=VU2PAI/OK7MT,=VU2SWS/F1,
#    =VU2TS/FF,=VU2UR/F1,=VU2UR/FF,=VU2WAP/DL7BC,=VU3DJQ/F1,=VU3VOC/F1,=VU4SEA;
#Andaman & Nicobar Is.:    26:  49:  AS:   12.37:   -92.78:    -5.5:  VU4:
#    VU4,=VU3VPX,=VU3VPY,=VU4AN/RBI,=VU4RBI/DBP,=VU4RBI/DVS;
#Lakshadweep Islands:      22:  41:  AS:   11.23:   -72.78:    -5.5:  VU7:
#    VU7,=VU3EBX,=VU7MY/JOS,=VU7MY/RBI;
#Mexico:                   06:  10:  NA:   21.32:   100.23:     6.0:  XE:
#    4A,4B,4C,6D,6E,6F,6G,6H,6I,6J,XA,XB,XC,XD,XE,XF,XG,XH,XI,
#    =XE3MAYA/C,=XE3MAYA/D,=XE3MAYA/E,=XE3MAYA/T,=XE3MAYA/X;
#Revillagigedo:            06:  10:  NA:   18.77:   110.97:     7.0:  XF4:
#    4A4,4B4,4C4,6D4,6E4,6F4,6G4,6H4,6I4,6J4,XA4,XB4,XC4,XD4,XE4,XF4,XG4,XH4,XI4;
#Burkina Faso:             35:  46:  AF:   12.00:     2.00:     0.0:  XT:
#    XT;
#Cambodia:                 26:  49:  AS:   12.93:  -105.13:    -7.0:  XU:
#    XU;
#Laos:                     26:  49:  AS:   18.20:  -104.55:    -7.0:  XW:
#    XW,=XW8KPL/RU3DX;
#Macao:                    24:  44:  AS:   22.10:  -113.50:    -8.0:  XX9:
#    XX9;
#Myanmar:                  26:  49:  AS:   20.00:   -96.37:    -6.5:  XZ:
#    XY,XZ;
#Afghanistan:              21:  40:  AS:   34.70:   -65.80:    -4.5:  YA:
#    T6,YA;
#Indonesia:                28:  51:  OC:   -7.30:  -109.88:    -7.0:  YB:
#    7A,7B,7C,7D,7E,7F,7G,7H,7I,8A,8B,8C,8D,8E,8F,8G,8H,8I,PK,PL,PM,PN,PO,YB,YC,YD,YE,YF,YG,YH,
#    YB0[54],YC0[54],YD0[54],YE0[54],YF0[54],YG0[54],YH0[54],=YB0AI/LH[54],=YC0LND/YL[54],
#    YB1[54],YC1[54],YD1[54],YE1[54],YF1[54],YG1[54],YH1[54],=YB1LGP/YL[54],=YC1BWA/YL[54],
#    =YC1CVA/YL[54],=YD1BZW/YL[54],=YD1MKQ/YL[54],=YD1NAA/YL[54],
#    YB2[54],YC2[54],YD2[54],YE2[54],YF2[54],YG2[54],YH2[54],
#    YB3[54],YC3[54],YD3[54],YE3[54],YF3[54],YG3[54],YH3[54],
#    YB4[54],YC4[54],YD4[54],YE4[54],YF4[54],YG4[54],YH4[54],
#    YB5[54],YC5[54],YD5[54],YE5[54],YF5[54],YG5[54],YH5[54],
#    YB6[54],YC6[54],YD6[54],YE6[54],YF6[54],YG6[54],YH6[54],
#    YB7[54],YC7[54],YD7[54],YE7[54],YF7[54],YG7[54],YH7[54],
#    YB8[54],YC8[54],YD8[54],YE8[54],YF8[54],YG8[54],YH8[54];
#Iraq:                     21:  39:  AS:   33.92:   -42.78:    -3.0:  YI:
#    HN,YI,=K4CY/M,=YI1IRQ/ND;
#Vanuatu:                  32:  56:  OC:  -17.67:  -168.38:   -11.0:  YJ:
#    YJ;
#Syria:                    20:  39:  AS:   35.38:   -38.20:    -2.0:  YK:
#    6C,YK;
#Latvia:                   15:  29:  EU:   57.03:   -24.65:    -2.0:  YL:
#    YL,=YL/LY1CM/LH,=YL0A/LH,=YL0WFF/LH,=YL1A/LH,=YL2AG/ANT,=YL2SW/MM(21),=YL3AD/LGT,=YL3BF/LH,
#    =YL3BU/LH,=YL3FT/LH,=YL3FT/P/LH,=YL3GED/LH,=YL3IZ/MM(8),=YL3JD/LH;
#Nicaragua:                07:  11:  NA:   12.88:    85.05:     6.0:  YN:
#    H6,H7,HT,YN;
#Romania:                  20:  28:  EU:   45.78:   -24.70:    -2.0:  YO:
#    YO,YP,YQ,YR,
#    =YO3FRI/YL,
#    =YO4ASG/LH,=YO4BBH/LH,=YO4GDP/LH,=YO4GJS/LH;
#El Salvador:              07:  11:  NA:   14.00:    89.00:     6.0:  YS:
#    HU,YS;
#Serbia:                   15:  28:  EU:   44.00:   -21.00:    -1.0:  YU:
#    YT,YU,=4O0A,=4O5W,=4O5Z,=4U/DA1KY,=YT1S/J,=YT2A/LGT,=YT2A/LH,=YU/IZ1VUC/LH,=YU1BBA/J,=YU1CA/LH,
#    =YU1FW/LH,=YU1JF/LH,=YU7RQ/FAIR;
#Venezuela:                09:  12:  SA:    8.00:    66.00:     4.5:  YV:
#    4M,YV,YW,YX,YY;
#Aves Island:              08:  11:  NA:   15.67:    63.60:     4.0:  YV0:
#    4M0,YV0,YW0,YX0,YY0;
#Zimbabwe:                 38:  53:  AF:  -18.00:   -31.00:    -2.0:  Z2:
#    Z2,=Z21KD/L,=Z27JAM/J;
#North Macedonia:          15:  28:  EU:   41.60:   -21.65:    -1.0:  Z3:
#    Z3;
#Republic of Kosovo:       15:  28:  EU:   42.67:   -21.17:    -1.0:  Z6:
#    Z6;
#Republic of South Sudan:  34:  48:  AF:    4.85:   -31.60:    -3.0:  Z8:
#    Z8,=ST0R;
#Albania:                  15:  28:  EU:   41.00:   -20.00:    -1.0:  ZA:
#    ZA;
#Gibraltar:                14:  37:  EU:   36.15:     5.37:    -1.0:  ZB:
#    ZB,ZG,=ZB2LGT/LH;
#UK Base Areas on Cyprus:  20:  39:  AS:   35.32:   -33.57:    -2.0:  ZC4:
#    ZC4,=ZC4ATC/2000Y;
#St. Helena:               36:  66:  AF:  -15.97:     5.72:     0.0:  ZD7:
#    ZD7;
#Ascension Island:         36:  66:  AF:   -7.93:    14.37:     0.0:  ZD8:
#    ZD8;
#Tristan da Cunha & Gough: 38:  66:  AF:  -37.13:    12.30:     0.0:  ZD9:
#    ZD9;
#Cayman Islands:           08:  11:  NA:   19.32:    81.22:     5.0:  ZF:
#    ZF;
#Tokelau Islands:          31:  62:  OC:   -9.40:   171.20:   -13.0:  ZK3:
#    ZK3;
#New Zealand:              32:  60:  OC:  -41.83:  -173.27:   -12.0:  ZL:
#    ZK,ZL,ZL50,ZM,=ZL1CT/MM(34),=ZL6A/HQ,=ZL6LH/LH,=ZL75KO,=ZL90IARU,=ZM50GW,=ZM50LA,=ZM50MAUQ,
#    =ZM80WB,
#    =ZL1AB/LH,
#    =ZL2ARG/LH,=ZL2III/LH,=ZL2VH/LH,=ZL80FOC;
#Chatham Islands:          32:  60:  OC:  -43.85:   176.48:  -12.75:  ZL7:
#    ZL7,ZM7;
#Kermadec Islands:         32:  60:  OC:  -29.25:   177.92:   -12.0:  ZL8:
#    ZL8,ZM8,=ZL1GO/8;
#N.Z. Subantarctic Is.:    32:  60:  OC:  -51.62:  -167.62:   -12.0:  ZL9:
#    ZL9;
#Paraguay:                 11:  14:  SA:  -25.27:    57.67:     4.0:  ZP:
#    ZP;
#South Africa:             38:  57:  AF:  -29.07:   -22.63:    -2.0:  ZS:
#    H5,S4,S8,V9,ZR,ZS,ZT,ZU,=ZS70BAK/L,=ZS71SIG,=ZS75PTA,=ZS85SARL,
#    =ZS1BAK/L,=ZS1CT/L,=ZS1CT/LH,=ZS1ESC/L,=ZS1ESC/LH,=ZS1FRC/L,=ZS1FRC/LH,=ZS1OAK/LH,=ZS1OAR/LH,
#    =ZS1SKR/LH,=ZS1YVP/LH,=ZS70BAK,
#    =ZS2CR/YL,
#    =ZS5T/L,=ZS5ZLB/L,
#    =ZS6AUH/L,=ZS6BXN/L,=ZS6LCM/L,=ZS6STN/L,=ZS6WR/L,=ZS6WRL/L,=ZS80VT;
#Pr. Edward & Marion Is.:  38:  57:  AF:  -46.88:   -37.72:    -3.0:  ZS8:
#    ZR8,ZS8,ZT8,ZU8;
