<?php

header('Content-Type: application/json; charset=utf-8');

try {
    file_put_contents("post.log",print_r($_POST,true));

    $integration_public = json_decode($_POST['integration_public'], true);
    $name = $_POST['name'];
    if ($integration_public['type'] == 1) {
        $name .= '😻';
    } elseif ($integration_public['type'] == 2) {
        $name .= '🔥';
    }

    $data = ['vars' => [
        'n' => 'inflect_name',
        'v' => $name
    ]];
    echo json_encode($data);
    exit;
} catch (Exception $e) {
    header('HTTP/1.1 500 Internal Server Error ' . $e->getMessage());
}
