Add-Type -AssemblyName System.Drawing

$bmp = New-Object System.Drawing.Bitmap(128, 128)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = 'AntiAlias'
$g.Clear([System.Drawing.Color]::FromArgb(30, 30, 30))

# Orange circle background
$brush1 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 87, 34))
$g.FillEllipse($brush1, 14, 14, 100, 100)

# Speaker icon using text
$font = New-Object System.Drawing.Font('Segoe UI Symbol', 52)
$brush2 = [System.Drawing.Brushes]::White
$sf = New-Object System.Drawing.StringFormat
$sf.Alignment = 'Center'
$sf.LineAlignment = 'Center'
$rect = New-Object System.Drawing.RectangleF(0, 0, 128, 128)
$g.DrawString([char]0x266B, $font, $brush2, $rect, $sf)

$bmp.Save("images\icon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmp.Dispose()
Write-Host "Icon created successfully"
