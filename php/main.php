<?php
session_start();
date_default_timezone_set('Europe/Moscow');
$startTime = microtime(true);

function validateFormatNumber($v): bool{
    if (str_contains($v, 'A')|| str_contains($v, 'B')|| str_contains($v, 'C')|| str_contains($v, 'D')|| str_contains($v, 'E')|| str_contains($v, 'F')|| str_contains($v, 'e')|| str_contains($v, ' '))
        return false;
    return true;
}

function validateFormat($x, $y, $r): bool
{
    if (!($x == '-3' || $x == '-2' || $x == '-1' || $x == '0' || $x == '1' || $x == '2' || $x == '3' || $x == '4' || $x == '5'))
        return false;
    if (strlen($r) > 10 || !validateFormatNumber($y) || !validateFormatNumber($r) || !is_numeric($r) || !is_numeric($y))
        return false;
    if ($y > 5 || $y < -3)
        return false;
    if ($r > 5 || $r < 2)
        return false;
    return true;
}
function validateValue($x, $y, $r): bool
{
    if ($x >= 0 && $y >= 0){
        if ($x <= $r/2 && $y <= $r)
            return true;
    }
    if ($x <= 0 && $y >= 0){
        if ($x * $x + $y * $y <= $r * $r / 4)
            return true;
    }
    if ($x <= 0 && $y <= 0){
        if ($x + $y >= -$r)
            return true;
    }
    return false;
}
$x = $_GET['x'];
$y = $_GET['y'];
$r = $_GET['r'];
$validate = validateFormat($x, $y, $r);
if ($validate)
    $answer = validateValue($x, $y, $r);
else
    $answer = null;
$array = [
    'isCorrect' => $validate,
    'isIn' => $answer,
    'x' => $x,
    'y' => $y,
    'r' => $r,
    'date' => date('d.m.Y H:i:s', time()),
    'time' => round(microtime(true) - $startTime, 8)
];
echo json_encode($array);