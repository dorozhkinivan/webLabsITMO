<!DOCTYPE html>
<html>
<head>
<script>
window.sessionLoad = () => {const parse = JSON.parse("<?php
    if ($_SESSION['requests'] == null){
        $_SESSION['requests'] = [];
        echo null;
    }
    else
        echo $_SESSION['requests'];
    ?>")
    console.log(parse)
}
</script>
</head>
</html>