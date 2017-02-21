# Mest

Media Streamer

* `.mp3`
* `.mp4`
  * SAMI(`.smi`) to WebVTT
  * *ASS support planned*

## Usage

1. Clone this repository
2. `npm install` or `yarn`
3. `cp config.example.json config.json`
4. Edit `config.json`
5. `node index.js` (or run with your favorite process manager)
6. Setup reverse proxy with decent web server like Nginx or Apache
7. Enjoy your things

## Nginx

```
server {
  listen       80;
  server_name  <your_server_name>;

  # This is not required, but highly recommended, since serving large files on
  # Node.js is not so good
  location /raw/ {
    alias <mestRoot with trailing slash>;
  }

  location / {
    proxy_pass http://127.0.0.1:<vistPort>;
    # and other options
  }

  # and other setups, for example, basic auth
}
```

## Apache

¯\\\_(ツ)\_/¯
