<?php
/**
 * Promotions API — PHP endpoint for cross-device persistence.
 * Reads/writes promotions data to a JSON file outside public_html.
 */

// CORS and content type headers
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: https://friendsgrp.com');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, x-auth-token');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Data file path — stored OUTSIDE public_html for security
$DATA_DIR = dirname(dirname(__DIR__)) . '/fg_data';
$DATA_FILE = $DATA_DIR . '/promotions.json';

// Ensure data directory exists
if (!is_dir($DATA_DIR)) {
    mkdir($DATA_DIR, 0755, true);
}

// ─── GET: Return current promotions ──────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!file_exists($DATA_FILE)) {
        echo json_encode(['success' => true, 'data' => null]);
        exit;
    }
    $raw = file_get_contents($DATA_FILE);
    $data = json_decode($raw);
    if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Corrupt data file']);
        exit;
    }
    echo json_encode(['success' => true, 'data' => $data]);
    exit;
}

// ─── POST: Save promotions (requires auth token) ────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Auth check
    $token = $_SERVER['HTTP_X_AUTH_TOKEN'] ?? '';
    if ($token !== 'Friends2026') {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Unauthorized action.']);
        exit;
    }

    // Parse JSON body
    $input = json_decode(file_get_contents('php://input'), true);
    if (!isset($input['offers']) || !is_array($input['offers'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid payload, offers array required.']);
        exit;
    }

    // Write atomically (write to temp, then rename)
    $tmpFile = $DATA_FILE . '.tmp';
    $written = file_put_contents($tmpFile, json_encode($input['offers'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    if ($written === false) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Server write failure']);
        exit;
    }
    rename($tmpFile, $DATA_FILE);

    echo json_encode(['success' => true, 'message' => 'Promotions saved successfully!']);
    exit;
}

// ─── Unsupported method ──────────────────────────────────────────────────────
http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method not allowed']);
