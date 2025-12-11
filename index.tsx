<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, interactive-widget=resizes-content" />
    <title>FakeZap</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Segoe+UI:wght@400;500;600&display=swap" rel="stylesheet">
    
    <!-- Meta Pixel Code -->
    <script>
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      // O init será chamado via React usando o ID do arquivo constants.ts
    </script>
    <noscript><img height="1" width="1" style="display:none"
      src="https://www.facebook.com/tr?id=1357041429488419&ev=PageView&noscript=1"
    /></noscript>
    <!-- End Meta Pixel Code -->

    <style>
      body {
        font-family: 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif;
        overscroll-behavior-y: none; /* Previne o efeito de 'bounce' no iOS */
      }
      /* Custom scrollbar for Webkit */
      ::-webkit-scrollbar {
        width: 6px;
      }
      ::-webkit-scrollbar-track {
        background: transparent;
      }
      ::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 3px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: rgba(0, 0, 0, 0.3);
      }
      .whatsapp-bg {
        background-color: #efe7dd;
        background-image: url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png");
        background-repeat: repeat;
        background-size: 400px;
      }
    </style>
  <script type="importmap">
{
  "imports": {
    "lucide-react": "https://esm.sh/lucide-react@^0.559.0",
    "@google/genai": "https://esm.sh/@google/genai@^1.32.0",
    "react/": "https://esm.sh/react@^19.2.1/",
    "react": "https://esm.sh/react@^19.2.1",
    "react-dom/": "https://esm.sh/react-dom@^19.2.1/"
  }
}
</script>
</head>
  <body>
    <div id="root"></div>
  </body>
</html>
