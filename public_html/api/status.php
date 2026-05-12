<?php
header('Content-Type: application/json; charset=utf-8');
echo json_encode([
    'success' => true,
    'status'  => 'online',
    'engine'  => 'php',
    'timestamp' => time()
]);
