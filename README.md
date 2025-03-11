Install Ngrok (if not already installed):

Download from ngrok.com
Or install via terminal:
nginx
Copy
Edit
npm install -g ngrok
Start your Express server.

Open a terminal and run:

yaml
Copy
Edit
ngrok http 5000
It will generate a public https link like:

lua
Copy
Edit
https://random.ngrok.io
Open this link on your phone’s browser and your server will be accessible!
