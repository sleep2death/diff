docker run --restart=always --network host -d -v /etc/frp/frpc.ini:/etc/frp/frpc.ini --name frpc snowdreamtech/frpc
docker run --name REDIS -v (pwd)/redis:/data -p 6379:6379 -d redis
docker run --gpus all --ipc=host --name DIFFUSERS -v (pwd)/outputs:/outputs --link REDIS:redis -p 8080:8080 -d aspirin2d/diffusers
