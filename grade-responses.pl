#!/usr/bin/perl -w
use List::MoreUtils qw(first_index);

$formresults="Activity 8.1: ES-Lint Experience.csv";
$eslintresults="eslint-output.txt";
$output="2021-03-09-linter.csv";

open my $lint, "<", $eslintresults
    || die ("Could not open ES-Lint results: $eslintresults\n");

%reported = (); # key is filename:line

my $file = "undefined";
while (<$lint>) {
    chomp $_;
    next if (/^$/);
    if (m#Week8-Linter/src/([-a-zA-Z0-9./]*.tsx?)#) {
	$file = $1;
    } elsif (m#[ ]*([0-9]+)[:].* ([-\@a-z0-9/]*)#) {
	my $key = $file.":".$1;
	if (defined($reported{$key})) {
	    $reported{$key} .= ",".$2;
	} else {
	    $reported{$key} = $2;
	}
    } else {
	print "No use for $_\n";
    }
}
close ($lint);

$emailcol = -1;
$filecol = -1;
$linecol = -1;
$rulecol = -1;

open my $csv, "<", $formresults
    || die ("Could not open CSV form results: $formresults\n");
open my $out, ">", $output
    || die ("Could not write grade file\n");
print $out "Email,Grade,Comments\n";
while (<$csv>) {
    if ($emailcol == -1) {
	my @legend = split(/,/);
	$emailcol = first_index { m/Email/ } @legend;
	die ("Couldn't find Email in @legend\n") if ($emailcol < 0);
	$filecol = first_index { m/Source file/ } @legend;
	die ("Couldn't find file in @legend\n") if ($filecol < 0);
	$linecol = first_index { m/Line number/ } @legend;
	die ("Couldn't find file in @legend\n") if ($linecol < 0);
	$rulecol = first_index { m/lint rule/ } @legend;
	fir ("COuldn't find rule in @legend\n") if ($rulecol < 0);
    } else {
	my @fields = split(/,/);
	my $email = $fields[$emailcol];
	$email =~ s/["]//g;
	my $file = $fields[$filecol];
	$file =~ s/["]//g;
	my $line = $fields[$linecol];
	$line =~ s/["]//g;
	$line =~ s/:[0-9]*//;
	$line =~ s/line //;
	$line =~ s/ //g;
	my $rule = $fields[$rulecol];
	$rule =~ s/["]//g;
	# print "Looking at @fields\n";
	my $key = $file . ":" . $line;
	if (!defined($reported{$key})) {
	    print $out "$email,0,$rule does not happen at $key\n";
	    print "$email said $rule happens at $key\n";
	} else {
	    my @rules = split /,/, $reported{$key};
	    my $index = first_index { $_ eq $rule } @rules;
	    if ($index < 0) {
		print $out "$email,0,$rule does not happen at $key\n";
		print "$email said $rule happens at $key\n";
	    } else {
		print $out "$email,1,\n";
	    }
	}
    }
}
close ($csv);
close ($out);
