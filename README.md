# hompocha

### 로컬 실행방법
#### openvidu
```$ docker run -p 4443:4443 --rm -e OPENVIDU_SECRET=229 openvidu/openvidu-dev:2.28.0```

#### server (node ver 18)
```npm i```

```npm run start:dev```

#### client (node ver 16)
```npm i```

```npm start```



### EC2 배포 방법
EC2 인스턴스 선택 시 t2.micro가 아닌 그보다 메모리가 더 큰 종류 선택하고 스토리지도 늘려야 함.
(현재 t3.medium, 20GB 사용중)

PORT 설정
(TBD)

#### openvidu
letsencrypt 이용하여 ssl 인증서 받기

```shell
sudo su
cd /opt
curl https://s3-eu-west-1.amazonaws.com/aws.openvidu.io/install_openvidu_latest.sh | bash
```

```
cd openvidu
sudo vim .env
```

**수정사항**
```
DOMAIN_OR_PUBLIC_IP=seomik.shop
OPENVIDU_SECRET=
CERTIFICATE_TYPE=letsencrypt
LETSENCRYPT_EMAIL=po
HTTP_PORT=8442
HTTPS_PORT=8443
```

#### nginx
```
server {
         location /{
                proxy_pass http://localhost:3000/;
        }

        location /api/ {
                proxy_pass http://localhost:8080/;
        }

    listen 443 ssl;
    server_name seomik.shop;
    ssl_certificate /etc/letsencrypt/live/seomik.shop/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seomik.shop/privkey.pem;

    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

server {
    if ($host = seomik.shop) {
        return 301 https://$host$request_uri;
    }

        listen 80;
        server_name seomik.shop;
    return 404;
}
```
