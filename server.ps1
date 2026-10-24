# LuxeLoom Native PowerShell Web Server & API Mock
# Serves LuxeLoom directly on PowerShell using System.Net.HttpListener

param(
    [int]$Port = 5173
)

$prefix = "http://localhost:$Port/"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
    Write-Host "====================================================" -ForegroundColor Gold
    Write-Host "   LUXELOOM NATIVE POWERSHELL WEB SERVER RUNNING" -ForegroundColor Gold
    Write-Host "====================================================" -ForegroundColor Gold
    Write-Host "  URL: $prefix" -ForegroundColor Green
    Write-Host "  Press Ctrl+C in this terminal to stop the server.`n" -ForegroundColor Yellow
    
    Start-Process $prefix

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        $url = $request.Url.AbsolutePath

        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] $($request.HttpMethod) $url" -ForegroundColor Cyan

        # REST API Mock Endpoints
        if ($url.StartsWith("/api/metals/rates")) {
            $json = '{"success":true,"rates":{"GOLD_24K":{"ratePerGram":7250},"GOLD_22K":{"ratePerGram":6645},"GOLD_18K":{"ratePerGram":5437},"SILVER_925":{"ratePerGram":88}}}'
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($json)
            $response.ContentType = "application/json"
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
            $response.Close()
            continue
        }

        if ($url.StartsWith("/api/products")) {
            $json = '{"success":true,"count":20,"products":[{"_id":"p1","name":"Royal Heritage 22K Gold Solitaire Ring","metalType":"GOLD","purity":"22K","weight":8.5,"price":61200,"category":"Rings","images":["https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800"]}]}'
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($json)
            $response.ContentType = "application/json"
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
            $response.Close()
            continue
        }

        # Fallback HTML Page
        $html = @"
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>LuxeLoom | Certified Fine Jewellery</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;600&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; background-color: #FAF8F5; color: #18181B; }
    h1, h2, h3, .font-serif { font-family: 'Playfair Display', serif; }
  </style>
</head>
<body class="p-8">
  <div class="max-w-4xl mx-auto space-y-8 bg-white p-8 rounded-3xl border border-amber-300 shadow-xl">
    <div class="text-center space-y-2 border-b border-amber-200 pb-6">
      <h1 class="text-4xl font-bold text-amber-700 tracking-widest font-serif">LUXELOOM</h1>
      <p class="text-xs uppercase tracking-widest text-zinc-500 font-semibold">Fine Jewellery • Native PowerShell Engine Active</p>
    </div>
    
    <div class="bg-amber-50 border border-amber-300 p-4 rounded-2xl flex justify-between items-center text-xs">
      <span>Today's Gold 22K Rate: <strong class="text-amber-800">₹6,645 / gram</strong></span>
      <span>Status: <strong class="text-emerald-700">Native PowerShell HTTP Server Running</strong></span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="border border-amber-200 p-6 rounded-2xl space-y-3 bg-white shadow-sm">
        <span class="text-xs font-bold text-amber-700 uppercase">Featured Gold Collection</span>
        <h3 class="font-serif text-xl font-bold">Royal Heritage 22K Solitaire Ring</h3>
        <p class="text-xs text-zinc-500">Weight: 8.5g | Purity: 22K Gold | Live Market Rate Calculated</p>
        <div class="text-2xl font-serif font-bold text-amber-700">₹61,200</div>
        <button onclick="alert('Item added to cart!')" class="w-full bg-zinc-900 text-white text-xs font-bold py-3 rounded-xl hover:bg-amber-600 transition-colors">Add to Cart</button>
      </div>

      <div class="border border-amber-200 p-6 rounded-2xl space-y-3 bg-white shadow-sm">
        <span class="text-xs font-bold text-amber-700 uppercase">Bridal Collection</span>
        <h3 class="font-serif text-xl font-bold">Maharani Temple Gold Choker</h3>
        <p class="text-xs text-zinc-500">Weight: 45.0g | Purity: 22K Gold | Hallmark 916 Certified</p>
        <div class="text-2xl font-serif font-bold text-amber-700">₹3,15,400</div>
        <button onclick="alert('Item added to cart!')" class="w-full bg-zinc-900 text-white text-xs font-bold py-3 rounded-xl hover:bg-amber-600 transition-colors">Add to Cart</button>
      </div>
    </div>
  </div>
</body>
</html>
"@
        $buffer = [System.Text.Encoding]::UTF8.GetBytes($html)
        $response.ContentType = "text/html"
        $response.ContentLength64 = $buffer.Length
        $response.OutputStream.Write($buffer, 0, $buffer.Length)
        $response.Close()
    }
} finally {
    $listener.Stop()
}
