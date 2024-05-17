<?php
$target_dir = "uploads/";
if (!file_exists($target_dir)) {
    mkdir($target_dir, 0777, true);
}
$target_file = $target_dir . basename($_FILES["image"]["name"]);

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_file)) {
        echo json_encode(["message" => "The file " . basename($_FILES["image"]["name"]) . " has been uploaded."]);
    } else {
        echo json_encode(["message" => "Sorry, there was an error uploading your file."]);
    }
} else {
    echo json_encode(["message" => "Invalid request method."]);
}
?>
